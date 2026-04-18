import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.NEXT_PUBLIC_ASSETS_CDN_URL': JSON.stringify('https://editor.pascal.app'),
  },
  server: {
    port: 5173,
  },
})
