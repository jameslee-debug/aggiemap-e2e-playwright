import { test, expect } from '@playwright/test';

const BASE = 'https://aggiemap.tamu.edu/';

test.describe('App Shell & Navigation', () => {
  test('Home page loads correctly', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    // 1) 타이틀
    await expect(page).toHaveTitle(/Aggie\s*Map/i, { timeout: 15000 });

    // 2) URL 패턴 (/map 또는 /map/d 포함 허용)
    await expect(page).toHaveURL(/aggiemap\.tamu\.edu\/(?:map(?:\/d)?\/?)?/, { timeout: 15000 });

    // 3) 검색창 (placeholder/aria-label/role 어떤 형태든 잡히게)
    const search = page.locator(
      'input[placeholder*="Find"][placeholder*="Parking" i],' +        // placeholder
      '[aria-label*="Find"][aria-label*="Parking" i],' +               // aria-label
      '[role="search"] input, input[type="search"]'                    // role/type
    ).first();
    await expect(search).toBeVisible({ timeout: 15000 });

    // 4) 지도 캔버스(보통 canvas로 렌더됨)
    const mapCanvas = page.locator('canvas, .maplibregl-canvas, .mapboxgl-canvas, .leaflet-canvas').first();
    await expect(mapCanvas).toBeVisible({ timeout: 15000 });
  });
});
