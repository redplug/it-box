import { describe, expect, it } from 'vitest';
import { jsonToQuery, queryToJson } from './query-string-converter.models';

describe('query string conversion', () => {
  it('preserves repeated keys, empty strings, decoded text and strings that look numeric', () => {
    expect(queryToJson('?tag=one&tag=two&n=003&empty=&hello=a+b')).toEqual({ tag: ['one', 'two'], n: '003', empty: '', hello: 'a b' });
    expect(queryToJson('__proto__=safe&__proto__=again')).toEqual(JSON.parse('{"__proto__":["safe","again"]}'));
  });
  it('encodes a flat string object and repeated arrays', () => {
    expect(jsonToQuery('{"tag":["one","two"],"hello":"a b","n":"003"}')).toBe('tag=one&tag=two&hello=a+b&n=003');
  });
  it.each(['[]', '{"n":3}', '{"x":null}', '{"x":["a",4]}', '{"x":{"y":"z"}}'])('rejects non-flat string JSON: %s', (input) => {
    expect(() => jsonToQuery(input)).toThrow();
  });
});
