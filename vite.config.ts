
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // 配置代理，将MaxKB的请求转发到正确的UI路径
    proxy: {
      '/maxkb-api': {
        target: 'http://127.0.0.1:8080', // MaxKB服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/maxkb-api/, '/ui'), // 修正路径为/ui而不是/api
        secure: false, // 允许无效/自签名证书
        ws: true       // 支持WebSocket
      }
    }
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
}));
