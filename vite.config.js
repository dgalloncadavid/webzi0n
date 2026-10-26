import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  /* BASE_PATH=/repo/ para publicar en una subcarpeta (GitHub Pages de proyecto) */
  base: process.env.BASE_PATH || '/',
  plugins: [
    vue({
      template: {
        /* Los espacios entre etiquetas se conservan igual que en el HTML original:
           en contextos en línea un espacio cambia el resultado visual. */
        compilerOptions: { whitespace: 'preserve' }
      }
    })
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
})
