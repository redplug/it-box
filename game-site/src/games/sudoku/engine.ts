export type SudokuStatus = 'playing' | 'won';
export interface SudokuGame { board: number[]; solution: number[]; givens: boolean[]; status: SudokuStatus }

const SOLUTION = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const PUZZLE = [5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9];
export function createSudokuGame(): SudokuGame { return { board: [...PUZZLE], solution: [...SOLUTION], givens: PUZZLE.map(Boolean), status: 'playing' }; }
export function enterDigit(game: SudokuGame, index: number, digit: number): SudokuGame {
  if (game.status !== 'playing' || game.givens[index] || !Number.isInteger(index) || index < 0 || index >= 81 || !Number.isInteger(digit) || digit < 1 || digit > 9 || digit !== game.solution[index]) return game;
  const board = [...game.board]; board[index] = digit;
  return { ...game, board, status: board.every(Boolean) ? 'won' : 'playing' };
}
export function resetSudoku(): SudokuGame { return createSudokuGame(); }
