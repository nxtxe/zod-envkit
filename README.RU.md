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


Типобезопасная валидация и документация переменных окружения с помощью Zod.

zod-envkit — это небольшая, явная библиотека + CLI, которая рассматривает переменные окружения как
явный runtime-контракт, а не как неявную игру в угадайку.
	•	валидирует process.env при старте приложения
	•	предоставляет полностью типизированные переменные окружения
	•	генерирует .env.example
	•	генерирует документацию (ENV.md, ENV.json, ENV.yaml)
	•	позволяет просматривать состояние env через CLI (с маскированием секретов)
	•	строго валидирует env в CI/CD
	•	инициализирует конфигурацию через zod-envkit init
	•	загружает несколько .env* файлов с приоритетом

Никакого облака. Никакой магии. Только код.

⸻

Зачем

Переменные окружения критичны, но обычно обрабатываются неправильно.

Типичные проблемы:
	•	process.env — это просто string | undefined
	•	отсутствующие или некорректные переменные ломают приложение во время выполнения
	•	.env.example и документация рассинхронизируются
	•	CI/CD падает поздно и непредсказуемо

zod-envkit решает это, делая env:
	•	валидируемым на раннем этапе
	•	типизированным
	•	документированным
	•	проверяемым в CI

⸻

Когда использовать

Используйте zod-envkit, если:
	•	вы хотите, чтобы ошибки env обнаруживались при старте, а не в продакшене
	•	вы используете TypeScript и вам важны корректные типы
	•	вы хотите получать .env.example и документацию из единого источника правды
	•	вы хотите, чтобы CI ловил отсутствующие или лишние переменные

Когда НЕ использовать

Не стоит использовать zod-envkit, если:
	•	ваш проект очень маленький и неформальный
	•	вы вообще не контролируете переменные окружения
	•	вы ожидаете автоматическую интроспекцию схем или “магическое” поведение

⸻

Установка

npm install zod-envkit
yarn add zod-envkit
pnpm add zod-envkit
bun add zod-envkit


⸻

Использование библиотеки (runtime-валидация)

Создайте один файл, отвечающий за загрузку и валидацию env.

import "dotenv/config";
import { z } from "zod";
import { loadEnv, mustLoadEnv, formatZodError } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().url(),
});

Безопасный режим (без исключений)

const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Некорректное окружение:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;

Fail-fast режим (рекомендуется)

export const env = mustLoadEnv(EnvSchema);

Теперь:
	•	env.PORT — это number
	•	env.DATABASE_URL — это string
	•	TypeScript знает всё на этапе компиляции
	•	приложение падает сразу, если env некорректен

⸻

Использование CLI

CLI работает на основе мета-файла: env.meta.json.

По умолчанию он ищется в:
	•	./env.meta.json
	•	./examples/env.meta.json

⸻

Пример env.meta.json

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


⸻

Команды CLI

Генерация .env.example и документации

(Поведение по умолчанию)

npx zod-envkit

или явно:

npx zod-envkit generate

Генерация документации в разных форматах:

npx zod-envkit generate --format json
npx zod-envkit generate --format yaml

Управление сортировкой:

npx zod-envkit generate --sort alpha
npx zod-envkit generate --sort required-first


⸻

Просмотр текущего состояния окружения

Загружает dotenv-файлы, маскирует секреты и выводит читаемую таблицу.

npx zod-envkit show

Дополнительные опции:

npx zod-envkit show --mask-mode full
npx zod-envkit show --no-mask
npx zod-envkit show --dotenv ".env,.env.local,.env.production"


⸻

Проверка окружения (удобно для CI)

npx zod-envkit check

Строгий режим (падает при неизвестных переменных):

npx zod-envkit check --strict

	•	завершает процесс с кодом 1, если отсутствуют обязательные переменные
	•	в --strict режиме также падает при наличии неизвестных переменных

⸻

Инициализация конфигурации

Быстрый старт конфигурации из существующих файлов.

Сгенерировать env.meta.json из .env.example:

npx zod-envkit init

Сгенерировать .env.example из существующего env.meta.json:

npx zod-envkit init --from-meta


⸻

Стабильность и версионирование

zod-envkit следует Semantic Versioning.

Стабильность Public API (1.x)

Всё перечисленное ниже считается стабильным public API в рамках всей ветки 1.x.

Экспорты библиотеки (entrypoint zod-envkit):
	•	loadEnv
	•	mustLoadEnv
	•	formatZodError
	•	checkEnv
	•	getMissingEnv
	•	getUnknownEnv
	•	isSecretKey
	•	generateEnvExample
	•	generateEnvDocs
	•	sortMetaEntries
	•	связанные публичные типы: EnvMeta, EnvMetaEntry, EnvCheckResult, GenerateDocsOptions, DocsFormat, SortMode

CLI-контракт:
	•	команды: generate, show, check, init
	•	задокументированные флаги и значения по умолчанию
	•	поведение exit-кодов (успех = 0, пользовательская ошибка = 1)

Политика breaking-изменений

Breaking change (major) включает:
	•	изменение сигнатур или структуры возвращаемых значений стабильных экспортов
	•	удаление или переименование public-экспортов
	•	удаление или переименование CLI-команд или флагов
	•	изменение поведения CLI по умолчанию
	•	изменение семантики exit-кодов
	•	изменение контрактов формата вывода, ломающих существующие инструменты

Не считается breaking (minor/patch):
	•	добавление новых экспортов (обратно совместимых)
	•	добавление новых CLI-флагов (обратно совместимых)
	•	добавление новых опциональных полей в env.meta.json
	•	улучшение сообщений об ошибках или форматирования документации без нарушения совместимости

⸻

Что нового в 1.2.0

Версия 1.2.0 сосредоточена на надёжности, контрактности и готовности к CI.

Основные изменения:
	•	усилено поведение строгого режима (check --strict) для CI
	•	детерминированная обработка приоритета dotenv-файлов
	•	улучшены гарантии маскирования секретов в show
	•	расширен preprod-набор тестов (smoke, contract, CLI E2E, robustness)
	•	CI-pipeline принудительно выполняет: build → tests → docs build

С этого момента zod-envkit — это не просто “утилита”, а
стабильный инструмент контрактов окружения для CI/CD-пайплайнов.

⸻

Почему не просто dotenv?

dotenv:
	•	❌ нет валидации
	•	❌ нет типов
	•	❌ нет документации
	•	❌ нет проверок для CI

zod-envkit:
	•	✅ валидация
	•	✅ вывод типов для TypeScript
	•	✅ документация
	•	✅ CLI-инструменты

Они предназначены для использования вместе.

⸻

Принципы дизайна
	•	явная конфигурация вместо магии
	•	отсутствие привязки к фреймворкам
	•	маленький и предсказуемый API
	•	библиотека и CLI независимы, но дополняют друг друга
	•	переменные окружения — это runtime-контракт

⸻

Лицензия

MIT