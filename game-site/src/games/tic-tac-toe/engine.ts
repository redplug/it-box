export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameStatus = 'playing' | 'won' | 'draw';

export interface TicTacToeGame {
  board: Cell[]
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  winningLine: number[] | null
}

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function createGame(): TicTacToeGame {
  return {
    board: Array<Cell>(9).fill(null),
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
    winningLine: null,
  };
}

export function playMove(game: TicTacToeGame, index: number): TicTacToeGame {
  if (!Number.isInteger(index) || index < 0 || index >= game.board.length) {
    throw new RangeError('Board index must be an integer from 0 to 8.');
  }
  if (game.status !== 'playing' || game.board[index] !== null) {
    return game;
  }

  const board = [...game.board];
  board[index] = game.currentPlayer;
  const winningLine = WINNING_LINES.find(line => line.every(cell => board[cell] === game.currentPlayer));

  if (winningLine) {
    return { ...game, board, status: 'won', winner: game.currentPlayer, winningLine: [...winningLine] };
  }
  if (board.every(Boolean)) {
    return { ...game, board, status: 'draw' };
  }

  return { ...game, board, currentPlayer: game.currentPlayer === 'X' ? 'O' : 'X' };
}

export function resetGame(): TicTacToeGame {
  return createGame();
}
