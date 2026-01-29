// src/cli/lib/mask.ts
import { isSecretKey } from "../../env.js";

/**
 * Masking modes for secret environment variables.
 *
 * CONTRACT (stable in 1.x):
 * - "none"    → values are printed as-is
 * - "partial" → only first and last characters are visible
 * - "full"    → value is fully masked with "*"
 *
 * @public
 * @since 1.0.4
 */
export type MaskMode = "partial" | "full" | "none";

/**
 * Mask an environment variable value based on key and mask mode.
 *
 * Rules:
 * - Non-secret keys are NEVER masked
 * - Secret detection is delegated to {@link isSecretKey}
 * - Masking is deterministic and length-preserving (except minimum 1 char)
 *
 * Examples:
 * - TOKEN=abcdef, mode=partial → ab**ef
 * - TOKEN=abcd,   mode=partial → ****
 * - TOKEN=abc,    mode=full    → ***
 *
 * @param key - Environment variable name
 * @param value - Raw environment variable value
 * @param mode - Masking mode
 *
 * @public
 * @since 1.0.4
 */
export function maskValue(key: string, value: string, mode: MaskMode): string {
  if (mode === "none") return value;

  // Non-secret keys must never be masked
  if (!isSecretKey(key)) return value;

  if (mode === "full") {
    return "*".repeat(Math.max(1, value.length));
  }

  // partial
  if (value.length <= 4) {
    return "*".repeat(value.length);
  }

  return (
    value.slice(0, 2) +
    "*".repeat(Math.max(1, value.length - 4)) +
    value.slice(-2)
  );
}
