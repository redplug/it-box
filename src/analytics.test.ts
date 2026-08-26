import { describe, expect, test, vi } from 'vitest';

const inject = vi.fn();

vi.mock('@vercel/analytics', () => ({ inject }));

describe('analytics', () => {
  test('starts Vercel Analytics tracking', async () => {
    const { startAnalytics } = await import('./analytics');

    startAnalytics();

    expect(inject).toHaveBeenCalledOnce();
  });
});
