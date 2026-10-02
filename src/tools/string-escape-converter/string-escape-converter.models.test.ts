import { describe, expect, it } from 'vitest';
import { decodeJsonString, encodeJsonString } from './string-escape-converter.models';

describe('JSON string literal conversion', () => {
  it('encodes and decodes quotes, slashes, newlines, nulls and Unicode', () => {
    expect(encodeJsonString('say "hi"\n\u0000한글')).toBe(String.raw`"say \"hi\"\n\u0000한글"`);
    expect(decodeJsonString(String.raw`"say \"hi\"\n\u0000한글"`)).toBe('say "hi"\n\u0000한글');
  });
  it.each(['null', '123', 'true', '[]', '{}', '\'text\'', '"bad\\x"'])('rejects non-string JSON or invalid literal %s', (input) => {
    expect(() => decodeJsonString(input)).toThrow();
  });
});
