import { checkTextSize } from '../_shared/local-tool';

const SYLLABLE_START = 0xAC00;
const SYLLABLE_END = 0xD7A3;
const JUNGSUNG_COUNT = 21;
const JONGSUNG_COUNT = 28;
const SYLLABLES_PER_CHOSUNG = JUNGSUNG_COUNT * JONGSUNG_COUNT;

const CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNGSUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONGSUNG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// Compound vowels and final consonants split into their parts (only used when expanding).
const COMPOUND_JUNGSUNG: Record<string, string> = { ㅘ: 'ㅗㅏ', ㅙ: 'ㅗㅐ', ㅚ: 'ㅗㅣ', ㅝ: 'ㅜㅓ', ㅞ: 'ㅜㅔ', ㅟ: 'ㅜㅣ', ㅢ: 'ㅡㅣ' };
const COMPOUND_JONGSUNG: Record<string, string> = { ㄳ: 'ㄱㅅ', ㄵ: 'ㄴㅈ', ㄶ: 'ㄴㅎ', ㄺ: 'ㄹㄱ', ㄻ: 'ㄹㅁ', ㄼ: 'ㄹㅂ', ㄽ: 'ㄹㅅ', ㄾ: 'ㄹㅌ', ㄿ: 'ㄹㅍ', ㅀ: 'ㄹㅎ', ㅄ: 'ㅂㅅ' };

const CHOSUNG_SET = new Set(CHOSUNG);

function normalize(text: string): string {
  checkTextSize(text);
  return text.normalize('NFC');
}

function isSyllable(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code >= SYLLABLE_START && code <= SYLLABLE_END;
}

function splitSyllable(ch: string): { cho: string; jung: string; jong: string } {
  const index = ch.charCodeAt(0) - SYLLABLE_START;
  return {
    cho: CHOSUNG[Math.floor(index / SYLLABLES_PER_CHOSUNG)],
    jung: JUNGSUNG[Math.floor((index % SYLLABLES_PER_CHOSUNG) / JONGSUNG_COUNT)],
    jong: JONGSUNG[index % JONGSUNG_COUNT],
  };
}

export function separateJamo(text: string, expandCompound = false): string {
  const pick = (part: string, table: Record<string, string>) => (expandCompound ? table[part] ?? part : part);
  return [...normalize(text)].map((ch) => {
    if (!isSyllable(ch)) {
      return ch;
    }
    const { cho, jung, jong } = splitSyllable(ch);
    return cho + pick(jung, COMPOUND_JUNGSUNG) + pick(jong, COMPOUND_JONGSUNG);
  }).join('');
}

export function extractChosung(text: string): string {
  return [...normalize(text)].map(ch => (isSyllable(ch) ? splitSyllable(ch).cho : ch)).join('');
}

export interface SyllableInfo {
  syllable: string
  cho: string
  jung: string
  jong: string
  codePoint: string
}

export function syllableTable(text: string, limit = 50): SyllableInfo[] {
  return [...normalize(text)].filter(isSyllable).slice(0, limit).map((ch) => {
    const { cho, jung, jong } = splitSyllable(ch);
    return {
      syllable: ch,
      cho,
      jung,
      jong: jong || '-',
      codePoint: `U+${ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
    };
  });
}

// Query jamo match the initial consonant of a syllable; query syllables must match exactly.
export function matchesChosung(text: string, query: string): boolean {
  const haystack = [...normalize(text)];
  const needle = [...query.normalize('NFC')];
  if (needle.length === 0) {
    return true;
  }
  const initialOf = (ch: string) => (isSyllable(ch) ? splitSyllable(ch).cho : ch);
  return haystack.some((_, start) => needle.every((q, offset) => {
    const index = start + offset;
    if (index >= haystack.length) {
      return false;
    }
    return CHOSUNG_SET.has(q) ? initialOf(haystack[index]) === q : haystack[index] === q;
  }));
}
