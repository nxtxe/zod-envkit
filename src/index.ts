import { z } from "zod";

export type EnvResult<T extends z.ZodTypeAny> = z.infer<T>;

export function loadEnv<T extends z.ZodTypeAny>(
  schema: T,
  opts?: { throwOnError?: boolean }
):
  | { ok: true; env: z.infer<T> }
  | { ok: false; error: z.ZodError } {
  const parsed = schema.safeParse(process.env);

  if (parsed.success) return { ok: true, env: parsed.data };

  if (opts?.throwOnError) throw parsed.error;
  return { ok: false, error: parsed.error };
}

export function formatZodError(err: z.ZodError): string {
  return err.issues
    .map((i) => `- ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}
