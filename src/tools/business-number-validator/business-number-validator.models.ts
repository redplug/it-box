import { checkTextSize } from '../_shared/local-tool';

export const MAX_LINES = 1000;
const BUSINESS_WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5];
const CORPORATE_WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

export type NumberKind = 'business' | 'corporate' | 'unknown';
export type ReasonCode = 'valid' | 'checksum' | 'length' | 'characters';
export type BusinessHint =
  | 'individual-taxable'
  | 'income-tax-nonprofit'
  | 'corporate-hq'
  | 'nonprofit-corporate'
  | 'government'
  | 'foreign-corporate'
  | 'corporate-branch'
  | 'religious'
  | 'individual-exempt'
  | 'unknown';

export interface NumberRow {
  raw: string
  normalized: string
  kind: NumberKind
  valid: boolean
  reason: ReasonCode
  hint: BusinessHint | ''
}

function checkDigit(sum: number): number {
  return (10 - (sum % 10)) % 10;
}

const SPECIFIC_HINTS: Record<number, BusinessHint> = {
  80: 'income-tax-nonprofit',
  81: 'corporate-hq',
  82: 'nonprofit-corporate',
  83: 'government',
  84: 'foreign-corporate',
  85: 'corporate-branch',
  86: 'corporate-hq',
  87: 'corporate-hq',
  88: 'corporate-hq',
  89: 'religious',
};

function businessHint(code: string): BusinessHint {
  const n = Number(code);
  if (n >= 1 && n <= 79) {
    return 'individual-taxable';
  }
  if (n >= 90 && n <= 99) {
    return 'individual-exempt';
  }
  return SPECIFIC_HINTS[n] ?? 'unknown';
}

export function checkNumber(raw: string): NumberRow {
  const digits = raw.replace(/[\s-]/g, '');
  const base = { raw, normalized: '', hint: '' as const };
  if (!/^\d*$/.test(digits)) {
    return { ...base, kind: 'unknown', valid: false, reason: 'characters' };
  }
  const d = [...digits].map(Number);
  if (d.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += BUSINESS_WEIGHTS[i] * d[i];
    }
    sum += Math.floor((d[8] * 5) / 10);
    const valid = checkDigit(sum) === d[9];
    return {
      raw,
      normalized: `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`,
      kind: 'business',
      valid,
      reason: valid ? 'valid' : 'checksum',
      hint: businessHint(digits.slice(3, 5)),
    };
  }
  if (d.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += CORPORATE_WEIGHTS[i] * d[i];
    }
    const valid = checkDigit(sum) === d[12];
    return {
      ...base,
      normalized: `${digits.slice(0, 6)}-${digits.slice(6)}`,
      kind: 'corporate',
      valid,
      reason: valid ? 'valid' : 'checksum',
    };
  }
  return { ...base, kind: 'unknown', valid: false, reason: 'length' };
}

export function checkNumbers(text: string): NumberRow[] {
  checkTextSize(text);
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length > MAX_LINES) {
    throw new Error('tools.business-number-validator.errors.tooManyLines');
  }
  return lines.map(checkNumber);
}
