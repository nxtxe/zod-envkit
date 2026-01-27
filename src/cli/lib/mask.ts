// src/cli/lib/mask.ts
import { isSecretKey } from "../../env.js";

export type MaskMode = "partial" | "full" | "none";

export function maskValue(key: string, value: string, mode: MaskMode): string {
  if (mode === "none") return value;
  if (!isSecretKey(key)) return value;

  if (mode === "full") return "*".repeat(Math.max(1, value.length));

  // partial
  if (value.length <= 4) return "*".repeat(value.length);
  return value.slice(0, 2) + "*".repeat(Math.max(1, value.length - 4)) + value.slice(-2);
}
