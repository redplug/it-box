import { describe, expect, it } from 'vitest';
import { convertJsonLines } from './json-lines-converter.models';

describe('JSON Lines converter', () => {
  it('converts every JSON type and skips blank lines', () => {
    expect(JSON.parse(convertJsonLines(' {"id":1}\r\n\nnull\n"hello"\n[1,2]', 'to-json'))).toEqual([
      { id: 1 },
      null,
      'hello',
      [1, 2],
    ]);
    expect(convertJsonLines('[{"id":1},null,"a\\nb"]', 'to-lines')).toBe('{"id":1}\nnull\n"a\\nb"');
  });
  it('identifies the physical failing line', () => {
    try {
      convertJsonLines('{"ok":true}\n\n{broken}', 'to-json');
      throw new Error('must reject invalid line');
    }
    catch (error) {
      expect((error as Error).message).toBe('tools.json-lines-converter.errors.invalidLine');
      expect((error as Error & { params: { line: number } }).params).toEqual({ line: 3 });
    }
  });
  it('requires a root array when emitting lines', () => {
    expect(() => convertJsonLines('{"id":1}', 'to-lines')).toThrow('tools.json-lines-converter.errors.arrayRequired');
    expect(convertJsonLines('[]', 'to-lines')).toBe('');
    expect(convertJsonLines('\n  \n', 'to-json')).toBe('[]');
  });
  it('rejects JSON5 and oversized input', () => {
    expect(() => convertJsonLines('[{id:1}]', 'to-lines')).toThrow('tools.local.errors.invalidJson');
    expect(() => convertJsonLines('x'.repeat(2097153), 'to-json')).toThrow('tools.local.errors.textTooLarge');
  });
});
