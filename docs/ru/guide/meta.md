# env.meta.json

CLI использует `env.meta.json` как явный контракт для:

* генерации `.env.example`
* генерации документации (`ENV.md`, `ENV.json`, `ENV.yaml`)
* проверки обязательных переменных в CI

По умолчанию CLI ищет файлы:

* `./env.meta.json`
* `./examples/env.meta.json`

## Пример

```json
{
  "NODE_ENV": {
    "description": "Режим выполнения",
    "example": "development",
    "required": true,
    "group": "Основное"
  },
  "DATABASE_URL": {
    "description": "Строка подключения к Postgres",
    "example": "postgres://user:pass@localhost:5432/db",
    "required": true,
    "group": "База данных"
  },
  "JWT_SECRET": {
    "description": "Ключ для подписи JWT",
    "example": "change-me",
    "required": true,
    "group": "Аутентификация",
    "since": "1.1.0",
    "link": "https://example.com/docs/auth#jwt"
  }
}
```

## Поддерживаемые поля

Каждый ключ — это имя переменной окружения. Значение — метаданные:

* `description?: string` — человекочитаемое описание
* `example?: string` — пример значения для `.env.example` и документации
* `required?: boolean` — по умолчанию `true`
* `group?: string` — название раздела в сгенерированной документации
* `default?: string` — значение по умолчанию (если есть)
* `deprecated?: boolean | string` — пометить как устаревшее (используйте строку для объяснения)
* `since?: string` — версия, в которой была введена переменная
* `link?: string` — ссылка на документацию

## Группы

Если указан `group`, генераторы могут создавать сгруппированные разделы (например, "База данных", "Аутентификация").
Если поле опущено, переменная помещается в группу по умолчанию.

## Советы

* Не указывайте секреты в значениях `example`.
* Используйте `group` для удобочитаемости документации в больших проектах.
* Добавляйте `since` и `deprecated` для поддержки долгоживущих сервисов с развивающейся конфигурацией.