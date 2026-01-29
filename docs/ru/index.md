<div align="center">
  <br />

  <img src="/zod-envkit.svg" width="546" alt="zod-envkit" />

  <br />

 <a href="https://github.com/nxtxe/zod-envkit" style="display: inline-block; margin-right: 10px;">
  <img src="https://github.com/nxtxe/zod-envkit/actions/workflows/release.yml/badge.svg" />
</a>
<a href="https://www.npmjs.com/package/zod-envkit" style="display: inline-block; margin-right: 10px;">
  <img src="https://img.shields.io/npm/v/zod-envkit.svg?maxAge=100" alt="Версия npm" />
</a>
<a href="https://www.npmjs.com/package/zod-envkit" style="display: inline-block;">
  <img src="https://img.shields.io/npm/dt/zod-envkit.svg?maxAge=100" alt="Загрузки npm" />
</a>

</div>


# zod-envkit

Типобезопасная валидация переменных окружения и документация с использованием **Zod**.

zod-envkit помогает вам относиться к переменным окружения как к **явному контракту времени выполнения**, а не как к неявной игре в угадайку.

## Возможности

- Валидация во время выполнения с помощью Zod
- Полностью типизированный `process.env`
- CLI для проверки окружения и CI-тестов
- Автоматическая генерация `.env.example`
- Генерация документации (`md`, `json`, `yaml`)
- Строгая валидация для CI/CD

## Быстрый старт

```bash
npm install zod-envkit
````

```bash
yarn add zod-envkit
```

```bash
pnpm add zod-envkit
```
## Пример

```ts
import "dotenv/config";
import { z } from "zod";
import { mustLoadEnv } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int(),
});

export const env = mustLoadEnv(EnvSchema);
```