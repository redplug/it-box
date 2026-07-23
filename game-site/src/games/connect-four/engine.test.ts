import { describe, expect, it } from 'vitest';
import { createConnectFourGame, dropDisc } from './engine';

describe('connect four engine', () => {
  it('drops discs to the bottom and alternates turns', () => {
    let game = createConnectFourGame();
    game = dropDisc(game, 0);
    game = dropDisc(game, 0);
    expect(game.board[35]).toBe('red');
    expect(game.board[28]).toBe('yellow');
    expect(game.currentPlayer).toBe('red');
  });
  it('rejects invalid and full columns', () => {
    let game = createConnectFourGame();
    expect(dropDisc(game, -1)).toBe(game);
    for (let index = 0; index < 6; index += 1) game = dropDisc(game, 0);
    const full = dropDisc(game, 0);
    expect(full).toBe(game);
  });
  it('detects horizontal, vertical, and diagonal wins', () => {
    let horizontal = createConnectFourGame();
    [0, 0, 1, 1, 2, 2, 3].forEach(column => { horizontal = dropDisc(horizontal, column); });
    expect(horizontal.status).toBe('won');
    let vertical = createConnectFourGame();
    [0, 1, 0, 1, 0, 1, 0].forEach(column => { vertical = dropDisc(vertical, column); });
    expect(vertical.status).toBe('won');
    let diagonal = createConnectFourGame();
    [0, 1, 1, 2, 2, 3, 2, 3, 3, 4, 3].forEach(column => { diagonal = dropDisc(diagonal, column); });
    expect(diagonal.status).toBe('won');
  });
  it('stores winning cells and ignores moves after a win', () => {
    let game = createConnectFourGame();
    [0, 0, 1, 1, 2, 2, 3].forEach(column => { game = dropDisc(game, column); });
    expect(game.winningCells.length).toBeGreaterThanOrEqual(4);
    expect(dropDisc(game, 4)).toBe(game);
  });
});
