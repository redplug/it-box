import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const stylesheet = readFileSync(new URL('./itbox-sidebar-menu.css', import.meta.url), 'utf8');

describe('sidebar menu theme', () => {
  test('uses the sidebar text token instead of a fixed white color', () => {
    expect(stylesheet).toContain('color: var(--sidebar-text-color)');
  });
});
