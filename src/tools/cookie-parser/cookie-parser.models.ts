import { checkTextSize } from '../_shared/local-tool';

export function parseCookieHeader(text: string): { name: string; value: string }[] {
  checkTextSize(text);
  // eslint-disable-next-line no-control-regex -- Request headers cannot contain control characters.
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error('tools.cookie-parser.errors.invalidCookie');
  }
  const input = text.trim().replace(/^Cookie:\s*/i, '');
  return input.split(';').filter(pair => pair.trim()).map((pair) => {
    const equals = pair.indexOf('=');
    const name = pair.slice(0, equals).trim();
    if (equals < 1 || !/^[!#$%&'*+.^_`|~\w-]+$/.test(name)) {
      throw new Error('tools.cookie-parser.errors.invalidCookie');
    }
    return { name, value: pair.slice(equals + 1).trim() };
  });
}
