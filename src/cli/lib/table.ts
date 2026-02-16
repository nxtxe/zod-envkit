// src/cli/lib/table.ts

/**
 * @internal
 */
function strLen(s: string): number {
  return (s ?? "").length;
}

/**
 * @internal
 */
function padCenter(text: string, width: number): string {
  const v = text ?? "";
  const diff = width - strLen(v);
  if (diff <= 0) return v;
  const left = Math.floor(diff / 2);
  const right = diff - left;
  return " ".repeat(left) + v + " ".repeat(right);
}

/**
 * @internal
 */
function makeDivider(width: number, align: "left" | "center" | "right"): string {
  // Markdown alignment cells should be at least 3 chars wide
  const w = Math.max(3, width);
  if (align === "center") return ":" + "-".repeat(w - 2) + ":";
  if (align === "right") return "-".repeat(w - 1) + ":";
  return "-".repeat(w);
}

/**
 * Print a simple, centered Markdown table to stdout.
 *
 * CONTRACT (stable in 1.x):
 * - Always prints a header row, a divider row, then one row per `rows` entry.
 * - Uses centered alignment for all columns.
 * - Widths are computed from `headers` + cell contents (stable/predictable output).
 *
 * @internal
 * @since 1.0.4
 */
export function printMarkdownTable(
  rows: Array<Record<string, string>>,
  headers: string[]
) {
  if (headers.length === 0) return;

  const widths: Record<string, number> = {};
  for (const h of headers) widths[h] = strLen(h);

  for (const row of rows) {
    for (const h of headers) {
      widths[h] = Math.max(widths[h], strLen(row[h] ?? ""));
    }
  }

  // add breathing room so centering looks nice
  for (const h of headers) widths[h] += 2;

  const headerLine =
    "|" + headers.map((h) => ` ${padCenter(h, widths[h])} `).join("|") + "|";

  const sepLine =
    "|" + headers.map((h) => ` ${makeDivider(widths[h], "center")} `).join("|") + "|";

  console.log(headerLine);
  console.log(sepLine);

  for (const row of rows) {
    console.log(
      "|" + headers.map((h) => ` ${padCenter(row[h] ?? "", widths[h])} `).join("|") + "|"
    );
  }
}
