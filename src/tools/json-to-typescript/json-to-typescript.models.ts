import { isRecord, parseJson } from '../_shared/local-tool';

function inferType(value: unknown, depth = 0): string {
  if (depth > 64) {
    throw new Error('tools.json-to-typescript.errors.tooDeep');
  }
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    const types = [...new Set(value.map(item => inferType(item, depth + 1)))];
    if (!types.length) {
      return 'unknown[]';
    }
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`;
  }
  if (isRecord(value)) {
    const entries = Object.entries(value);
    if (!entries.length) {
      return '{}';
    }
    const indent = '  '.repeat(depth + 1);
    return `{\n${entries
      .map(
        ([key, item]) =>
          `${indent}${/^[A-Z_$][\w$]*$/i.test(key) ? key : JSON.stringify(key)}: ${inferType(item, depth + 1)};`,
      )
      .join('\n')}\n${'  '.repeat(depth)}}`;
  }
  return typeof value;
}

export function jsonToTypescript(text: string): string {
  return `type Root = ${inferType(parseJson(text))};`;
}
