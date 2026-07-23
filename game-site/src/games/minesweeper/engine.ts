export type MinesweeperStatus = 'playing' | 'won' | 'lost';

export interface MinesweeperCell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

export interface MinesweeperState {
  rows: number
  columns: number
  mines: number
  cells: MinesweeperCell[]
  status: MinesweeperStatus
  started: boolean
  elapsedSeconds: number
}

export interface CreateMinesweeperOptions {
  rows?: number
  columns?: number
  mines?: number
  random?: () => number
}

const neighbors = (index: number, rows: number, columns: number): number[] => {
  const y = Math.floor(index / columns);
  const x = index % columns;
  const result: number[] = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < columns && ny >= 0 && ny < rows) result.push(ny * columns + nx);
    }
  }
  return result;
};

function emptyCells(rows: number, columns: number): MinesweeperCell[] {
  return Array.from({ length: rows * columns }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }));
}

function placeMines(cells: MinesweeperCell[], firstIndex: number, rows: number, columns: number, mineCount: number, random: () => number): MinesweeperCell[] {
  const next = cells.map(cell => ({ ...cell }));
  const candidates = next.map((_, index) => index).filter(index => index !== firstIndex);
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swap = Math.min(index, Math.floor(random() * (index + 1)));
    [candidates[index], candidates[swap]] = [candidates[swap], candidates[index]];
  }
  candidates.slice(0, mineCount).forEach(index => { next[index].mine = true; });
  next.forEach((cell, index) => {
    cell.adjacent = neighbors(index, rows, columns).filter(neighbor => next[neighbor].mine).length;
  });
  return next;
}

export function createMinesweeperGame(options: CreateMinesweeperOptions = {}): MinesweeperState {
  const rows = options.rows ?? 9;
  const columns = options.columns ?? 9;
  const mines = options.mines ?? 10;
  if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows < 2 || columns < 2) throw new RangeError('Board dimensions must be integers of at least 2.');
  if (!Number.isInteger(mines) || mines < 1 || mines >= rows * columns) throw new RangeError('Mine count must fit on the board.');
  return { rows, columns, mines, cells: emptyCells(rows, columns), status: 'playing', started: false, elapsedSeconds: 0 };
}

function revealSafeArea(cells: MinesweeperCell[], firstIndex: number, rows: number, columns: number): void {
  const queue = [firstIndex];
  const visited = new Set<number>();
  while (queue.length) {
    const index = queue.shift()!;
    if (visited.has(index) || cells[index].flagged || cells[index].mine) continue;
    visited.add(index);
    cells[index].revealed = true;
    if (cells[index].adjacent === 0) neighbors(index, rows, columns).forEach(neighbor => { if (!visited.has(neighbor)) queue.push(neighbor); });
  }
}

function hasWon(cells: MinesweeperCell[]): boolean {
  return cells.every(cell => cell.mine || cell.revealed);
}

export function revealCell(state: MinesweeperState, index: number, random: () => number = Math.random): MinesweeperState {
  if (!Number.isInteger(index) || index < 0 || index >= state.cells.length || state.status !== 'playing') return state;
  if (state.cells[index].flagged || state.cells[index].revealed) return state;
  const cells = state.started ? state.cells.map(cell => ({ ...cell })) : placeMines(state.cells, index, state.rows, state.columns, state.mines, random);
  const next = { ...state, cells, started: true };
  if (cells[index].mine) {
    cells.forEach(cell => { if (cell.mine) cell.revealed = true; });
    return { ...next, status: 'lost' };
  }
  revealSafeArea(cells, index, state.rows, state.columns);
  return hasWon(cells) ? { ...next, status: 'won' } : next;
}

export function toggleFlag(state: MinesweeperState, index: number): MinesweeperState {
  if (!Number.isInteger(index) || index < 0 || index >= state.cells.length || state.status !== 'playing') return state;
  if (state.cells[index].revealed) return state;
  const cells = state.cells.map(cell => ({ ...cell }));
  cells[index].flagged = !cells[index].flagged;
  return { ...state, cells };
}

export function resetMinesweeper(options: CreateMinesweeperOptions = {}): MinesweeperState {
  return createMinesweeperGame(options);
}
