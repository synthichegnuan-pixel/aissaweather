import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remplacez 'REPO_NAME' par le nom exact du repo GitHub (ex: AissaWeather.github.io ou mon-repo)
export default defineConfig({
  base: '/AissaWeather.github.io/', 
  plugins: [react()]
})