import { checkTextSize } from '../_shared/local-tool';

export type Direction = 'en-to-ko' | 'ko-to-en';

const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
// 종성 없음('')이 0번. 쌍자음 ㄸ ㅃ ㅉ은 종성이 될 수 없어 목록에 없다.
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 두벌식 표준 자판. 그 외 대문자는 소문자 키와 같은 자모다.
const KEY_TO_JAMO: Partial<Record<string, string>> = {
  q: 'ㅂ',
  w: 'ㅈ',
  e: 'ㄷ',
  r: 'ㄱ',
  t: 'ㅅ',
  y: 'ㅛ',
  u: 'ㅕ',
  i: 'ㅑ',
  o: 'ㅐ',
  p: 'ㅔ',
  a: 'ㅁ',
  s: 'ㄴ',
  d: 'ㅇ',
  f: 'ㄹ',
  g: 'ㅎ',
  h: 'ㅗ',
  j: 'ㅓ',
  k: 'ㅏ',
  l: 'ㅣ',
  z: 'ㅋ',
  x: 'ㅌ',
  c: 'ㅊ',
  v: 'ㅍ',
  b: 'ㅠ',
  n: 'ㅜ',
  m: 'ㅡ',
  Q: 'ㅃ',
  W: 'ㅉ',
  E: 'ㄸ',
  R: 'ㄲ',
  T: 'ㅆ',
  O: 'ㅒ',
  P: 'ㅖ',
};
const JAMO_TO_KEY: Partial<Record<string, string>> = Object.fromEntries(Object.entries(KEY_TO_JAMO).map(([key, jamo]) => [jamo, key]));

// 겹모음·겹받침: 합쳐진 자모 → 두 자모
const COMPOUND: Partial<Record<string, string>> = {
  ㅘ: 'ㅗㅏ',
  ㅙ: 'ㅗㅐ',
  ㅚ: 'ㅗㅣ',
  ㅝ: 'ㅜㅓ',
  ㅞ: 'ㅜㅔ',
  ㅟ: 'ㅜㅣ',
  ㅢ: 'ㅡㅣ',
  ㄳ: 'ㄱㅅ',
  ㄵ: 'ㄴㅈ',
  ㄶ: 'ㄴㅎ',
  ㄺ: 'ㄹㄱ',
  ㄻ: 'ㄹㅁ',
  ㄼ: 'ㄹㅂ',
  ㄽ: 'ㄹㅅ',
  ㄾ: 'ㄹㅌ',
  ㄿ: 'ㄹㅍ',
  ㅀ: 'ㄹㅎ',
  ㅄ: 'ㅂㅅ',
};
// 두 자모 → 합쳐진 자모
const COMBINE: Partial<Record<string, string>> = Object.fromEntries(Object.entries(COMPOUND).map(([joined, pair]) => [pair, joined]));

interface Syllable { cho?: string; jung?: string; jong?: string }

function render(syllable: Syllable): string {
  if (syllable.cho && syllable.jung) {
    const code = 0xAC00 + (CHO.indexOf(syllable.cho) * 21 + JUNG.indexOf(syllable.jung)) * 28 + JONG.indexOf(syllable.jong ?? '');
    return String.fromCharCode(code);
  }
  return syllable.cho ?? syllable.jung ?? '';
}

function enToKo(text: string): string {
  let out = '';
  let cur: Syllable = {};
  const flush = () => {
    out += render(cur);
    cur = {};
  };
  for (const ch of text) {
    const jamo = KEY_TO_JAMO[ch] ?? KEY_TO_JAMO[ch.toLowerCase()];
    if (!jamo) {
      flush();
      out += ch;
      continue;
    }
    if (JUNG.includes(jamo)) {
      if (!cur.jung) {
        cur.jung = jamo;
        continue;
      }
      const combined = COMBINE[cur.jung + jamo];
      if (combined && !cur.jong) {
        cur.jung = combined;
        continue;
      }
      if (cur.jong) {
        // 겹받침이면 뒤쪽 자음만 다음 글자 초성으로 넘어간다.
        const pair = COMPOUND[cur.jong];
        const moved = pair ? pair[1] : cur.jong;
        cur.jong = pair ? pair[0] : undefined;
        flush();
        cur = { cho: moved, jung: jamo };
        continue;
      }
      flush();
      cur = { jung: jamo };
      continue;
    }
    if (!cur.cho || !cur.jung) {
      flush();
      cur = { cho: jamo };
      continue;
    }
    if (!cur.jong && JONG.includes(jamo)) {
      cur.jong = jamo;
      continue;
    }
    const combined = cur.jong ? COMBINE[cur.jong + jamo] : undefined;
    if (combined) {
      cur.jong = combined;
      continue;
    }
    flush();
    cur = { cho: jamo };
  }
  flush();
  return out;
}

function jamoKeys(jamo: string): string | undefined {
  const pair = COMPOUND[jamo];
  if (pair) {
    return [...pair].map(part => JAMO_TO_KEY[part] ?? '').join('');
  }
  return JAMO_TO_KEY[jamo];
}

function koToEn(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const index = code - 0xAC00;
      const parts = [CHO[Math.floor(index / 588)], JUNG[Math.floor((index % 588) / 28)], JONG[index % 28]];
      out += parts.map(jamo => jamoKeys(jamo) ?? '').join('');
    }
    else {
      out += jamoKeys(ch) ?? ch;
    }
  }
  return out;
}

export function convertKeyboard(text: string, direction: Direction): string {
  checkTextSize(text);
  return direction === 'en-to-ko' ? enToKo(text) : koToEn(text);
}
