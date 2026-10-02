import { expect, test } from '@playwright/test';

test.describe('Tool - Token generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/token-generator');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle(/ - it-box$/);
  });

  test('New token on refresh', async ({ page }) => {
    const token = page.locator('.token-display textarea');
    await expect(token).not.toHaveValue('');
    const initialToken = await token.inputValue();
    await page.getByRole('button', { name: '새로 생성' }).click();
    await expect(token).not.toHaveValue(initialToken);
  });
});
