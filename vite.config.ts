import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  define: {
    __CARD_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/wolf-heat-pump-flow-card.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "wolf-heat-pump-flow-card.js",
    },
    outDir: "dist",
    sourcemap: false,
    target: "es2022",
    rolldownOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
  test: {
    environment: "happy-dom",
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
