import { checkTextSize } from '../_shared/local-tool';

export function parseHttpHeaders(text: string): { startLine?: string; headers: Record<string, string[]> } {
  checkTextSize(text);
  const invalid = () => new Error('tools.http-headers-parser.errors.invalidHeaders');
  if (/\r(?!\n)/.test(text)) {
    throw invalid();
  }
  const lines = text.split(/\r?\n/);
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  const first = lines[0] ?? '';
  // eslint-disable-next-line no-control-regex -- Validate the raw HTTP start line.
  const startLine = /^(?:HTTP\/\d(?:\.\d)? \d{3}(?: [^\u0000-\u001F\u007F]*)?|[!#$%&'*+.^_`|~\w-]+ [^\s\u0000-\u001F\u007F]+ HTTP\/\d(?:\.\d)?)$/.test(first) ? lines.shift() : undefined;
  const headers = new Map<string, string[]>();
  let ended = false;
  for (const line of lines) {
    if (!line.trim()) {
      ended = true;
      continue;
    }
    const colon = line.indexOf(':');
    const name = line.slice(0, colon);
    const value = line.slice(colon + 1);
    // eslint-disable-next-line no-control-regex -- Reject header value controls and folded lines.
    if (ended || colon < 1 || !/^[!#$%&'*+.^_`|~\w-]+$/.test(name) || /[\u0000-\u0008\u000A-\u001F\u007F]/.test(value)) {
      throw invalid();
    }
    const key = name.toLowerCase();
    const values = headers.get(key) ?? [];
    values.push(value.trim());
    headers.set(key, values);
  }
  return { ...(startLine ? { startLine } : {}), headers: Object.fromEntries(headers) };
}
