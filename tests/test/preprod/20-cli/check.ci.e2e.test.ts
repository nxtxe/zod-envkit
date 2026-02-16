/**
 * CLI E2E / check (CI gate)
 */
import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "@test/helpers/cli";
import { writeFile } from "@test/helpers/fs";
import { makeMeta } from "@test/helpers/meta";

describe("CLI E2E / check", () => {
  it("check passes when env ok", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env"],
        reject: false,
        inheritProcessEnv: false, 
      });

      expect(r.exitCode).toBe(0);
    }, { unsafeCleanup: true });
  });

  it("check --strict fails on unknown env vars", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\nEXTRA=1\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--strict", "--dotenv", ".env"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(1);
      expect(r.all).toMatch(/Unknown|неизвест/i);
    }, { unsafeCleanup: true });
  });
});
