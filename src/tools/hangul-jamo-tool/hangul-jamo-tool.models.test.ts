import { describe, expect, it } from 'vitest';
import { TEXT_LIMIT } from '../_shared/local-tool';
import { extractChosung, matchesChosung, separateJamo, syllableTable } from './hangul-jamo-tool.models';

describe('separateJamo', () => {
  it('splits syllables into compatibility jamo', () => {
    expect(separateJamo('한글')).toBe('ㅎㅏㄴㄱㅡㄹ');
  });
  it('keeps compound vowels and final consonants as one letter by default', () => {
    expect(separateJamo('값')).toBe('ㄱㅏㅄ');
  });
  it('expands compound jamo when requested', () => {
    expect(separateJamo('값', true)).toBe('ㄱㅏㅂㅅ');
    expect(separateJamo('과', true)).toBe('ㄱㅗㅏ');
  });
  it('handles syllables without a final consonant', () => {
    expect(separateJamo('가하')).toBe('ㄱㅏㅎㅏ');
  });
  it('preserves non-Hangul characters', () => {
    expect(separateJamo('Korea 2026!')).toBe('Korea 2026!');
    expect(separateJamo('가 A1')).toBe('ㄱㅏ A1');
  });
  it('normalizes NFD input to NFC first', () => {
    expect(separateJamo('한'.normalize('NFD'))).toBe('ㅎㅏㄴ');
  });
});

describe('extractChosung', () => {
  it('keeps non-syllable characters as they are', () => {
    expect(extractChosung('대한민국 Korea 2026')).toBe('ㄷㅎㅁㄱ Korea 2026');
  });
  it('handles syllables without a final consonant', () => {
    expect(extractChosung('가하')).toBe('ㄱㅎ');
  });
  it('normalizes NFD input to NFC first', () => {
    expect(extractChosung('대한민국'.normalize('NFD'))).toBe('ㄷㅎㅁㄱ');
  });
});

describe('syllableTable', () => {
  it('lists the syllable parts and code points', () => {
    expect(syllableTable('가한')).toEqual([
      { syllable: '가', cho: 'ㄱ', jung: 'ㅏ', jong: '-', codePoint: 'U+AC00' },
      { syllable: '한', cho: 'ㅎ', jung: 'ㅏ', jong: 'ㄴ', codePoint: 'U+D55C' },
    ]);
  });
  it('shows at most the first 50 syllables', () => {
    expect(syllableTable('가'.repeat(60))).toHaveLength(50);
  });
  it('returns an empty list when there are no syllables', () => {
    expect(syllableTable('Korea 123')).toEqual([]);
  });
});

describe('matchesChosung', () => {
  it('matches initial consonants against syllables', () => {
    expect(matchesChosung('대한민국', 'ㄷㅎㅁㄱ')).toBe(true);
    expect(matchesChosung('대한민국', 'ㄷㅎ')).toBe(true);
    expect(matchesChosung('대한민국', 'ㅎㄷ')).toBe(false);
  });
  it('compares complete syllables in the query exactly', () => {
    expect(matchesChosung('대한민국', '대ㅎ')).toBe(true);
    expect(matchesChosung('대한민국', '하')).toBe(false);
  });
  it('matches standalone and non-Hangul characters exactly', () => {
    expect(matchesChosung('Korea', 'ㅋ')).toBe(false);
    expect(matchesChosung('Korea', 'Ko')).toBe(true);
    expect(matchesChosung('ㄱ', 'ㄱ')).toBe(true);
  });
  it('returns false when the query is longer than the text', () => {
    expect(matchesChosung('하', 'ㅎㅏㄴ')).toBe(false);
  });
  it('treats an empty query as a match', () => {
    expect(matchesChosung('대한민국', '')).toBe(true);
  });
  it('normalizes NFD input to NFC first', () => {
    expect(matchesChosung('대한민국'.normalize('NFD'), 'ㄷㅎ'.normalize('NFD'))).toBe(true);
  });
});

describe('size limit', () => {
  it('rejects text over the shared limit', () => {
    expect(() => extractChosung('a'.repeat(TEXT_LIMIT + 1))).toThrow('tools.local.errors.textTooLarge');
  });
});
