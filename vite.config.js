import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '')
const API_BASE = env.VITE_API_URL || 'http://localhost:5000'

let articleRoutes = []
try {
  const res = await fetch(`${API_BASE}/api/articles`)
  if (res.ok) {
    const articles = await res.json()
    articleRoutes = articles.map(a => `/articles/${a.slug}`)
    console.log(`[sitemap] ${articleRoutes.length} article route(s) added`)
  }
} catch {
  console.warn('[sitemap] Could not reach API — article slug routes skipped')
}

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
        '/circulars',
        '/articles',
        '/contact',
        ...articleRoutes,
      ]
    })
  ],
  server: { host: 'localhost', port: 5173 }
})