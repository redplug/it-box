import { describe, expect, it } from 'vitest';
import { canMove, continueGame, createGame, move, type Board } from './engine';

describe('2048 engine', () => {
  it('merges each tile at most once from left to right', () => {
    const board: Board = [
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const result = move({ board, score: 0, status: 'playing', canContinue: false }, 'left', () => 0.5);

    expect(result.changed).toBe(true);
    expect(result.state.board[0]).toEqual([4, 4, 0, 0]);
    expect(result.state.score).toBe(8);
  });

  it('does not add a tile when a move changes nothing', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    const result = move({ board, score: 10, status: 'playing', canContinue: false }, 'left', () => 0);

    expect(result.changed).toBe(false);
    expect(result.state).toEqual({ board, score: 10, status: 'playing', canContinue: false });
  });

  it('marks a game as won when a move creates 2048', () => {
    const board: Board = [
      [1024, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const result = move({ board, score: 0, status: 'playing', canContinue: false }, 'left', () => 0.5);

    expect(result.state.board[0][0]).toBe(2048);
    expect(result.state.status).toBe('won');
    expect(result.state.canContinue).toBe(false);
  });

  it('keeps playing after the player continues beyond 2048', () => {
    const state = continueGame({
      board: [
        [2048, 2, 4, 0],
        [16, 32, 64, 0],
        [256, 512, 1024, 2],
        [4, 8, 16, 32],
      ],
      score: 0,
      status: 'won',
      canContinue: false,
    });

    const result = move(state, 'right', () => 0.5);

    expect(result.changed).toBe(true);
    expect(result.state.status).toBe('playing');
    expect(result.state.canContinue).toBe(true);
  });

  it('detects a full board with no possible moves', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(canMove(board)).toBe(false);
  });

  it('creates a playable game with two tiles', () => {
    const state = createGame(() => 0.5);
    expect(state.board.flat().filter(Boolean)).toHaveLength(2);
    expect(state.status).toBe('playing');
    expect(state.score).toBe(0);
  });
});
