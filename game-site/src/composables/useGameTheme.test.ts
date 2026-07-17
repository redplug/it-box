import { describe, expect, test } from 'vitest';
import { getThemeClass, isDarkTheme } from './useGameTheme';

describe('game theme state', () => {
  test('uses dark theme unless light is explicitly stored', () => {
    expect(isDarkTheme(null)).toBe(true);
    expect(isDarkTheme('dark')).toBe(true);
    expect(isDarkTheme('light')).toBe(false);
  });

  test('returns the class needed to render the selected theme', () => {
    expect(getThemeClass(true)).toBe('');
    expect(getThemeClass(false)).toBe('light-theme');
  });
});
