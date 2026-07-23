import { describe, expect, it } from 'vitest';
import { createSnakeGame, queueDirection, startSnakeGame, tick, togglePause } from './engine';

describe('snake engine', () => {
  it('starts with a centered three-segment snake', () => {
    const game = createSnakeGame(20);
    expect(game.snake).toEqual([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
    expect(game.status).toBe('idle');
  });

  it('moves and grows when eating food', () => {
    let game = startSnakeGame(createSnakeGame(10));
    game = { ...game, food: { x: 6, y: 5 } };
    game = tick(game, () => 0);
    expect(game.snake[0]).toEqual({ x: 6, y: 5 });
    expect(game.snake).toHaveLength(4);
    expect(game.score).toBe(10);
  });

  it('ignores an immediate reverse direction', () => {
    const game = queueDirection(startSnakeGame(createSnakeGame()), 'left');
    expect(game.nextDirection).toBe('right');
  });

  it('ends on a wall collision and ignores ticks after ending', () => {
    let game = startSnakeGame(createSnakeGame(5));
    game = tick(game);
    game = tick(game);
    game = tick(game);
    expect(game.status).toBe('game-over');
    expect(tick(game)).toBe(game);
  });

  it('pauses and resumes without changing the board', () => {
    const game = startSnakeGame(createSnakeGame());
    const paused = togglePause(game);
    expect(paused.status).toBe('paused');
    expect(togglePause(paused).status).toBe('playing');
    expect(tick(paused)).toEqual(paused);
  });
});
