import { generateMeta } from '@it-tools/oggen';

type MetaConfig = Parameters<typeof generateMeta>[0];

// oggen puts values into attributes without escaping, so values are escaped before generation
const escapeAttribute = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function escapeValues(node: unknown): unknown {
  if (typeof node === 'string') {
    return escapeAttribute(node);
  }
  if (Array.isArray(node)) {
    return node.map(escapeValues);
  }
  if (node && typeof node === 'object' && !(node instanceof Date)) {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, escapeValues(value)]));
  }
  return node;
}

// oggen writes value="..."; the crawlers read content="..."
export function generateMetaTags(metadata: MetaConfig): string {
  const html = generateMeta(escapeValues(metadata) as MetaConfig, { generateTwitterCompatibleMeta: true });
  return html.replace(/ value="/g, ' content="');
}
