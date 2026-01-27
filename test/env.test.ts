import { describe, it, expect } from "vitest";
import { getMissingEnv, getUnknownEnv, isSecretKey } from "../src/env.js";

describe("env utils", () => {
  it("detects missing required vars", () => {
    const meta = { A: { required: true }, B: { required: false } } as any;
    const env = { B: "x" } as any;
    expect(getMissingEnv(meta, env)).toEqual(["A"]);
  });

  it("detects unknown vars", () => {
    const meta = { A: {} } as any;
    const env = { A: "1", X: "2" } as any;
    expect(getUnknownEnv(meta, env)).toEqual(["X"]);
  });

  it("secret key detection", () => {
    expect(isSecretKey("TOKEN")).toBe(true);
    expect(isSecretKey("MY_PRIVATE_KEY")).toBe(true);
    expect(isSecretKey("PUBLIC_URL")).toBe(false);
  });
});
