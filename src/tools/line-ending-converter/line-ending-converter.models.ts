import { checkTextSize } from '../_shared/local-tool';

export function convertLineEndings(text: string, ending: string): string {
  checkTextSize(text);
  const endings: Record<string, string> = { LF: '\n', CRLF: '\r\n', CR: '\r' };
  if (!Object.prototype.hasOwnProperty.call(endings, ending)) {
    throw new Error('tools.line-ending-converter.errors.invalidEnding');
  }
  return text.replace(/\r\n|\r|\n/g, endings[ending]);
}
