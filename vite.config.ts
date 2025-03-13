
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // 配置代理，用于测试MaxKB服务
    proxy: {
      '/maxkb-api': {
        target: 'https://maxkb.fit2cloud.com', // 新的MaxKB服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/maxkb-api/, ''), // 将/maxkb-api路径转发到根路径
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
