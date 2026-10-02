import { describe, expect, it } from 'vitest';
import { convertDataSize, formatDataSize } from './data-size-converter.models';

describe('Data size conversion', () => {
  it('distinguishes SI, IEC, bytes and bits', () => {
    const result = convertDataSize(1, 'KiB');
    expect(result.find(row => row.unit === 'byte')?.value).toBe(1024);
    expect(result.find(row => row.unit === 'bit')?.value).toBe(8192);
    expect(result.find(row => row.unit === 'kB')?.value).toBe(1.024);
    expect(result.find(row => row.unit === 'MiB')?.value).toBe(0.0009765625);
    expect(result).toHaveLength(10);
  });
  it('preserves tiny values and formats large values without zero rounding', () => {
    expect(formatDataSize(1e-20)).toBe('1e-20');
    expect(formatDataSize(1e25)).toBe('1e+25');
    expect(convertDataSize(0, 'byte').every(row => row.value === 0)).toBe(true);
  });
  it('rejects negatives, unknown units and overflow', () => {
    expect(() => convertDataSize(-1, 'byte')).toThrow('tools.data-size-converter.errors.invalidValue');
    expect(() => convertDataSize(1, 'invalid' as 'byte')).toThrow('tools.data-size-converter.errors.invalidUnit');
    expect(() => convertDataSize(1e308, 'TiB')).toThrow('tools.data-size-converter.errors.overflow');
  });
});
