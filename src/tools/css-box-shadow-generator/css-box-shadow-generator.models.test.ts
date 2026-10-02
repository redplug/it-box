import { describe, expect, it } from 'vitest';
import { generateBoxShadow } from './css-box-shadow-generator.models';

const sample = { x: 4, y: -2, blur: 12, spread: -3, color: '#000000', opacity: 0.25, inset: false };
describe('CSS box shadow', () => {
  it('builds offset, blur, spread, opacity and inset CSS', () => {
    expect(generateBoxShadow(sample)).toBe('4px -2px 12px -3px rgba(0, 0, 0, 0.25)');
    expect(generateBoxShadow({ ...sample, inset: true })).toBe('inset 4px -2px 12px -3px rgba(0, 0, 0, 0.25)');
  });
  it('rejects negative blur, invalid opacity, colors and nonfinite offsets', () => {
    expect(() => generateBoxShadow({ ...sample, blur: -1 })).toThrow('tools.css-box-shadow-generator.errors.invalidNumbers');
    expect(() => generateBoxShadow({ ...sample, opacity: 1.1 })).toThrow('tools.css-box-shadow-generator.errors.invalidOpacity');
    expect(() => generateBoxShadow({ ...sample, color: 'bad' })).toThrow('tools.css-box-shadow-generator.errors.invalidColor');
    expect(() => generateBoxShadow({ ...sample, x: Number.NaN })).toThrow('tools.css-box-shadow-generator.errors.invalidNumbers');
  });
});
