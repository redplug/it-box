import { describe, expect, it } from 'vitest';
import { parseCookieHeader } from './cookie-parser.models';

describe('Cookie request header', () => {
  it('splits the first equals sign and keeps duplicate names', () => {
    expect(parseCookieHeader('Cookie: session=abc==; theme=dark; session=xyz; empty=')).toEqual([{ name: 'session', value: 'abc==' }, { name: 'theme', value: 'dark' }, { name: 'session', value: 'xyz' }, { name: 'empty', value: '' }]);
  });
  it.each(['Set-Cookie: a=b', 'missing', '=value', 'bad name=x', 'a=b\r\nX: c'])('rejects non-Cookie or malformed input: %s', (input) => {
    expect(() => parseCookieHeader(input)).toThrow();
  });
});
