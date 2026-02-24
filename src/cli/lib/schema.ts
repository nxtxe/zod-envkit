// src/cli/lib/schema.ts
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import type { Lang } from "../../i18n.js";
import { fail } from "./fail.js";

// Resolve CJS fallback from cwd so we don't rely on import.meta (avoids CJS build warning)
const require = createRequire(path.join(process.cwd(), "package.json"));

/**
 * Load a Zod object schema from a JS/TS-compiled file.
 * Expects default export or .schema to be a z.object(...).
 *
 * Stable in 1.2.
 *
 * @internal
 * @since 1.3.0
 */
export async function loadSchemaFile(
  filePath: string,
  lang: Lang
): Promise<{ keys: string[] }> {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  let mod: unknown;
  try {
    const url = pathToFileURL(absolutePath).href;
    mod = await import(url);
  } catch {
    try {
      mod = require(absolutePath);
    } catch (e) {
      fail(lang, "SCHEMA_LOAD_FAILED", [`- ${absolutePath}`, String(e)]);
    }
  }

  const raw =
    mod != null && typeof mod === "object"
      ? (mod as { default?: unknown; schema?: unknown }).default ?? mod
      : undefined;
  const schema =
    raw != null && typeof raw === "object"
      ? (raw as { default?: unknown; schema?: unknown }).default ??
        (raw as { schema?: unknown }).schema ??
        raw
      : undefined;

  if (schema == null) {
    fail(lang, "SCHEMA_NOT_OBJECT", [`- ${absolutePath}`]);
  }

  const shape =
    schema != null &&
    typeof schema === "object" &&
    "shape" in schema &&
    typeof (schema as { shape: unknown }).shape === "object"
      ? (schema as { shape: Record<string, unknown> }).shape
      : undefined;

  if (shape == null || !Object.keys(shape).length) {
    fail(lang, "SCHEMA_NOT_OBJECT", [`- ${absolutePath}`]);
  }

  return { keys: Object.keys(shape) };
}
