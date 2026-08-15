import type { Lang } from "./i18n.js";

/**
 * CLI and library messages.
 *
 * ⚠️ This file is part of the public CLI contract.
 * Adding keys is allowed, renaming/removing is breaking.
 *
 * Stable in 1.2.
 *
 * @since 1.0.0
 */
export const messages: Record<Lang, Record<string, string>> = {
  en: {
    ENV_INVALID: "Environment is invalid.",
    META_NOT_FOUND: "env meta file not found.",
    META_TRIED: "Tried:",
    META_TIP: "Tip:",
    META_PARSE_FAILED: "Failed to read/parse env meta file:",
    META_EXAMPLE_EMPTY: ".env.example exists but has no parseable variables.",
    META_FALLBACK_EXAMPLE: "env.meta.json not found, falling back to .env.example (minimal meta).",
    META_FALLBACK_TIP: "Tip: create env.meta.json for richer docs, grouping, and stable CLI behavior.",

    GENERATED: "Generated: {example}, {docs}",

    ENV_OK: "Environment looks good.",
    MISSING_ENV: "Missing required environment variables:",
    EMPTY_REQUIRED_ENV: "Required environment variables are empty (production; dotenv-loaded keys):",
    PLACEHOLDER_ENV: "Placeholder environment values (production; dotenv-loaded keys):",
    UNKNOWN_ENV: "Unknown environment variables (strict mode; only dotenv-loaded keys):",

    INVALID_FORMAT: "Invalid docs format",
    INVALID_MASK_MODE: "Invalid mask mode",
    INVALID_SORT: "Invalid sort mode",
    INVALID_SCHEMA_MODE: "Invalid schema mode",

    INIT_INPUT_EMPTY: "Input env file is empty or not found:",
    META_EMPTY_TIP_LINE_1: "Add at least one KEY=value line to .env.example,",
    META_EMPTY_TIP_LINE_2: "or create env.meta.json and run: npx zod-envkit generate -c env.meta.json",

    SCHEMA_LOAD_FAILED: "Failed to load schema file:",
    SCHEMA_NOT_OBJECT: "Schema file must export a Zod object (z.object(...)).",
    SCHEMA_VARS_NOT_IN_META: "Schema variables not listed in env.meta.json:",
    META_VARS_NOT_IN_SCHEMA: "env.meta.json variables not in schema:",
    SCHEMA_HINT_ADD_TO_META: "Hint: add these keys to env.meta.json for docs and CLI.",
    META_HINT_SYNC_SCHEMA: "Hint: add these to your Zod schema or remove from env.meta.json.",
  },

  ru: {
    ENV_INVALID: "Переменные окружения заданы некорректно.",
    META_NOT_FOUND: "Файл env.meta.json не найден.",
    META_TRIED: "Пробовали:",
    META_TIP: "Подсказка:",
    META_PARSE_FAILED: "Не удалось прочитать или распарсить env meta файл:",
    META_EXAMPLE_EMPTY: ".env.example найден, но в нем нет распознаваемых переменных.",
    META_FALLBACK_EXAMPLE: "env.meta.json не найден, используем .env.example как минимальную мету.",
    META_FALLBACK_TIP: "Подсказка: лучше создать env.meta.json — будет богаче документация и стабильнее CLI-контракт.",

    GENERATED: "Сгенерировано: {example}, {docs}",

    ENV_OK: "Переменные окружения в порядке.",
    MISSING_ENV: "Отсутствуют обязательные переменные окружения:",
    EMPTY_REQUIRED_ENV: "Обязательные переменные окружения пустые (production; только из dotenv-файлов):",
    PLACEHOLDER_ENV: "Обнаружены placeholder-значения (production; только из dotenv-файлов):",
    UNKNOWN_ENV: "Обнаружены неизвестные переменные окружения (strict; только из dotenv-файлов):",

    INVALID_FORMAT: "Неверный формат документации",
    INVALID_MASK_MODE: "Неверный режим маскировки",
    INVALID_SORT: "Неверный режим сортировки",
    INVALID_SCHEMA_MODE: "Неверный режим schema",

    INIT_INPUT_EMPTY: "Файл окружения пуст или не найден:",
    META_EMPTY_TIP_LINE_1: "Добавьте в .env.example хотя бы одну строку KEY=value,",
    META_EMPTY_TIP_LINE_2: "или создайте env.meta.json и выполните: npx zod-envkit generate -c env.meta.json",

    SCHEMA_LOAD_FAILED: "Не удалось загрузить файл схемы:",
    SCHEMA_NOT_OBJECT: "Файл схемы должен экспортировать Zod object (z.object(...)).",
    SCHEMA_VARS_NOT_IN_META: "Переменные схемы отсутствуют в env.meta.json:",
    META_VARS_NOT_IN_SCHEMA: "Переменные env.meta.json отсутствуют в схеме:",
    SCHEMA_HINT_ADD_TO_META: "Подсказка: добавьте эти ключи в env.meta.json для доков и CLI.",
    META_HINT_SYNC_SCHEMA: "Подсказка: добавьте их в Zod-схему или удалите из env.meta.json.",
  },
};