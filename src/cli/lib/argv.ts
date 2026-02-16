// src/cli/lib/argv.ts

/**
 * Inject default CLI command if none of the known commands/flags are present.
 *
 * This powers the behavior:
 *   `zod-envkit` → `zod-envkit generate`
 *
 * @internal
 * @since 1.1.0
 */
export function injectDefaultCommandIfMissing(
  argv: string[],
  opts: { known: Set<string>; defaultCommand: string }
) {
  // argv: [node, script, ...args]
  if (argv.length <= 2) {
    argv.splice(2, 0, opts.defaultCommand);
    return;
  }

  const args = argv.slice(2);

  const hasKnownToken = args.some((a) => opts.known.has(a));
  const alreadyInjected = args[0] === opts.defaultCommand;

  if (!hasKnownToken && !alreadyInjected) {
    argv.splice(2, 0, opts.defaultCommand);
  }
}