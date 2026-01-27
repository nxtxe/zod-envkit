// src/cli/lib/fail.ts
import { t, type Lang } from "../../i18n.js";

export type MsgKey = Parameters<typeof t>[1];

export function fail(lang: Lang, key: MsgKey, details?: string[]): never {
  console.error(`❌ ${t(lang, key)}`);
  if (details?.length) for (const d of details) console.error(d);
  process.exit(1);
}
