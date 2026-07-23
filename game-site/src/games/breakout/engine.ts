export type BreakoutStatus = 'idle' | 'playing' | 'paused' | 'won' | 'game-over';
export interface BreakoutBall { x: number; y: number; vx: number; vy: number; radius: number }
export interface BreakoutPaddle { x: number; width: number; speed: number }
export interface BreakoutBrick { x: number; y: number; width: number; height: number; alive: boolean }
export interface BreakoutState { width: number; height: number; ball: BreakoutBall; paddle: BreakoutPaddle; bricks: BreakoutBrick[]; score: number; lives: number; status: BreakoutStatus }
export interface BreakoutOptions { width?: number; height?: number }

function makeBricks(width: number): BreakoutBrick[] { const result: BreakoutBrick[] = []; const columns = 6; const rows = 4; const gap = 6; const side = 16; const brickWidth = (width - side * 2 - gap * (columns - 1)) / columns; for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) result.push({ x: side + column * (brickWidth + gap), y: 50 + row * 24, width: brickWidth, height: 16, alive: true }); return result; }
export function createBreakoutGame(options: BreakoutOptions = {}): BreakoutState { const width = options.width ?? 360; const height = options.height ?? 520; return { width, height, ball: { x: width / 2, y: height - 80, vx: 150, vy: -150, radius: 7 }, paddle: { x: width / 2 - 42, width: 84, speed: 260 }, bricks: makeBricks(width), score: 0, lives: 3, status: 'idle' }; }
export function movePaddle(state: BreakoutState, direction: -1 | 0 | 1, deltaMs = 16): BreakoutState { const distance = direction * state.paddle.speed * Math.max(0, deltaMs) / 1000; const x = Math.max(0, Math.min(state.width - state.paddle.width, state.paddle.x + distance)); return { ...state, paddle: { ...state.paddle, x } }; }
function overlap(ball: BreakoutBall, brick: BreakoutBrick): boolean { return ball.x + ball.radius >= brick.x && ball.x - ball.radius <= brick.x + brick.width && ball.y + ball.radius >= brick.y && ball.y - ball.radius <= brick.y + brick.height; }
export function stepBreakout(state: BreakoutState, deltaMs: number): BreakoutState {
  if (state.status !== 'playing') return state;
  const dt = Math.min(Math.max(deltaMs, 0), 40) / 1000;
  const ball = { ...state.ball, x: state.ball.x + state.ball.vx * dt, y: state.ball.y + state.ball.vy * dt };
  let { vx, vy } = ball;
  if (ball.y - ball.radius > state.height) {
    const lives = state.lives - 1;
    if (lives <= 0) return { ...state, ball: { ...ball, vx, vy }, lives: 0, status: 'game-over' };
    return { ...state, ball: { x: state.width / 2, y: state.height - 80, vx: 150, vy: -150, radius: ball.radius }, lives };
  }
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= state.width) { vx *= -1; ball.x = Math.max(ball.radius, Math.min(state.width - ball.radius, ball.x)); }
  if (ball.y - ball.radius <= 0) { vy = Math.abs(vy); ball.y = ball.radius; }
  const paddleY = state.height - 32;
  if (vy > 0 && ball.y + ball.radius >= paddleY && ball.x >= state.paddle.x && ball.x <= state.paddle.x + state.paddle.width) { vy = -Math.abs(vy); ball.y = paddleY - ball.radius; const ratio = (ball.x - (state.paddle.x + state.paddle.width / 2)) / (state.paddle.width / 2); vx = 190 * ratio; }
  const bricks = state.bricks.map(brick => ({ ...brick }));
  const hit = bricks.find(brick => brick.alive && overlap(ball, brick));
  let score = state.score;
  if (hit) { hit.alive = false; score += 10; vy *= -1; }
  if (bricks.every(brick => !brick.alive)) return { ...state, ball: { ...ball, vx, vy }, bricks, score, status: 'won' };
  return { ...state, ball: { ...ball, vx, vy }, bricks, score };
}
export function resetBreakout(options: BreakoutOptions = {}): BreakoutState { return createBreakoutGame(options); }
