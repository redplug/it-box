import { describe, expect, it } from 'vitest';
import { createTypingGame, typeCharacter } from './engine';

describe('typing engine', () => {
  it('advances for correct characters and counts mistakes', () => {
    let game = createTypingGame('cat');
    game = typeCharacter(game, 'c');
    game = typeCharacter(game, 'x');
    expect(game.typed).toBe('c');
    expect(game.mistakes).toBe(1);
    expect(game.progress).toBe(1);
  });

  it('wins after typing the whole phrase', () => {
    let game = createTypingGame('go');
    game = typeCharacter(typeCharacter(game, 'g'), 'o');
    expect(game.status).toBe('won');
    expect(typeCharacter(game, 'x')).toBe(game);
  });
});
