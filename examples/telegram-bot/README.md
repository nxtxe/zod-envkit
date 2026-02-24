# Telegram Test Bot

A simple, well-structured Telegram bot built with **Telegraf**, featuring:

* command-based architecture
* environment validation with **Zod + zod-envkit**
* health & ping endpoints for testing
* clean startup and graceful shutdown
* ready for CI/CD and production usage

---

## Features

* `/start` — basic start command
* `/ping` — quick liveness check with latency
* `/health` — runtime health status (env, uptime, memory)
* strict environment variable validation on startup
* CLI tools for env inspection and CI checks

---

## Project Structure

```
.
├── src/
│   ├── core/
│   │   ├── env.js        # Environment validation (Zod)
│   │   └── logger.js     # Simple logger
│   ├── handlers/
│   │   └── commands/
│   │       ├── start.js
│   │       ├── ping.js
│   │       └── health.js
│   ├── bot.js            # Bot initialization
│   └── index.js          # App bootstrap
├── .env                  # Local env (NOT committed)
├── .env.example          # Example env file
├── env.meta.json         # Env metadata for zod-envkit
├── ENV.md                # Auto-generated env docs
├── index.js              # Entry point
├── package.json
└── README.md
```

---

## Requirements

* **Node.js 18+**
* Telegram bot token from `@BotFather`

---

## Installation

```bash
npm install
```

---

## Environment Setup

1. Copy example env file:

```bash
cp .env.example .env
```

2. Fill in required variables:

```env
BOT_TOKEN=your_telegram_bot_token
NODE_ENV=development
LOG_LEVEL=debug
```

3. Validate environment:

```bash
npm run env:check
```

---

## Running the Bot

```bash
npm start
```

If the environment is invalid, the app will fail fast on startup.

---

## Available Commands

| Command   | Description                |
| --------- | -------------------------- |
| `/start`  | Start the bot              |
| `/ping`   | Liveness check + latency   |
| `/health` | Runtime health information |

---

## Environment Tooling (zod-envkit)

Generate env docs and examples:

```bash
npm run env:gen
```

Show current environment state:

```bash
npm run env:show
```

Validate required variables (CI-friendly):

```bash
npm run env:check
```

---

## CI / Production Notes

* `.env` is **never committed**
* use `env.meta.json` + `zod-envkit check` in CI
* polling mode is enabled by default (no webhook required)
* supports graceful shutdown (`SIGINT`, `SIGTERM`)

---

## License

ISC
