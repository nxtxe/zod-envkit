import type { Lang } from "./i18n.js";

/**
 * CLI and library messages.
 *
 * ⚠️ This file is part of the public CLI contract.
 * Adding keys is allowed, renaming/removing is breaking.
 *
 * @since 1.0.0
 */
export const messages: Record<Lang, Record<string, string>> = {
  en: {
    META_NOT_FOUND: "env meta file not found.",
    META_TRIED: "Tried:",
    META_TIP: "Tip:",
    META_PARSE_FAILED: "Failed to read/parse env meta file:",

    GENERATED: "Generated: {example}, {docs}",

    ENV_OK: "Environment looks good.",
    MISSING_ENV: "Missing required environment variables:",
    UNKNOWN_ENV: "Unknown environment variables:",

    INVALID_FORMAT: "Invalid docs format",
    INVALID_MASK_MODE: "Invalid mask mode",
    INVALID_SORT: "Invalid sort mode",

    INIT_INPUT_EMPTY: "Input env file is empty or not found:",
  },

  ru: {
    META_NOT_FOUND: "Файл env.meta.json не найден.",
    META_TRIED: "Пробовали:",
    META_TIP: "Подсказка:",
    META_PARSE_FAILED: "Не удалось прочитать или распарсить env meta файл:",

    GENERATED: "Сгенерировано: {example}, {docs}",

    ENV_OK: "Переменные окружения в порядке.",
    MISSING_ENV: "Отсутствуют обязательные переменные окружения:",
    UNKNOWN_ENV: "Обнаружены неизвестные переменные окружения:",

    INVALID_FORMAT: "Неверный формат документации",
    INVALID_MASK_MODE: "Неверный режим маскировки",
    INVALID_SORT: "Неверный режим сортировки",

    INIT_INPUT_EMPTY: "Файл окружения пуст или не найден:",
  },
};
