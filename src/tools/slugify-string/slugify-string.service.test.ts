import { describe, expect, it } from 'vitest';
import { toSlug } from './slugify-string.service';

describe('slugify-string', () => {
  it('keeps the existing latin behaviour', () => {
    expect(toSlug('My file path')).toBe('my-file-path');
    expect(toSlug('Crème Brûlée')).toBe('creme-brulee');
    expect(toSlug('Hello, World! 2026')).toBe('hello-world-2026');
    expect(toSlug('')).toBe('');
  });

  it('keeps hangul syllables and separates them from latin words', () => {
    expect(toSlug('안녕 세계 hello')).toBe('안녕-세계-hello');
    expect(toSlug('한글 제목')).toBe('한글-제목');
    expect(toSlug('가나abc')).toBe('가나abc');
    expect(toSlug('My 한글 file!')).toBe('my-한글-file');
  });

  it('keeps other unicode letters and digits', () => {
    expect(toSlug('こんにちは 世界')).toBe('こんにちは-世界');
    expect(toSlug('Привет мир 2026')).toBe('privet-mir-2026'); // library romanizes cyrillic like accents
  });

  it('returns an empty slug when there is nothing to keep', () => {
    expect(toSlug('!!! ---')).toBe('');
  });
});
