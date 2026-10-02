import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { checkTextSize } from '../_shared/local-tool';

extend([namesPlugin]);

export function generateBoxShadow({ x, y, blur, spread, color, opacity, inset }: { x: number; y: number; blur: number; spread: number; color: string; opacity: number; inset: boolean }): string {
  if (![x, y, blur, spread].every(Number.isFinite) || blur < 0) {
    throw new Error('tools.css-box-shadow-generator.errors.invalidNumbers');
  }
  if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
    throw new Error('tools.css-box-shadow-generator.errors.invalidOpacity');
  }
  checkTextSize(color);
  const parsed = colord(color);
  if (!parsed.isValid()) {
    throw new Error('tools.css-box-shadow-generator.errors.invalidColor');
  }
  return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${parsed.alpha(opacity).toRgbString()}`;
}
