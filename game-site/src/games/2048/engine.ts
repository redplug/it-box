export type Direction = 'up' | 'right' | 'down' | 'left';
export type GameStatus = 'playing' | 'won' | 'game-over';
export type Board = number[][];

export interface GameState {
  board: Board
  score: number
  status: GameStatus
  canContinue: boolean
}

export interface MoveResult {
  state: GameState
  changed: boolean
}

type Random = () => number;

const SIZE = 4;
const TARGET = 2048;

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

function addRandomTile(board: Board, random: Random): Board {
  const empty: Array<[number, number]> = [];
  board.forEach((row, y) => row.forEach((value, x) => {
    if (value === 0) empty.push([x, y]);
  }));
  if (!empty.length) return board;
  const [x, y] = empty[Math.min(empty.length - 1, Math.floor(random() * empty.length))];
  board[y][x] = random() < 0.9 ? 2 : 4;
  return board;
}

function mergeLine(line: number[]): { line: number[], score: number } {
  const values = line.filter(Boolean);
  const merged: number[] = [];
  let score = 0;
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === values[index + 1]) {
      const value = values[index] * 2;
      merged.push(value);
      score += value;
      index += 1;
    } else {
      merged.push(values[index]);
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { line: merged, score };
}

function getLine(board: Board, direction: Direction, index: number): number[] {
  if (direction === 'left') return [...board[index]];
  if (direction === 'right') return [...board[index]].reverse();
  if (direction === 'up') return board.map(row => row[index]);
  return board.map(row => row[index]).reverse();
}

function setLine(board: Board, direction: Direction, index: number, line: number[]): void {
  if (direction === 'left') board[index] = line;
  if (direction === 'right') board[index] = [...line].reverse();
  if (direction === 'up') board.forEach((row, y) => { row[index] = line[y]; });
  if (direction === 'down') board.forEach((row, y) => { row[index] = line[SIZE - 1 - y]; });
}

function sameBoard(left: Board, right: Board): boolean {
  return left.every((row, y) => row.every((value, x) => value === right[y][x]));
}

export function createGame(random: Random = Math.random): GameState {
  const board = emptyBoard();
  addRandomTile(board, random);
  addRandomTile(board, random);
  return { board, score: 0, status: 'playing', canContinue: false };
}

export function hasWon(board: Board): boolean {
  return board.some(row => row.some(value => value >= TARGET));
}

export function canMove(board: Board): boolean {
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (board[y][x] === 0) return true;
      if (x < SIZE - 1 && board[y][x] === board[y][x + 1]) return true;
      if (y < SIZE - 1 && board[y][x] === board[y + 1][x]) return true;
    }
  }
  return false;
}

export function move(state: GameState, direction: Direction, random: Random = Math.random): MoveResult {
  if (state.status === 'game-over' || (state.status === 'won' && !state.canContinue)) {
    return { state, changed: false };
  }

  const board = cloneBoard(state.board);
  let scoreGain = 0;
  for (let index = 0; index < SIZE; index += 1) {
    const result = mergeLine(getLine(board, direction, index));
    setLine(board, direction, index, result.line);
    scoreGain += result.score;
  }
  if (sameBoard(board, state.board)) return { state, changed: false };

  addRandomTile(board, random);
  const reachedTarget = hasWon(board);
  const won = reachedTarget && !state.canContinue;
  const nextState: GameState = {
    board,
    score: state.score + scoreGain,
    status: won ? 'won' : canMove(board) ? 'playing' : 'game-over',
    canContinue: state.canContinue,
  };
  return { state: nextState, changed: true };
}

export function continueGame(state: GameState): GameState {
  if (state.status !== 'won') return state;
  return { ...state, status: 'playing', canContinue: true };
}
