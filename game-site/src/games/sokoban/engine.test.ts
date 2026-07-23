import { describe, expect, it } from 'vitest';
import { createSokobanGame, movePlayer } from './engine';

const level = { id: 'test', rows: 5, columns: 5, tiles: ['#####', '#   #', '#   #', '#   #', '#####'], player: 6, boxes: [7], targets: [8] };

describe('sokoban engine', () => {
  it('moves on floor and blocks walls', () => {
    const game = createSokobanGame(level);
    expect(movePlayer(game, 'up')).toBe(game);
    expect(movePlayer(game, 'right').player).toBe(7);
  });
  it('pushes one box and counts the move', () => {
    const game = createSokobanGame(level);
    const next = movePlayer(game, 'right');
    expect(next.player).toBe(7);
    expect(next.boxes).toEqual([8]);
    expect(next.moves).toBe(1);
  });
  it('blocks a box against a wall or another box', () => {
    const game = createSokobanGame({ ...level, boxes: [7, 8], targets: [11, 13] });
    expect(movePlayer(game, 'right')).toBe(game);
  });
  it('wins when every box is on a target', () => {
    const game = createSokobanGame(level);
    expect(movePlayer(game, 'right').status).toBe('won');
  });
  it('ignores moves after winning and resets cleanly', () => {
    const won = movePlayer(createSokobanGame(level), 'right');
    expect(movePlayer(won, 'down')).toBe(won);
    expect(createSokobanGame(level).moves).toBe(0);
  });
});
