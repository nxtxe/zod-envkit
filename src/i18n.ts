import { messages } from "./messages.js";

/** CLI i18n. Stable in 1.2. */
export type Lang = "en" | "ru";
export type MessageKey = keyof typeof messages["en"];

/**
 * @internal
 * Escape a string for use inside a RegExp source.
 */
function escapeRegExp(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Resolve CLI language.
 *
 * Priority:
 * 1. --lang flag
 * 2. LANG env (ru*)
 * 3. default: en
 *
 * @since 1.0.0
 */
export function resolveLang(cliLang?: string): Lang {
  if (cliLang === "ru" || cliLang === "en") return cliLang;

  const envLang = process.env.LANG?.toLowerCase();
  if (envLang?.startsWith("ru")) return "ru";

  return "en";
}

/**
 * Translate message key using selected language.
 *
 * Supports simple template variables: `{var}` (all occurrences).
 *
 * @since 1.0.0
 */
export function t(
  lang: Lang,
  key: MessageKey,
  vars?: Record<string, string>
): string {
  let text = messages[lang][key] ?? messages.en[key];

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      const pattern = new RegExp(`\\{${escapeRegExp(k)}\\}`, "g");
      text = text.replace(pattern, v);
    }
  }

  return text;
}
