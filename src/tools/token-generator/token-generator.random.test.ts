import { afterEach, describe, expect, it, vi } from 'vitest';
import { createToken } from './token-generator.service';

describe('token-generator randomness', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('draws from crypto.getRandomValues instead of Math.random', () => {
    const cryptoSpy = vi.spyOn(crypto, 'getRandomValues');
    const mathSpy = vi.spyOn(Math, 'random');

    createToken({ length: 20 });

    expect(cryptoSpy).toHaveBeenCalled();
    expect(mathSpy).not.toHaveBeenCalled();
  });

  it('rejects random values that would bias the modulo', () => {
    // 2^32 % 3 === 1, so 0xFFFFFFFF must be rejected; the next value 4 gives index 4 % 3 === 1
    const values = [0xFFFFFFFF, 4];
    vi.spyOn(crypto, 'getRandomValues').mockImplementation(((array: Uint32Array) => {
      array[0] = values.shift() ?? 0;
      return array;
    }) as typeof crypto.getRandomValues);

    expect(createToken({ alphabet: 'abc', length: 1 })).toBe('b');
    expect(values).toHaveLength(0);
  });

  it('uses only the selected characters for long tokens', () => {
    const token = createToken({ alphabet: 'xy', length: 5000 });

    expect(token).toHaveLength(5000);
    expect(token).toMatch(/^[xy]+$/);
  });

  it('returns an empty string for length 0', () => {
    expect(createToken({ length: 0 })).toBe('');
  });
});
