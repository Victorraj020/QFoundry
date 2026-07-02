import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    // Output into the extension package so the built assets are included in the VSIX
    outDir: path.resolve(__dirname, '../extension/webview-dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Deterministic filenames (no content hash) for easier webview URI rewriting
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      // Allow webview to import from extension shared/ types
      '@shared': path.resolve(__dirname, '../extension/src/shared'),
    },
  },
});
