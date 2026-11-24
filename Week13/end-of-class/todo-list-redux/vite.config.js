import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // db.json inside the project, so every write json server makes
    // looks like a source code change and vite reloads the page, that reload
    //refreshes the list, which can hide hide a broken reducer: the screen
    //looks right because the page restarted, NOT because your code worked
    watch: {
      ignored: ['**/db.json'],
    },
  },
})
