import { checkTextSize, isRecord, parseJson } from '../_shared/local-tool';

export function queryToJson(text: string): Record<string, string | string[]> {
  checkTextSize(text);
  const values = new Map<string, string[]>();
  for (const [key, value] of new URLSearchParams(text.startsWith('?') ? text.slice(1) : text)) {
    const previous = values.get(key) ?? [];
    previous.push(value);
    values.set(key, previous);
  }
  return Object.fromEntries([...values].map(([key, value]) => [key, value.length === 1 ? value[0] : value]));
}

export function jsonToQuery(text: string): string {
  const value = parseJson(text);
  if (!isRecord(value)) {
    throw new Error('tools.query-string-converter.errors.invalidShape');
  }
  const params = new URLSearchParams();
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === 'string') {
      params.append(key, item);
    }
    else if (Array.isArray(item) && item.every(entry => typeof entry === 'string')) {
      for (const entry of item) {
        params.append(key, entry);
      }
    }
    else {
      throw new Error('tools.query-string-converter.errors.invalidShape');
    }
  }
  return params.toString();
}
