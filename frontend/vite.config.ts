import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Enable HTTPS with auto-generated self-signed certificate
  ],
  server: {
    // Host configuration
    host: true,
    // Port configuration
    port: 5173,
    proxy: {
      // Proxy API calls to the app service
      '/api': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false // Allow self-signed certificates in development
      }
    }
  }
})
