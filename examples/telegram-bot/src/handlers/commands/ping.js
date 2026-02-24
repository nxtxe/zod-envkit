module.exports = {
  name: "ping",
  type: "command",

  async execute(ctx, { logger }) {
    const start = Date.now();

    const msg = await ctx.reply("🏓 pong");

    const latency = Date.now() - start;
    logger.debug("Ping latency:", latency, "ms");

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      msg.message_id,
      undefined,
      `🏓 pong\n⏱ ${latency} ms`
    );
  },
};
