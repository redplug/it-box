import { checkTextSize, parseJson } from '../_shared/local-tool';

export function encodeJsonString(text: string): string {
  checkTextSize(text);
  return JSON.stringify(text);
}

export function decodeJsonString(text: string): string {
  const value = parseJson(text);
  if (typeof value !== 'string') {
    throw new TypeError('tools.string-escape-converter.errors.stringOnly');
  }
  return value;
}
