# CLI

zod-envkit включает CLI для генерации документации по окружению и валидации конфигурации в CI.

Запуск:

```bash
npx zod-envkit --help
```

## generate

Генерация `.env.example` и документации из `env.meta.json`.

```bash
npx zod-envkit generate
```

Общие опции:

```bash
npx zod-envkit generate \
  --config env.meta.json \
  --out-example .env.example \
  --out-docs ENV.md
```

### Формат документации

```bash
npx zod-envkit generate --format md
npx zod-envkit generate --format json
npx zod-envkit generate --format yaml
```

### Сортировка

```bash
npx zod-envkit generate --sort alpha
npx zod-envkit generate --sort required-first
npx zod-envkit generate --sort none
```

## show

Показать текущее состояние переменных окружения в читаемой таблице.

* может загружать dotenv-файлы
* по умолчанию маскирует секреты

```bash
npx zod-envkit show
```

### Цепочка dotenv

Загрузка нескольких файлов по порядку (последующие переопределяют предыдущие):

```bash
npx zod-envkit show --dotenv ".env,.env.local,.env.production"
```

### Маскирование

```bash
npx zod-envkit show --mask-mode partial
npx zod-envkit show --mask-mode full
npx zod-envkit show --no-mask
```

## check

Проверить обязательные переменные окружения.

```bash
npx zod-envkit check
```

* завершается с кодом `0` при успехе
* завершается с кодом `1` при ошибке

### Строгий режим

Также завершается с ошибкой, если присутствуют неизвестные переменные (не перечисленные в `env.meta.json`):

```bash
npx zod-envkit check --strict
```

### Цепочка dotenv

```bash
npx zod-envkit check --dotenv ".env,.env.local"
```

## init

Инициализация конфигурации из существующих файлов.

### Создать `env.meta.json` из `.env.example`

```bash
npx zod-envkit init
```

### Создать `.env.example` из `env.meta.json`

```bash
npx zod-envkit init --from-meta
```

## Поддержка папки examples

Если в вашем репозитории есть примеры:

* `./examples/env.meta.json`

CLI автоматически обнаружит их, или вы можете передать явный конфиг:

```bash
npx zod-envkit generate -c examples/env.meta.json
```