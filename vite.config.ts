import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'development-csp',
      // Vite development injects its refresh preamble and opens a WebSocket.
      // Keep the restrictive policy in production, where neither is needed.
      transformIndexHtml(html) {
        return command === 'serve'
          ? html.replace(/\s*<meta http-equiv="Content-Security-Policy"[^>]*\/>/, '')
          : html;
      },
    },
  ],
}))
