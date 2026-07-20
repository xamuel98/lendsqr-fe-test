import path from "node:path";
import { fileURLToPath } from "node:url";

import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));

function resolveFromRoot(relativePath: string) {
  return path.resolve(rootDirectory, relativePath);
}

export default defineConfig({
  plugins: [svgr() as never],
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
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"]
  }
});
