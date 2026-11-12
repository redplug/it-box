import { checkTextSize } from '../_shared/local-tool';

export type LimitMode = 'chars' | 'charsNoSpace' | 'utf8' | 'eucKr';
export type LineBreak = 'lf' | 'crlf';

const LINE_BREAK = /\r\n|\r|\n/g;
const LINE_BREAK_UNIT = /^(\r\n|\r|\n)$/;
const encoder = new TextEncoder();
// shortcut: Intl.Segmenter is missing in old browsers; fallback splits code points and keeps CRLF together, upgrade never needed unless targets change.
// The project's TS lib predates Intl.Segmenter, so it is typed by hand here.
type Segmenter = new (locale: string, options: { granularity: 'grapheme' }) => { segment(text: string): Iterable<{ segment: string }> };
const SegmenterCtor = typeof Intl !== 'undefined' ? (Intl as unknown as { Segmenter?: Segmenter }).Segmenter : undefined;
const segmenter = SegmenterCtor ? new SegmenterCtor('ko', { granularity: 'grapheme' }) : undefined;

export function splitGraphemes(text: string): string[] {
  return segmenter
    ? Array.from(segmenter.segment(text), part => part.segment)
    : text.match(/\r\n|[\s\S]/gu) ?? [];
}

// Byte cost in the EUC-KR/CP949 approximation: ASCII 1, everything else 2 per code point.
// NFC first so a decomposed (NFD) Hangul syllable costs the same as its precomposed form.
function eucKrUnitCost(unit: string, lineBreak: LineBreak): number {
  if (LINE_BREAK_UNIT.test(unit)) {
    return lineBreak === 'crlf' ? 2 : 1;
  }
  let bytes = 0;
  for (const char of unit.normalize('NFC')) {
    bytes += char.codePointAt(0)! <= 0x7F ? 1 : 2;
  }
  return bytes;
}

function unitCost(unit: string, mode: LimitMode, lineBreak: LineBreak): number {
  switch (mode) {
    case 'chars':
      return 1;
    case 'charsNoSpace':
      return /^\s+$/.test(unit) ? 0 : 1;
    case 'utf8':
      return encoder.encode(unit).byteLength;
    case 'eucKr':
      return eucKrUnitCost(unit, lineBreak);
  }
}

export function measureText(text: string, lineBreak: LineBreak = 'lf') {
  checkTextSize(text);
  const units = splitGraphemes(text);
  const nfc = text.normalize('NFC');
  const eucKrBytes = units.reduce((sum, unit) => sum + eucKrUnitCost(unit, lineBreak), 0);

  return {
    chars: units.length,
    charsNoSpace: units.reduce((sum, unit) => sum + unitCost(unit, 'charsNoSpace', lineBreak), 0),
    utf8Bytes: encoder.encode(text).byteLength,
    eucKrBytes,
    utf16Units: text.length,
    lines: text === '' ? 0 : (text.match(LINE_BREAK)?.length ?? 0) + 1,
    hangul: nfc.match(/[가-힣]/g)?.length ?? 0,
    latin: text.match(/[A-Za-z]/g)?.length ?? 0,
    digits: text.match(/[0-9]/g)?.length ?? 0,
    // Code points above U+FFFF (emoji and the like) that CP949 cannot encode; each is counted as 2 bytes above.
    unrepresentable: text.match(/[\u{10000}-\u{10FFFF}]/gu)?.length ?? 0,
    sms: eucKrBytes <= 90 ? 'sms' : eucKrBytes <= 2000 ? 'lms' : 'over',
  } as const;
}

export function truncateToLimit(text: string, limit: number, mode: LimitMode, lineBreak: LineBreak = 'lf'): string {
  let used = 0;
  let result = '';
  for (const unit of splitGraphemes(text)) {
    const cost = unitCost(unit, mode, lineBreak);
    if (used + cost > limit) {
      break;
    }
    used += cost;
    result += unit;
  }
  return result;
}
