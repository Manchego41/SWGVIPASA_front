// src/utils/api.js
import axios from 'axios';
console.log(">>> VITE_API_BASE =", import.meta.env.VITE_API_BASE);


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
});

// Interceptor: agrega Authorization a todas las requests
API.interceptors.request.use((config) => {
  let token = null;

  try {
    const raw = localStorage.getItem('user');
    if (raw) token = JSON.parse(raw)?.token || null;
  } catch {
    // ignore
  }
  // Fallback legacy (por si aún existía)
  if (!token) token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;