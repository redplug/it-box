import { checkTextSize, isRecord, parseJson } from '../_shared/local-tool';

const identifier = /^[A-Z_][\w]*$/i;

function parseValue(raw: string): string {
  const quote = raw[0];
  if (quote !== '"' && quote !== '\'') {
    return raw.split('#')[0].trimEnd();
  }
  let value = '';
  for (let index = 1; index < raw.length; index++) {
    const char = raw[index];
    if (char === quote) {
      const tail = raw.slice(index + 1).trim();
      if (!tail || tail.startsWith('#')) {
        return value;
      }
      break;
    }
    if (quote === '"' && char === '\\') {
      const next = raw[++index];
      const escapes: Record<string, string> = {
        'n': '\n',
        'r': '\r',
        't': '\t',
        'b': '\b',
        'f': '\f',
        '"': '"',
        '\\': '\\',
        '$': '$',
        '`': '`',
      };
      if (next === 'u' && /^[\dA-F]{4}$/i.test(raw.slice(index + 1, index + 5))) {
        value += String.fromCharCode(Number.parseInt(raw.slice(index + 1, index + 5), 16));
        index += 4;
      }
      else if (Object.prototype.hasOwnProperty.call(escapes, next)) {
        value += escapes[next];
      }
      else if (next !== undefined) {
        value += `\\${next}`;
      }
      else {
        break;
      }
    }
    else {
      value += char;
    }
  }
  throw new Error('tools.env-to-json.errors.invalidEnv');
}

export function envToJson(text: string): string {
  checkTextSize(text);
  const entries: [string, string][] = [];
  const seen = new Set<string>();
  for (const rawLine of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const match = /^(?:export\s+)?([A-Z_][\w]*)\s*=\s*(.*)$/i.exec(line);
    if (!match) {
      throw new Error('tools.env-to-json.errors.invalidEnv');
    }
    const [, key, raw] = match;
    if (seen.has(key)) {
      throw new Error('tools.env-to-json.errors.duplicate');
    }
    seen.add(key);
    entries.push([key, parseValue(raw)]);
  }
  return JSON.stringify(Object.fromEntries(entries), null, 2);
}

export function jsonToEnv(text: string): string {
  const value = parseJson(text);
  if (
    !isRecord(value)
    || Object.entries(value).some(([key, item]) => !identifier.test(key) || typeof item !== 'string')
  ) {
    throw new Error('tools.env-to-json.errors.stringsRequired');
  }
  return Object.entries(value)
    .map(([key, item]) => `${key}=${JSON.stringify(item).replace(/\$/g, '\\$').replace(/`/g, '\\`')}`)
    .join('\n');
}
