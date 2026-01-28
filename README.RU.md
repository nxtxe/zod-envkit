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
    <a href="./README.md">English</a> |
    <a href="./README.RU.md">Русский</a>
  </p>
</div>

Типобезопасная валидация и документация переменных окружения с помощью **Zod**.

**zod-envkit** — это небольшая, явная библиотека + CLI, которая помогает воспринимать переменные окружения как  
**явный runtime-контракт**, а не как неявную игру в угадайку.

- валидация `process.env` при старте приложения
- полностью типизированные переменные окружения
- генерация `.env.example`
- генерация документации (`ENV.md`, `ENV.json`, `ENV.yaml`)
- просмотр состояния env через CLI (с маскированием секретов)
- строгая проверка env в CI/CD
- инициализация конфигурации через `zod-envkit init`
- загрузка нескольких `.env*` файлов с приоритетом

Никакого облака. Никакой магии. Только код.

---

## Зачем

Переменные окружения критичны, но почти всегда обрабатываются плохо.

Типичные проблемы:

- `process.env` — это просто `string | undefined`
- отсутствующие или некорректные переменные ломают приложение **во время выполнения**
- `.env.example` и документация быстро устаревают
- CI/CD падает поздно и непредсказуемо

**zod-envkit** решает это, делая env:

- валидируемым на раннем этапе
- типизированным
- документированным
- проверяемым в CI

---

## Когда использовать

Используйте **zod-envkit**, если:

- ошибки env должны обнаруживаться **при старте**, а не в продакшене
- вы используете TypeScript и хотите строгие типы
- `.env.example` и документация должны генерироваться из одного источника
- CI должен падать при отсутствии или лишних переменных

## Когда НЕ использовать

Не стоит использовать **zod-envkit**, если:

- проект очень маленький и неформальный
- вы не контролируете переменные окружения
- вы ожидаете “магическую” автогенерацию схем

---

## Установка

```bash
npm install zod-envkit
````

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

### Безопасный режим (без исключений)

```ts
const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Некорректное окружение:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;
```

### Fail-fast режим (рекомендуется)

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

CLI работает на основе мета-файла: `env.meta.json`.

По умолчанию он ищется в:

* `./env.meta.json`
* `./examples/env.meta.json`

---

## Пример `env.meta.json`

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

### Генерация `.env.example` и документации

(Поведение по умолчанию)

```bash
npx zod-envkit
```

или явно:

```bash
npx zod-envkit generate
```

Генерация документации в разных форматах:

```bash
npx zod-envkit generate --format json
npx zod-envkit generate --format yaml
```

Сортировка переменных:

```bash
npx zod-envkit generate --sort alpha
npx zod-envkit generate --sort required-first
```

---

### Просмотр текущего состояния окружения

Загружает dotenv-файлы, маскирует секреты и выводит читаемую таблицу.

```bash
npx zod-envkit show
```

Дополнительные опции:

```bash
npx zod-envkit show --mask-mode full
npx zod-envkit show --no-mask
npx zod-envkit show --dotenv ".env,.env.local,.env.production"
```

---

### Проверка окружения (удобно для CI)

```bash
npx zod-envkit check
```

Строгий режим:

```bash
npx zod-envkit check --strict
```

* завершает процесс с кодом `1`, если отсутствуют обязательные переменные
* в `--strict` режиме также падает при наличии неизвестных переменных

---

### Инициализация конфигурации

Быстрый старт конфигурации из существующих файлов.

Сгенерировать `env.meta.json` из `.env.example`:

```bash
npx zod-envkit init
```

Сгенерировать `.env.example` из существующего `env.meta.json`:

```bash
npx zod-envkit init --from-meta
```

---

## Стабильность и версионирование

`zod-envkit` следует **Semantic Versioning**.

### Стабильный public API (1.x)

**Библиотека:**

* `loadEnv`
* `mustLoadEnv`
* `formatZodError`
* `checkEnv`
* `getMissingEnv`
* `getUnknownEnv`
* `isSecretKey`
* `generateEnvExample`
* `generateEnvDocs`

**CLI:**

* `generate`, `show`, `check`, `init`
* задокументированные флаги и коды выхода

### Что считается breaking change

* изменение сигнатур или типов возвращаемых значений
* удаление или переименование public-экспортов
* удаление или переименование CLI-команд и флагов
* изменение семантики exit-кодов
* изменение поведения CLI по умолчанию

Не считается breaking:

* добавление новых опциональных возможностей
* добавление новых флагов
* улучшение форматирования и сообщений об ошибках

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

Они предназначены для использования **вместе**.

---

## Принципы дизайна

* явная конфигурация вместо магии
* отсутствие привязки к фреймворкам
* маленький и предсказуемый API
* библиотека и CLI независимы, но дополняют друг друга
* переменные окружения — это runtime-контракт

---

## Лицензия

MIT