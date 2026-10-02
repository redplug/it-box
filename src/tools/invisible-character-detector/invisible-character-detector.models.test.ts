import { describe, expect, it } from 'vitest';
import { detectInvisibleCharacters } from './invisible-character-detector.models';

describe('invisible character detection', () => {
  it('uses zero-based Unicode codepoint positions across astral characters', () => {
    const result = detectInvisibleCharacters('😀A\u200B\u00A0\u202E\n');
    expect(result.map(({ position, codePoint }) => ({ position, codePoint }))).toEqual([{ position: 2, codePoint: 'U+200B' }, { position: 3, codePoint: 'U+00A0' }, { position: 4, codePoint: 'U+202E' }, { position: 5, codePoint: 'U+000A' }]);
  });
  it('includes zero width and bidi controls without marking normal text', () => {
    expect(detectInvisibleCharacters('abc 한글')).toEqual([]);
    expect(detectInvisibleCharacters('\u200C\u200D\u2060\uFEFF\u061C\u2066\u2069')).toHaveLength(7);
  });
});
