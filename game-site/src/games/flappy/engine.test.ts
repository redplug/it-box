import { describe, expect, it } from 'vitest';
import { createFlappyGame, flap, stepFlappy } from './engine';

describe('flappy engine', () => {
  it('flaps upward and gravity pulls the bird down', () => {
    const game = createFlappyGame({ random: () => 0.5 });
    const jumped = flap(game);
    expect(jumped.birdY).toBeLessThan(game.birdY);
    let falling = jumped;
    for (let index = 0; index < 20; index += 1) falling = stepFlappy(falling, 50);
    expect(falling.birdY).toBeGreaterThan(jumped.birdY);
  });

  it('scores after passing a pipe and ends on collision', () => {
    let game = createFlappyGame({ random: () => 0.5 });
    game = { ...game, status: 'playing', birdX: 100, pipes: [{ x: 30, gapY: 100, gap: 100, scored: false }] };
    expect(stepFlappy(game, 16).score).toBe(1);
    const dangerous = { ...game, pipes: [{ x: 100, gapY: 10, gap: 100, scored: false }] };
    expect(stepFlappy(dangerous, 16).status).toBe('game-over');
  });
});
