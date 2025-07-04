import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      writeBundle() {
        const srcManifest = path.resolve(process.cwd(), 'src/manifest.json');
        const distManifest = path.resolve(process.cwd(), 'dist/manifest.json');
        
        if (fs.existsSync(srcManifest)) {
          fs.copyFileSync(srcManifest, distManifest);
          console.log('✓ manifest.json copied to dist');
        }
        
        if (fs.existsSync('src/assets/icon.png')) {
          fs.copyFileSync('src/assets/icon.png', 'dist/icon.png');
          console.log('✓ icon.png copied to dist');
        }
        
        const srcIndex = path.resolve(process.cwd(), 'dist/src/popup/index.html');
        const distIndex = path.resolve(process.cwd(), 'dist/index.html');


        if (fs.existsSync(srcIndex)) {
          fs.copyFileSync(srcIndex, distIndex);
          console.log('✓ index.html moved to dist root');
          
          const srcDir = path.resolve(process.cwd(), 'dist/src');
          if (fs.existsSync(srcDir)) {
            fs.rmSync(srcDir, { recursive: true, force: true });
            console.log('✓ cleaned up dist/src directory');
          }
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/popup/index.html'),
        content: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/content/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'content' ? 'content.js' : '[name].js'
        },
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    copyPublicDir: false,
    assetsDir: '',
  },
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
