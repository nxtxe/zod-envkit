import { z } from "zod";

export type LoadEnvOptions = {
  /**
   * If true, throws ZodError instead of returning { ok: false }
   */
  throwOnError?: boolean;
};

export type LoadEnvOk<T extends z.ZodTypeAny> = { ok: true; env: z.infer<T> };
export type LoadEnvFail = { ok: false; error: z.ZodError };

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
 * Convenience wrapper around loadEnv(schema, { throwOnError: true })
 * Returns typed env or throws ZodError
 */
export function mustLoadEnv<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  const res = loadEnv(schema);
  if (res.ok) return res.env;
  throw res.error;
}

/**
 * Human-friendly ZodError formatting (one issue per line)
 */
export function formatZodError(err: z.ZodError): string {
  return err.issues
    .map((i) => `- ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}
