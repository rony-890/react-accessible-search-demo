import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/react-accessible-search-demo/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    restoreMocks: true,
  },
})
