(async () => {
  try {
    const { start } = require("./src/index");
    await start();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
