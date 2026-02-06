import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api/foto-moldura": {
          target: "https://lucassampaio.app.n8n.cloud",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/foto-moldura/, "/webhook/foto-moldura"),
        },
      },
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
