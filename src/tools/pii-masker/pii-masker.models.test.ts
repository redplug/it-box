import { describe, expect, it } from 'vitest';
import { luhnValid, maskPii } from './pii-masker.models';

const zeroCounts = { rrn: 0, phone: 0, email: 0, card: 0, ipv4: 0, businessNo: 0 };

describe('PII masker', () => {
  it('masks each kind with the documented pattern', () => {
    expect(maskPii('900101-1234567').text).toBe('900101-1******');
    expect(maskPii('9001011234567').text).toBe('9001011******');
    expect(maskPii('010-1234-5678').text).toBe('010-****-5678');
    expect(maskPii('010.1234.5678').text).toBe('010.****.5678');
    expect(maskPii('01012345678').text).toBe('010****5678');
    expect(maskPii('016-123-4567').text).toBe('016-***-4567');
    expect(maskPii('honggildong@example.com').text).toBe('ho*********@example.com');
    expect(maskPii('ab@example.com').text).toBe('**@example.com');
    expect(maskPii('a@example.com').text).toBe('*@example.com');
    expect(maskPii('4111 1111 1111 1111').text).toBe('4111 **** **** 1111');
    expect(maskPii('4111-1111-1111-1111').text).toBe('4111-****-****-1111');
    expect(maskPii('4111111111111111').text).toBe('4111********1111');
    expect(maskPii('192.168.0.10').text).toBe('192.168.0.***');
    expect(maskPii('123-45-67890').text).toBe('123-45-*****');
  });

  it('leaves text unchanged when every kind is turned off', () => {
    const text = '010-1234-5678 honggildong@example.com 4111 1111 1111 1111 192.168.0.10 123-45-67890 900101-1234567';
    const result = maskPii(text, Object.fromEntries(Object.keys(zeroCounts).map(kind => [kind, false])));
    expect(result).toEqual({ text, counts: zeroCounts });
  });

  it('skips a kind that is switched off and still masks the others', () => {
    const result = maskPii('010-1234-5678 192.168.0.10', { phone: false });
    expect(result.text).toBe('010-1234-5678 192.168.0.***');
    expect(result.counts).toEqual({ ...zeroCounts, ipv4: 1 });
  });

  it('does not match inside a longer digit run', () => {
    const digits = '1234567890123456789';
    expect(maskPii(digits)).toEqual({ text: digits, counts: zeroCounts });
  });

  it('masks several kinds in one line and counts each one', () => {
    const text = '문의 010-1234-5678, honggildong@example.com, 카드 4111 1111 1111 1111, IP 192.168.0.10, 사업자 123-45-67890, 주민 900101-1234567';
    expect(maskPii(text)).toEqual({
      text: '문의 010-****-5678, ho*********@example.com, 카드 4111 **** **** 1111, IP 192.168.0.***, 사업자 123-45-*****, 주민 900101-1******',
      counts: { rrn: 1, phone: 1, email: 1, card: 1, ipv4: 1, businessNo: 1 },
    });
  });

  it('counts every occurrence', () => {
    const result = maskPii('010-1234-5678 / 010-9999-0000');
    expect(result.text).toBe('010-****-5678 / 010-****-0000');
    expect(result.counts.phone).toBe(2);
  });

  it('leaves card-shaped numbers that fail the Luhn check unchanged', () => {
    const text = '1234-5678-9012-3456';
    expect(maskPii(text)).toEqual({ text, counts: zeroCounts });
  });

  it('leaves invalid IPv4 octets unchanged', () => {
    expect(maskPii('256.1.1.1').text).toBe('256.1.1.1');
  });

  it('rejects text over the size limit', () => {
    expect(() => maskPii('a'.repeat(2 * 1024 * 1024 + 1))).toThrow('tools.local.errors.textTooLarge');
  });
});

describe('luhnValid', () => {
  it('accepts a valid test card number and rejects a broken one', () => {
    expect(luhnValid('4111111111111111')).toBe(true);
    expect(luhnValid('4111111111111112')).toBe(false);
    expect(luhnValid('')).toBe(false);
  });
});
