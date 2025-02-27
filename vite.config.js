import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mapbox/mapbox-gl-draw': '/node_modules/@mapbox/mapbox-gl-draw',
    },
  },
});
