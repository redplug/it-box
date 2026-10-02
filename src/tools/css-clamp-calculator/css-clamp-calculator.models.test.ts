import { describe, expect, it } from 'vitest';
import { calculateClamp } from './css-clamp-calculator.models';

const sample = { minFont: 16, maxFont: 32, minWidth: 320, maxWidth: 1280, rootFont: 16 };
describe('CSS clamp', () => {
  it('matches exact endpoints for an exactly representable slope', () => {
    const result = calculateClamp({ ...sample, maxFont: 40 });
    expect(result.css).toBe('clamp(1rem, 0.5rem + 2.5vw, 2.5rem)');
    expect(result.interceptRem * 16 + result.slopeVw * 320 / 100).toBe(16);
    expect(result.interceptRem * 16 + result.slopeVw * 1280 / 100).toBe(40);
  });
  it('hits both requested endpoints and expresses bounds in rem', () => {
    const result = calculateClamp(sample);
    expect(result.minRem).toBe(1);
    expect(result.maxRem).toBe(2);
    expect(result.interceptRem * 16 + result.slopeVw * 320 / 100).toBeCloseTo(16, 12);
    expect(result.interceptRem * 16 + result.slopeVw * 1280 / 100).toBeCloseTo(32, 12);
    expect(result.css).toMatch(/^clamp\(1rem, .+rem \+ .+vw, 2rem\)$/);
  });
  it('supports negative intercepts and constant font sizes', () => {
    expect(calculateClamp({ minFont: 16, maxFont: 32, minWidth: 800, maxWidth: 1200, rootFont: 16 }).css).toBe('clamp(1rem, -1rem + 4vw, 2rem)');
    expect(calculateClamp({ ...sample, maxFont: 16 }).css).toBe('clamp(1rem, 1rem + 0vw, 1rem)');
  });
  it('rejects inverted widths, fonts, zero root and overflow', () => {
    expect(() => calculateClamp({ ...sample, maxWidth: 320 })).toThrow('tools.css-clamp-calculator.errors.invalidWidths');
    expect(() => calculateClamp({ ...sample, maxFont: 8 })).toThrow('tools.css-clamp-calculator.errors.invalidFonts');
    expect(() => calculateClamp({ ...sample, rootFont: 0 })).toThrow('tools.css-clamp-calculator.errors.invalidRoot');
    expect(() => calculateClamp({ ...sample, rootFont: Number.MIN_VALUE })).toThrow('tools.css-clamp-calculator.errors.overflow');
  });
});
