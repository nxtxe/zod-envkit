export type EnvMeta = Record<
  string,
  {
    description?: string;
    example?: string;
    required?: boolean; // default: true
  }
>;

export function generateEnvExample(meta: EnvMeta): string {
  const lines: string[] = [];

  for (const [key, m] of Object.entries(meta)) {
    if (m.description) lines.push(`# ${m.description}`);
    lines.push(`${key}=${m.example ?? ""}`);
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

export function generateEnvDocs(meta: EnvMeta): string {
  const rows = Object.entries(meta).map(([key, m]) => {
    const req = m.required === false ? "no" : "yes";
    return `| ${key} | ${req} | ${m.example ?? ""} | ${m.description ?? ""} |`;
  });

  return [
    `# Environment variables`,
    ``,
    `| Key | Required | Example | Description |`,
    `|---|---:|---|---|`,
    ...rows,
    ``,
  ].join("\n");
}
