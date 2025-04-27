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
  // Add this line to explicitly enable source maps
  sourcemap: true,
}));
