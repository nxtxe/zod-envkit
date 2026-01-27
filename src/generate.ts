// src/generate.ts

export type EnvMeta = Record<
  string,
  {
    description?: string;
    example?: string;
    required?: boolean; // default: true
  }
>;

function strLen(s: string): number {
  return (s ?? "").length;
}

function padCenter(text: string, width: number): string {
  const t = text ?? "";
  const diff = width - strLen(t);
  if (diff <= 0) return t;

  const left = Math.floor(diff / 2);
  const right = diff - left;
  return " ".repeat(left) + t + " ".repeat(right);
}

function makeDivider(width: number, align: "left" | "center" | "right"): string {
  // Markdown alignment:
  // left   : --- 
  // center : :---:
  // right  : ---:
  if (width < 3) width = 3;

  if (align === "center") return ":" + "-".repeat(width - 2) + ":";
  if (align === "right") return "-".repeat(width - 1) + ":";
  return "-".repeat(width);
}

/**
 * Generate .env.example:
 * - comment with description (if present)
 * - KEY=example
 */
export function generateEnvExample(meta: EnvMeta): string {
  const lines: string[] = [];

  for (const [key, m] of Object.entries(meta)) {
    if (m.description) lines.push(`# ${m.description}`);
    lines.push(`${key}=${m.example ?? ""}`);
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

/**
 * Generate ENV.md as a nicely aligned Markdown table:
 * - calculates column widths from content
 * - centers cells (including keys) like CLI table
 * - uses :---: alignment markers for centered markdown columns
 */
export function generateEnvDocs(meta: EnvMeta): string {
  const headers = ["Key", "Required", "Example", "Description"] as const;

  const rows = Object.entries(meta).map(([key, m]) => {
    const req = m.required === false ? "no" : "yes";
    return {
      Key: key,
      Required: req,
      Example: m.example ?? "",
      Description: m.description ?? "",
    };
  });

  const widths = {
    Key: headers[0].length,
    Required: headers[1].length,
    Example: headers[2].length,
    Description: headers[3].length,
  };

  for (const r of rows) {
    widths.Key = Math.max(widths.Key, strLen(r.Key));
    widths.Required = Math.max(widths.Required, strLen(r.Required));
    widths.Example = Math.max(widths.Example, strLen(r.Example));
    widths.Description = Math.max(widths.Description, strLen(r.Description));
  }

  // немного воздуха, чтобы центрирование выглядело красиво
  widths.Key += 2;
  widths.Required += 2;
  widths.Example += 2;
  widths.Description += 2;

  const headerLine =
    `| ${padCenter(headers[0], widths.Key)} ` +
    `| ${padCenter(headers[1], widths.Required)} ` +
    `| ${padCenter(headers[2], widths.Example)} ` +
    `| ${padCenter(headers[3], widths.Description)} |`;

  const dividerLine =
    `| ${makeDivider(widths.Key, "center")} ` +
    `| ${makeDivider(widths.Required, "center")} ` +
    `| ${makeDivider(widths.Example, "center")} ` +
    `| ${makeDivider(widths.Description, "center")} |`;

  const bodyLines = rows.map((r) => {
    return (
      `| ${padCenter(r.Key, widths.Key)} ` +
      `| ${padCenter(r.Required, widths.Required)} ` +
      `| ${padCenter(r.Example, widths.Example)} ` +
      `| ${padCenter(r.Description, widths.Description)} |`
    );
  });

  return [
    `# Environment variables`,
    ``,
    headerLine,
    dividerLine,
    ...bodyLines,
    ``,
  ].join("\n");
}
