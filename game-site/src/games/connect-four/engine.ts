export type ConnectPlayer = 'red' | 'yellow';
export type ConnectCell = ConnectPlayer | null;
export type ConnectStatus = 'playing' | 'won' | 'draw';
export interface ConnectFourGame { board: ConnectCell[]; rows: number; columns: number; currentPlayer: ConnectPlayer; status: ConnectStatus; winner: ConnectPlayer | null; winningCells: number[] }
const ROWS = 6;
const COLUMNS = 7;

function lineFrom(board: ConnectCell[], row: number, column: number, dy: number, dx: number, player: ConnectPlayer): number[] {
  const line: number[] = [];
  let y = row;
  let x = column;
  while (y >= 0 && y < ROWS && x >= 0 && x < COLUMNS && board[y * COLUMNS + x] === player) { line.push(y * COLUMNS + x); y += dy; x += dx; }
  return line;
}
function winningLine(board: ConnectCell[], row: number, column: number, player: ConnectPlayer): number[] {
  for (const [dy, dx] of [[0, 1], [1, 0], [1, 1], [1, -1]] as const) {
    const forward = lineFrom(board, row, column, dy, dx, player);
    const backward = lineFrom(board, row, column, -dy, -dx, player).reverse();
    const line = [...backward.slice(0, -1), ...forward];
    if (line.length >= 4) return line;
  }
  return [];
}

export function createConnectFourGame(): ConnectFourGame { return { board: Array<ConnectCell>(ROWS * COLUMNS).fill(null), rows: ROWS, columns: COLUMNS, currentPlayer: 'red', status: 'playing', winner: null, winningCells: [] }; }
export function dropDisc(game: ConnectFourGame, column: number): ConnectFourGame {
  if (game.status !== 'playing' || !Number.isInteger(column) || column < 0 || column >= COLUMNS) return game;
  let row = ROWS - 1;
  while (row >= 0 && game.board[row * COLUMNS + column] !== null) row -= 1;
  if (row < 0) return game;
  const board = [...game.board];
  board[row * COLUMNS + column] = game.currentPlayer;
  const winningCells = winningLine(board, row, column, game.currentPlayer);
  if (winningCells.length) return { ...game, board, status: 'won', winner: game.currentPlayer, winningCells };
  if (board.every(Boolean)) return { ...game, board, status: 'draw' };
  return { ...game, board, currentPlayer: game.currentPlayer === 'red' ? 'yellow' : 'red' };
}
export function resetConnectFour(): ConnectFourGame { return createConnectFourGame(); }
