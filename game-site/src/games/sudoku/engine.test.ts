import { describe, expect, it } from 'vitest';
import { createSudokuGame, enterDigit, resetSudoku } from './engine';

describe('sudoku engine', () => {
  it('starts with a fixed puzzle and rejects an invalid digit', () => {
    const game = createSudokuGame();
    expect(game.board.filter(Boolean)).toHaveLength(30);
    const empty = game.board.findIndex(value => value === 0);
    expect(enterDigit(game, empty, 1).board[empty]).toBe(0);
  });

  it('accepts the solution digit and detects completion', () => {
    let game = createSudokuGame();
    for (let index = 0; index < game.board.length; index += 1) {
      if (game.board[index] === 0) game = enterDigit(game, index, game.solution[index]);
    }
    expect(game.status).toBe('won');
    expect(enterDigit(game, 0, 2)).toBe(game);
  });

  it('resets to a fresh playing puzzle', () => {
    const game = createSudokuGame();
    expect(resetSudoku()).toEqual(game);
  });
});
