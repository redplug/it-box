import { describe, expect, it } from 'vitest';
import { activateReactionGame, createReactionGame, markReady, startReactionGame } from './engine';

describe('reaction test engine', () => {
  it('moves from idle to waiting when started', () => {
    expect(startReactionGame(createReactionGame())).toMatchObject({ status: 'waiting', readyAt: null });
  });

  it('records ready time using an injected clock', () => {
    const game = startReactionGame(createReactionGame());
    expect(markReady(game, () => 1_000)).toMatchObject({ status: 'ready', readyAt: 1_000 });
  });

  it('reports a false start when activated while waiting', () => {
    expect(activateReactionGame(startReactionGame(createReactionGame()), () => 500)).toMatchObject({
      status: 'false-start', reactionMs: null,
    });
  });

  it('calculates elapsed time when activated after ready', () => {
    const ready = markReady(startReactionGame(createReactionGame()), () => 1_000);
    expect(activateReactionGame(ready, () => 1_237)).toMatchObject({ status: 'result', reactionMs: 237 });
  });

  it('ignores activation in idle and terminal states', () => {
    const idle = createReactionGame();
    expect(activateReactionGame(idle)).toBe(idle);
    const result = activateReactionGame(markReady(startReactionGame(idle), () => 10), () => 20);
    expect(activateReactionGame(result)).toBe(result);
  });
});
