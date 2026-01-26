import { describe, it, expect } from "vitest";
import { z } from "zod";
import { loadEnv } from "../src/index";

describe("loadEnv", () => {
  it("parses valid env", () => {
    process.env.PORT = "3000";
    const schema = z.object({ PORT: z.coerce.number() });

    const res = loadEnv(schema);
    expect(res.ok).toBe(true);

    if (res.ok) expect(res.env.PORT).toBe(3000);
  });
});
