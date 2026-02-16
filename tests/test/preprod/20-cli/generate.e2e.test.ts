/**
 * CLI E2E / generate
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile, exists } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";

describe("CLI E2E / generate", () => {
  it("creates .env.example", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      const r = await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false });
      expect(r.exitCode).toBe(0);
      expect(await exists(path.join(dir, ".env.example"))).toBe(true);
    }, { unsafeCleanup: true });
  });

  it("creates ENV.json & ENV.yaml with --format", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      expect((await runZodEnvkit({ cwd: dir, args: ["generate", "--format", "json"] })).exitCode).toBe(0);
      expect(await exists(path.join(dir, "ENV.json"))).toBe(true);

      expect((await runZodEnvkit({ cwd: dir, args: ["generate", "--format", "yaml"] })).exitCode).toBe(0);
      expect(await exists(path.join(dir, "ENV.yaml"))).toBe(true);
    }, { unsafeCleanup: true });
  });

  it("idempotent-ish: second run doesn’t crash", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      expect((await runZodEnvkit({ cwd: dir, args: ["generate"] })).exitCode).toBe(0);
      expect((await runZodEnvkit({ cwd: dir, args: ["generate"] })).exitCode).toBe(0);
    }, { unsafeCleanup: true });
  });
});