/**
 * ROBUST / invalid or missing meta
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile, exists } from "../../helpers/fs";

describe("ROBUST / meta invalid", () => {
  it("missing env.meta.json (and no .env.example) => generate exit != 0", async () => {
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

      const out = (r.all ?? "").toLowerCase();
      expect(out).toMatch(/parse|json|syntax|failed|error|invalid/);
    }, { unsafeCleanup: true });
  });

  it("missing meta but .env.example exists => generate succeeds (fallback)", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(path.join(dir, ".env.example"), "PORT=3000\n");

      const r = await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false });

      expect(r.exitCode).toBe(0);

      const out = r.all ?? "";
      expect(out).toMatch(/falling back|minimal meta|\.env\.example/i);
      expect(out).not.toMatch(/^❌/m);
    }, { unsafeCleanup: true });
  });

  it("invalid env.meta.json => show exit != 0", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(path.join(dir, "env.meta.json"), "{not json}");
      const r = await runZodEnvkit({ cwd: dir, args: ["show"], reject: false });
      expect(r.exitCode).not.toBe(0);
      expect((r.all ?? "").toLowerCase()).toMatch(/parse|json|failed|error|invalid/);
    }, { unsafeCleanup: true });
  });

  it("invalid env.meta.json => check exit != 0", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(path.join(dir, "env.meta.json"), "{broken");
      const r = await runZodEnvkit({ cwd: dir, args: ["check"], reject: false });
      expect(r.exitCode).not.toBe(0);
      expect((r.all ?? "").toLowerCase()).toMatch(/parse|json|failed|error|invalid/);
    }, { unsafeCleanup: true });
  });

  it("valid empty env.meta.json {} => generate exit 0", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(path.join(dir, "env.meta.json"), "{}");
      const r = await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false });
      expect(r.exitCode).toBe(0);
    }, { unsafeCleanup: true });
  });
});