/**
 * SMOKE / CLI
 * Проверка: бинарь существует и отвечает на базовую команду.
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";

describe("SMOKE / CLI", () => {
  it("generate runs (exit 0) with minimal env.meta.json", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      const r = await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false });
      expect(r.exitCode).toBe(0);
    }, { unsafeCleanup: true });
  });
});