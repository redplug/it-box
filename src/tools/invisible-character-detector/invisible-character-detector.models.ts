import { checkTextSize } from '../_shared/local-tool';

export function detectInvisibleCharacters(text: string): { position: number; codePoint: string; name: string }[] {
  checkTextSize(text);
  const names = new Map([
    [0x00A0, 'NO-BREAK SPACE'], [0x00AD, 'SOFT HYPHEN'], [0x034F, 'COMBINING GRAPHEME JOINER'], [0x061C, 'ARABIC LETTER MARK'],
    [0x180E, 'MONGOLIAN VOWEL SEPARATOR'], [0x200B, 'ZERO WIDTH SPACE'], [0x200C, 'ZERO WIDTH NON-JOINER'], [0x200D, 'ZERO WIDTH JOINER'],
    [0x200E, 'LEFT-TO-RIGHT MARK'], [0x200F, 'RIGHT-TO-LEFT MARK'], [0x202A, 'LEFT-TO-RIGHT EMBEDDING'], [0x202B, 'RIGHT-TO-LEFT EMBEDDING'],
    [0x202C, 'POP DIRECTIONAL FORMATTING'], [0x202D, 'LEFT-TO-RIGHT OVERRIDE'], [0x202E, 'RIGHT-TO-LEFT OVERRIDE'],
    [0x2060, 'WORD JOINER'], [0x2066, 'LEFT-TO-RIGHT ISOLATE'], [0x2067, 'RIGHT-TO-LEFT ISOLATE'], [0x2068, 'FIRST STRONG ISOLATE'],
    [0x2069, 'POP DIRECTIONAL ISOLATE'], [0xFEFF, 'ZERO WIDTH NO-BREAK SPACE'],
  ]);
  const result: { position: number; codePoint: string; name: string }[] = [];
  let position = 0;
  for (const character of text) {
    const code = character.codePointAt(0)!;
    const name = names.get(code) ?? (code < 0x20 || (code >= 0x7F && code <= 0x9F) ? 'CONTROL' : undefined);
    if (name) {
      result.push({ position, codePoint: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`, name });
    }
    position++;
  }
  return result;
}
