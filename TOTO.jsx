import React, { useState } from 'react';
import { Camera, MapPin, Sparkles, Sun, Moon, Cloud, CloudRain, Wind, Droplets, Thermometer, ArrowRight } from 'lucide-react';
import { fetchWeatherForCity } from './src/weatherHelpers.js';

export default function CompleteOutfitCoach() {
  const [step, setStep] = useState(1); // 1: météo, 2: suggestions, 3: photo et motivation
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [outfitImage, setOutfitImage] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const compliments = {
    colors: [
      "Cette couleur te va à merveille, on dirait un arc-en-ciel qui a décidé de te choisir comme ambassadeur",
      "Waouh, ces couleurs illuminent la journée comme un feu d'artifice 🎆",
      "Tu rayonnes tellement qu'on pourrait t'utiliser comme lampe de poche 🔦",
      "Cette palette de couleurs est une vraie déclaration d'amour à la mode 💕",
      "Tu portes ces couleurs comme un super-héros porte sa cape 🦸"
    ],
    style: [
      "Ce style est absolument canon, tu pourrais défiler sur un podium là maintenant 🏆",
      "Élégance niveau : légende déverrouillée 🔓✨",
      "Ce look mérite d'être encadré dans un musée de la mode 🖼️",
      "Tu as le style d'une star de cinéma qui part conquérir le monde 🌍",
      "Cette tenue crie 'je suis venu·e, j'ai vu, j'ai vaincu' en langage mode 👑"
    ],
    general: [
      "Cette tenue te transforme en super-héros du quotidien 🦸‍♂️🦸‍♀️",
      "Tu es absolument magnifique, les miroirs doivent se sentir honorés 🪞✨",
      "Look du jour : niveau excellence maximale atteint 📊🔥",
      "Cette tenue a compris l'assignement à 200% 💯💯",
      "Tu dégages une énergie de main character aujourd'hui 🎬⭐"
    ]
  };

  const morningMotivation = [
    "Allez champion·ne 💪, aujourd'hui tu vas briller comme jamais ! Rien ni personne ne peut t'arrêter 🌟",
    "Bonjour superstar ☀️ ! Le monde t'attend, et crois-moi, il n'est pas prêt pour tout ce que tu vas accomplir 🚀",
    "Debout conquérant·e 🦁 ! Cette journée va être légendaire, je le sens déjà ✨",
    "Good morning sunshine 🌅 ! Tu vas tellement déchirer aujourd'hui que les gens vont demander ton autographe 📝",
    "Let's go 🔥 ! Ton énergie va contaminer tout le monde autour de toi aujourd'hui. Prépare-toi à recevoir des compliments 💫"
  ];

  const eveningMotivation = [
    "Bravo champion·ne 👏 ! Tu as assuré comme un·e pro aujourd'hui. Maintenant relax et recharge tes batteries 🌙✨",
    "Respect total 🙌 ! Tu as géré cette journée comme personne. Time to chill et te faire plaisir 🛋️💜",
    "Mission accomplie 🎯 ! Tu mérites une médaille (et peut-être aussi du chocolat 🍫). Profite de ta soirée !",
    "What a day 🌟 ! Tu as tout donné, maintenant c'est l'heure de te poser et de savourer ta victoire 🏆",
    "GG bien joué 🎮 ! La journée est terminée, tu peux être fier·e de toi. Place au repos mérité 😌✨"
  ];

  const weatherCompliments = {
    rain: [
      "Pluie dehors 🌧️, mais toi tu illumines tout sur ton passage ☀️",
      "Même les gouttes de pluie sont jalouses de ton style 💧😎",
      "Tu transformes ce temps gris en défilé de mode 🌈",
      "La pluie n'a aucune chance face à ton éclat ✨"
    ],
    sun: [
      "Le soleil brille ☀️, mais pas autant que toi 🌟",
      "Même le soleil te regarde avec admiration 😎",
      "Tu rivalises avec le soleil en termes de rayonnement ✨",
      "Cette météo ensoleillée est parfaite pour ton look de star 🌞"
    ],
    cold: [
      "Tu transformes le froid en opportunité de style absolu ❄️🔥",
      "Même l'hiver te trouve stylé·e 🧊😍",
      "Tu chauffes l'atmosphère malgré la température 🔥",
      "Le froid n'a aucun effet sur ton charisme de feu 🌡️🔥"
    ],
    hot: [
      "Tu gères la chaleur avec un style de champion·ne 🥵👑",
      "Fresh et stylé·e malgré la canicule, respect 😎🧊",
      "Tu portes cette chaleur comme un accessoire de mode 🌡️✨",
      "Ton look estival mérite tous les applaudissements 👏🌴"
    ]
  };

  const getOutfitSuggestion = (temp, condition, humidity, windSpeed) => {
    const suggestions = {
      top: [],
      bottom: [],
      shoes: [],
      accessories: [],
      advice: ''
    };

    if (temp < 0) {
      suggestions.top = ['Manteau d\'hiver épais', 'Pull en laine', 'Sous-vêtements thermiques'];
      suggestions.bottom = ['Pantalon épais', 'Legging thermique'];
      suggestions.shoes = ['Bottes fourrées'];
      suggestions.accessories = ['Bonnet', 'Écharpe', 'Gants'];
      suggestions.advice = "Brr, il fait glacial ! ❄️ Protège-toi bien du froid, mais reste stylé·e !";
    } else if (temp < 10) {
      suggestions.top = ['Manteau', 'Pull', 'Veste'];
      suggestions.bottom = ['Jean', 'Pantalon'];
      suggestions.shoes = ['Bottines', 'Baskets montantes'];
      suggestions.accessories = ['Écharpe légère', 'Bonnet fin'];
      suggestions.advice = "Il fait frais ! 🍂 Superpose les couches pour un look cozy et canon !";
    } else if (temp < 20) {
      suggestions.top = ['Veste légère', 'Sweat', 'Cardigan'];
      suggestions.bottom = ['Jean', 'Pantalon', 'Jupe avec collants'];
      suggestions.shoes = ['Baskets', 'Chaussures fermées'];
      suggestions.accessories = ['Foulard'];
      suggestions.advice = "Température idéale ! 🌤️ Parfait pour un look décontracté chic !";
    } else if (temp < 28) {
      suggestions.top = ['T-shirt', 'Chemise légère', 'Blouse'];
      suggestions.bottom = ['Short', 'Jupe', 'Pantalon léger'];
      suggestions.shoes = ['Baskets', 'Sandales'];
      suggestions.accessories = ['Casquette', 'Lunettes de soleil'];
      suggestions.advice = "Super temps ! ☀️ Reste léger·e et confortable !";
    } else {
      suggestions.top = ['T-shirt léger', 'Débardeur', 'Robe légère'];
      suggestions.bottom = ['Short', 'Jupe courte', 'Bermuda'];
      suggestions.shoes = ['Sandales', 'Tongs'];
      suggestions.accessories = ['Chapeau', 'Lunettes de soleil', 'Crème solaire'];
      suggestions.advice = "Canicule ! 🔥 Privilégie des vêtements légers et respirants !";
    }

    if (condition.includes('rain') || condition.includes('drizzle')) {
      suggestions.accessories.push('☂️ Parapluie', '🧥 Imperméable');
      suggestions.shoes = ['Bottes de pluie', 'Chaussures imperméables'];
      suggestions.advice += " Et n'oublie pas de te protéger de la pluie ! 🌧️";
    }

    if (windSpeed > 30) {
      suggestions.accessories.push('🌪️ Coupe-vent');
      suggestions.advice += " Attention au vent ! 💨";
    }

    return suggestions;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    return hour < 18 ? 'morning' : 'evening';
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="w-8 h-8" />;
    const c = condition.toLowerCase();
    if (c.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (c.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const generateMotivation = (weatherData) => {
    const timeOfDay = getTimeOfDay();
    const motivationMsg = timeOfDay === 'morning' 
      ? getRandomItem(morningMotivation)
      : getRandomItem(eveningMotivation);

    let outfitCompliment = getRandomItem([
      ...compliments.colors,
      ...compliments.style,
      ...compliments.general
    ]);

    let weatherCompliment = '';
    if (weatherData) {
      const temp = weatherData.main.temp;
      const condition = weatherData.weather[0].main.toLowerCase();

      if (condition.includes('rain')) {
        weatherCompliment = getRandomItem(weatherCompliments.rain);
      } else if (temp > 25) {
        weatherCompliment = getRandomItem(weatherCompliments.hot);
      } else if (temp < 10) {
        weatherCompliment = getRandomItem(weatherCompliments.cold);
      } else {
        weatherCompliment = getRandomItem(weatherCompliments.sun);
      }
    }

    return {
      outfit: outfitCompliment,
      weather: weatherCompliment,
      motivation: motivationMsg,
      timeOfDay
    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOutfitImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchWeather = async () => {
    const q = city?.trim();
    if (!q) {
      alert("Entre d'abord une ville ! 🌍");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await fetchWeatherForCity(q);
      if (!result.found) {
        setErrorMsg(result.error ? `Ville introuvable : ${result.error}` : "Ville introuvable.");
        setWeather(null);
        return;
      }

      setErrorMsg(null);
      setWeather(result.weather);
      setCity(result.city);
      setStep(2);
    } catch (err) {
      console.error('Erreur fetchWeather:', err);
      setErrorMsg("Erreur réseau ou API. Regarde la console pour plus de détails.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  async function handleSearchCity(cityName) {
    setErrorMsg(null);
    try {
      setLoading(true);
      const result = await fetchWeatherForCity(cityName);
      setLoading(false);
      if (!result.found) {
        setWeather(null);
        setErrorMsg("Ville introuvable. Essaie 'Paris' ou 'Paris,FR'.");
        return;
      }
      setWeather(result.weather);
      setCity(result.city);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setErrorMsg("Erreur réseau ou API. Regarde la console pour plus de détails.");
    }
  }

  const handleGenerateMotivation = () => {
    if (!outfitImage) {
      alert('Ajoute d\'abord une photo de ta tenue ! 📸');
      return;
    }

    const motivationData = generateMotivation(weather);
    setMotivation(motivationData);
    setStep(3);
  };

  const resetApp = () => {
    setStep(1);
    setCity('');
    setWeather(null);
    setOutfitImage(null);
    setMotivation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* ÉTAPE 1: Météo */}
        {step === 1 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Coach Style & Motivation 🌟
              </h1>
              <p className="text-xl text-gray-600">
                Étape 1 : Quelle est ta météo aujourd'hui ? 🌤️
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Entre ta ville
              </label>
              <div className="relative mb-4">
                <MapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                  placeholder="Paris, Londres, Tokyo..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={fetchWeather}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? '...' : 'Voir la météo'}
                <ArrowRight className="w-6 h-6" />
              </button>

              {errorMsg && (
                <div className="mt-4 text-red-500 text-center">
                  {errorMsg}
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Ce site appartient à <span className="font-bold text-purple-600">GNUAN AISSA GRACE SYNTHICHE</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2: Suggestions de tenue */}
        {step === 2 && weather && (
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-center mb-6">
                Météo à {weather.name} 🌍
              </h2>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 capitalize text-lg">{weather.weather[0].description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weather.weather[0].main)}
                    <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center bg-white rounded-lg p-2">
                    <Thermometer className="w-5 h-5 text-red-500 mb-1" />
                    <span className="text-gray-600">Ressenti</span>
                    <span className="font-semibold">{Math.round(weather.main.feels_like)}°C</span>
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-lg p-2">
                    <Droplets className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-gray-600">Humidité</span>
                    <span className="font-semibold">{weather.main.humidity}%</span>
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-lg p-2">
                    <Wind className="w-5 h-5 text-gray-500 mb-1" />
                    <span className="text-gray-600">Vent</span>
                    <span className="font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</span>
                  </div>
                </div>
              </div>

              {(() => {
                const outfit = getOutfitSuggestion(
                  weather.main.temp,
                  weather.weather[0].main.toLowerCase(),
                  weather.main.humidity,
                  weather.wind.speed * 3.6
                );
                
                return (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold mb-4 text-purple-700 text-center">
                      ✨ Comment t'habiller aujourd'hui ✨
                    </h3>
                    
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                      <p className="text-lg font-semibold text-yellow-800">{outfit.advice}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2 text-lg">👕 Haut</h4>
                        <div className="flex flex-wrap gap-2">
                          {outfit.top.map((item, i) => (
                            <span key={i} className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2 text-lg">👖 Bas</h4>
                        <div className="flex flex-wrap gap-2">
                          {outfit.bottom.map((item, i) => (
                            <span key={i} className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2 text-lg">👟 Chaussures</h4>
                        <div className="flex flex-wrap gap-2">
                          {outfit.shoes.map((item, i) => (
                            <span key={i} className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2 text-lg">🎒 Accessoires</h4>
                        <div className="flex flex-wrap gap-2">
                          {outfit.accessories.map((item, i) => (
                            <span key={i} className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-6">
                <p className="text-center text-gray-700 mb-4 text-lg font-semibold">
                  Maintenant, habille-toi et montre-moi ton style ! 📸✨
                </p>
                
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📸 Ta tenue du jour
                </label>
                <div className="relative mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="outfit-upload"
                  />
                  <label
                    htmlFor="outfit-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-500 transition bg-purple-50 hover:bg-purple-100"
                  >
                    {outfitImage ? (
                      <img src={outfitImage} alt="Outfit" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                        <p className="text-purple-600 font-semibold">Clique pour ajouter une photo</p>
                      </div>
                    )}
                  </label>
                </div>

                <button
                  onClick={handleGenerateMotivation}
                  disabled={!outfitImage}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-6 h-6" />
                  Reçois ta motivation ! 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3: Compliments et motivation */}
        {step === 3 && motivation && (
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              {outfitImage && (
                <div className="mb-6">
                  <img src={outfitImage} alt="Ta tenue" className="w-full max-w-md mx-auto rounded-2xl shadow-lg" />
                </div>
              )}

              <div className="text-center mb-6">
                {motivation.timeOfDay === 'morning' ? (
                  <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
                ) : (
                  <Moon className="w-16 h-16 text-indigo-500 mx-auto mb-3" />
                )}
                <h2 className="text-4xl font-bold text-gray-800">
                  {motivation.timeOfDay === 'morning' ? 'Bonjour Superstar ! ☀️' : 'Bonsoir Champion·ne ! 🌙'}
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Ton look aujourd'hui
                  </h3>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {motivation.outfit}
                  </p>
                </div>

                {motivation.weather && (
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
                      {weather && getWeatherIcon(weather.weather[0].main)}
                      Style & Météo
                    </h3>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      {motivation.weather}
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-orange-700 mb-3 flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    Message du jour
                  </h3>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {motivation.motivation}
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-5xl mb-6">🎉 🌟 💪 ✨ 🚀 🔥</p>
                
                <button
                  onClick={resetApp}
                  className="px-8 py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition"
                >
                  ← Recommencer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}