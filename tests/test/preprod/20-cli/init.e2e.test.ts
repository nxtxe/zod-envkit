/**
 * CLI E2E / init
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile, exists } from "../../helpers/fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("CLI E2E / init", () => {
  it("init creates env.meta.json from .env.example", async () => {
    await withDir(
      async ({ path: dir }) => {
        await writeFile(path.join(dir, ".env.example"), "PORT=3000\n");

        const r = await runZodEnvkit({ cwd: dir, args: ["init"], reject: false });
        if (r.exitCode !== 0) {
          throw new Error(`init failed (exit=${r.exitCode})\n${r.all ?? ""}`);
        }

        expect(await exists(path.join(dir, "env.meta.json"))).toBe(true);
      },
      { unsafeCleanup: true }
    );
  });

  it("init --from-meta generates .env.example from env.meta.json", async () => {
    await withDir(
      async ({ path: dir }) => {
        const baseText = await fs.readFile(
          path.resolve(__dirname, "../../fixtures/env.meta.base.json"),
          "utf8"
        );

        // CLI ищет meta в:
        // - ./env.meta.json
        // - ./examples/env.meta.json
        await writeFile(path.join(dir, "examples", "env.meta.json"), baseText);

        const r = await runZodEnvkit({
          cwd: dir,
          args: ["init", "--from-meta", "--input", "examples/env.meta.json", "--output", ".env.example"],
          reject: false,
          inheritProcessEnv: false,
        });

        if (r.exitCode !== 0) {
          throw new Error(
            `init --from-meta failed (exit=${r.exitCode})\n${r.all ?? ""}`
          );
        }

        const outPath = path.join(dir, ".env.example");
        expect(await exists(outPath)).toBe(true);

        const out = await fs.readFile(outPath, "utf8");

        // Это env-example, не JSON
        expect(out.trim().startsWith("{")).toBe(false);

        // Проверяем ключи/значения из meta
        expect(out).toContain("NODE_ENV=development");
        expect(out).toContain("PORT=3000");
        expect(out).toContain("DATABASE_URL=https://example.com");
        expect(out).toContain("API_KEY=super-secret");

        // И что есть комментарии (описания)
        expect(out).toContain("# Runtime mode");
        expect(out).toContain("# HTTP port");
      },
      { unsafeCleanup: true }
    );
  });
});