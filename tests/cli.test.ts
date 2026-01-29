import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const CLI = path.join(ROOT, "dist", "cli", "index.js");
const FIX = path.join(ROOT, "tests", "fixtures");

function run(args: string[], env?: NodeJS.ProcessEnv) {
  return execFileSync("node", [CLI, ...args], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
}

function runFail(args: string[], env?: NodeJS.ProcessEnv) {
  try {
    run(args, env);
    return { ok: true as const, out: "" };
  } catch (e: any) {
    return {
      ok: false as const,
      out: String(e.stdout ?? "") + String(e.stderr ?? ""),
      code: e.status,
    };
  }
}

describe("cli", () => {
  it("show (smoke) works", () => {
    const out = run([
      "show",
      "-c",
      path.join(FIX, "env.meta.json"),
      "--dotenv",
      path.join(FIX, ".env.good"),
      "--no-mask",
      "--sort",
      "alpha",
    ]);

    expect(out).toContain("NODE_ENV");
    expect(out).toContain("PORT");
  });

  it("check --strict fails on unknown env vars", () => {
    const res = runFail([
      "check",
      "-c",
      path.join(FIX, "env.meta.json"),
      "--dotenv",
      path.join(FIX, ".env.strict"),
      "--strict",
    ]);

    expect(res.ok).toBe(false);
    expect(res.code).toBe(1);
    expect(res.out).toMatch(/Unknown|неизвест/i);
  });
});
