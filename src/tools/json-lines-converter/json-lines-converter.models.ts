import { checkTextSize, parseJson } from '../_shared/local-tool';

export function convertJsonLines(text: string, direction: 'to-json' | 'to-lines'): string {
  checkTextSize(text);
  if (direction === 'to-lines') {
    const value = parseJson(text);
    if (!Array.isArray(value)) {
      throw new TypeError('tools.json-lines-converter.errors.arrayRequired');
    }
    return value.map(item => JSON.stringify(item)).join('\n');
  }
  const values: unknown[] = [];
  text.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim()) {
      return;
    }
    try {
      values.push(parseJson(line));
    }
    catch {
      throw Object.assign(new Error('tools.json-lines-converter.errors.invalidLine'), { params: { line: index + 1 } });
    }
  });
  return JSON.stringify(values, null, 2);
}
