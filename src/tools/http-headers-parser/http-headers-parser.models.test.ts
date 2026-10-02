import { describe, expect, it } from 'vitest';
import { parseHttpHeaders } from './http-headers-parser.models';

describe('HTTP headers', () => {
  it('retains the optional status line, repeats, lowercase names and colons in values', () => {
    expect(parseHttpHeaders('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nX-Trace: first:part\r\nX-Trace: second\r\n\r\n')).toEqual({ startLine: 'HTTP/1.1 200 OK', headers: { 'content-type': ['text/plain'], 'x-trace': ['first:part', 'second'] } });
  });
  it('accepts a request line and preserves dangerous-looking property names safely', () => {
    expect(parseHttpHeaders('GET /path HTTP/1.1\n__proto__: harmless')).toEqual({ startLine: 'GET /path HTTP/1.1', headers: JSON.parse('{"__proto__":["harmless"]}') });
  });
  it.each(['not a header', 'Bad Name: value', 'X: a\n folded', 'X: a\rInjected: b', 'X: a\u0000b', 'X: a\n\nbody', 'GET /\u0000 HTTP/1.1'])('rejects malformed headers: %s', (input) => {
    expect(() => parseHttpHeaders(input)).toThrow();
  });
});
