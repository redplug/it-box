import { describe, expect, it } from 'vitest';
import { mergeJson } from './json-merge.models';

describe('JSON deep merge', () => {
  it('recursively merges objects while replacing arrays, nulls, and conflicts', () => {
    expect(
      JSON.parse(
        mergeJson('{"a":{"x":1,"list":[1]},"b":1,"c":{"x":1}}', '{"a":{"y":2,"list":[2]},"b":null,"c":"new"}'),
      ),
    ).toEqual({ a: { x: 1, y: 2, list: [2] }, b: null, c: 'new' });
  });
  it('merges dangerous property names as own data', () => {
    const result = JSON.parse(
      mergeJson('{"__proto__":{"a":1},"constructor":{"x":1}}', '{"__proto__":{"b":2},"constructor":{"y":2}}'),
    );
    expect(Object.getOwnPropertyDescriptor(result, '__proto__')?.value).toEqual({ a: 1, b: 2 });
    expect(result.constructor).toEqual({ x: 1, y: 2 });
    expect(({} as Record<string, unknown>).a).toBeUndefined();
  });
  it.each(['[]', 'null', '1', '"text"'])('rejects non-object roots %s', (input) => {
    expect(() => mergeJson(input, '{}')).toThrow('tools.json-merge.errors.objectsRequired');
    expect(() => mergeJson('{}', input)).toThrow('tools.json-merge.errors.objectsRequired');
  });
  it('enforces depth even on an unmodified branch', () => {
    const nested = `${'{"x":'.repeat(70)}0${'}'.repeat(70)}`;
    expect(() => mergeJson(nested, '{}')).toThrow('tools.json-merge.errors.tooDeep');
  });
  it('validates both input sizes and strict JSON', () => {
    expect(() => mergeJson('{}', 'x'.repeat(2097153))).toThrow('tools.local.errors.textTooLarge');
    expect(() => mergeJson('{}', '{a:1}')).toThrow('tools.local.errors.invalidJson');
  });
});
