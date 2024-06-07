import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    "process.env": {
      VITE_SECURE_LOCAL_STORAGE_HASH_KEY:
        "f0922b5a9147ba3c9ed741de30934b1f1889127fae73a180aa1a44==",
      VITE_SECURE_LOCAL_STORAGE_PREFIX: "hm_cb@crypt",
    },
  },
});
