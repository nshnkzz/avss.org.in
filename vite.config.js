import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://avss.org.in',
      dynamicRoutes: [
        '/about',
        '/membership',
        '/donate',
        '/schemes',
        '/gallery',
        '/contact',
      ]
    })
  ],
  server: { host: 'localhost', port: 5173 }
})