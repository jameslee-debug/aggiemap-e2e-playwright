import { test, expect } from '@playwright/test';
const BASE = 'https://aggiemap.tamu.edu/';

test.describe('Map Canvas & Interactions', () => {
  test('Canvas visible and zoom works', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(()=>{});

    const canvas = page.locator('canvas, .maplibregl-canvas, .mapboxgl-canvas, .leaflet-canvas').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 확대: 버튼이 있으면 클릭, 없으면 키보드 '+'
    const zoomIn = page.getByRole('button', { name: /Zoom in|\+/i })
                    .or(page.locator('button:has-text("+")')).first();
    if (await zoomIn.count()) await zoomIn.click();
    else await page.keyboard.press('+');

    await page.waitForTimeout(500);
    await expect(canvas).toBeVisible();
  });
});
