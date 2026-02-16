/**
 * CLI E2E / dotenv priority sanity
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";

describe("CLI E2E / dotenv priority", () => {
  it("later file in --dotenv list wins (sanity check via output)", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      await writeFile(path.join(dir, ".env"), "PORT=3000\n");
      await writeFile(path.join(dir, ".env.local"), "PORT=4000\n");

      const r = await runZodEnvkit({ cwd: dir, args: ["show", "--dotenv", ".env,.env.local"], reject: false });
      expect(r.exitCode).toBe(0);
      expect(r.all).toContain("4000");
    }, { unsafeCleanup: true });
  });
});