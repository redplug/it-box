export type Direction = 'up' | 'right' | 'down' | 'left';
export type SokobanStatus = 'playing' | 'won';
export interface SokobanLevel { id: string; rows: number; columns: number; tiles: string[]; player: number; boxes: number[]; targets: number[] }
export interface SokobanState { levelId: string; rows: number; columns: number; tiles: string[]; player: number; boxes: number[]; targets: number[]; moves: number; status: SokobanStatus }
const DEFAULT_LEVEL: SokobanLevel = { id: 'starter', rows: 7, columns: 7, tiles: ['#######', '#     #', '# .   #', '# $   #', '#  .  #', '#  $@ #', '#######'], player: 39, boxes: [23, 38], targets: [16, 31] };
const DELTAS: Record<Direction, number> = { up: -7, right: 1, down: 7, left: -1 };
function isWall(state: SokobanState, index: number): boolean { return index < 0 || index >= state.tiles.length || state.tiles[index].includes('#'); }
function isBox(state: SokobanState, index: number): boolean { return state.boxes.includes(index); }
function solved(boxes: number[], targets: number[]): boolean { return boxes.length === targets.length && boxes.every(box => targets.includes(box)); }
export function createSokobanGame(level: SokobanLevel = DEFAULT_LEVEL): SokobanState { if (level.boxes.length !== level.targets.length) throw new RangeError('Every box must have a target.'); return { levelId: level.id, rows: level.rows, columns: level.columns, tiles: level.tiles.flatMap(row => row.split('')), player: level.player, boxes: [...level.boxes], targets: [...level.targets], moves: 0, status: 'playing' }; }
export function movePlayer(state: SokobanState, direction: Direction): SokobanState {
  if (state.status !== 'playing') return state;
  const delta = DELTAS[direction];
  const next = state.player + delta;
  if (isWall(state, next)) return state;
  const boxes = [...state.boxes];
  const boxIndex = boxes.indexOf(next);
  if (boxIndex >= 0) {
    const pushed = next + delta;
    if (isWall(state, pushed) || isBox(state, pushed)) return state;
    boxes[boxIndex] = pushed;
  }
  return { ...state, player: next, boxes, moves: state.moves + 1, status: solved(boxes, state.targets) ? 'won' : 'playing' };
}
export function resetSokoban(level: SokobanLevel = DEFAULT_LEVEL): SokobanState { return createSokobanGame(level); }
