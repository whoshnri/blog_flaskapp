import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'), // or 'frontend/dist' if that's where Flask serves from
    emptyOutDir: true,
  },
  base: '/', // ensures correct routing for React Router
})
