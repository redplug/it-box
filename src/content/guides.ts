import { parse } from 'yaml';

export interface Guide {
  slug: string
  title: string
  description: string
  date: string
  tools: string[]
  body: string
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function fail(message: string): never {
  throw new Error(message);
}

// Pure: no Vue, alias or import.meta imports, so vite.config.ts can use it too.
export function parseGuide(slug: string, raw: string): Guide {
  const match = raw.match(FRONTMATTER) ?? fail(`Guide "${slug}" is missing YAML frontmatter`);
  const data = parse(match[1]) ?? {};
  const title = data.title ?? fail(`Guide "${slug}" is missing a title`);

  return {
    slug,
    title: String(title),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    tools: Array.isArray(data.tools) ? data.tools.map(String) : [],
    body: match[2].trim(),
  };
}
