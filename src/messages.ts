export type Lang = "en" | "ru";

export const messages: Record<Lang, Record<string, string>> = {
  en: {
    META_NOT_FOUND: "env meta file not found.",
    META_TRIED: "Tried:",
    META_TIP: "Tip:",
    GENERATED: "Generated: {example}, {docs}",
    ENV_OK: "Environment looks good.",
    MISSING_ENV: "Missing required environment variables:",
    META_PARSE_FAILED: "Failed to read/parse env meta file:"
  },

  ru: {
    META_NOT_FOUND: "Файл env.meta.json не найден.",
    META_TRIED: "Пробовали:",
    META_TIP: "Подсказка:",
    GENERATED: "Сгенерировано: {example}, {docs}",
    ENV_OK: "Переменные окружения в порядке.",
    MISSING_ENV: "Отсутствуют обязательные переменные окружения:",
    META_PARSE_FAILED: "Не удалось прочитать/распарсить env meta файл:"
  },
};
