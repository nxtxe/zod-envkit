import path from "node:path";
import { execa } from "execa";

function resolveZodEnvkitCli(): string {
  return path.resolve(process.cwd(), "dist/cli/index.js");
}

export async function runZodEnvkit(opts: {
  cwd: string;
  args: string[];
  env?: NodeJS.ProcessEnv;
  reject?: boolean;
  /**
   * If false, do NOT inherit process.env (only provided env will be used).
   * Useful for --strict tests so host env doesn't break them.
   */
  inheritProcessEnv?: boolean;
}) {
  const { cwd, args, env, reject, inheritProcessEnv } = opts;

  const cliEntry = resolveZodEnvkitCli();

  const baseEnv = inheritProcessEnv === false ? {} : process.env;

  return execa(process.execPath, [cliEntry, ...args], {
    cwd,
    env: {
      ...baseEnv,
      ...env,
    },
    reject: reject ?? false,
    all: true,
  });
}