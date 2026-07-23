import { describe, expect, it } from 'vitest';
import { createBreakoutGame, movePaddle, stepBreakout } from './engine';

describe('breakout engine', () => {
  it('moves the paddle within the board', () => {
    const game = createBreakoutGame({ width: 200, height: 300 });
    expect(movePaddle(game, -1, 10_000).paddle.x).toBe(0);
    expect(movePaddle(game, 1, 10_000).paddle.x).toBe(116);
  });
  it('does not advance a non-playing game', () => {
    const game = createBreakoutGame();
    expect(stepBreakout(game, 16)).toBe(game);
  });
  it('bounces off walls and removes a brick for score', () => {
    const base = createBreakoutGame({ width: 200, height: 300 });
    const game = { ...base, status: 'playing' as const, bricks: [{ ...base.bricks[0], x: 0 }, ...base.bricks.slice(1)], ball: { x: 3, y: 56, vx: -80, vy: 0, radius: 7 } };
    const next = stepBreakout(game, 16);
    expect(next.ball.vx).toBeGreaterThan(0);
    expect(next.score).toBe(10);
    expect(next.bricks.filter(brick => brick.alive)).toHaveLength(game.bricks.length - 1);
  });
  it('loses a life when the ball falls below the board', () => {
    const game = { ...createBreakoutGame(), status: 'playing' as const, ball: { ...createBreakoutGame().ball, y: 600, vy: 100 } };
    const next = stepBreakout(game, 16);
    expect(next.lives).toBe(2);
    expect(next.ball.y).toBe(440);
  });
  it('wins when the final brick is hit', () => {
    const base = createBreakoutGame();
    const game = { ...base, status: 'playing' as const, bricks: [ { ...base.bricks[0], x: 100, y: 100, alive: true } ], ball: { x: 100, y: 100, vx: 0, vy: 0, radius: 7 } };
    expect(stepBreakout(game, 16).status).toBe('won');
  });
});
