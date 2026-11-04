import { test, expect } from '@playwright/test';

test('AI stays off, removes legacy browser key and records only explicit preference', async ({page}) => {
  await page.addInitScript(() => {
    localStorage.setItem('becoming_onboarded','true');
    localStorage.setItem('becoming_consent_agreed','true');
    sessionStorage.setItem('becoming_locale_v1','en');
    localStorage.setItem('becoming_ai_settings_v1', JSON.stringify({enabled:true,apiKey:'legacy-test-secret',endpoint:'https://test.invalid'}));
  });
  await page.goto('/');
  const open = page.locator('button[aria-label="Open sanctuary controls"]');
  await open.click();
  await page.locator('#mobile-sanctuary-menu').locator('button').filter({hasText:/settings/i}).first().click();
  await page.getByRole('button',{name:'Configure API Bridge'}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('BECOMING works without AI. Choosing AI is entirely optional.')).toBeVisible();
  const consent = dialog.getByRole('checkbox');
  await expect(consent).not.toBeChecked();
  await consent.check();
  await dialog.getByRole('button',{name:'Save preference'}).click();
  await expect(dialog).not.toBeVisible();
  const stored = await page.evaluate(() => ({
    current: localStorage.getItem('becoming_ai_settings_v2') || sessionStorage.getItem('becoming_ai_settings_v2'),
    legacyLocal: localStorage.getItem('becoming_ai_settings_v1'),
    legacySession: sessionStorage.getItem('becoming_ai_settings_v1'),
  }));
  expect(stored.legacyLocal).toBeNull();
  expect(stored.legacySession).toBeNull();
  expect(JSON.parse(stored.current||'{}')).toEqual({enabled:true});
  await page.reload();
  await page.locator('button[aria-label="Open sanctuary controls"]').click();
  await page.locator('#mobile-sanctuary-menu').locator('button').filter({hasText:/settings/i}).first().click();
  await page.getByRole('button',{name:'Configure API Bridge'}).click();
  await expect(page.getByRole('dialog').getByRole('checkbox')).toBeChecked();
});
