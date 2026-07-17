import { describe, expect, it } from 'vitest';
import { evaluateGuess, generateSecretNumber, validateGuess } from './engine';

describe('number baseball engine', () => {
  it('generates a unique three-digit number without a leading zero', () => {
    const secret = generateSecretNumber(() => 0.5);

    expect(secret).toMatch(/^[1-9]\d{2}$/);
    expect(new Set(secret).size).toBe(3);
  });

  it.each(['', '12', '1234', '122', '023', '1a3'])('rejects invalid guess %s', (guess) => {
    expect(validateGuess(guess)).not.toBeNull();
  });

  it('counts correct positions as strikes and misplaced digits as balls', () => {
    expect(evaluateGuess('123', '153')).toEqual({ strikes: 2, balls: 0 });
    expect(evaluateGuess('123', '312')).toEqual({ strikes: 0, balls: 3 });
  });

  it('returns three strikes for the correct guess', () => {
    expect(evaluateGuess('789', '789')).toEqual({ strikes: 3, balls: 0 });
  });
});
