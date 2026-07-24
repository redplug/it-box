export interface FlappyPipe { x: number; gapY: number; gap: number; scored: boolean }
export interface FlappyGame { width: number; height: number; birdX: number; birdY: number; velocity: number; pipes: FlappyPipe[]; score: number; status: 'idle' | 'playing' | 'game-over' }
const BIRD = 22; const PIPE_WIDTH = 54;
export function createFlappyGame(options: { random?: () => number } = {}): FlappyGame {
  const random = options.random ?? Math.random;
  return { width: 360, height: 520, birdX: 90, birdY: 240, velocity: 0, pipes: [{ x: 360, gapY: 185 + random() * 150, gap: 132, scored: false }], score: 0, status: 'idle' };
}
export function flap(game: FlappyGame): FlappyGame { return game.status === 'game-over' ? game : { ...game, status: 'playing', birdY: game.birdY - 1, velocity: -360 }; }
export function stepFlappy(game: FlappyGame, deltaMs: number): FlappyGame {
  if (game.status !== 'playing') return game;
  const dt = Math.min(Math.max(deltaMs, 0), 50) / 1000;
  const birdY = game.birdY + game.velocity * dt + 0.5 * 1000 * dt * dt;
  const velocity = game.velocity + 1000 * dt;
  const pipes = game.pipes.map(pipe => ({ ...pipe, x: pipe.x - 150 * dt }));
  let score = game.score;
  for (const pipe of pipes) if (!pipe.scored && pipe.x + PIPE_WIDTH < game.birdX) { pipe.scored = true; score += 1; }
  if (pipes.every(pipe => pipe.x < game.width - 150)) pipes.push({ x: game.width + 80, gapY: 120 + Math.random() * 200, gap: 132, scored: false });
  const hitEdge = birdY < 0 || birdY + BIRD > game.height;
  const hitPipe = pipes.some(pipe => game.birdX + BIRD / 2 > pipe.x && game.birdX - BIRD / 2 < pipe.x + PIPE_WIDTH && (birdY - BIRD / 2 < pipe.gapY || birdY + BIRD / 2 > pipe.gapY + pipe.gap));
  return { ...game, birdY, velocity, pipes: pipes.filter(pipe => pipe.x > -PIPE_WIDTH), score, status: hitEdge || hitPipe ? 'game-over' : 'playing' };
}
