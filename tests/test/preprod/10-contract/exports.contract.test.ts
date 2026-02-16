/**
 * CONTRACT / Exports
 * Сигналит, если в релизе исчезли/переименовались публичные функции.
 */

import { describe, it, expect } from "vitest";

describe("CONTRACT / exports", () => {
  it("public exports exist (dist build)", async () => {
    const mod = await import("../../../../dist/index.js");
    const expected = [
      "loadEnv",
      "mustLoadEnv",
      "formatZodError",
      "checkEnv",
      "getMissingEnv",
      "getUnknownEnv",
      "isSecretKey",
      "generateEnvExample",
      "generateEnvDocs",
    ];

    for (const name of expected) {
      expect(mod[name as keyof typeof mod], `missing export: ${name}`).toBeTypeOf("function");
    }
  });
});
