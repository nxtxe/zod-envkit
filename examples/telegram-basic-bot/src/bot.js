const { Telegraf, Scenes, session } = require("telegraf");
const fs = require("fs");
const path = require("path");

function loadHandlers(bot, dir, deps) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      loadHandlers(bot, fullPath, deps);
      continue;
    }

    if (!entry.isFile() || !fullPath.endsWith(".js")) continue;

    const handler = require(fullPath);

    if (!handler?.name || typeof handler.execute !== "function") continue;

    const isCommand =
      handler.type === "command" ||
      entry.name.toLowerCase().startsWith("cmd") ||
      fullPath.includes(`${path.sep}commands${path.sep}`);

    const wrapped = async (ctx) => {
      try {
        await handler.execute(ctx, deps);
      } catch (e) {
        deps.logger.error("Handler error:", e);
        try { await ctx.reply("⚠️ Error, try again."); } catch {}
      }
    };

    if (isCommand) bot.command(handler.name, wrapped);
    else bot.on(handler.name, wrapped);
  }
}

async function createBot({ env, logger }) {
  const bot = new Telegraf(env.BOT_TOKEN);

  const scenes = [];

  const stage = new Scenes.Stage(scenes);

  bot.use(session());
  bot.use(stage.middleware());

  loadHandlers(bot, path.join(__dirname, "handlers"), { env, logger, bot });

  bot.catch((err, ctx) => {
    logger.error("Telegraf error:", err);
  });

  return bot;
}

module.exports = { createBot };
