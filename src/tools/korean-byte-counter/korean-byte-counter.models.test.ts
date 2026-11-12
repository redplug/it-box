import { describe, expect, it } from 'vitest';
import { measureText, truncateToLimit } from './korean-byte-counter.models';

describe('Korean byte counter', () => {
  it('measures mixed Hangul and ASCII', () => {
    expect(measureText('안녕 hello')).toMatchObject({
      chars: 8,
      charsNoSpace: 7,
      utf8Bytes: 12,
      eucKrBytes: 10,
      utf16Units: 8,
      lines: 1,
      hangul: 2,
      latin: 5,
      digits: 0,
      unrepresentable: 0,
      sms: 'sms',
    });
  });

  it('counts a family emoji as one character but reports its non-BMP code points', () => {
    const family = '👨‍👩‍👧';
    expect(measureText(family)).toMatchObject({ chars: 1, utf8Bytes: 18, utf16Units: 8, unrepresentable: 3 });
  });

  it('counts decomposed Hangul as one syllable', () => {
    expect(measureText('한')).toMatchObject({ chars: 1, hangul: 1, eucKrBytes: 2, utf8Bytes: 9 });
  });

  it('applies the line break option to EUC-KR bytes only', () => {
    expect(measureText('가\r\n나', 'lf')).toMatchObject({ chars: 3, lines: 2, eucKrBytes: 5, utf8Bytes: 8 });
    expect(measureText('가\r\n나', 'crlf')).toMatchObject({ eucKrBytes: 6 });
  });

  it.each([
    [90, 'sms'],
    [91, 'lms'],
    [2000, 'lms'],
    [2001, 'over'],
  ])('classifies %i EUC-KR bytes as %s', (length, expected) => {
    expect(measureText('a'.repeat(length)).sms).toBe(expected);
  });

  it('rejects text over the shared 2MiB limit', () => {
    expect(() => measureText('a'.repeat(2 * 1024 * 1024 + 1))).toThrow('tools.local.errors.textTooLarge');
  });

  it('truncates without splitting Hangul, emoji or surrogate pairs', () => {
    expect(truncateToLimit('가나다', 5, 'eucKr')).toBe('가나');
    expect(truncateToLimit('한국어', 8, 'utf8')).toBe('한국');
    expect(truncateToLimit('😀😀', 5, 'utf8')).toBe('😀');
    expect(truncateToLimit('👨‍👩‍👧a', 1, 'chars')).toBe('👨‍👩‍👧');
  });

  it('truncates by character mode, skipping whitespace in the no-space mode', () => {
    expect(truncateToLimit('안녕 hello', 3, 'chars')).toBe('안녕 ');
    expect(truncateToLimit('안녕 hello', 3, 'charsNoSpace')).toBe('안녕 h');
    expect(truncateToLimit('안녕', 0, 'utf8')).toBe('');
  });

  it('respects the line break option when truncating EUC-KR', () => {
    expect(truncateToLimit('가\r\n나', 3, 'eucKr', 'lf')).toBe('가\r\n');
    expect(truncateToLimit('가\r\n나', 3, 'eucKr', 'crlf')).toBe('가');
  });
});
