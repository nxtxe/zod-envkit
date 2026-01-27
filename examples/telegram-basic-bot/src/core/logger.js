const levels = ["debug", "info", "warn", "error"];

function createLogger(level = "info") {
  const minIndex = levels.indexOf(level);

  const can = (lvl) => levels.indexOf(lvl) >= minIndex;

  return {
    debug: (...a) => can("debug") && console.log("[DEBUG]", ...a),
    info: (...a) => can("info") && console.log("[INFO ]", ...a),
    warn: (...a) => can("warn") && console.warn("[WARN ]", ...a),
    error: (...a) => can("error") && console.error("[ERROR]", ...a),
  };
}

module.exports = { createLogger };
