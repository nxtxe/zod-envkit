// src/cli/lib/argv.ts
export function injectDefaultCommandIfMissing(
  argv: string[],
  opts: { known: Set<string>; defaultCommand: string }
) {
  // argv: [node, script, ...args]
  const args = argv.slice(2);
  const hasKnownToken = args.some((a) => opts.known.has(a));
  if (!hasKnownToken) argv.splice(2, 0, opts.defaultCommand);
}
