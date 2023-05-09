import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  server:{
    host:"200.200.170.111"
  },
  plugins: [
    vue()
  ],
})
