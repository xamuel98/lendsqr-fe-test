import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));

function resolveFromRoot(relativePath: string) {
  return path.resolve(rootDirectory, relativePath);
}

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@app": resolveFromRoot("src/app"),
      "@pages": resolveFromRoot("src/pages"),
      "@widgets": resolveFromRoot("src/widgets"),
      "@features": resolveFromRoot("src/features"),
      "@entities": resolveFromRoot("src/entities"),
      "@shared": resolveFromRoot("src/shared"),
      "@styles": resolveFromRoot("src/app/styles")
    }
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly"
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@styles/abstracts" as *;'
      }
    }
  }
});
