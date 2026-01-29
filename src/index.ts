import { z } from "zod";

/**
 * Public exports (stable in 1.x).
 *
 * Rule of thumb:
 * - Adding new exports is OK (minor).
 * - Removing/renaming exports is breaking (major).
 *
 * @public
 */
export * from "./generate.js";

/**
 * @public
 */
export * from "./env.js";

/**
 * Options for {@link loadEnv}.
 *
 * @public
 * @since 1.0.0
 */
export type LoadEnvOptions = {
  /**
   * If true, throws `ZodError` instead of returning `{ ok: false }`.
   *
   * @defaultValue false
   */
  throwOnError?: boolean;
};

/**
 * Successful result of {@link loadEnv}.
 *
 * @public
 * @since 1.0.0
 */
export type LoadEnvOk<T extends z.ZodTypeAny> = { ok: true; env: z.infer<T> };

/**
 * Failed result of {@link loadEnv}.
 *
 * @public
 * @since 1.0.0
 */
export type LoadEnvFail = { ok: false; error: z.ZodError };

/**
 * Validate `process.env` using a Zod schema.
 *
 * - On success: returns `{ ok: true, env }` (typed).
 * - On failure:
 *   - returns `{ ok: false, error }` by default
 *   - throws `ZodError` if `opts.throwOnError === true`
 *
 * @example
 * ```ts
 * const result = loadEnv(EnvSchema);
 * if (!result.ok) {
 *   console.error("Invalid environment:\n" + formatZodError(result.error));
 *   process.exit(1);
 * }
 * export const env = result.env;
 * ```
 *
 * @public
 * @since 1.0.0
 */
export function loadEnv<T extends z.ZodTypeAny>(
  schema: T,
  opts?: LoadEnvOptions
): LoadEnvOk<T> | LoadEnvFail {
  const parsed = schema.safeParse(process.env);

  if (parsed.success) return { ok: true, env: parsed.data };

  if (opts?.throwOnError) throw parsed.error;
  return { ok: false, error: parsed.error };
}

/**
 * Fail-fast wrapper around {@link loadEnv}.
 *
 * Equivalent to: `loadEnv(schema, { throwOnError: true })` but returns typed env directly.
 *
 * @example
 * ```ts
 * export const env = mustLoadEnv(EnvSchema);
 * ```
 *
 * @throws ZodError
 *
 * @public
 * @since 1.0.5
 */
export function mustLoadEnv<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  // keep behavior aligned with docs: this is the throw-on-error variant
  const res = loadEnv(schema, { throwOnError: true });

  // `loadEnv` throws on error here; this branch is for TS narrowing only.
  if (res.ok) return res.env;

  throw res.error;
}

/**
 * Format `ZodError` into a human-friendly multi-line message (one issue per line).
 *
 * @example
 * ```ts
 * console.error("Invalid environment:\n" + formatZodError(err));
 * ```
 *
 * @public
 * @since 1.0.0
 */
export function formatZodError(err: z.ZodError): string {
  return err.issues
    .map((i) => `- ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}
