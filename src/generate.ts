// src/generate.ts

/**
 * Metadata entry for a single environment variable.
 *
 * This file is part of the stable public API: it powers the CLI generators,
 * and is intended to be reusable by consumers.
 *
 * @public
 * @since 1.0.0
 */
export type EnvMetaEntry = {
  /**
   * Human-readable description.
   */
  description?: string;

  /**
   * Example value used for `.env.example` and documentation.
   *
   * Tip: do NOT put real secrets here.
   */
  example?: string;

  /**
   * Whether the variable is required.
   *
   * @defaultValue true
   */
  required?: boolean;

  /**
   * Optional group/section for docs (primarily for Markdown format).
   *
   * @since 1.1.0
   */
  group?: string;

  /**
   * Default value (documentation only).
   *
   * @since 1.1.0
   */
  default?: string;

  /**
   * Mark variable as deprecated in docs.
   *
   * @since 1.1.0
   */
  deprecated?: boolean;

  /**
   * Version when the variable was introduced (documentation only).
   *
   * @since 1.1.0
   */
  since?: string;

  /**
   * Optional link to further documentation.
   *
   * @since 1.1.0
   */
  link?: string;
};

/**
 * Environment meta map (`KEY` -> metadata).
 *
 * @public
 * @since 1.0.0
 */
export type EnvMeta = Record<string, EnvMetaEntry>;

/**
 * Sorting mode for generated docs.
 *
 * @public
 * @since 1.1.0
 */
export type SortMode = "alpha" | "required-first" | "none";

/**
 * Output format for generated docs.
 *
 * @public
 * @since 1.1.0
 */
export type DocsFormat = "md" | "json" | "yaml";

/**
 * Options for {@link generateEnvDocs}.
 *
 * @public
 * @since 1.1.0
 */
export type GenerateDocsOptions = {
  /**
   * Output format.
   *
   * @defaultValue "md"
   */
  format?: DocsFormat;

  /**
   * Sort mode.
   *
   * @defaultValue "none"
   */
  sort?: SortMode;

  /**
   * Group Markdown output by `meta[*].group`.
   *
   * - default: `true`
   * - ignored for `json` / `yaml`
   *
   * @defaultValue true
   */
  group?: boolean;
};

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
  const t = text ?? "";
  const diff = width - strLen(t);
  if (diff <= 0) return t;

  const left = Math.floor(diff / 2);
  const right = diff - left;
  return " ".repeat(left) + t + " ".repeat(right);
}

/**
 * @internal
 */
function makeDivider(width: number, align: "left" | "center" | "right"): string {
  if (width < 3) width = 3;
  if (align === "center") return ":" + "-".repeat(width - 2) + ":";
  if (align === "right") return "-".repeat(width - 1) + ":";
  return "-".repeat(width);
}

/**
 * Sort meta entries.
 *
 * - `none`: keep insertion order
 * - `alpha`: by key (A-Z)
 * - `required-first`: required first, then A-Z
 *
 * @public
 * @since 1.1.0
 */
export function sortMetaEntries(
  meta: EnvMeta,
  sort: SortMode = "none"
): Array<[string, EnvMetaEntry]> {
  const entries = Object.entries(meta);

  if (sort === "none") return entries;

  if (sort === "alpha") {
    return entries.sort(([a], [b]) => a.localeCompare(b));
  }

  // required-first
  return entries.sort(([a, av], [b, bv]) => {
    const ar = av.required === false ? 1 : 0;
    const br = bv.required === false ? 1 : 0;
    if (ar !== br) return ar - br; // required (0) first
    return a.localeCompare(b);
  });
}

/**
 * @internal
 */
function groupEntries(
  entries: Array<[string, EnvMetaEntry]>
): Array<[string, Array<[string, EnvMetaEntry]>]> {
  const map = new Map<string, Array<[string, EnvMetaEntry]>>();

  for (const [k, v] of entries) {
    const g = v.group?.trim() || "General";
    const arr = map.get(g) ?? [];
    arr.push([k, v]);
    map.set(g, arr);
  }

  // stable-ish order: General first, then alpha
  const groups = Array.from(map.entries());
  groups.sort(([ga], [gb]) => {
    if (ga === "General") return -1;
    if (gb === "General") return 1;
    return ga.localeCompare(gb);
  });

  return groups;
}

/**
 * Generate `.env.example` from {@link EnvMeta}.
 *
 * Rules:
 * - outputs `# description` comment if present
 * - outputs `KEY=example`
 *
 * @public
 * @since 1.0.0
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
 * @internal
 */
type DocsRow = {
  Key: string;
  Required: string;
  Example: string;
  Default: string;
  Deprecated: string;
  Since: string;
  Link: string;
  Description: string;
};

/**
 * @internal
 */
function buildRows(entries: Array<[string, EnvMetaEntry]>): DocsRow[] {
  return entries.map(([key, m]) => {
    const req = m.required === false ? "no" : "yes";
    const dep = m.deprecated ? "⚠️" : "";
    const link = m.link ? m.link : "";
    return {
      Key: key,
      Required: req,
      Example: m.example ?? "",
      Default: m.default ?? "",
      Deprecated: dep,
      Since: m.since ?? "",
      Link: link,
      Description: m.description ?? "",
    };
  });
}

/**
 * @internal
 */
function renderMarkdownTable(rows: DocsRow[], headers: Array<keyof DocsRow>): string {
  const widths: Record<string, number> = {};
  for (const h of headers) widths[h] = String(h).length;

  for (const r of rows) {
    for (const h of headers) widths[h] = Math.max(widths[h], strLen(String(r[h] ?? "")));
  }

  // extra padding for nice centering
  for (const h of headers) widths[h] += 2;

  const headerLine =
    "|" + headers.map((h) => ` ${padCenter(String(h), widths[h])} `).join("|") + "|";

  const dividerLine =
    "|" + headers.map((h) => ` ${makeDivider(widths[h], "center")} `).join("|") + "|";

  const body = rows.map((r) =>
    "|" + headers.map((h) => ` ${padCenter(String(r[h] ?? ""), widths[h])} `).join("|") + "|"
  );

  return [headerLine, dividerLine, ...body].join("\n");
}

/**
 * @internal
 */
function toJson(meta: EnvMeta, sort: SortMode): string {
  // json: preserve order if none, otherwise sorted order
  const entries = sortMetaEntries(meta, sort);
  const obj: EnvMeta = {};
  for (const [k, v] of entries) obj[k] = v;
  return JSON.stringify(obj, null, 2) + "\n";
}

/**
 * @internal
 */
function escapeYamlString(s: string): string {
  const v = s ?? "";
  if (v === "" || /[:#\-\n\r\t]/.test(v) || /^\s|\s$/.test(v)) {
    return JSON.stringify(v);
  }
  return v;
}

/**
 * @internal
 */
function toYaml(meta: EnvMeta, sort: SortMode): string {
  const entries = sortMetaEntries(meta, sort);

  const lines: string[] = [];
  for (const [key, m] of entries) {
    lines.push(`${escapeYamlString(key)}:`);

    const props: Array<[string, unknown]> = [
      ["description", m.description],
      ["example", m.example],
      ["required", m.required],
      ["group", m.group],
      ["default", m.default],
      ["deprecated", m.deprecated],
      ["since", m.since],
      ["link", m.link],
    ];

    for (const [p, val] of props) {
      if (val === undefined) continue;
      if (typeof val === "boolean") lines.push(`  ${p}: ${val ? "true" : "false"}`);
      else lines.push(`  ${p}: ${escapeYamlString(String(val))}`);
    }
  }
  return lines.join("\n") + "\n";
}

/**
 * @internal
 */
function toMarkdown(meta: EnvMeta, sort: SortMode, group: boolean): string {
  const entries = sortMetaEntries(meta, sort);

  const headers: Array<keyof DocsRow> = [
    "Key",
    "Required",
    "Example",
    "Default",
    "Deprecated",
    "Since",
    "Link",
    "Description",
  ];

  const blocks: string[] = [];
  blocks.push(`# Environment variables`);
  blocks.push("");

  if (group) {
    const groups = groupEntries(entries);
    for (const [g, gEntries] of groups) {
      blocks.push(`## ${g}`);
      blocks.push("");
      const rows = buildRows(gEntries);
      blocks.push(renderMarkdownTable(rows, headers));
      blocks.push("");
    }
  } else {
    const rows = buildRows(entries);
    blocks.push(renderMarkdownTable(rows, headers));
    blocks.push("");
  }

  return blocks.join("\n");
}

/**
 * Generate env documentation from {@link EnvMeta}.
 *
 * Supported formats:
 * - `md` (default)
 * - `json`
 * - `yaml`
 *
 * @public
 * @since 1.0.0
 */
export function generateEnvDocs(meta: EnvMeta, opts: GenerateDocsOptions = {}): string {
  const format = opts.format ?? "md";
  const sort = opts.sort ?? "none";
  const group = opts.group ?? true;

  if (format === "json") return toJson(meta, sort);
  if (format === "yaml") return toYaml(meta, sort);
  return toMarkdown(meta, sort, group);
}
