/**
 * ROBUST / invalid or missing meta
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";

describe("ROBUST / meta invalid", () => {
  it("missing env.meta.json => generate exit != 0", async () => {
    await withDir(async ({ path: dir }) => {
      const r = await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false });
      expect(r.exitCode).not.toBe(0);
    }, { unsafeCleanup: true });
  });

  it("invalid env.meta.json => generate exit != 0", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(path.join(dir, "env.meta.json"), "{not json}");
      const r = await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false });
      expect(r.exitCode).not.toBe(0);
      expect((r.all ?? "").toLowerCase()).toMatch(/json|parse|syntax|invalid/);
    }, { unsafeCleanup: true });
  });
});