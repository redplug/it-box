import { describe, expect, it } from 'vitest';
import { convertDuration } from './duration-converter.models';

describe('Duration conversion', () => {
  it('converts elapsed units using exact fixed durations', () => {
    expect(convertDuration(1, 'week')).toEqual([
      { unit: 'ms', value: 604800000 },
      { unit: 's', value: 604800 },
      { unit: 'min', value: 10080 },
      { unit: 'h', value: 168 },
      { unit: 'day', value: 7 },
      { unit: 'week', value: 1 },
    ]);
    expect(convertDuration(0, 'ms').every(row => row.value === 0)).toBe(true);
    expect(convertDuration(0.5, 'min')[1]?.value).toBe(30);
  });
  it('rejects negative, nonfinite, unknown units and overflow', () => {
    expect(() => convertDuration(-1, 'ms')).toThrow('tools.duration-converter.errors.invalidValue');
    expect(() => convertDuration(Number.POSITIVE_INFINITY, 'ms')).toThrow('tools.duration-converter.errors.invalidValue');
    expect(() => convertDuration(1, 'year' as 'ms')).toThrow('tools.duration-converter.errors.invalidUnit');
    expect(() => convertDuration(1e308, 'week')).toThrow('tools.duration-converter.errors.overflow');
  });
});
