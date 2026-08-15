# CLI

zod-envkit включает CLI для генерации документации по окружению и валидации конфигурации в CI.

Запуск:

```bash
npx zod-envkit --help
```

Расширенная справка для глубокого ознакомления и рабочих сценариев:

```bash
npx zod-envkit help --all
```

Язык можно указать явно:

```bash
npx zod-envkit help --all --lang en
npx zod-envkit help --all --lang ru
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

Проверка неизвестных переменных смотрит **только на ключи из dotenv** — переменные, которые есть только в host `process.env`, игнорируются.

### Production guard

Более строгие проверки для deploy/CI перед релизом или выкладкой в production:

```bash
npx zod-envkit check --production
```

С `--production`:

* неизвестные переменные из dotenv-файлов приводят к ошибке так же, как в `--strict`
* обязательные переменные, которые есть в dotenv, но пустые после trim, приводят к ошибке (`PORT=`, `PORT="   "` и т.д.)
* placeholder / заглушки приводят к ошибке (правила v1 ниже)

Проверки пустых значений и placeholder смотрят только на ключи из dotenv — обычный `check` без `--production` эти правила не применяет.

Переменные только из host-окружения, которых нет в загруженной цепочке dotenv, по-прежнему игнорируются для проверки unknown.

#### Правила placeholder (v1)

Значение из dotenv считается placeholder, если оно:

* совпадает с непустым полем `example` в meta для этого ключа
* точный литерал без учёта регистра: `changeme`, `todo`, `xxx`
* шаблон целиком в угловых скобках: `<SOMETHING>` (не URL)
* шаблон целиком вида `YOUR_*_HERE` (например `YOUR_API_KEY_HERE`)

В ошибке выводятся **ключ + причина**. Сырые значения не печатаются; для ключей-секретов (`isSecretKey`) литералы тоже скрываются.

Используйте в production-пайплайнах, когда нужны дополнительные guardrails поверх обычного `check`, без явного `--strict`.

`--production` и `--strict` можно комбинировать; проверка неизвестных переменных выполняется один раз (без дублирования секций ошибок).

### Цепочка dotenv

```bash
npx zod-envkit check --dotenv ".env,.env.local"
```

### Согласованность Schema ↔ Meta

Если у вас есть и Zod-схема (например в `src/env.ts`), и `env.meta.json`, можно проверять их соответствие:

```bash
npx zod-envkit check --schema dist/env.js
```

* **--schema &lt;файл&gt;** — путь к JS-файлу, экспортирующему Zod object (`z.object(...)`). CLI сравнивает ключи схемы с ключами в `env.meta.json`: переменные только в схеме или только в мете выводятся в отчёт.
* **--schema-mode warn | strict** — `warn` (только сообщение, exit 0) или `strict` (сообщение и exit 1). По умолчанию: `strict`.

Пример: падать в CI при расхождении схемы и меты:

```bash
npx zod-envkit check --schema dist/env.js --schema-mode strict
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

## Стабильность CLI-контракта

В ветке 1.x следующее поведение CLI считается стабильным контрактом:

* `--help` содержит основные команды: `generate`, `show`, `check`, `init`
* `help --all` выводит расширенный справочник (быстрый старт, workflow, полная справка по командам)
* `--version` выводит версию в формате SemVer
* exit-коды остаются предсказуемыми:
  * `0` при успехе
  * `1` при пользовательских/конфигурационных ошибках валидации
* `show` сохраняет стабильные заголовки таблицы:
  * `Key`, `Required`, `Present`, `Value`, `Description`

Небрейкинг-обновления могут улучшать формулировки и подсказки, но не должны менять эти контрактные точки.