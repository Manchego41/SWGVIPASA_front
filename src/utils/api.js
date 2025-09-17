import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// ⬇️ agrega/interceptor para enviar el token
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('user') || 'null')
    if (stored?.token) {
      config.headers.Authorization = `Bearer ${stored.token}`
    }
  } catch {}
  return config
})

export default api
