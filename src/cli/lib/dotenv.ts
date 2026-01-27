// src/cli/lib/dotenv.ts
import path from "node:path";
import dotenv from "dotenv";

export function loadDotEnv(envFile: string) {
  dotenv.config({ path: path.resolve(process.cwd(), envFile), quiet: true });
}
