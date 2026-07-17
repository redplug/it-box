import { describe, expect, it } from 'vitest';
import { createNumberGuessingGame, submitGuess } from './engine';

describe('number guessing engine', () => {
  it('uses an injected target and starts with no attempts', () => {
    const game = createNumberGuessingGame({ target: 42, maxAttempts: 5 });
    expect(game).toMatchObject({ target: 42, maxAttempts: 5, attempts: 0, status: 'playing' });
  });

  it('rejects non-integer and out-of-range guesses without using an attempt', () => {
    const game = createNumberGuessingGame({ target: 42 });
    expect(submitGuess(game, 4.2)).toMatchObject({ error: '1부터 100 사이의 정수를 입력하세요.', attempts: 0 });
    expect(submitGuess(game, 101)).toMatchObject({ error: '1부터 100 사이의 정수를 입력하세요.', attempts: 0 });
  });

  it('returns a hint and counts valid guesses', () => {
    const low = submitGuess(createNumberGuessingGame({ target: 42 }), 20);
    expect(low).toMatchObject({ hint: 'higher', attempts: 1, status: 'playing' });
    expect(submitGuess(low, 70)).toMatchObject({ hint: 'lower', attempts: 2, status: 'playing' });
  });

  it('wins when the target is guessed', () => {
    expect(submitGuess(createNumberGuessingGame({ target: 42 }), 42)).toMatchObject({
      hint: 'correct', attempts: 1, status: 'won',
    });
  });

  it('loses after the final wrong guess and ignores later submissions', () => {
    const first = submitGuess(createNumberGuessingGame({ target: 42, maxAttempts: 2 }), 10);
    const lost = submitGuess(first, 20);
    expect(lost).toMatchObject({ attempts: 2, status: 'lost' });
    expect(submitGuess(lost, 42)).toBe(lost);
  });
});
