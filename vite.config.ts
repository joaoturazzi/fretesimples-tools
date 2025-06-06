
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Expose env variables to the client
    __DEV__: mode === 'development',
  },
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet'],
  },
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'maps': ['leaflet', 'react-leaflet'],
          'ui': ['lucide-react', '@radix-ui/react-toast'],
          'analytics': ['react-helmet-async'],
        },
      },
    },
    // Use esbuild instead of terser to avoid dependency issues
    minify: mode === 'production' ? 'esbuild' : false,
    // Enable gzip compression
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
}));
