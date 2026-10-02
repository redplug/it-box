import { describe, expect, it } from 'vitest';
import { generateBorderRadius } from './css-border-radius-generator.models';

describe('CSS border radius', () => {
  it('keeps clockwise corner order and permits zero', () => {
    expect(generateBorderRadius(0, 12, 24, 36)).toBe('0px 12px 24px 36px');
  });
  it('rejects negative and nonfinite radii', () => {
    expect(() => generateBorderRadius(0, -1, 0, 0)).toThrow('tools.css-border-radius-generator.errors.invalidRadius');
    expect(() => generateBorderRadius(0, 0, Number.POSITIVE_INFINITY, 0)).toThrow('tools.css-border-radius-generator.errors.invalidRadius');
  });
});
