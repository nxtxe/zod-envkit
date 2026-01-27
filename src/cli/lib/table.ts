// src/cli/lib/table.ts
function padCenter(text: string, width: number): string {
  const v = text ?? "";
  const diff = width - v.length;
  if (diff <= 0) return v;
  const left = Math.floor(diff / 2);
  const right = diff - left;
  return " ".repeat(left) + v + " ".repeat(right);
}

export function printMarkdownTable(rows: Array<Record<string, string>>, headers: string[]) {
  const widths: Record<string, number> = {};
  for (const h of headers) widths[h] = h.length;

  for (const row of rows) {
    for (const h of headers) widths[h] = Math.max(widths[h], (row[h] ?? "").length);
  }

  // add breathing room so centering looks nice
  for (const h of headers) widths[h] += 2;

  const headerLine = "|" + headers.map((h) => " " + padCenter(h, widths[h]) + " ").join("|") + "|";
  const sepLine = "|" + headers.map((h) => ":" + "-".repeat(Math.max(3, widths[h])) + ":").join("|") + "|";

  console.log(headerLine);
  console.log(sepLine);

  for (const row of rows) {
    console.log("|" + headers.map((h) => " " + padCenter(row[h] ?? "", widths[h]) + " ").join("|") + "|");
  }
}
