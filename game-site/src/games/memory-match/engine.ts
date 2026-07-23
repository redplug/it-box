export type MemoryStatus = 'playing' | 'won';
export interface MemoryCard { id: number; pairId: number; faceUp: boolean; matched: boolean }
export interface MemoryGameState { cards: MemoryCard[]; selectedIndices: number[]; moves: number; status: MemoryStatus }
export interface CreateMemoryGameOptions { pairCount?: number; random?: () => number }

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function createMemoryGame(options: CreateMemoryGameOptions = {}): MemoryGameState {
  const pairCount = options.pairCount ?? 8;
  if (!Number.isInteger(pairCount) || pairCount < 2) throw new RangeError('Pair count must be at least 2.');
  const random = options.random ?? Math.random;
  const pairs = shuffle(Array.from({ length: pairCount * 2 }, (_, index) => Math.floor(index / 2)), random);
  return { cards: pairs.map((pairId, id) => ({ id, pairId, faceUp: false, matched: false })), selectedIndices: [], moves: 0, status: 'playing' };
}

export function flipCard(state: MemoryGameState, index: number): MemoryGameState {
  if (state.status !== 'playing' || !Number.isInteger(index) || index < 0 || index >= state.cards.length) return state;
  if (state.selectedIndices.length >= 2 || state.cards[index].faceUp || state.cards[index].matched) return state;
  const cards = state.cards.map(card => ({ ...card }));
  cards[index].faceUp = true;
  return { ...state, cards, selectedIndices: [...state.selectedIndices, index] };
}

export function resolvePair(state: MemoryGameState): MemoryGameState {
  if (state.selectedIndices.length !== 2) return state;
  const [first, second] = state.selectedIndices;
  const cards = state.cards.map(card => ({ ...card }));
  const match = cards[first].pairId === cards[second].pairId;
  if (match) { cards[first].matched = true; cards[second].matched = true; }
  else { cards[first].faceUp = false; cards[second].faceUp = false; }
  const status = cards.every(card => card.matched) ? 'won' : 'playing';
  return { ...state, cards, selectedIndices: [], moves: state.moves + 1, status };
}

export function resetMemoryGame(options: CreateMemoryGameOptions = {}): MemoryGameState { return createMemoryGame(options); }
