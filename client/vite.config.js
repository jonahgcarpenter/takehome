import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/socket.io": "http://localhost:4000",
      "/api": "http://localhost:4000",
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    // npm run build directory
    outDir: "../server/dist",
    emptyOutDir: true,
  },
});
