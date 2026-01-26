import { describe, expect, it } from "vitest";
import { z } from "zod";
import { loadEnv, mustLoadEnv } from "../src/index";

describe("env api", () => {
  it("mustLoadEnv throws on invalid env", () => {
    const schema = z.object({ A: z.string().min(1) });
    delete process.env.A;

    expect(() => mustLoadEnv(schema)).toThrow();
  });

  it("loadEnv returns ok=false on invalid env", () => {
    const schema = z.object({ A: z.string().min(1) });
    delete process.env.A;

    const res = loadEnv(schema);
    expect(res.ok).toBe(false);
  });
});
