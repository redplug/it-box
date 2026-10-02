import { describe, expect, it } from 'vitest';
import { envToJson, jsonToEnv } from './env-to-json.models';

describe('environment file and JSON', () => {
  it('parses exports, comments, quotes, and literal interpolation text', () => {
    const input = String.raw`# comment
export NAME="Ada" # name
EMPTY=
RAW=hello # note
SINGLE='a # b'
VAR=$HOME
QUOTE="a\n\t\\\"b"`;
    expect(JSON.parse(envToJson(input))).toEqual({
      NAME: 'Ada',
      EMPTY: '',
      RAW: 'hello',
      SINGLE: 'a # b',
      VAR: '$HOME',
      QUOTE: 'a\n\t\\"b',
    });
  });
  it('keeps unrecognized double quoted escapes literal', () => {
    expect(JSON.parse(envToJson(String.raw`VALUE="a\qb"`))).toEqual({ VALUE: 'a\\qb' });
  });
  it('emits escaped double quoted values that round trip', () => {
    const source = String.raw`{"EMPTY":"","TEXT":"line\nwith\tquote\"slash\\end","LITERAL":"$HOME # test"}`;
    const env = jsonToEnv(source);
    expect(env).toContain('EMPTY=""');
    expect(env).toContain(String.raw`TEXT="line\nwith\tquote\"slash\\end"`);
    expect(JSON.parse(envToJson(env))).toEqual({
      EMPTY: '',
      TEXT: 'line\nwith\tquote"slash\\end',
      LITERAL: '$HOME # test',
    });
  });
  it('preserves prototype names without assigning to object prototypes', () => {
    expect(
      Object.getOwnPropertyDescriptor(JSON.parse(envToJson('__proto__=safe\nconstructor=other')), '__proto__')?.value,
    ).toBe('safe');
    expect(jsonToEnv('{"__proto__":"safe"}')).toBe('__proto__="safe"');
  });
  it('rejects duplicate keys', () => {
    expect(() => envToJson('A=1\nA=2')).toThrow('tools.env-to-json.errors.duplicate');
  });
  it.each(['1BAD=x', 'BAD-KEY=x', 'missing', 'A="unterminated', 'A=\'x\' trailing', 'A="x" junk'])(
    'rejects invalid environment input %s',
    (input) => {
      expect(() => envToJson(input)).toThrow('tools.env-to-json.errors.invalidEnv');
    },
  );
  it.each(['[]', 'null', '{"A":1}', '{"A":null}', '{"A":{}}', '{"bad-key":"x"}'])(
    'requires valid identifiers and string values %s',
    (input) => {
      expect(() => jsonToEnv(input)).toThrow('tools.env-to-json.errors.stringsRequired');
    },
  );
  it('enforces the size of both formats', () => {
    expect(() => envToJson('x'.repeat(2097153))).toThrow('tools.local.errors.textTooLarge');
    expect(() => jsonToEnv('x'.repeat(2097153))).toThrow('tools.local.errors.textTooLarge');
  });
});
