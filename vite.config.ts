
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // 配置代理，用于测试百度
    proxy: {
      '/maxkb-api': {
        target: 'https://www.baidu.com', // 百度服务地址测试
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/maxkb-api/, ''), // 将/maxkb-api路径转发到百度根路径
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
