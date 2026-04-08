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
      expect(nm.all).toContain(secret);

      // Но показывает частично (начало/конец)
      expect(nm.all).toContain("su");
      expect(nm.all).toContain("ue");

    }, { unsafeCleanup: true });
  });

  it("masking handles short secret values deterministically", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "API_KEY", required: false, example: "x" }])
      );
      await writeFile(path.join(dir, ".env"), "API_KEY=ab\n");

      const partial = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--mask-mode", "partial"],
        reject: false,
      });
      expect(partial.exitCode).toBe(0);
      expect(partial.all).toContain("**");
      expect(partial.all).not.toContain("ab");

      const full = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--mask-mode", "full"],
        reject: false,
      });
      expect(full.exitCode).toBe(0);
      expect(full.all).toContain("**");
      expect(full.all).not.toContain("ab");
    }, { unsafeCleanup: true });
  });

  it("secret detection remains case-insensitive (Api_Key / my_password)", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([
          { key: "Api_Key", required: false, example: "token" },
          { key: "my_password", required: false, example: "pw" },
        ])
      );
      await writeFile(path.join(dir, ".env"), "Api_Key=secret1\nmy_password=secret2\n");

      const out = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--mask-mode", "partial"],
        reject: false,
      });
      expect(out.exitCode).toBe(0);
      expect(out.all).not.toContain("secret1");
      expect(out.all).not.toContain("secret2");
    }, { unsafeCleanup: true });
  });
});