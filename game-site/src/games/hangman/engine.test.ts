import { describe, expect, it } from 'vitest';
import { createHangmanGame, guessLetter, HANGMAN_WORDS, pickHangmanWord } from './engine';

describe('hangman engine', () => {
  it('normalizes a valid word and rejects invalid words', () => {
    expect(createHangmanGame(' code ').word).toBe('CODE');
    expect(() => createHangmanGame('한글')).toThrow();
  });
  it('reveals repeated letters and counts wrong guesses', () => {
    let game = createHangmanGame('LEVEL');
    game = guessLetter(game, 'e');
    expect(game.guessedLetters).toEqual(['E']);
    expect(game.wrongGuesses).toBe(0);
    game = guessLetter(game, 'x');
    expect(game.wrongGuesses).toBe(1);
  });
  it('ignores invalid and repeated guesses', () => {
    const game = guessLetter(createHangmanGame('CAT'), 'C');
    expect(guessLetter(game, 'c')).toBe(game);
    expect(guessLetter(game, '?')).toBe(game);
  });
  it('wins when every unique letter is guessed', () => {
    let game = createHangmanGame('CODE');
    for (const letter of ['C', 'O', 'D', 'E']) game = guessLetter(game, letter);
    expect(game.status).toBe('won');
  });
  it('loses after the wrong guess limit and ignores terminal state', () => {
    let game = createHangmanGame('CODE', 2);
    game = guessLetter(game, 'X');
    game = guessLetter(game, 'Y');
    expect(game.status).toBe('lost');
    expect(guessLetter(game, 'C')).toBe(game);
  });

  it('provides a real word bank and avoids immediately repeating a word', () => {
    expect(HANGMAN_WORDS.length).toBeGreaterThanOrEqual(12);
    expect(pickHangmanWord(() => 0, HANGMAN_WORDS[0])).not.toBe(HANGMAN_WORDS[0]);
  });
});
