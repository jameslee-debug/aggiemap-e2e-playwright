import { test, expect } from '@playwright/test';
const BASE = 'https://aggiemap.tamu.edu/';

test.describe('Sidebar Main', () => {
  test('Sidebar shows Layers/Legend on load', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(()=>{});

    const layers  = page.getByText(/^\s*Layers\s*$/i).first();
    const legend  = page.getByText(/^\s*Legend\s*$/i).first();
    const filters = page.getByText(/^\s*Filter(s)?\s*$/i).first();

    const anyVisible = async () =>
      (await layers.count()) || (await legend.count()) || (await filters.count());

    for (let i = 0; i < 5 && !(await anyVisible()); i++) {
      await page.waitForTimeout(300);
    }

    expect(await anyVisible()).toBeTruthy();

    if (await layers.count())  await expect.soft(layers).toBeVisible({ timeout: 5000 });
    if (await legend.count())  await expect.soft(legend).toBeVisible({ timeout: 5000 });
    if (await filters.count()) await expect.soft(filters).toBeVisible({ timeout: 5000 });
  });
});
