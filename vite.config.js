import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: process.env.NODE_ENV === 'production' ? '/oops-we-saved-co2/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173
  }
})