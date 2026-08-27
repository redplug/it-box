import { expect, test } from '@playwright/test';

test.describe('Tool - Token generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/token-generator');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle(/ - it-box$/);
  });

  test('New token on refresh', async ({ page }) => {
    const tokenOutput = page.getByTestId('token-output');
    const initialToken = await tokenOutput.inputValue();
    await page.getByRole('button', { name: /Refresh|새로 생성/ }).click();
    const newToken = await tokenOutput.inputValue();

    expect(newToken).not.toEqual(initialToken);
  });
});
