import { describe, expect, it } from 'vitest';
import { createMinesweeperGame, revealCell, toggleFlag } from './engine';

describe('minesweeper engine', () => {
  it('creates an unstarted board with the requested mine count', () => {
    const game = createMinesweeperGame({ rows: 3, columns: 3, mines: 2 });
    expect(game.cells).toHaveLength(9);
    expect(game.cells.filter(cell => cell.mine)).toHaveLength(0);
  });

  it('keeps the first revealed cell safe and reveals empty neighbors', () => {
    const game = createMinesweeperGame({ rows: 3, columns: 3, mines: 1 });
    const next = revealCell(game, 0, () => 0);
    expect(next.cells[0].mine).toBe(false);
    expect(next.cells[0].revealed).toBe(true);
  });

  it('toggles flags and does not reveal flagged cells', () => {
    const game = createMinesweeperGame({ rows: 3, columns: 3, mines: 1 });
    const flagged = toggleFlag(game, 1);
    expect(flagged.cells[1].flagged).toBe(true);
    expect(revealCell(flagged, 1)).toEqual(flagged);
  });

  it('loses when a mine is revealed', () => {
    let game = createMinesweeperGame({ rows: 2, columns: 2, mines: 1 });
    game = revealCell(game, 0, () => 0);
    const mine = game.cells.findIndex(cell => cell.mine);
    expect(revealCell(game, mine).status).toBe('lost');
  });

  it('wins when every safe cell is revealed', () => {
    let game = createMinesweeperGame({ rows: 2, columns: 2, mines: 1 });
    game = revealCell(game, 0, () => 0);
    const safe = game.cells.map((cell, index) => !cell.mine && !cell.revealed ? index : -1).filter(index => index >= 0);
    safe.forEach(index => { game = revealCell(game, index); });
    expect(game.status).toBe('won');
  });

  it('ignores invalid and terminal actions', () => {
    const game = createMinesweeperGame({ rows: 3, columns: 3, mines: 1 });
    expect(revealCell(game, -1)).toBe(game);
    const won = { ...game, status: 'won' as const };
    expect(toggleFlag(won, 0)).toBe(won);
  });
});
