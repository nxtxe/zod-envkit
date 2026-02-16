export async function withEnv<T>(
  next: Record<string, string | undefined>,
  fn: () => T | Promise<T>
): Promise<T> {
  const keys = Object.keys(next);
  const prev: Record<string, string | undefined> = {};

  // сохраняем прошлые значения
  for (const k of keys) prev[k] = process.env[k];

  // выставляем новые
  for (const k of keys) {
    const v = next[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }

  try {
    return await fn();
  } finally {
    // откатываем
    for (const k of keys) {
      const v = prev[k];
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}
