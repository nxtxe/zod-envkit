import { messages, type Lang } from "./messages.js";

export type { Lang };

export function resolveLang(cliLang?: string): Lang {
  if (cliLang === "ru" || cliLang === "en") return cliLang;

  const envLang = process.env.LANG?.toLowerCase();
  if (envLang?.startsWith("ru")) return "ru";

  return "en";
}

export function t(
  lang: Lang,
  key: keyof typeof messages["en"],
  vars?: Record<string, string>
): string {
  let text = messages[lang][key] ?? messages.en[key];

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, v);
    }
  }

  return text;
}
