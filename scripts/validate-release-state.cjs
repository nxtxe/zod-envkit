const fs = require("node:fs");
const path = require("node:path");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getLatestChangelogVersion(changelog) {
  const match = changelog.match(/^##\s+\[(\d+\.\d+\.\d+)\]/m);
  return match ? match[1] : null;
}

function main() {
  const root = process.cwd();
  const pkgPath = path.resolve(root, "package.json");
  const changelogPath = path.resolve(root, "CHANGELOG.md");

  const pkg = readJson(pkgPath);
  const changelog = fs.readFileSync(changelogPath, "utf8");

  const packageVersion = String(pkg.version ?? "");
  const changelogVersion = getLatestChangelogVersion(changelog);

  if (!changelogVersion) {
    throw new Error("Release hygiene check failed: cannot find latest version heading in CHANGELOG.md");
  }

  if (changelogVersion !== packageVersion) {
    throw new Error(
      `Release hygiene check failed: package.json version (${packageVersion}) does not match latest CHANGELOG version (${changelogVersion})`
    );
  }

  console.log(`release hygiene ok: ${packageVersion}`);
}

main();
