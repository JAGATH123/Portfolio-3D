import { defineConfig } from 'vite';
// import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [], // Disabled glsl plugin temporarily
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    host: true,
    port: 3000
  }
});
