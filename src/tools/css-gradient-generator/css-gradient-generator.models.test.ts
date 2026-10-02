import { describe, expect, it } from 'vitest';
import { generateGradient } from './css-gradient-generator.models';

describe('CSS gradient', () => {
  it('normalizes two colors into a linear gradient', () => {
    expect(generateGradient({ firstColor: '#ff0000', secondColor: 'blue', angle: 45 })).toBe('linear-gradient(45deg, rgb(255, 0, 0), rgb(0, 0, 255))');
  });
  it('rejects invalid colors and nonfinite angles', () => {
    expect(() => generateGradient({ firstColor: 'url(example)', secondColor: '#fff', angle: 90 })).toThrow('tools.css-gradient-generator.errors.invalidColor');
    expect(() => generateGradient({ firstColor: '#000', secondColor: '#fff', angle: Number.POSITIVE_INFINITY })).toThrow('tools.css-gradient-generator.errors.invalidAngle');
  });
});
