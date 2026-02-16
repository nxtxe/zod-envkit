/**
 * CONTRACT / Exit codes
 * Стабильность семантики: check => 0/1, strict => 1 на unknown.
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";

describe("CONTRACT / exit codes", () => {
  it("check: exit 0 on valid, exit 1 on missing", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([
          { key: "PORT", required: true, example: "3000" },
          { key: "DATABASE_URL", required: true, example: "https://example.com" },
        ])
      );

      await writeFile(path.join(dir, ".env"), "PORT=3000\nDATABASE_URL=https://example.com\n");
      expect((await runZodEnvkit({ cwd: dir, args: ["check"], reject: false })).exitCode).toBe(0);

      await writeFile(path.join(dir, ".env"), "PORT=3000\n");
      expect((await runZodEnvkit({ cwd: dir, args: ["check"], reject: false })).exitCode).toBe(1);
    }, { unsafeCleanup: true });
  });

  it("check --strict: exit 1 on unknown", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      await writeFile(path.join(dir, ".env"), "PORT=3000\nSOME_RANDOM=1\n");
      const r = await runZodEnvkit({ cwd: dir, args: ["check", "--strict"], reject: false });
      expect(r.exitCode).toBe(1);
    }, { unsafeCleanup: true });
  });
});