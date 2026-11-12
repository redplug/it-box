import { describe, expect, it } from 'vitest';
import {
  normalizeAmount,
  parseKoreanNumber,
  toCommaSeparated,
  toKoreanAmount,
  toKoreanReading,
  toMixedUnits,
} from './korean-number-converter.models';

const reading = (digits: string) => toKoreanReading(normalizeAmount(digits));

describe('Korean reading', () => {
  it.each([
    ['0', '영'],
    ['1', '일'],
    ['10', '십'],
    ['11', '십일'],
    ['100', '백'],
    ['1000', '천'],
    ['10000', '만'],
    ['10001', '만일'],
    ['100000', '십만'],
    ['12345', '만이천삼백사십오'],
    ['100000000', '일억'],
    ['100010000', '일억일만'],
    ['1234000', '백이십삼만사천'],
    ['1234567890', '십이억삼천사백오십육만칠천팔백구십'],
    ['10000000000000000', '일경'],
  ])('reads %s as %s', (input, expected) => {
    expect(reading(input)).toBe(expected);
  });
});

describe('Amount notation', () => {
  it.each([
    ['1234000', '금 일백이십삼만사천원정'],
    ['10000', '금 일만원정'],
    ['100000000', '금 일억원정'],
    ['0', '금 영원정'],
  ])('writes %s as %s', (input, expected) => {
    expect(toKoreanAmount(normalizeAmount(input))).toBe(expected);
  });
});

describe('Mixed unit notation', () => {
  it.each([
    ['0', '0'],
    ['1234000', '123만 4,000'],
    ['1234567890', '12억 3,456만 7,890'],
    ['100000000', '1억'],
    ['10001', '1만 1'],
    ['1230000', '123만'],
  ])('writes %s as %s', (input, expected) => {
    expect(toMixedUnits(normalizeAmount(input))).toBe(expected);
  });
});

describe('Comma notation', () => {
  it.each([['0', '0'], ['123', '123'], ['1234000', '1,234,000']])('writes %s as %s', (input, expected) => {
    expect(toCommaSeparated(normalizeAmount(input))).toBe(expected);
  });
});

describe('Input normalization', () => {
  it('accepts commas, spaces and a trailing 원', () => {
    expect(normalizeAmount(' 1,234,000원 ')).toBe('1234000');
  });
  it('removes leading zeros and accepts the 20-digit maximum', () => {
    expect(normalizeAmount('0000')).toBe('0');
    expect(normalizeAmount('99999999999999999999')).toBe('99999999999999999999');
  });
  it.each(['', '-1', '1.5', 'abc', '123456789012345678901'])('rejects %s', (input) => {
    expect(() => normalizeAmount(input)).toThrow();
  });
});

describe('parseKoreanNumber', () => {
  it.each([
    ['삼억오천만', '350000000'],
    ['일백이십삼만사천원', '1234000'],
    ['3억 5천만', '350000000'],
    ['12억3456만7890', '1234567890'],
    ['금 일만원정', '10000'],
    ['만', '10000'],
    ['만일', '10001'],
    ['일억일만', '100010000'],
    ['1,234,000원', '1234000'],
    ['영', '0'],
  ])('parses %s as %s', (input, expected) => {
    expect(parseKoreanNumber(input)).toBe(expected);
  });

  it.each(['', '-5', '1.5', 'abc', '일이', '십십', '억억', '1억 2억', '억만', '만12345', '123456789012345678901'])('rejects %s', (input) => {
    expect(() => parseKoreanNumber(input)).toThrow();
  });

  it.each(['0', '1', '10', '11', '100', '1000', '10000', '10001', '100000', '12345', '100000000', '1234567890', '10000000000000000', '100010000', '99999999999999999999'])('round-trips %s through every notation', (digits) => {
    expect(parseKoreanNumber(toKoreanReading(digits))).toBe(digits);
    expect(parseKoreanNumber(toKoreanAmount(digits))).toBe(digits);
    expect(parseKoreanNumber(toMixedUnits(digits))).toBe(digits);
    expect(parseKoreanNumber(toCommaSeparated(digits))).toBe(digits);
  });
});
