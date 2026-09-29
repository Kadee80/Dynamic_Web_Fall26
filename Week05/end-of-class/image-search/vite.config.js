import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Same setup as the component library: Tailwind v4 is a Vite plugin, and
// there is no tailwind.config.js.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
