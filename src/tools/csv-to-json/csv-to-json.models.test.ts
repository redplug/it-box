import { describe, expect, it } from 'vitest';
import { csvToJson } from './csv-to-json.models';

describe('CSV and TSV to JSON', () => {
  it('keeps values as strings and supports BOM and CRLF', () => {
    expect(JSON.parse(csvToJson('\uFEFFname,score\r\nAda,001\r\n'))).toEqual([{ name: 'Ada', score: '001' }]);
  });
  it('parses quoted delimiters, newlines, and doubled quotes', () => {
    expect(JSON.parse(csvToJson('name,note\nAda,"hello,\n""world"""'))).toEqual([
      { name: 'Ada', note: 'hello,\n"world"' },
    ]);
    expect(JSON.parse(csvToJson('name\tnote\nAda\t"a\tb"', '\t'))).toEqual([{ name: 'Ada', note: 'a\tb' }]);
  });
  it('preserves special property names safely', () => {
    const row = JSON.parse(csvToJson('__proto__,constructor\nvalue,other'))[0];
    expect(Object.keys(row)).toEqual(['__proto__', 'constructor']);
    expect(Object.getOwnPropertyDescriptor(row, '__proto__')?.value).toBe('value');
  });
  it('accepts a header-only file and empty cells', () => {
    expect(csvToJson('name,value')).toBe('[]');
    expect(JSON.parse(csvToJson('a,b\n,\n'))).toEqual([{ a: '', b: '' }]);
  });
  it.each(['a,a\n1,2', 'a,\n1,2', 'a,b\n1', 'a,b\n1,2,3', 'a,b\n"unterminated,2', 'a,b\n"x"oops,2', 'a,b\na"b,2'])(
    'rejects malformed input %s',
    (input) => {
      expect(() => csvToJson(input)).toThrow();
    },
  );
  it('enforces the input size limit', () => {
    expect(() => csvToJson('x'.repeat(2097153))).toThrow('tools.local.errors.textTooLarge');
  });
});
