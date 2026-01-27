module.exports = {
  name: "health",
  type: "command",

  async execute(ctx, { env }) {
    const mem = process.memoryUsage();

    const uptimeSec = Math.floor(process.uptime());

    await ctx.reply(
      [
        "🩺 Health check",
        "",
        `• Status: ✅ OK`,
        `• Environment: ${env.NODE_ENV}`,
        `• Uptime: ${uptimeSec}s`,
        "",
        "📦 Memory:",
        `• RSS: ${(mem.rss / 1024 / 1024).toFixed(1)} MB`,
        `• Heap used: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
      ].join("\n")
    );
  },
};
