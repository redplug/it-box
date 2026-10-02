import { describe, expect, it } from 'vitest';
import { generateHttpRequest } from './http-request-generator.models';

describe('HTTP snippet generation', () => {
  it('produces fetch data with repeated headers and JSON string escaping', () => {
    const result = generateHttpRequest('POST', 'https://example.com/api', 'X-Test: one\nX-Test: two', 'say "hi"\nnext');
    expect(result.fetch).toBe(String.raw`fetch("https://example.com/api", {
  "method": "POST",
  "headers": [
    [
      "x-test",
      "one"
    ],
    [
      "x-test",
      "two"
    ]
  ],
  "body": "say \"hi\"\nnext"
});`);
  });
  it('quotes single quotes and shell substitutions as literal POSIX shell arguments', () => {
    const result = generateHttpRequest('POST', 'https://example.com', '', 'it\'s $(whoami)');
    expect(result.curl).toContain('--data-raw \'it\'\\\'\'s $(whoami)\'');
  });
  it.each(['GET', 'HEAD'])('rejects body for %s', (method) => {
    expect(() => generateHttpRequest(method, 'https://example.com', '', 'body')).toThrow();
  });
  it('rejects NUL bodies that cannot be represented as POSIX shell arguments', () => {
    expect(() => generateHttpRequest('POST', 'https://example.com', '', 'a\u0000b')).toThrow();
  });
  it.each(['javascript:alert(1)', '/relative', 'https://example.com\r\nX: injected'])('rejects unsafe or relative URLs: %s', (url) => {
    expect(() => generateHttpRequest('GET', url, '', '')).toThrow();
  });
  it.each(['X: good\rInjected: bad', 'X: good\n folded', 'GET / HTTP/1.1'])('rejects injected or request-line headers: %s', (headers) => {
    expect(() => generateHttpRequest('GET', 'https://example.com', headers, '')).toThrow();
  });
  it('rejects non-ByteString header values while accepting Latin-1', () => {
    for (const value of ['한글', '😀']) {
      expect(() => generateHttpRequest('GET', 'https://example.com', `X-Test: ${value}`, '')).toThrow('tools.http-request-generator.errors.invalidHeaders');
    }
    expect(generateHttpRequest('GET', 'https://example.com', 'X-Test: café', '').fetch).toContain('café');
  });
});
