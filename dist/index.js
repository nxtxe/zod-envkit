// src/index.ts
function loadEnv(schema, opts) {
  const parsed = schema.safeParse(process.env);
  if (parsed.success) return { ok: true, env: parsed.data };
  if (opts?.throwOnError) throw parsed.error;
  return { ok: false, error: parsed.error };
}
function formatZodError(err) {
  return err.issues.map((i) => `- ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
}
export {
  formatZodError,
  loadEnv
};
