import { describe, expect, it } from 'vitest';
import { matchRegex } from './regex-tester.service';

const values = (regex: string, text: string, flags: string) => matchRegex(regex, text, flags).map(m => [m.index, m.value]);

describe('matchRegex with empty matches', () => {
  it('keeps searching after an empty match', () => {
    expect(values('a*', 'baab', 'g')).toEqual([[1, 'aa']]);
    expect(values('a*', 'baaa', 'g')).toEqual([[1, 'aaa']]);
  });

  it('finds every real match around empty ones', () => {
    expect(values('b|x*', 'abxb', 'g')).toEqual([[1, 'b'], [2, 'x'], [3, 'b']]);
  });

  it('terminates on unicode input with empty matches', () => {
    expect(values('x*', '😀é', 'gu')).toEqual([]);
    expect(values('(?:)', '😀', 'gu')).toEqual([]);
  });
});
