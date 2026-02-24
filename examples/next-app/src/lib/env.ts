import { z } from "zod";
import { mustLoadEnv } from "zod-envkit";

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  // Server-only (not exposed to client)
  API_SECRET: z.string().min(1, "API_SECRET is required"),
  // Optional with default
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const env = mustLoadEnv(EnvSchema);
