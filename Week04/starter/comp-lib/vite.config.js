import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 is a Vite plugin. There is no tailwind.config.js and no
// postcss.config.js any more -- configuration lives in CSS (src/index.css).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
