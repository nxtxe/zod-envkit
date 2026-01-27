// src/cli/lib/mask.ts
const SECRET_PATTERNS: ReadonlyArray<(k: string) => boolean> = [
  (k) => k.includes("TOKEN"),
  (k) => k.includes("SECRET"),
  (k) => k.includes("PASSWORD"),
  (k) => k.includes("PRIVATE"),
  (k) => k.includes("API_KEY"),
  (k) => k.endsWith("_KEY"),
];

export function isSecretKey(key: string): boolean {
  const k = key.toUpperCase();
  return SECRET_PATTERNS.some((fn) => fn(k));
}

export function maskValue(key: string, value: string): string {
  if (!isSecretKey(key)) return value;

  if (value.length <= 4) return "*".repeat(value.length);
  return value.slice(0, 2) + "*".repeat(Math.max(1, value.length - 4)) + value.slice(-2);
}
