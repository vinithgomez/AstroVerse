import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Mounts api/news.js under Vite's dev server so `/api/news` works with
// `npm run dev` too, not just on Vercel — the handler is written against
// plain Node http.ServerResponse methods, so the same file runs unmodified
// in both places (see the comment at the top of api/news.js).
function apiRoutesPlugin() {
  return {
    name: 'local-api-routes',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/news.js')
        await handler(req, res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiRoutesPlugin()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'gsap-vendor':  ['gsap'],
        },
      },
    },
  },
})
