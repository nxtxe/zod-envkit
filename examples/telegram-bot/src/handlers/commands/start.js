module.exports = {
  name: "start",
  type: "command",
  async execute(ctx, { logger, env }) {
    logger.info("start from", ctx.from?.id);

    await ctx.reply(
      [
        "👋 Hi!",
        "",
        "I'm a test bot.",
        "Commands:",
        "/start — start\n/ping — ping\n/health — health check",
      ].join("\n")
    );
  },
};
