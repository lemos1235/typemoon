import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  root: "src",
  server: { port: 3000 },
  plugins: [
    svgr(),
    react(),
    legacy({
      renderLegacyChunks: false,
      modernTargets: ["edge>=109", "safari>=13"],
      modernPolyfills: true,
      additionalModernPolyfills: [
        "core-js/modules/es.object.has-own.js",
        "core-js/modules/web.structured-clone.js",
        path.resolve("./src/polyfills/matchMedia.js"),
        path.resolve("./src/polyfills/WeakRef.js"),
        path.resolve("./src/polyfills/RegExp.js"),
      ],
    }),
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@root": path.resolve("."),
    },
  },
  define: {
    OS_PLATFORM: `"${process.platform}"`,
  },
});
