import { describe, expect, it } from 'vitest';
import { normalizeUnicode } from './unicode-normalizer.models';

describe('Unicode normalization', () => {
  it.each([
    ['e\u0301', 'NFC', 'é', true],
    ['é', 'NFD', 'e\u0301', true],
    ['①', 'NFKC', '1', true],
    ['é', 'NFKD', 'e\u0301', true],
    ['plain', 'NFC', 'plain', false],
  ])('normalizes %s as %s', (input, form, text, changed) => {
    expect(normalizeUnicode(input, form)).toEqual({ text, changed });
  });
  it('rejects unsupported forms', () => {
    expect(() => normalizeUnicode('x', 'bad')).toThrow();
  });
});
