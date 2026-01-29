# Библиотека

zod-envkit предоставляет небольшой, сфокусированный API для валидации `process.env` во время выполнения.

## loadEnv

Безопасный парсинг переменных окружения без выбрасывания исключений.

```ts
import { z } from "zod";
import { loadEnv, formatZodError } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),
});

const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Некорректное окружение:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;
```

**Возвращает**

* `{ ok: true, env }` при успехе
* `{ ok: false, error }` при ошибке валидации

## mustLoadEnv

Версия `loadEnv` с немедленным завершением при ошибке.

```ts
import { z } from "zod";
import { mustLoadEnv } from "zod-envkit";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1).max(65535),
});

export const env = mustLoadEnv(EnvSchema);
```

* выбрасывает `ZodError`, если валидация не пройдена
* рекомендуется использовать при запуске приложения

## formatZodError

Преобразует `ZodError` в читаемую многострочную строку.

```ts
import { z } from "zod";
import { loadEnv, formatZodError } from "zod-envkit";

const schema = z.object({ PORT: z.coerce.number().int() });
const res = loadEnv(schema);

if (!res.ok) {
  console.error(formatZodError(res.error));
}
```

Формат вывода:

* одна проблема на строку
* включает путь (например, `PORT`) и сообщение

## Примечания

* zod-envkit валидирует только `process.env` (строки) — используйте `z.coerce.*` для преобразования значений.
* Храните схему окружения в одном месте (при запуске) для раннего обнаружения ошибок и согласованности типов.