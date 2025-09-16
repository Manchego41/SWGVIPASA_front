// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  // Usa variable de entorno en producción y fallback local
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // si usas cookies/sesiones
});

// (Opcional) Interceptor para ver cada request en consola
API.interceptors.request.use((config) => {
  console.log('➡️', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

export default API;
