/**
 * CONTRACT / Exports
 * Сигналит, если в релизе исчезли/переименовались публичные функции.
 */

import { describe, it, expect } from "vitest";

describe("CONTRACT / exports", () => {
  it("public exports exist (dist build)", async () => {
    const mod: any = await import("@dist/index.js");

    const expected = [
      // core
      "loadEnv",
      "mustLoadEnv",
      "formatZodError",

      // env contract helpers
      "checkEnv",
      "getMissingEnv",
      "getEmptyRequiredEnv",
      "getUnknownEnv",
      "isSecretKey",

      // generators
      "generateEnvExample",
      "generateEnvDocs",
      "sortMetaEntries",
    ] as const;

    for (const name of expected) {
      expect(mod[name], `missing export: ${name}`).toBeTypeOf("function");
    }
  });
});