/**
 * Copies CHANGELOG.md to docs/guide/changelog.md with VitePress frontmatter.
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "CHANGELOG.md");
const out = path.join(root, "docs", "guide", "changelog.md");

const content = fs.readFileSync(src, "utf8");
const notice =
  "> **Generated from [CHANGELOG.md](https://github.com/nxtxe/zod-envkit/blob/main/CHANGELOG.md).** Edit only the repo file.\n\n";
const frontmatter = "---\ntitle: What's new\n---\n\n";
fs.writeFileSync(out, frontmatter + notice + content, "utf8");

console.log("Copied CHANGELOG.md → docs/guide/changelog.md");
