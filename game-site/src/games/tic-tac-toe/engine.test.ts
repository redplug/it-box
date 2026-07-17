import { describe, expect, it } from 'vitest';

import { createGame, playMove, resetGame } from './engine';

describe('tic-tac-toe engine', () => {
  it('places alternating marks without mutating the previous game', () => {
    const initial = createGame();
    const afterX = playMove(initial, 0);
    const afterO = playMove(afterX, 4);

    expect(initial.board).toEqual(Array(9).fill(null));
    expect(afterO.board).toEqual(['X', null, null, null, 'O', null, null, null, null]);
    expect(afterO.currentPlayer).toBe('X');
  });

  it('ignores moves on occupied cells', () => {
    const game = playMove(playMove(createGame(), 0), 0);

    expect(game.board[0]).toBe('X');
    expect(game.currentPlayer).toBe('O');
  });

  it('detects a win and exposes its winning line', () => {
    let game = createGame();
    for (const index of [0, 3, 1, 4, 2]) {
      game = playMove(game, index);
    }

    expect(game.status).toBe('won');
    expect(game.winner).toBe('X');
    expect(game.winningLine).toEqual([0, 1, 2]);
  });

  it('detects a draw when the board fills without a winner', () => {
    let game = createGame();
    for (const index of [0, 1, 2, 4, 3, 5, 7, 6, 8]) {
      game = playMove(game, index);
    }

    expect(game.status).toBe('draw');
    expect(game.winner).toBeNull();
  });

  it('ignores moves after the game finishes and resets to a new game', () => {
    let won = createGame();
    for (const index of [0, 3, 1, 4, 2]) {
      won = playMove(won, index);
    }

    expect(playMove(won, 8)).toBe(won);
    expect(resetGame()).toEqual(createGame());
  });

  it('rejects indices outside the board', () => {
    expect(() => playMove(createGame(), -1)).toThrow(RangeError);
    expect(() => playMove(createGame(), 9)).toThrow(RangeError);
  });
});
