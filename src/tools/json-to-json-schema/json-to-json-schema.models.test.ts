import { describe, expect, it } from 'vitest';
import { jsonToSchema } from './json-to-json-schema.models';

describe('JSON sample to JSON Schema', () => {
  it('infers object properties and required keys from the sample', () => {
    expect(JSON.parse(jsonToSchema('{"name":"Ada","active":true,"score":1,"nothing":null}'))).toEqual({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        name: { type: 'string' },
        active: { type: 'boolean' },
        score: { type: 'number' },
        nothing: { type: 'null' },
      },
      required: ['name', 'active', 'score', 'nothing'],
    });
  });
  it('uses deduplicated anyOf for mixed arrays and unconstrained empty items', () => {
    expect(JSON.parse(jsonToSchema('[1,"a",2,null]'))).toMatchObject({
      type: 'array',
      items: { anyOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
    });
    expect(JSON.parse(jsonToSchema('[]'))).toMatchObject({ type: 'array', items: {} });
    expect(JSON.parse(jsonToSchema('[1,2]'))).toMatchObject({ type: 'array', items: { type: 'number' } });
  });
  it('preserves untrusted names without inferring enums or formats', () => {
    const schema = JSON.parse(jsonToSchema('{"__proto__":"2026-10-02","constructor":{}}'));
    expect(Object.getOwnPropertyDescriptor(schema.properties, '__proto__')?.value).toEqual({ type: 'string' });
    expect(schema.properties.constructor).toEqual({ type: 'object', properties: {}, required: [] });
  });
  it('rejects excessive recursion', () => {
    expect(() => jsonToSchema(`${'['.repeat(70)}0${']'.repeat(70)}`)).toThrow(
      'tools.json-to-json-schema.errors.tooDeep',
    );
  });
});
