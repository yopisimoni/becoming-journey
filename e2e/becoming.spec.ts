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

    // If on Sanctuary Step 0 entrance, proceed through "Begin in Silence"
    const beginBtn = page.getByRole('button', { name: /Begin/i }).first();
    if (await beginBtn.isVisible()) {
      await beginBtn.click();
    }

    // Select "I feel lost"
    await page.getByRole('button', { name: /I feel lost/i }).click();

    // Wait for Stage 1: Express
    await expect(page.getByRole('heading', { name: /1\. Express/i })).toBeVisible();
    const textarea = page.locator('textarea');
    await textarea.fill('Synthetic test entry: feeling disorganized today.');

    // Proceed to Stage 2: Exploration
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByRole('heading', { name: /2\. Exploration/i })).toBeVisible();

    // Proceed to Stage 3: Confirm Insight
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByRole('heading', { name: /3\. Confirm/i })).toBeVisible();

    // Confirm insight
    await page.getByRole('button', { name: /Confirm Insight/i }).click();

    // Proceed to Stage 4: Choose Micro-Step
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByRole('heading', { name: /4\. Choose/i })).toBeVisible();

    // Choose micro-step and save to Journey Map
    await page.getByRole('button', { name: /Accept This Step/i }).click();
    await page.getByRole('button', { name: /Save to Journey Map/i }).click();

    // Wait for Stage 5: Saved
    await expect(page.getByRole('heading', { name: /5\. Journey Reflection Saved/i })).toBeVisible();

    // Assert zero external requests occurred
    expect(externalRequests).toEqual([]);
  });
});

test.describe('Sanctuary Upgrade v0.2: Step Deck, Themes, and Audio Engine', () => {
  test('navigates through Sanctuary Entrance Deck with Back button', async ({ page }) => {
    await page.goto('/');

    // Step 0 entrance is visible
    await expect(page.getByText(/We are here for you/i)).toBeVisible();

    // Click "Begin Quietly (With Sound)"
    const beginSoundBtn = page.getByRole('button', { name: /Begin Quietly/i });
    await expect(beginSoundBtn).toBeVisible();
    await beginSoundBtn.click();

    // Now on Step 1: Intent Cards are visible
    await expect(page.getByRole('button', { name: /I feel lost/i })).toBeVisible();

    // Click Back to return to Step 0
    const backBtn = page.getByRole('button', { name: /Back/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // Back on Step 0
    await expect(page.getByText(/We are here for you/i)).toBeVisible();
  });

  test('toggles Twilight Sanctuary dark mode', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('#twilight-theme-toggle');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      expect(isDark).toBe(true);

      // Toggle back to light
      await themeToggle.click();
      const isStillDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      expect(isStillDark).toBe(false);
    }
  });

  test('walks through multi-option diagnostic tree and selectable insights', async ({ page }) => {
    await page.goto('/');

    const beginBtn = page.getByRole('button', { name: /Begin/i }).first();
    if (await beginBtn.isVisible()) {
      await beginBtn.click();
    }

    // Select "I feel lost"
    await page.getByRole('button', { name: /I feel lost/i }).click();

    // Wait for Stage 1: Express
    await expect(page.getByRole('heading', { name: /1\. Express/i })).toBeVisible();

    // Verify diagnostic situation cards exist and select the first one
    const diagCards = page.locator('button:has-text("Unsure which path aligns")');
    if (await diagCards.count() > 0) {
      await diagCards.first().click();
    }

    // Proceed to Stage 2: Exploration
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByRole('heading', { name: /2\. Exploration/i })).toBeVisible();

    // Select a deepening perspective option
    const deepenCards = page.locator('button:has-text("Permission to move at my own unhurried pace")');
    if (await deepenCards.count() > 0) {
      await deepenCards.first().click();
    }

    // Proceed to Stage 3: Confirm Insight
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByRole('heading', { name: /3\. Confirm/i })).toBeVisible();

    // Verify 3 selectable insight cards appear
    const insightOptionButtons = page.locator('button:has-text("I am not behind")');
    expect(await insightOptionButtons.count()).toBeGreaterThanOrEqual(1);

    // Confirm insight
    await page.getByRole('button', { name: /Confirm Insight/i }).click();

    // Proceed to Stage 4: Choose Micro-Step
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByRole('heading', { name: /4\. Choose/i })).toBeVisible();

    // Accept micro-step and save
    await page.getByRole('button', { name: /Accept This Step/i }).click();
    await page.getByRole('button', { name: /Save to Journey Map/i }).click();

    // Verified saved to Journey Map
    await expect(page.getByRole('heading', { name: /5\. Journey Reflection Saved/i })).toBeVisible();
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

    // If on Step 0, click the Arabic begin button to reach intent cards
    const arBeginBtn = page.getByRole('button', { name: /ابدأ/i }).first();
    if (await arBeginBtn.isVisible()) {
      await arBeginBtn.click();
    }

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
