import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

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
    // Add visualizer plugin
    visualizer({
      filename: 'stats.html', // Output file name
      open: true, // Automatically open the report in the browser after build
      gzipSize: true, // Show gzip size
      brotliSize: true, // Show brotli size
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separate syntax highlighter and its large dependencies
            if (id.includes('react-syntax-highlighter') || id.includes('refractor')) {
              return 'syntax-highlighter';
            }
            // Group core vendor libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('lucide-react')) {
              return 'vendor';
            }
            // You could add more specific chunking rules here if needed
            // For example, chunking large UI libraries separately
            // if (id.includes('@radix-ui')) {
            //   return 'radix-ui';
            // }
          }
        },
      },
    },
  },
  // Add this line to explicitly enable source maps
  sourcemap: true, // Keep sourcemap enabled if needed, or set to false for production builds to reduce size slightly
}));
