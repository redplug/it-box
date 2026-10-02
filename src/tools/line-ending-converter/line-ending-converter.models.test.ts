import { describe, expect, it } from 'vitest';
import { convertLineEndings } from './line-ending-converter.models';

describe('line ending conversion', () => {
  it.each([
    ['LF', 'a\nb\nc\n'],
    ['CRLF', 'a\r\nb\r\nc\r\n'],
    ['CR', 'a\rb\rc\r'],
  ])('converts mixed endings to %s and preserves a final newline', (ending, expected) => {
    expect(convertLineEndings('a\r\nb\rc\n', ending)).toBe(expected);
  });
  it('keeps other text and the absence of a final newline', () => {
    expect(convertLineEndings('  안녕\t\r\n😀', 'CRLF')).toBe('  안녕\t\r\n😀');
    expect(Array.from(new TextEncoder().encode(convertLineEndings('a\n', 'CRLF')))).toEqual([97, 13, 10]);
  });
  it('rejects unsupported endings', () => {
    expect(() => convertLineEndings('x', 'bad')).toThrow();
  });
});
