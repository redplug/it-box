export type GuessHint = 'higher' | 'lower' | 'correct' | null;
export type GuessStatus = 'playing' | 'won' | 'lost';

export interface NumberGuessingState {
  target: number
  min: number
  max: number
  maxAttempts: number
  attempts: number
  status: GuessStatus
  hint: GuessHint
  error: string | null
  lastGuess: number | null
}

export interface NumberGuessingOptions {
  target?: number
  min?: number
  max?: number
  maxAttempts?: number
  random?: () => number
}

export function createNumberGuessingGame(options: NumberGuessingOptions = {}): NumberGuessingState {
  const min = options.min ?? 1;
  const max = options.max ?? 100;
  const random = options.random ?? Math.random;
  const target = options.target ?? Math.floor(random() * (max - min + 1)) + min;

  if (!Number.isInteger(target) || target < min || target > max) {
    throw new RangeError('target must be an integer within the configured range');
  }

  return {
    target,
    min,
    max,
    maxAttempts: options.maxAttempts ?? 10,
    attempts: 0,
    status: 'playing',
    hint: null,
    error: null,
    lastGuess: null,
  };
}

export function submitGuess(state: NumberGuessingState, guess: number): NumberGuessingState {
  if (state.status !== 'playing') return state;
  if (!Number.isInteger(guess) || guess < state.min || guess > state.max) {
    return { ...state, error: `${state.min}부터 ${state.max} 사이의 정수를 입력하세요.` };
  }

  const attempts = state.attempts + 1;
  const hint: GuessHint = guess === state.target ? 'correct' : guess < state.target ? 'higher' : 'lower';
  const status: GuessStatus = hint === 'correct' ? 'won' : attempts >= state.maxAttempts ? 'lost' : 'playing';
  return { ...state, attempts, hint, status, error: null, lastGuess: guess };
}
