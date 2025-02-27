import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración para permitir hot-reload en Docker
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permitir acceso desde Docker
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Necesario para Docker
    },
    cors: true, // Evitar problemas de CORS
  }
})
