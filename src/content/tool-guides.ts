import { cryptoToolGuides } from './tool-guides/crypto';
import { converterToolGuides } from './tool-guides/converter';
import { webToolGuides } from './tool-guides/web';
import { imagesToolGuides } from './tool-guides/images';
import { developmentToolGuides } from './tool-guides/development';
import { networkToolGuides } from './tool-guides/network';
import { mathMeasurementToolGuides } from './tool-guides/math-measurement';
import { textToolGuides } from './tool-guides/text';
import { dataToolGuides } from './tool-guides/data';

export interface ToolGuide {
  purpose: string
  steps: string[]
  example: string
  limitations: string
  safety: string
  background?: string[]
  faq?: { q: string; a: string }[]
}

export const toolGuides: Record<string, ToolGuide> = {
  ...cryptoToolGuides,
  ...converterToolGuides,
  ...webToolGuides,
  ...imagesToolGuides,
  ...developmentToolGuides,
  ...networkToolGuides,
  ...mathMeasurementToolGuides,
  ...textToolGuides,
  ...dataToolGuides,
};
