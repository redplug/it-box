import { describe, expect, it } from 'vitest';
import { envToJson } from './env-to-json.models';

describe('unquoted # handling', () => {
  it('keeps a # that is attached to the value', () => {
    expect(JSON.parse(envToJson('URL=http://a/#frag'))).toEqual({ URL: 'http://a/#frag' });
    expect(JSON.parse(envToJson('PASSWORD=abc#123'))).toEqual({ PASSWORD: 'abc#123' });
  });

  it('starts a comment at a # preceded by whitespace', () => {
    expect(JSON.parse(envToJson('A=abc #note'))).toEqual({ A: 'abc' });
    expect(JSON.parse(envToJson('A=abc\t# note'))).toEqual({ A: 'abc' });
    expect(JSON.parse(envToJson('A= # note'))).toEqual({ A: '' });
  });
});
