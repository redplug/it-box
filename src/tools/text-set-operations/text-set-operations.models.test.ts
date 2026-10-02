import { describe, expect, it } from 'vitest';
import { operateTextSets } from './text-set-operations.models';

describe('line-list set operations', () => {
  const first = 'a\r\nb\na\n\n a \n   ';
  const second = 'b\nc\nc';
  it('unions in first-appearance order, skips blanks and compares exact lines', () => {
    expect(operateTextSets(first, second, 'union')).toEqual(['a', 'b', ' a ', 'c']);
  });
  it('intersects and subtracts using first-list order', () => {
    expect(operateTextSets(first, second, 'intersection')).toEqual(['b']);
    expect(operateTextSets(first, second, 'difference')).toEqual(['a', ' a ']);
  });
  it('handles one empty list', () => {
    expect(operateTextSets('', second, 'union')).toEqual(['b', 'c']);
    expect(operateTextSets(first, '', 'intersection')).toEqual([]);
  });
  it('rejects unknown operations and oversized secondary input', () => {
    expect(() => operateTextSets('x', 'y', 'bad')).toThrow();
    expect(() => operateTextSets('x', 'a'.repeat(2 * 1024 * 1024 + 1), 'union')).toThrow();
  });
});
