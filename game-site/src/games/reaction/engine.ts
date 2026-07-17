export type ReactionStatus = 'idle' | 'waiting' | 'ready' | 'result' | 'false-start';
export type Clock = () => number;

export interface ReactionState {
  status: ReactionStatus
  readyAt: number | null
  reactionMs: number | null
}

export function createReactionGame(): ReactionState {
  return { status: 'idle', readyAt: null, reactionMs: null };
}

export function startReactionGame(_state: ReactionState): ReactionState {
  return { status: 'waiting', readyAt: null, reactionMs: null };
}

export function markReady(state: ReactionState, clock: Clock = Date.now): ReactionState {
  if (state.status !== 'waiting') return state;
  return { ...state, status: 'ready', readyAt: clock() };
}

export function activateReactionGame(state: ReactionState, clock: Clock = Date.now): ReactionState {
  if (state.status === 'waiting') return { ...state, status: 'false-start', reactionMs: null };
  if (state.status !== 'ready' || state.readyAt === null) return state;
  return { ...state, status: 'result', reactionMs: Math.max(0, Math.round(clock() - state.readyAt)) };
}
