import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    reporters: "verbose",
    exclude: [
      ...configDefaults.exclude,
      "packages/template/*",
      "build/**/*",
      "dist/**/*",
    ],
  },
});
