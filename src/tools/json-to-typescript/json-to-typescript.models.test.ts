import { describe, expect, it } from 'vitest';
import { jsonToTypescript } from './json-to-typescript.models';

describe('JSON sample to TypeScript', () => {
  it('generates a recursive Root type with quoted unsafe keys', () => {
    expect(jsonToTypescript('{"name":"Ada","active":true,"score":1,"missing":null,"bad-key":{"x":1},"tags":[]}')).toBe(
      'type Root = {\n  name: string;\n  active: boolean;\n  score: number;\n  missing: null;\n  "bad-key": {\n    x: number;\n  };\n  tags: unknown[];\n};',
    );
  });
  it('deduplicates mixed array unions and handles nested arrays', () => {
    expect(jsonToTypescript('[1,"a",2,null,true]')).toBe('type Root = (number | string | null | boolean)[];');
    expect(jsonToTypescript('[[1,2],[3]]')).toBe('type Root = number[][];');
    expect(jsonToTypescript('[]')).toBe('type Root = unknown[];');
  });
  it('handles primitive roots and empty objects', () => {
    expect(jsonToTypescript('null')).toBe('type Root = null;');
    expect(jsonToTypescript('{}')).toBe('type Root = {};');
    expect(jsonToTypescript('{"__proto__":1}')).toContain('__proto__: number;');
  });
  it('rejects excessive recursion and invalid JSON', () => {
    expect(() => jsonToTypescript(`${'['.repeat(70)}0${']'.repeat(70)}`)).toThrow(
      'tools.json-to-typescript.errors.tooDeep',
    );
    expect(() => jsonToTypescript('{bad}')).toThrow('tools.local.errors.invalidJson');
  });
});
