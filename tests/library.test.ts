import { describe, expect, it, beforeEach } from "vitest";
import { z } from "zod";
import { loadEnv, mustLoadEnv } from "../src/index.js";

function resetEnv() {
  delete process.env.NODE_ENV;
  delete process.env.PORT;
}

describe("library", () => {
  beforeEach(() => resetEnv());

  it("missing env -> loadEnv returns ok:false", () => {
    const schema = z.object({
      NODE_ENV: z.enum(["development", "test", "production"]),
      PORT: z.coerce.number().int().min(1).max(65535),
    });

    process.env.NODE_ENV = "development";

    const res = loadEnv(schema);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("wrong type -> mustLoadEnv throws", () => {
    const schema = z.object({
      NODE_ENV: z.enum(["development", "test", "production"]),
      PORT: z.coerce.number().int(),
    });

    process.env.NODE_ENV = "development";
    process.env.PORT = "abc";

    expect(() => mustLoadEnv(schema)).toThrow();
  });
});
