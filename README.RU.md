<div align="center">
  <br />
  <p>
    <img src="./zod-envkit.svg" width="546" alt="zod-envkit" />
  </p>
  <br />
  <p>
    <a href="https://github.com/nxtxe/zod-envkit">
      <img src="https://github.com/nxtxe/zod-envkit/actions/workflows/release.yml/badge.svg" />
    </a>
    <a href="https://www.npmjs.com/package/zod-envkit">
      <img src="https://img.shields.io/npm/v/zod-envkit.svg?maxAge=100" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/zod-envkit">
      <img src="https://img.shields.io/npm/dt/zod-envkit.svg?maxAge=100" alt="npm downloads" />
    </a>
  </p>

  <p>
    <a href="./README.md">
      <p>English</p>
    </a>
    <a href="./README.RU.md">
      <p>Русский</p>
    </a>
  </p>
</div>

Ниже — русский перевод текста, сохраняя структуру и смысл оригинала.

---

Типобезопасная валидация и документация переменных окружения с помощью **Zod**.

**zod-envkit** — это небольшая библиотека + CLI, которая помогает воспринимать переменные окружения как
**явный контракт времени выполнения**, а не как игру в угадайку.

* валидация `process.env` при старте приложения
* полностью типизированные переменные окружения
* генерация `.env.example`
* генерация читаемой документации (`ENV.md`)
* просмотр и проверка состояния env через CLI
* быстрый фейл в CI/CD до деплоя

Никакого облака. Никакой магии. Только код.

---

## Зачем

Переменные окружения критичны, но почти всегда обрабатываются плохо.

Типичные проблемы:

* `process.env` — это просто `string | undefined`
* отсутствующие или некорректные переменные падают **во время выполнения**
* `.env.example` и документация быстро устаревают
* CI/CD ломается поздно и непредсказуемо

**zod-envkit** решает это, делая env:

* валидируемым на раннем этапе
* типизированным
* документированным
* проверяемым в CI

---

## Установка

```bash
npm install zod-envkit
```

```bash
yarn add zod-envkit
```

```bash
pnpm add zod-envkit
```

---

## Использование библиотеки (runtime-валидация)

Создайте один файл, отвечающий за загрузку и валидацию env.

```ts
import "dotenv/config";
import { z } from "zod";
import { loadEnv, mustLoadEnv, formatZodError } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().url(),
});
```

### Вариант 1 — безопасный режим (без исключений)

```ts
const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Некорректное окружение:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;
```

### Вариант 2 — fail-fast (рекомендуется)

```ts
export const env = mustLoadEnv(EnvSchema);
```

Теперь:

* `env.PORT` — это **number**
* `env.DATABASE_URL` — это **string**
* TypeScript всё знает на этапе компиляции
* приложение падает сразу, если env некорректен

---

## Использование CLI

CLI работает на основе простого мета-файла: `env.meta.json`.

По умолчанию он ищется в:

* `./env.meta.json`
* `./examples/env.meta.json`

---

### Пример `env.meta.json`

```json
{
  "NODE_ENV": {
    "description": "Режим выполнения",
    "example": "development",
    "required": true
  },
  "PORT": {
    "description": "HTTP-порт",
    "example": "3000",
    "required": true
  },
  "DATABASE_URL": {
    "description": "Строка подключения к Postgres",
    "example": "postgresql://user:pass@localhost:5432/db",
    "required": true
  }
}
```

---

## Команды CLI

### Генерация `.env.example` и `ENV.md`

(Поведение по умолчанию)

```bash
npx zod-envkit
```

или явно:

```bash
npx zod-envkit generate
```

---

### Просмотр текущего состояния окружения

Загружает `.env`, маскирует секреты и показывает читаемую таблицу.

```bash
npx zod-envkit show
```

Показывает:

* какие переменные обязательны
* какие присутствуют
* замаскированные значения секретов (`TOKEN`, `SECRET`, `*_KEY` и т.д.)

---

### Проверка обязательных переменных (удобно для CI)

```bash
npx zod-envkit check
```

* завершает процесс с кодом `1`, если отсутствует хотя бы одна обязательная переменная
* идеально для CI/CD пайплайнов и pre-deploy проверок

Пример шага в CI:

```bash
npx zod-envkit check
```

---

### Опции CLI

```bash
zod-envkit --help
```

Часто используемые флаги:

```bash
zod-envkit show \
  --config examples/env.meta.json \
  --env-file .env
```

---

## Почему не просто dotenv?

`dotenv`:

* ❌ нет валидации
* ❌ нет типов
* ❌ нет документации
* ❌ нет проверок для CI

`zod-envkit`:

* ✅ валидация
* ✅ вывод типов для TypeScript
* ✅ документация
* ✅ CLI-инструменты

Они созданы для использования **вместе**.

---

## Принципы дизайна

* явная конфигурация вместо магии
* отсутствие привязки к фреймворкам
* маленький и предсказуемый API
* библиотека и CLI независимы, но дополняют друг друга
* переменные окружения — это runtime-контракт

---

## Roadmap

* [ ] проверка согласованности schema ↔ meta
* [ ] группировка секций в сгенерированной документации
* [ ] более аккуратный и человеко-понятный вывод ошибок
* [ ] экспорт в JSON Schema
* [ ] более строгие режимы валидации для production

---

## Для кого это?

* backend- и fullstack-проекты
* сервисы на Node.js и Bun
* CI/CD пайплайны
* команды, которые хотят, чтобы ошибки env находились рано, а не поздно

---

## Лицензия

MIT
