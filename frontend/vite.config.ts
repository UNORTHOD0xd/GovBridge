import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  define: {
    global: "globalThis",
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8081",
      "/ws": {
        target: "http://localhost:8081",
        ws: true,
      },
    },
  },
});
