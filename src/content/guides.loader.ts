import { type Guide, parseGuide } from './guides';

const modules = import.meta.glob('./guides/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const guides: Guide[] = Object.entries(modules)
  .map(([path, raw]) => parseGuide(path.replace(/^\.\/guides\//, '').replace(/\.md$/, ''), raw))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
