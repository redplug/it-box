import { checkTextSize } from '../_shared/local-tool';

export const PII_KINDS = ['rrn', 'phone', 'email', 'card', 'ipv4', 'businessNo'] as const;
export type PiiKind = typeof PII_KINDS[number];
export type PiiOptions = Partial<Record<PiiKind, boolean>>;
export interface PiiResult {
  text: string
  counts: Record<PiiKind, number>
}

// One named group per kind, so a single pass over the text can tell which rule matched.
const PATTERNS: Record<PiiKind, string> = {
  email: String.raw`(?<email>(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9-]{1,63}\.){1,10}[A-Za-z]{2,63})`,
  rrn: String.raw`(?<rrn>(?<!\d)\d{6}-?[1-8]\d{6}(?!\d))`,
  card: String.raw`(?<card>(?<!\d)\d{4}(?<cardSep>[- ]?)\d{4}\k<cardSep>\d{4}\k<cardSep>\d{4}(?!\d))`,
  phone: String.raw`(?<phone>(?<!\d)01[016789][-. ]?\d{3,4}[-. ]?\d{4}(?!\d))`,
  ipv4: String.raw`(?<ipv4>(?<![\d.])(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?!\.?\d))`,
  businessNo: String.raw`(?<businessNo>(?<!\d)\d{3}-\d{2}-\d{5}(?!\d))`,
};

// Returns null when a candidate must be left as it is.
const MASKERS: Record<PiiKind, (match: string) => string | null> = {
  email(match) {
    const at = match.lastIndexOf('@');
    const local = match.slice(0, at);
    const keep = local.length > 2 ? local.slice(0, 2) : '';
    return keep + '*'.repeat(local.length - keep.length) + match.slice(at);
  },
  rrn: match => `${match.slice(0, match.includes('-') ? 8 : 7)}******`,
  card(match) {
    const digits = match.replace(/\D/g, '');
    if (!luhnValid(digits)) {
      return null;
    }
    const sep = match.length === 19 ? match[4] : '';
    return `${digits.slice(0, 4)}${sep}****${sep}****${sep}${digits.slice(12)}`;
  },
  phone: match => match.replace(/^(01[016789][-. ]?)(\d{3,4})(?=[-. ]?\d{4}$)/, (_, head: string, middle: string) => head + '*'.repeat(middle.length)),
  ipv4: match => `${match.slice(0, match.lastIndexOf('.') + 1)}***`,
  businessNo: match => `${match.slice(0, 7)}*****`,
};

export function luhnValid(digits: string): boolean {
  if (!/^\d+$/.test(digits)) {
    return false;
  }
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function maskPii(text: string, options: PiiOptions = {}): PiiResult {
  checkTextSize(text);
  const enabled = PII_KINDS.filter(kind => options[kind] !== false);
  const counts = Object.fromEntries(PII_KINDS.map(kind => [kind, 0])) as Record<PiiKind, number>;
  if (enabled.length === 0) {
    return { text, counts };
  }
  const pattern = new RegExp(enabled.map(kind => PATTERNS[kind]).join('|'), 'g');
  const masked = text.replace(pattern, (...args: unknown[]) => {
    const match = args[0] as string;
    const groups = args[args.length - 1] as Record<string, string | undefined>;
    const kind = enabled.find(name => groups[name] !== undefined);
    if (!kind) {
      return match;
    }
    const replacement = MASKERS[kind](match);
    if (replacement === null) {
      return match;
    }
    counts[kind] += 1;
    return replacement;
  });
  return { text: masked, counts };
}
