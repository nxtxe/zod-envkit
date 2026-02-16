/**
 * ROBUST / fuzz repeat CLI
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";
import { ITER, randInt, randStr } from "../../helpers/random";

describe("ROBUST / fuzz repeat runs", () => {
  it("repeated show/check never hard-crashes", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([
          { key: "PORT", required: true, example: "3000" },
          { key: "API_KEY", required: false, example: "secret" },
        ])
      );

      for (let i = 0; i < ITER; i++) {
        const port = i % 2 === 0 ? String(randInt(1, 65535)) : randStr(5);
        const secret = "secret-" + randStr(24);
        await writeFile(path.join(dir, ".env"), `PORT=${port}\nAPI_KEY=${secret}\n`);

        const show = await runZodEnvkit({ cwd: dir, args: ["show"], reject: false });
        expect(show.exitCode).toBe(0);
        expect(show.all).not.toContain(secret);

        const check = await runZodEnvkit({ cwd: dir, args: ["check"], reject: false });
        expect([0, 1]).toContain(check.exitCode);
      }
    }, { unsafeCleanup: true });
  });
});