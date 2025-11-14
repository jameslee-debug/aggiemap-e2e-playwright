import { test, expect, Page } from '@playwright/test';
const BASE = 'https://aggiemap.tamu.edu/';

async function clickFirstAvailable(page: Page, locators: ReturnType<Page['locator'] | Page['getByRole'] | Page['getByText']>[]) {
  for (const loc of locators) {
    if (await (loc as any).count?.()) {
      try {
        await (loc as any).first?.().click({ timeout: 3000 });
        return true;
      } catch {}
    }
  }
  return false;
}

test.describe('Sidebar Directions', () => {
  test('Directions panel opens and inputs are visible', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(()=>{});

    const fromCandidates = [
      page.getByPlaceholder(/From|Start|Origin/i).first(),
      page.getByRole('textbox', { name: /From|Start|Origin/i }).first(),
      page.locator('[aria-label*="From" i],[aria-label*="Start" i],[aria-label*="Origin" i]').first(),
    ];
    const toCandidates = [
      page.getByPlaceholder(/To|End|Destination/i).first(),
      page.getByRole('textbox', { name: /To|End|Destination/i }).first(),
      page.locator('[aria-label*="To" i],[aria-label*="End" i],[aria-label*="Destination" i]').first(),
    ];

    const visible = async (loc: any) => (await loc.count?.()) && await loc.isVisible().catch(()=>false);
    const anyFrom = async () => await visible(fromCandidates[0]) || await visible(fromCandidates[1]) || await visible(fromCandidates[2]);
    const anyTo   = async () => await visible(toCandidates[0])   || await visible(toCandidates[1])   || await visible(toCandidates[2]);

    if (!(await anyFrom()) || !(await anyTo())) {
      const openTries = [
        page.getByRole('button', { name: /Directions|Route|Routing|Navigate/i }),
        page.getByText(/^\s*Directions\s*$/i),
        page.locator('[aria-label*="direction" i],[aria-label*="route" i],[title*="Directions" i],[title*="Route" i]'),
        page.locator('a[href*="directions" i],button:has-text("Directions")'),
      ];

      let opened = await clickFirstAvailable(page, openTries);
      if (!opened) {
        const menuTries = [
          page.getByRole('button', { name: /Menu|Open menu|Options|More/i }),
          page.locator('[aria-label*="menu" i],[aria-label*="options" i],[title*="menu" i]').first(),
          page.locator('header button,[class*="toolbar" i] button,[class*="top" i] button').first(),
        ];
        await clickFirstAvailable(page, menuTries);
        opened = await clickFirstAvailable(page, openTries);
      }

      await page.waitForTimeout(500);
    }

    const from =
      (await fromCandidates[0].count()) ? fromCandidates[0] :
      (await fromCandidates[1].count()) ? fromCandidates[1] : fromCandidates[2];

    const to =
      (await toCandidates[0].count()) ? toCandidates[0] :
      (await toCandidates[1].count()) ? toCandidates[1] : toCandidates[2];

    await expect(from).toBeVisible({ timeout: 15000 });
    await expect(to).toBeVisible({ timeout: 15000 });
  });
});
