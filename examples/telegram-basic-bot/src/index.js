const { env } = require("./core/env");
const { createLogger } = require("./core/logger");
const { createBot } = require("./bot");

async function start() {
  const logger = createLogger(env.LOG_LEVEL);

  const bot = await createBot({ env, logger });

  await bot.launch({ dropPendingUpdates: true });
  logger.info("Bot launched");

  const shutdown = async (signal) => {
    logger.warn(`Received ${signal}, stopping...`);
    try {
      await bot.stop(signal);
    } finally {
      process.exit(0);
    }
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

module.exports = { start };
