import { describe, it, expect } from "vitest";
import { z } from "zod";
import { loadEnv, mustLoadEnv, formatZodError } from "@dist/index.js";
import { withEnv } from "../../helpers/env";

const Schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().url(),
});

describe("SMOKE / library", () => {
  it("loadEnv ok=true на валидном env", async () => {
    const r = await withEnv(
      {
        NODE_ENV: "test",
        PORT: "3000",
        DATABASE_URL: "https://example.com",
      },
      () => loadEnv(Schema)
    );

    if (!r.ok) {
      throw new Error("loadEnv failed:\n" + formatZodError(r.error));
    }

    expect(r.ok).toBe(true);
    expect(r.env.PORT).toBe(3000);
  });

  it("formatZodError не падает на ошибке", async () => {
    const env = {
      NODE_ENV: "development",
      PORT: "nope",
      DATABASE_URL: "bad",
    } as any;

    // оставь как у тебя было или тоже переведи на withEnv — не критично
    const r = await withEnv(env, () => loadEnv(Schema as any));

    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(formatZodError(r.error).length).toBeGreaterThan(0);
    }
  });

  it("mustLoadEnv throws на невалидном env", async () => {
    await withEnv(
      {
        NODE_ENV: "test",
        PORT: "0", // invalid
        DATABASE_URL: "https://example.com",
      },
      () => {
        expect(() => mustLoadEnv(Schema)).toThrow();
      }
    );
  });

  it("formatZodError: one line per issue, path then message, sorted by path", async () => {
    const schema = z.object({
      A: z.string().min(1),
      B: z.coerce.number(),
    });
    const r = await withEnv({ A: "", B: "not-a-number" }, () => loadEnv(schema));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      const out = formatZodError(r.error);
      expect(out).toMatch(/^- .+: .+/m);
      const lines = out.split("\n").filter(Boolean);
      expect(lines.length).toBeGreaterThanOrEqual(1);
      const paths = lines.map((line) => line.replace(/^- (.+): .+/, "$1"));
      expect([...paths].sort()).toEqual(paths);
    }
  });
});
