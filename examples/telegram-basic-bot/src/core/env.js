const dotenv = require("dotenv");
const { z } = require("zod");
const { mustLoadEnv } = require("zod-envkit");

dotenv.config();

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(20, "BOT_TOKEN looks too short"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

module.exports = {
  env: mustLoadEnv(EnvSchema),
};
