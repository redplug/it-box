import { describe, expect, it } from 'vitest';
import { countWordFrequency } from './word-frequency-counter.models';

describe('Unicode token frequency', () => {
  it('counts Unicode letters and numbers with combining marks, sorting ties deterministically', () => {
    expect(countWordFrequency('Cat cat 한글 한글 123 e\u0301 e\u0301 dog!')).toEqual([{ word: 'cat', count: 2 }, { word: 'e\u0301', count: 2 }, { word: '한글', count: 2 }, { word: '123', count: 1 }, { word: 'dog', count: 1 }]);
  });
  it('supports exact case and separates punctuation', () => {
    expect(countWordFrequency('Cat cat Cat x-y', true)).toEqual([{ word: 'Cat', count: 2 }, { word: 'cat', count: 1 }, { word: 'x', count: 1 }, { word: 'y', count: 1 }]);
    expect(countWordFrequency('😀 --')).toEqual([]);
  });
});
