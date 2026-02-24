# Env template

Generic **env.meta.json** and **.env.example** for reference (NODE_ENV, PORT, DATABASE_URL).  
Real examples use their own env in their folders:

* [telegram-bot](../telegram-bot) — BOT_TOKEN, NODE_ENV, LOG_LEVEL
* [next-app](../next-app) — NODE_ENV, API_SECRET, LOG_LEVEL

Generate docs from this template:

```bash
npx zod-envkit generate -c examples/template/env.meta.json
```
