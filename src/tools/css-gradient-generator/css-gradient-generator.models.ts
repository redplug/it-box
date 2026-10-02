import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { checkTextSize } from '../_shared/local-tool';

extend([namesPlugin]);

export function generateGradient({ firstColor, secondColor, angle }: { firstColor: string; secondColor: string; angle: number }): string {
  checkTextSize(firstColor);
  checkTextSize(secondColor);
  const first = colord(firstColor);
  const second = colord(secondColor);
  if (!first.isValid() || !second.isValid()) {
    throw new Error('tools.css-gradient-generator.errors.invalidColor');
  }
  if (!Number.isFinite(angle)) {
    throw new TypeError('tools.css-gradient-generator.errors.invalidAngle');
  }
  return `linear-gradient(${angle}deg, ${first.toRgbString()}, ${second.toRgbString()})`;
}
