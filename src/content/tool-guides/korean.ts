import type { ToolGuide } from '../tool-guides';
import { guide as businessNumberValidator } from '../../tools/business-number-validator/guide';
import { guide as hangulKeyboardConverter } from '../../tools/hangul-keyboard-converter/guide';
import { guide as hangulJamoTool } from '../../tools/hangul-jamo-tool/guide';
import { guide as koreanNumberConverter } from '../../tools/korean-number-converter/guide';
import { guide as piiMasker } from '../../tools/pii-masker/guide';
import { guide as ageDdayCalculator } from '../../tools/age-dday-calculator/guide';
import { guide as koreanByteCounter } from '../../tools/korean-byte-counter/guide';

export const koreanToolGuides: Record<string, ToolGuide> = {
  '/business-number-validator': businessNumberValidator,
  '/hangul-keyboard-converter': hangulKeyboardConverter,
  '/hangul-jamo-tool': hangulJamoTool,
  '/korean-number-converter': koreanNumberConverter,
  '/pii-masker': piiMasker,
  '/age-dday-calculator': ageDdayCalculator,
  '/korean-byte-counter': koreanByteCounter,
};
