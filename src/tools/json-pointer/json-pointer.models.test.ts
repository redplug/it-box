import { describe, expect, it } from 'vitest';
import { resolveJsonPointer } from './json-pointer.models';

describe('RFC 6901 JSON Pointer', () => {
  it('returns the root for an empty pointer and selects nested values', () => {
    expect(JSON.parse(resolveJsonPointer('{"a":[null,{"x":1}]}', ''))).toEqual({ a: [null, { x: 1 }] });
    expect(resolveJsonPointer('{"a":[null,{"x":1}]}', '/a/0')).toBe('null');
    expect(resolveJsonPointer('{"a":[null,{"x":1}]}', '/a/1/x')).toBe('1');
  });
  it('decodes tilde escapes in the correct order and supports empty keys', () => {
    expect(resolveJsonPointer('{"a/b":{"~1":2},"":3}', '/a~1b/~01')).toBe('2');
    expect(resolveJsonPointer('{"":3}', '/')).toBe('3');
    expect(resolveJsonPointer('{"01":4}', '/01')).toBe('4');
  });
  it('reads only own properties including explicit prototype names', () => {
    expect(resolveJsonPointer('{"__proto__":5}', '/__proto__')).toBe('5');
    expect(() => resolveJsonPointer('{}', '/constructor')).toThrow('tools.json-pointer.errors.missing');
    expect(() => resolveJsonPointer('[]', '/length')).toThrow('tools.json-pointer.errors.arrayIndex');
  });
  it.each(['#/a', 'a', '/~2', '/~', '/a~01~9'])('rejects malformed pointers %s', (pointer) => {
    expect(() => resolveJsonPointer('{"a":1}', pointer)).toThrow('tools.json-pointer.errors.invalidPointer');
  });
  it.each(['/01', '/-1', '/-', '/1.0', '/1', '/9007199254740993'])(
    'rejects invalid or missing array indices %s',
    (pointer) => {
      expect(() => resolveJsonPointer('[0]', pointer)).toThrow();
    },
  );
  it('rejects traversal through primitives and oversized pointers', () => {
    expect(() => resolveJsonPointer('{"x":null}', '/x/a')).toThrow('tools.json-pointer.errors.missing');
    expect(() => resolveJsonPointer('{}', 'x'.repeat(2097153))).toThrow('tools.local.errors.textTooLarge');
  });
});
