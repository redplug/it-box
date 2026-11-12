import { describe, expect, it } from 'vitest';
import { MAX_LINES, checkNumber, checkNumbers } from './business-number-validator.models';

// Expected values were computed by hand from the checksum rules.
describe('business registration number (10 digits)', () => {
  it('accepts a valid number and normalizes it as 3-2-5 with a hint', () => {
    expect(checkNumber('1234567891')).toEqual({
      raw: '1234567891',
      normalized: '123-45-67891',
      kind: 'business',
      valid: true,
      reason: 'valid',
      hint: 'individual-taxable',
    });
  });

  it('strips hyphens and spaces before checking', () => {
    const row = checkNumber(' 123 - 81-4567 2 ');
    expect(row.normalized).toBe('123-81-45672');
    expect(row.valid).toBe(true);
    expect(row.hint).toBe('corporate-hq');
  });

  it('rejects a wrong check digit', () => {
    expect(checkNumber('1234567892')).toMatchObject({ kind: 'business', valid: false, reason: 'checksum' });
  });

  it('rejects every other last digit when the original is valid', () => {
    for (let last = 0; last <= 9; last++) {
      const candidate = `123456789${last}`;
      expect(checkNumber(candidate).valid).toBe(last === 1);
    }
  });
});

describe('corporate registration number (13 digits)', () => {
  it('accepts a valid number and normalizes it as 6-7', () => {
    expect(checkNumber('1101111234569')).toEqual({
      raw: '1101111234569',
      normalized: '110111-1234569',
      kind: 'corporate',
      valid: true,
      reason: 'valid',
      hint: '',
    });
  });

  it('rejects a wrong check digit and keeps the normalized form', () => {
    expect(checkNumber('110111-1234567')).toMatchObject({
      normalized: '110111-1234567',
      kind: 'corporate',
      valid: false,
      reason: 'checksum',
    });
  });

  it('rejects every other last digit when the original is valid', () => {
    for (let last = 0; last <= 9; last++) {
      const candidate = `135792468012${last}`;
      expect(checkNumber(candidate).valid).toBe(last === 2);
    }
  });
});

describe('format errors', () => {
  it.each(['12345678901', '12345678901234', '1'])('reports a length error for %s', (input) => {
    expect(checkNumber(input)).toMatchObject({ kind: 'unknown', valid: false, reason: 'length', normalized: '' });
  });

  it('reports disallowed characters', () => {
    expect(checkNumber('123-45-6789a')).toMatchObject({ kind: 'unknown', valid: false, reason: 'characters' });
  });
});

describe('business hint from digits 4 and 5', () => {
  it.each([
    ['01', 'individual-taxable'],
    ['79', 'individual-taxable'],
    ['00', 'unknown'],
    ['80', 'income-tax-nonprofit'],
    ['81', 'corporate-hq'],
    ['86', 'corporate-hq'],
    ['87', 'corporate-hq'],
    ['88', 'corporate-hq'],
    ['82', 'nonprofit-corporate'],
    ['83', 'government'],
    ['84', 'foreign-corporate'],
    ['85', 'corporate-branch'],
    ['89', 'religious'],
    ['90', 'individual-exempt'],
    ['99', 'individual-exempt'],
  ] as const)('maps %s to %s', (code, hint) => {
    expect(checkNumber(`123${code}56789`).hint).toBe(hint);
  });
});

describe('checkNumbers', () => {
  it('ignores blank lines and accepts CRLF line endings', () => {
    const rows = checkNumbers('\n1234567891\r\n\r\n  \r\n1101111234569\n');
    expect(rows.map(row => row.kind)).toEqual(['business', 'corporate']);
  });

  it('checks up to the line limit', () => {
    const text = Array.from({ length: MAX_LINES }, () => '1234567891').join('\n');
    expect(checkNumbers(text)).toHaveLength(MAX_LINES);
  });

  it('throws an i18n key when there are too many lines', () => {
    const text = Array.from({ length: MAX_LINES + 1 }, () => '1234567891').join('\n');
    expect(() => checkNumbers(text)).toThrow('tools.business-number-validator.errors.tooManyLines');
  });
});
