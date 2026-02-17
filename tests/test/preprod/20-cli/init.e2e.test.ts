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
    await withDir(async ({ path: dir }) => {
      await writeFile(path.join(dir, ".env.example"), "PORT=3000\n");

      const r = await runZodEnvkit({ cwd: dir, args: ["init"], reject: false });

      if (r.exitCode !== 0) {
        throw new Error(`init failed (exit=${r.exitCode})\n${r.all ?? ""}`);
      }

      const metaPath = path.join(dir, "env.meta.json");
      expect(await exists(metaPath)).toBe(true);

      const raw = await fs.readFile(metaPath, "utf8");
      const json = JSON.parse(raw);

      expect(json.PORT).toBeDefined();
      expect(json.PORT.example).toBe("3000");
      expect(json.PORT.required).toBe(true);
    }, { unsafeCleanup: true });
  });

  it("init --from-meta generates .env.example from env.meta.json", async () => {
    await withDir(async ({ path: dir }) => {
      const baseText = await fs.readFile(
        path.resolve(__dirname, "../../fixtures/env.meta.base.json"),
        "utf8"
      );

      await writeFile(path.join(dir, "examples", "env.meta.json"), baseText);

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["init", "--from-meta", "--input", "examples/env.meta.json", "--output", ".env.example"],
        reject: false,
        inheritProcessEnv: false,
      });

      if (r.exitCode !== 0) {
        throw new Error(`init --from-meta failed (exit=${r.exitCode})\n${r.all ?? ""}`);
      }

      const outPath = path.join(dir, ".env.example");
      expect(await exists(outPath)).toBe(true);

      const out = await fs.readFile(outPath, "utf8");

      expect(out.trim().startsWith("{")).toBe(false);

      expect(out).toContain("NODE_ENV=development");
      expect(out).toContain("PORT=3000");
      expect(out).toContain("DATABASE_URL=https://example.com");
      expect(out).toContain("API_KEY=super-secret");

      expect(out).toContain("# Runtime mode");
      expect(out).toContain("# HTTP port");
    }, { unsafeCleanup: true });
  });

  it("roundtrip: example → meta → example preserves keys", async () => {
    await withDir(async ({ path: dir }) => {
      const original = ["PORT=3000", "API_KEY=abc123", ""].join("\n");

      await writeFile(path.join(dir, ".env.example"), original);

      // example -> meta
      const r1 = await runZodEnvkit({ cwd: dir, args: ["init"], reject: false });
      expect(r1.exitCode).toBe(0);

      // meta -> example
      const r2 = await runZodEnvkit({
        cwd: dir,
        args: ["init", "--from-meta"],
        reject: false,
      });

      expect(r2.exitCode).toBe(0);

      const final = await fs.readFile(path.join(dir, ".env.example"), "utf8");

      expect(final).toContain("PORT=3000");
      expect(final).toContain("API_KEY=abc123");
    }, { unsafeCleanup: true });
  });

  it("init fails on empty .env.example", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(path.join(dir, ".env.example"), "");

      const r = await runZodEnvkit({ cwd: dir, args: ["init"], reject: false });

      expect(r.exitCode).not.toBe(0);

      const out = (r.all ?? "").toLowerCase();
      expect(out).toMatch(/empty|not found|пуст/i);
    }, { unsafeCleanup: true });
  });
});