// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // usa siempre 5173
    strictPort: true, // si 5173 está ocupado, Vite FALLA en vez de cambiarlo
    host: true
  }
})
