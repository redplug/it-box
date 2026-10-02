import { checkTextSize } from '../_shared/local-tool';

export function normalizeUnicode(input: string, form: string): { text: string; changed: boolean } {
  checkTextSize(input);
  if (!['NFC', 'NFD', 'NFKC', 'NFKD'].includes(form)) {
    throw new Error('tools.unicode-normalizer.errors.invalidForm');
  }
  const text = input.normalize(form);
  return { text, changed: text !== input };
}
