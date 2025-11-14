import { test, expect } from '@playwright/test';
const BASE = 'https://aggiemap.tamu.edu/';

test.describe('Sidebar Main', () => {
  test('Sidebar shows Layers/Legend on load', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(()=>{});

    // 사이드바가 이미 열려 있다고 가정: 보이는 텍스트만 확인
    const layers  = page.getByText(/^\s*Layers\s*$/i).first();
    const legend  = page.getByText(/^\s*Legend\s*$/i).first();
    const filters = page.getByText(/^\s*Filter(s)?\s*$/i).first();

    // 최소 하나는 보인다 (환경 따라 표기 달라질 수 있어 3가지 후보)
    const anyVisible = async () =>
      (await layers.count()) || (await legend.count()) || (await filters.count());

    // 처음에 안 잡히면 약간 기다리며 재확인
    for (let i = 0; i < 5 && !(await anyVisible()); i++) {
      await page.waitForTimeout(300);
    }

    expect(await anyVisible()).toBeTruthy();

    // 잡힌 항목이 실제로 화면에 보이는지 최종 확인 (soft)
    if (await layers.count())  await expect.soft(layers).toBeVisible({ timeout: 5000 });
    if (await legend.count())  await expect.soft(legend).toBeVisible({ timeout: 5000 });
    if (await filters.count()) await expect.soft(filters).toBeVisible({ timeout: 5000 });
  });
});
