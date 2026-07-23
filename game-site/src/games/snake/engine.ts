export type Direction = 'up' | 'right' | 'down' | 'left';
export type SnakeStatus = 'idle' | 'playing' | 'paused' | 'game-over' | 'won';

export interface Point { x: number; y: number }
export interface SnakeState {
  size: number
  snake: Point[]
  direction: Direction
  nextDirection: Direction
  food: Point
  score: number
  status: SnakeStatus
}

const DELTAS: Record<Direction, Point> = {
  up: { x: 0, y: -1 }, right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 },
};
const OPPOSITE: Record<Direction, Direction> = { up: 'down', right: 'left', down: 'up', left: 'right' };

function samePoint(a: Point, b: Point) { return a.x === b.x && a.y === b.y; }

export function createSnakeGame(size = 20): SnakeState {
  const middle = Math.floor(size / 2);
  return { size, snake: [{ x: middle, y: middle }, { x: middle - 1, y: middle }, { x: middle - 2, y: middle }], direction: 'right', nextDirection: 'right', food: { x: 5, y: 5 }, score: 0, status: 'idle' };
}

export function startSnakeGame(state: SnakeState): SnakeState { return { ...state, status: 'playing' }; }

export function queueDirection(state: SnakeState, direction: Direction): SnakeState {
  if (state.status !== 'playing' || OPPOSITE[state.direction] === direction) return state;
  return { ...state, nextDirection: direction };
}

export function togglePause(state: SnakeState): SnakeState {
  if (state.status === 'playing') return { ...state, status: 'paused' };
  if (state.status === 'paused') return { ...state, status: 'playing' };
  return state;
}

export function tick(state: SnakeState, random: () => number = Math.random): SnakeState {
  if (state.status !== 'playing') return state;
  const direction = state.nextDirection;
  const delta = DELTAS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
  const outside = nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= state.size || nextHead.y >= state.size;
  const eating = samePoint(nextHead, state.food);
  const bodyToCheck = eating ? state.snake : state.snake.slice(0, -1);
  if (outside || bodyToCheck.some(segment => samePoint(segment, nextHead))) return { ...state, direction, nextDirection: direction, status: 'game-over' };

  const snake = [nextHead, ...state.snake];
  if (!eating) snake.pop();
  const score = eating ? state.score + 10 : state.score;
  if (eating && snake.length === state.size * state.size) return { ...state, snake, direction, nextDirection: direction, score, status: 'won' };
  let food = state.food;
  if (eating) {
    const free: Point[] = [];
    for (let y = 0; y < state.size; y += 1) for (let x = 0; x < state.size; x += 1) if (!snake.some(segment => segment.x === x && segment.y === y)) free.push({ x, y });
    food = free[Math.min(free.length - 1, Math.floor(random() * free.length))];
  }
  return { ...state, snake, direction, nextDirection: direction, food, score };
}
