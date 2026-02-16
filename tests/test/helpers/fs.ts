import { promises as fs } from "node:fs";
import path from "node:path";

export async function writeFile(p: string, content: string) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, content, "utf8");
}

export async function readFile(p: string) {
  return fs.readFile(p, "utf8");
}

export async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}