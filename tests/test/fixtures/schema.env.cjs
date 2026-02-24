"use strict";
const { z } = require("zod");

const schema = z.object({
  PORT: z.string(),
  NODE_ENV: z.string(),
});

module.exports = { schema };
module.exports.default = schema;
