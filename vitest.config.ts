import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/test/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@test": path.resolve(__dirname, "tests/test"),
      "@dist": path.resolve(__dirname, "dist"),
    },
  },
});