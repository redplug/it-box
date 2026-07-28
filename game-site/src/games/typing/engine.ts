export interface TypingGame { phrase: string; typed: string; progress: number; mistakes: number; status: 'playing' | 'won' }
export function createTypingGame(phrase: string): TypingGame { return { phrase, typed: '', progress: 0, mistakes: 0, status: 'playing' }; }
export function typeCharacter(game: TypingGame, character: string): TypingGame {
  if (game.status !== 'playing') return game;
  const expected = game.phrase[game.progress];
  if (character !== expected) return { ...game, mistakes: game.mistakes + 1 };
  const progress = game.progress + 1;
  return { ...game, typed: game.typed + character, progress, status: progress === game.phrase.length ? 'won' : 'playing' };
}
export function resetTyping(phrase: string): TypingGame { return createTypingGame(phrase); }
