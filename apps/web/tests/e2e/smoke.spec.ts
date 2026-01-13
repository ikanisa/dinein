import { test, expect } from '@playwright/test';

test('home loads and shows brand header', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByRole('heading', { name: /SACCO\+/i })).toBeVisible();
  await expect(page.locator('text=Protected by')).toBeVisible();
});

test('explore route is reachable', async ({ page }) => {
  await page.goto('/#/explore');
  await expect(page).toHaveURL(/explore/);
});
