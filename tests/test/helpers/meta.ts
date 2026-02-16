export type MetaKey = {
  key: string;
  required: boolean;
  example: string;
  description?: string;
  group?: string;
  default?: string;
  deprecated?: boolean;
  since?: string;
  link?: string;
};

export function makeMeta(keys: MetaKey[]): string {
  const meta: Record<string, any> = {};

  for (const k of keys) {
    meta[k.key] = {
      required: k.required,
      example: k.example,
      description: k.description ?? "",
      ...(k.group ? { group: k.group } : {}),
      ...(k.default !== undefined ? { default: k.default } : {}),
      ...(k.deprecated !== undefined ? { deprecated: k.deprecated } : {}),
      ...(k.since ? { since: k.since } : {}),
      ...(k.link ? { link: k.link } : {}),
    };
  }

  return JSON.stringify(meta, null, 2) + "\n";
}