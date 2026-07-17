import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const stylesheet = readFileSync(new URL('./ItBoxToolbar.vue', import.meta.url), 'utf8');

describe('toolbar locale selector theme', () => {
  test('uses theme tokens for the locale selector background and text', () => {
    expect(stylesheet).toContain('color:var(--control-text-color)');
    expect(stylesheet).toContain('background:var(--control-background)');
  });
});
