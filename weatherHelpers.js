function mapWeatherCode(code) {
  // mapping simplifié des codes Open-Meteo
  if (code === 0) return { main: 'Clear', description: 'Ciel dégagé' };
  if (code >= 1 && code <= 3) return { main: 'Clouds', description: 'Partiellement nuageux' };
  if (code === 45 || code === 48) return { main: 'Fog', description: 'Brouillard' };
  if (code >= 51 && code <= 57) return { main: 'Drizzle', description: 'Bruine' };
  if (code >= 61 && code <= 67) return { main: 'Rain', description: 'Pluie' };
  if (code >= 71 && code <= 77) return { main: 'Snow', description: 'Neige' };
  if (code >= 80 && code <= 82) return { main: 'Rain', description: 'Averses' };
  if (code >= 95) return { main: 'Thunderstorm', description: 'Orage' };
  return { main: 'Unknown', description: 'Temps variable' };
}

export async function fetchWeatherForCity(city) {
  if (!city || !city.trim()) return { found: false, error: 'Nom de ville vide' };

  const q = encodeURIComponent(city.trim());

  // géocodage via Open-Meteo (pas de clé)
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1&language=fr`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) {
    const text = await geoRes.text();
    return { found: false, error: `Erreur géocodage: ${geoRes.status} ${text}` };
  }
  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) {
    return { found: false, error: 'Ville introuvable' };
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  // météo via Open-Meteo
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m&timezone=auto`;
  const fRes = await fetch(forecastUrl);
  if (!fRes.ok) {
    const text = await fRes.text();
    return { found: false, error: `Erreur météo: ${fRes.status} ${text}` };
  }
  const forecast = await fRes.json();

  const current = forecast.current_weather || {};
  // essayer de récupérer l'humidité correspondante dans hourly
  let humidity = null;
  if (forecast.hourly && Array.isArray(forecast.hourly.time)) {
    const idx = forecast.hourly.time.indexOf(current.time);
    if (idx >= 0 && Array.isArray(forecast.hourly.relativehumidity_2m)) {
      humidity = forecast.hourly.relativehumidity_2m[idx];
    }
  }

  const mapped = mapWeatherCode(current.weathercode ?? -1);
  // OpenWeather-like shape
  const weatherLike = {
    name,
    main: {
      temp: current.temperature ?? 0,
      feels_like: current.temperature ?? 0,
      humidity: humidity ?? 0
    },
    weather: [
      {
        main: mapped.main,
        description: mapped.description
      }
    ],
    wind: {
      // Open-Meteo windspeed is km/h — convertir en m/s pour compatibilité (component multiplie par 3.6)
      speed: typeof current.windspeed === 'number' ? (current.windspeed / 3.6) : 0
    },
    // garder raw si besoin
    raw: forecast
  };

  return {
    found: true,
    city: `${name}${country ? ',' + country : ''}`,
    lat: latitude,
    lon: longitude,
    weather: weatherLike,
    raw: forecast
  };
}