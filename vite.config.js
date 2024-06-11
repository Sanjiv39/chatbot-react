import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "html-transform",
      transformIndexHtml(html) {
        html = html.replace(`src="/`, `src="`).replace(`href="/`, `href="`);
        return html;
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // outDir: "chatbot/dist",
    sourcemap: true,
    minify: true,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  define: {
    "process.env": {
      VITE_SECURE_LOCAL_STORAGE_HASH_KEY:
        "f0922b5a9147ba3c9ed741de30934b1f1889127fae73a180aa1a44==",
      VITE_SECURE_LOCAL_STORAGE_PREFIX: "hm_cb@crypt",
      VITE_HUMA_JWT:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MSwiZW1haWwiOiJiaGFyYWR3YWpzd2FybmE5NEBnbWFpbC5jb20ifQ.n0S42kiplk6K6aFxtoLlf25VVqICWmViSImaBHd2v9A",
    },
  },
});
