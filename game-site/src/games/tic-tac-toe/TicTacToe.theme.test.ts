import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const component = readFileSync(new URL('./TicTacToe.vue', import.meta.url), 'utf8');

describe('tic-tac-toe theme', () => {
  test('uses the app surface token for board cells', () => {
    expect(component).toContain('background: var(--surface-background, #fff)');
  });
});
