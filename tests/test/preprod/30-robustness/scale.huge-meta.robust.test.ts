/**
 * ROBUST / huge meta + long secret + unicode
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta, MetaKey } from "../../helpers/meta";
import { randStr } from "../../helpers/random";

describe("ROBUST / huge meta", () => {
  it("generate/show/check should not crash", async () => {
    await withDir(async ({ path: dir }) => {
      const keys: MetaKey[] = [
        { key: "PORT", required: true, example: "3000", description: "порт 🚀" },
        { key: "API_KEY", required: false, example: "секрет", description: "ключ 🔑" },
      ];

      for (let i = 0; i < 200; i++) {
        keys.push({
          key: `K_${i}_${randStr(5)}`,
          required: i % 7 === 0,
          example: randStr(8),
        });
      }
      await writeFile(path.join(dir, "env.meta.json"), makeMeta(keys));
      const secret = "S_" + randStr(10_000);

      await writeFile(path.join(dir, ".env"), ["PORT=3000", `API_KEY=${secret}`, ""].join("\n"));

      expect((await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false })).exitCode).toBe(0);

      const show = await runZodEnvkit({ cwd: dir, args: ["show"], reject: false });
      expect(show.exitCode).toBe(0);
      expect(show.all).not.toContain(secret);

      const check = await runZodEnvkit({ cwd: dir, args: ["check"], reject: false });
      expect([0, 1]).toContain(check.exitCode);
    }, { unsafeCleanup: true });
  });
});