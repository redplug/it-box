const MAX_DIGITS = 20;
const DIGIT_KO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const KOREAN_ZERO_TO_NINE = '영일이삼사오육칠팔구';
const SMALL_KO = ['', '십', '백', '천'];
const BIG_KO = ['', '만', '억', '조', '경'];
const SMALL_EXP: Record<string, number> = { 십: 1, 백: 2, 천: 3 };
// Exponents are 4 * unit index: 만=10^4, 억=10^8, 조=10^12, 경=10^16.
const BIG_EXP: Record<string, number> = { 만: 4, 억: 8, 조: 12, 경: 16 };

const invalidInput = () => new Error('tools.korean-number-converter.errors.invalidInput');
const tooLarge = () => new Error('tools.korean-number-converter.errors.tooLarge');

/** Accepts digits with optional commas, spaces and a trailing 원. Returns the digit string without leading zeros. */
export function normalizeAmount(text: string): string {
  const cleaned = text.replace(/[\s,]/g, '').replace(/원$/, '');
  if (!/^\d+$/.test(cleaned)) {
    throw invalidInput();
  }
  const digits = cleaned.replace(/^0+(?=\d)/, '');
  if (digits.length > MAX_DIGITS) {
    throw tooLarge();
  }
  return digits;
}

/** Splits digits into 4-digit groups, highest first. `unit` is the big-unit index (0 = none, 1 = 만, ...). */
function groupsOf(digits: string): { digits: string; unit: number }[] {
  const groups: { digits: string; unit: number }[] = [];
  for (let unit = 0, end = digits.length; end > 0; unit++, end -= 4) {
    groups.unshift({ digits: digits.slice(Math.max(0, end - 4), end), unit });
  }
  return groups;
}

function fourDigitWords(group: string, oneBeforeUnit: boolean): string {
  let words = '';
  for (let i = 0; i < group.length; i++) {
    const digit = group.charCodeAt(i) - 48;
    const place = group.length - 1 - i;
    if (digit === 0) {
      continue;
    }
    // 십, 백, 천 take a leading 일 only in amount notation.
    words += digit === 1 && place > 0 && !oneBeforeUnit ? SMALL_KO[place] : DIGIT_KO[digit] + SMALL_KO[place];
  }
  return words;
}

/** Korean reading, e.g. 1234000 -> 백이십삼만사천. */
export function toKoreanReading(digits: string): string {
  return koreanWords(digits, false);
}

/** Amount notation for contracts and receipts, e.g. 1234000 -> 금 일백이십삼만사천원정. */
export function toKoreanAmount(digits: string): string {
  return `금 ${koreanWords(digits, true)}원정`;
}

function koreanWords(digits: string, amount: boolean): string {
  if (digits === '0') {
    return '영';
  }
  let words = '';
  for (const { digits: group, unit } of groupsOf(digits)) {
    if (/^0+$/.test(group)) {
      continue;
    }
    const isOne = group.replace(/^0+/, '') === '1';
    if (isOne && unit > 0) {
      // 만 alone is idiomatic for 10000; 억 and above always take 일.
      const prefix = amount || unit >= 2 || words !== '' ? '일' : '';
      words += prefix + BIG_KO[unit];
    }
    else {
      words += fourDigitWords(group, amount) + BIG_KO[unit];
    }
  }
  return words;
}

function withComma(group: string): string {
  return group.length > 3 ? `${group.slice(0, group.length - 3)},${group.slice(-3)}` : group;
}

/** Mixed unit notation, e.g. 1234567890 -> 12억 3,456만 7,890. Zero groups are omitted. */
export function toMixedUnits(digits: string): string {
  if (digits === '0') {
    return '0';
  }
  return groupsOf(digits)
    .map(({ digits: group, unit }) => ({ value: group.replace(/^0+/, ''), unit }))
    .filter(({ value }) => value !== '')
    .map(({ value, unit }) => `${withComma(value)}${BIG_KO[unit]}`)
    .join(' ');
}

/** Plain thousands separators, e.g. 1234000 -> 1,234,000. */
export function toCommaSeparated(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parses digits, Korean readings, amount notation and mixed notation into a digit string.
 * Arithmetic uses BigInt; values are never converted with Number.
 */
export function parseKoreanNumber(text: string): string {
  const cleaned = text.replace(/[\s,]/g, '').replace(/^금/, '').replace(/원정?$/, '');
  if (/^\d+$/.test(cleaned)) {
    return normalizeAmount(cleaned);
  }
  const tokens = cleaned.match(/\d+|[영일이삼사오육칠팔구십백천만억조경]/g);
  if (!tokens || tokens.join('') !== cleaned) {
    throw invalidInput();
  }

  let total = 0n;
  let chunk = 0n; // value of the 4-digit group being read, below the last big unit
  let pending: bigint | null = null; // a digit waiting for its small unit or unit-less end
  let hasChunk = false;
  let lastSmall = 4; // exponent of the last small unit in this group; strictly decreasing
  let lastBig = 17; // exponent of the last big unit; strictly decreasing
  let closedBig = false;

  const flushPending = () => {
    if (pending === null) {
      return;
    }
    // A bare tail after 십/백/천 must fit under that unit, e.g. 5천45 is 5045 but 5천12345 is rejected.
    if (lastSmall < 4 && pending >= 10n ** BigInt(lastSmall)) {
      throw invalidInput();
    }
    chunk += pending;
    pending = null;
  };

  for (const token of tokens) {
    if (/^\d+$/.test(token) || KOREAN_ZERO_TO_NINE.includes(token)) {
      if (pending !== null) {
        throw invalidInput();
      }
      pending = /^\d+$/.test(token) ? BigInt(token) : BigInt(KOREAN_ZERO_TO_NINE.indexOf(token));
      hasChunk = true;
    }
    else if (token in SMALL_EXP) {
      const exp = SMALL_EXP[token];
      if (exp >= lastSmall) {
        throw invalidInput();
      }
      chunk += (pending ?? 1n) * 10n ** BigInt(exp);
      pending = null;
      lastSmall = exp;
      hasChunk = true;
    }
    else {
      const exp = BIG_EXP[token];
      if (exp >= lastBig) {
        throw invalidInput();
      }
      flushPending();
      if (!hasChunk && closedBig) {
        throw invalidInput();
      }
      const group = hasChunk ? chunk : 1n;
      if (closedBig && group >= 10000n) {
        throw invalidInput();
      }
      total += group * 10n ** BigInt(exp);
      chunk = 0n;
      hasChunk = false;
      lastSmall = 4;
      lastBig = exp;
      closedBig = true;
    }
  }

  flushPending();
  if (hasChunk) {
    if (closedBig && chunk >= 10000n) {
      throw invalidInput();
    }
    total += chunk;
  }
  const result = total.toString();
  if (result.length > MAX_DIGITS) {
    throw tooLarge();
  }
  return result;
}
