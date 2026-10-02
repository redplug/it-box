import { describe, expect, it } from 'vitest';
import { checkTextSize, isRecord, parseJson } from './local-tool';

describe('local tool input boundary', () => {
  it('parses standard JSON while rejecting JSON5 and oversized text', () => {
    expect(parseJson('{"name":"한글","value":null}')).toEqual({ name: '한글', value: null });
    expect(() => parseJson('{name:1}')).toThrow('tools.local.errors.invalidJson');
    expect(() => checkTextSize('한'.repeat(700000))).toThrow('tools.local.errors.textTooLarge');
  });
  it('distinguishes objects from null and arrays', () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
  });
});
