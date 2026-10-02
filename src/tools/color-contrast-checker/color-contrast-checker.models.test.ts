import { describe, expect, it } from 'vitest';
import { checkContrast } from './color-contrast-checker.models';

describe('Color contrast', () => {
  it('reports all four readability thresholds for black on white', () => {
    expect(checkContrast('#000', '#fff')).toMatchObject({ ratio: 21, aaNormal: true, aaLarge: true, aaaNormal: true, aaaLarge: true });
  });
  it('does not round a failing ratio into a passing threshold', () => {
    expect(checkContrast('#777', '#fff')).toMatchObject({ ratio: 4.47, aaNormal: false, aaLarge: true, aaaNormal: false, aaaLarge: false });
    expect(checkContrast('#fff', '#fff')).toMatchObject({ ratio: 1, aaNormal: false, aaLarge: false, aaaNormal: false, aaaLarge: false });
  });
  it('rejects invalid colors and alpha below one', () => {
    expect(() => checkContrast('invalid', '#fff')).toThrow('tools.color-contrast-checker.errors.invalidColor');
    expect(() => checkContrast('rgba(0, 0, 0, 0.9)', '#fff')).toThrow('tools.color-contrast-checker.errors.transparentColor');
    expect(() => checkContrast('rgba(0, 0, 0, 0.9999)', '#fff')).toThrow('tools.color-contrast-checker.errors.transparentColor');
    expect(() => checkContrast('#000000fe', '#fff')).toThrow('tools.color-contrast-checker.errors.transparentColor');
    expect(() => checkContrast('#000', '#ffffff00')).toThrow('tools.color-contrast-checker.errors.transparentColor');
  });
  it.each(['rgb(118.5,118.5,118.5)', 'hsl(0,0%,46.5%)'])('matches preview and reverse-pair contrast for %s', (color) => {
    const forward = checkContrast(color, '#fff');
    const reverse = checkContrast('#fff', color);
    expect(forward).toMatchObject({ ratio: 4.47, aaNormal: false, foreground: '#777777' });
    expect(reverse.ratio).toBe(forward.ratio);
    expect(reverse.aaNormal).toBe(forward.aaNormal);
    expect(checkContrast(forward.foreground, forward.background)).toEqual(forward);
  });
});
