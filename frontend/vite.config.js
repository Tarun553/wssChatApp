import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import process from 'process'

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Set NODE_ENV based on command (build/serve)
  process.env.NODE_ENV = command === 'build' ? 'production' : process.env.NODE_ENV || 'development';
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': {},
      __APP_ENV__: JSON.stringify(env.APP_ENV || 'production'),
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/ws': {
          target: env.VITE_API_WS_URL || 'ws://localhost:8080',
          ws: true,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      target: 'esnext',
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    base: mode === 'production' ? '/' : '/',
  }
})