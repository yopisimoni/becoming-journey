import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('becoming_onboarded', 'true');
    localStorage.setItem('becoming_consent_agreed', 'true');
  });
});

test('activity flow respects session privacy and preserves repeated attempts', async ({ page }) => {
  await page.goto('/');
  const discovery = page.getByRole('heading', { name: 'Discover something good for today' });
  await expect(discovery).toBeVisible();

  const tryButton = page.getByRole('button', { name: 'Try it offline' });
  const originalTitle = await page.locator('section').filter({ has: discovery }).getByRole('heading', { level: 3 }).first().textContent();
  await tryButton.click();
  await page.getByRole('button', { name: 'I tried it' }).click();
  await expect(page.getByText('You gave it a try. What next?')).toBeVisible();
  await page.getByLabel('Optional reflection').fill('I noticed something helpful.');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  const first = await page.evaluate(() => ({
    session: JSON.parse(sessionStorage.getItem('becoming_activity_journey_v1') || '[]'),
    persistent: localStorage.getItem('becoming_activity_journey_v1'),
  }));
  expect(first.session).toHaveLength(1);
  expect(first.session[0].reflection).toBe('I noticed something helpful.');
  expect(first.persistent).toBeNull();

  // Cycle until the original activity returns, then record a second attempt.
  for (let i = 0; i < 6; i++) {
    const currentTitle = await page.locator('section').filter({ has: discovery }).getByRole('heading', { level: 3 }).first().textContent();
    if (currentTitle === originalTitle) break;
    await page.getByRole('button', { name: 'Another idea' }).click();
  }
  await expect(page.locator('section').filter({ has: discovery }).getByRole('heading', { level: 3 }).first()).toHaveText(originalTitle || '');
  await page.getByRole('button', { name: 'Try it offline' }).click();
  await page.getByRole('button', { name: 'I tried it' }).click();
  await page.getByRole('button', { name: 'Finish for now' }).click();

  const repeated = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('becoming_activity_journey_v1') || '[]')
  );
  expect(repeated).toHaveLength(2);
  expect(repeated[0].id).toBe(repeated[1].id);
  expect(repeated[1].reflection).toBe('I noticed something helpful.');
});
