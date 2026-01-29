# Начало работы

Это руководство показывает, как проверять переменные окружения во время выполнения с использованием zod-envkit.

## Установка

```bash
npm add zod-envkit
```
```bash
pnpm add zod-envkit
```
```bash
yarn add zod-envkit
```

Создайте один файл, ответственный за загрузку и валидацию переменных окружения.

```ts
import "dotenv/config";
import { z } from "zod";
import { mustLoadEnv } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1).max(65535),
});

export const env = mustLoadEnv(EnvSchema);
```

Если валидация не пройдена, приложение немедленно завершается с понятной ошибкой.

### Что вы получаете

* раннее обнаружение недействительных или отсутствующих переменных
* полностью типизированный объект окружения
* предсказуемое поведение во время выполнения
* более безопасные развертывания CI/CD