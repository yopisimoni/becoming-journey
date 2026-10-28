import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('becoming_onboarded','true');
    localStorage.setItem('becoming_consent_agreed','true');
  });
});

async function auth(page: Page, mode: 'signup'|'signin', name: string, email: string) {
  await page.getByRole('button', { name: 'Open sanctuary controls' }).click();
  await page.locator('#mobile-auth-button').click();
  await page.locator(mode === 'signup' ? '#auth-tab-signup' : '#auth-tab-signin').click();
  if (mode === 'signup') await page.locator('#auth-name-input').fill(name);
  await page.locator('#auth-email-input').fill(email);
  await page.locator('#auth-password-input').fill('test-pass-012345');
  await page.locator('#auth-submit-button').click();
  await expect(page.locator('#auth-submit-button')).toHaveCount(0);
}
async function signOut(page: Page) {
  await page.getByRole('button', { name: 'Open sanctuary controls' }).click();
  await page.locator('#mobile-auth-button').click();
}

test('real local sign-up and sign-in: A B guest A activities remain separated', async ({ page }) => {
  await page.goto('/');
  await auth(page,'signup','Tester A','test-a@example.invalid');
  await page.getByRole('button',{name:'Try it offline'}).click();
  await page.getByRole('button',{name:'I tried it'}).click();
  await page.getByLabel('Optional reflection').fill('TEST_PRIVATE_A');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await signOut(page);
  await auth(page,'signup','Tester B','test-b@example.invalid');
  await page.getByRole('button',{name:'Journey Map'}).click();
  await expect(page.getByText('TEST_PRIVATE_A')).toHaveCount(0);
  await page.getByRole('button',{name:'Sanctuary',exact:true}).click();
  await page.getByRole('button',{name:'Try it offline'}).click();
  await page.getByRole('button',{name:'I tried it'}).click();
  await page.getByLabel('Optional reflection').fill('TEST_PRIVATE_B');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await signOut(page);
  await page.getByRole('button',{name:'Journey Map'}).click();
  await expect(page.getByText('TEST_PRIVATE_A')).toHaveCount(0);
  await expect(page.getByText('TEST_PRIVATE_B')).toHaveCount(0);
  await page.getByRole('button',{name:'Sanctuary',exact:true}).click();
  await auth(page,'signin','Tester A','test-a@example.invalid');
  await page.getByRole('button',{name:'Journey Map'}).click();
  await expect(page.getByText('TEST_PRIVATE_A')).toBeVisible();
  await expect(page.getByText('TEST_PRIVATE_B')).toHaveCount(0);
});
