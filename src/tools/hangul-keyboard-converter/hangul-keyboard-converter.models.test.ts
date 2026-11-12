import { describe, expect, it } from 'vitest';
import { TEXT_LIMIT } from '../_shared/local-tool';
import { convertKeyboard } from './hangul-keyboard-converter.models';

describe('Hangul keyboard converter', () => {
  it('turns English key input into Hangul syllables', () => {
    expect(convertKeyboard('dkssudgktpdy', 'en-to-ko')).toBe('안녕하세요');
    expect(convertKeyboard('rkqt', 'en-to-ko')).toBe('값');
    expect(convertKeyboard('rkqtdl', 'en-to-ko')).toBe('값이');
    expect(convertKeyboard('dhkTek', 'en-to-ko')).toBe('왔다');
    expect(convertKeyboard('gksrmf', 'en-to-ko')).toBe('한글');
    expect(convertKeyboard('ekfrk', 'en-to-ko')).toBe('달가');
    expect(convertKeyboard('dO', 'en-to-ko')).toBe('얘');
    expect(convertKeyboard('Rk', 'en-to-ko')).toBe('까');
  });

  it('keeps lone jamo and passes digits, spaces and newlines through', () => {
    expect(convertKeyboard('rr', 'en-to-ko')).toBe('ㄱㄱ');
    expect(convertKeyboard('k', 'en-to-ko')).toBe('ㅏ');
    expect(convertKeyboard('12 dk\n', 'en-to-ko')).toBe('12 아\n');
  });

  it('splits composed syllables and jamo into English keys', () => {
    expect(convertKeyboard('ㅗㄷㅣㅣㅐ', 'ko-to-en')).toBe('hello');
    expect(convertKeyboard('ㅗ디ㅣㅐ', 'ko-to-en')).toBe('hello');
    expect(convertKeyboard('안녕', 'ko-to-en')).toBe('dkssud');
    expect(convertKeyboard('값', 'ko-to-en')).toBe('rkqt');
    expect(convertKeyboard('왔다', 'ko-to-en')).toBe('dhkTek');
    expect(convertKeyboard('한글', 'ko-to-en')).toBe('gksrmf');
    expect(convertKeyboard('12 아\n', 'ko-to-en')).toBe('12 dk\n');
  });

  it.each(['안녕하세요 값이 왔다\n한글 123', '닭이 달가 까 얘 왜 쌍'])('round-trips Hangul text: %s', (text) => {
    expect(convertKeyboard(convertKeyboard(text, 'ko-to-en'), 'en-to-ko')).toBe(text);
  });

  it('rejects input larger than the text limit', () => {
    expect(() => convertKeyboard('a'.repeat(TEXT_LIMIT + 1), 'en-to-ko')).toThrow('tools.local.errors.textTooLarge');
  });
});
