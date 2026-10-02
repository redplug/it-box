export function calculateClamp({ minFont, maxFont, minWidth, maxWidth, rootFont }: { minFont: number; maxFont: number; minWidth: number; maxWidth: number; rootFont: number }) {
  if (!Number.isFinite(minWidth) || !Number.isFinite(maxWidth) || minWidth <= 0 || maxWidth <= minWidth) {
    throw new Error('tools.css-clamp-calculator.errors.invalidWidths');
  }
  if (!Number.isFinite(minFont) || !Number.isFinite(maxFont) || minFont <= 0 || maxFont < minFont) {
    throw new Error('tools.css-clamp-calculator.errors.invalidFonts');
  }
  if (!Number.isFinite(rootFont) || rootFont <= 0) {
    throw new Error('tools.css-clamp-calculator.errors.invalidRoot');
  }
  const slope = (maxFont - minFont) / (maxWidth - minWidth);
  const slopeVw = slope * 100;
  const interceptRem = (minFont - slope * minWidth) / rootFont;
  const minRem = minFont / rootFont;
  const maxRem = maxFont / rootFont;
  if (![slopeVw, interceptRem, minRem, maxRem].every(Number.isFinite)) {
    throw new Error('tools.css-clamp-calculator.errors.overflow');
  }
  return { minRem, maxRem, slopeVw, interceptRem, css: `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)` };
}
