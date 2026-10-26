import { test, expect } from '@playwright/test';

test.describe('BCM-012: Privacy & Zero-Telemetry Network Audit', () => {
  test('makes ZERO external network requests during entire reflection flow', async ({
    page,
  }) => {
    const externalRequests: string[] = [];

    page.on('request', (request) => {
      const url = new URL(request.url());
      // Whitelist only localhost / current origin
      if (
        url.hostname !== 'localhost' &&
        url.hostname !== '127.0.0.1' &&
        !url.protocol.startsWith('data:') &&
        !url.protocol.startsWith('blob:')
      ) {
        externalRequests.push(request.url());
      }
    });

    await page.goto('/');

    // Verify main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Select "I feel lost"
    await page.getByRole('button', { name: /I feel lost/i }).click();

    // Fill expression
    const textarea = page.locator('textarea');
    await textarea.fill('Synthetic test entry: feeling disorganized today.');

    // Step through cognitive loop
    await page.getByRole('button', { name: /Continue/i }).click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Confirm insight
    await page.getByRole('button', { name: /Confirm Insight/i }).click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Choose micro-step and save
    await page.getByRole('button', { name: /Accept This Step/i }).click();
    await page.getByRole('button', { name: /Save to Journey Map/i }).click();

    // Assert zero external requests occurred
    expect(externalRequests).toEqual([]);
  });
});

test.describe('BCM-004: Multilingual & Arabic RTL', () => {
  test('switching to Arabic sets dir="rtl" on html root', async ({ page }) => {
    await page.goto('/');

    const menuBtn = page.getByRole('button', { name: /Toggle navigation menu/i });
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.locator('#mobile-lang-select').selectOption('ar');
    } else {
      await page.locator('header select').first().selectOption('ar');
    }

    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');

    // Verify Arabic content is displayed
    await expect(page.getByText('أشعر بالضياع')).toBeVisible();
  });
});

test.describe('BCM-003: Responsive Layouts & Accessibility', () => {
  test('renders properly without horizontal overflow across screen sizes', async ({
    page,
  }) => {
    await page.goto('/');

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });
});
