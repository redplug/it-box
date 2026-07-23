import { describe, expect, it } from 'vitest';
import { createMemoryGame, flipCard, resolvePair } from './engine';

describe('memory match engine', () => {
  it('creates shuffled pairs', () => {
    const game = createMemoryGame({ pairCount: 2, random: () => .5 });
    expect(game.cards).toHaveLength(4);
    expect(new Set(game.cards.map(card => card.pairId))).toHaveLength(2);
    expect(game.cards.filter(card => card.pairId === 0)).toHaveLength(2);
  });
  it('flips two cards but rejects a third card', () => {
    const game = createMemoryGame({ pairCount: 2, random: () => 0 });
    const first = flipCard(game, 0);
    const second = flipCard(first, 1);
    expect(second.selectedIndices).toEqual([0, 1]);
    expect(flipCard(second, 2)).toBe(second);
  });
  it('matches pairs and counts moves', () => {
    let game = createMemoryGame({ pairCount: 2, random: () => 0 });
    const pair = game.cards[0].pairId;
    const other = game.cards.findIndex((card, index) => index !== 0 && card.pairId === pair);
    game = resolvePair(flipCard(flipCard(game, 0), other));
    expect(game.cards[0].matched).toBe(true);
    expect(game.moves).toBe(1);
  });
  it('turns a mismatched pair face down', () => {
    let game = createMemoryGame({ pairCount: 2, random: () => 0 });
    const other = game.cards.findIndex(card => card.pairId !== game.cards[0].pairId);
    game = resolvePair(flipCard(flipCard(game, 0), other));
    expect(game.cards[0].faceUp).toBe(false);
    expect(game.moves).toBe(1);
  });
  it('wins after all pairs match and ignores repeated cards', () => {
    let game = createMemoryGame({ pairCount: 2, random: () => 0 });
    const byPair = new Map<number, number[]>();
    game.cards.forEach((card, index) => byPair.set(card.pairId, [...(byPair.get(card.pairId) ?? []), index]));
    for (const indices of byPair.values()) game = resolvePair(flipCard(flipCard(game, indices[0]), indices[1]));
    expect(game.status).toBe('won');
    expect(flipCard(game, 0)).toBe(game);
  });
});
