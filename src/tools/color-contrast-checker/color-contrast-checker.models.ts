import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import namesPlugin from 'colord/plugins/names';
import { checkTextSize } from '../_shared/local-tool';

extend([a11yPlugin, namesPlugin]);

export function checkContrast(foreground: string, background: string) {
  checkTextSize(foreground);
  checkTextSize(background);
  const fg = colord(foreground);
  const bg = colord(background);
  if (!fg.isValid() || !bg.isValid()) {
    throw new Error('tools.color-contrast-checker.errors.invalidColor');
  }
  const transparentHex = [foreground, background].some((value) => {
    const hex = value.trim();
    return /^#[\da-f]{8}$/i.test(hex) && !/ff$/i.test(hex);
  });
  if (fg.rgba.a < 1 || bg.rgba.a < 1 || transparentHex) {
    throw new Error('tools.color-contrast-checker.errors.transparentColor');
  }
  // Normalize both sides to the same 8-bit channels used by the preview.
  const normalizedFg = colord(fg.toHex());
  const normalizedBg = colord(bg.toHex());
  return {
    ratio: normalizedFg.contrast(normalizedBg),
    foreground: normalizedFg.toHex(),
    background: normalizedBg.toHex(),
    aaNormal: normalizedFg.isReadable(normalizedBg, { level: 'AA', size: 'normal' }),
    aaLarge: normalizedFg.isReadable(normalizedBg, { level: 'AA', size: 'large' }),
    aaaNormal: normalizedFg.isReadable(normalizedBg, { level: 'AAA', size: 'normal' }),
    aaaLarge: normalizedFg.isReadable(normalizedBg, { level: 'AAA', size: 'large' }),
  };
}
