import { test, expect } from '@playwright/test';

test('new visitor can onboard, begin, explore and reach journey map without horizontal overflow', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/A calm space to understand yourself/i})).toBeVisible();
  for (let i=0; i<4; i++) await page.locator('#onboarding-next-btn').click();
  await page.locator('#onboarding-consent-checkbox').check();
  await page.locator('#onboarding-agree-btn').click();
  await expect(page.getByRole('heading',{name:'Discover something good for today'})).toBeVisible();
  await page.getByRole('button',{name:'Begin in Silence'}).click();
  await expect(page.getByRole('button',{name:/I feel lost/i})).toBeVisible();
  await page.getByRole('button',{name:'Journey Map'}).click();
  await expect(page.getByRole('heading',{name:'Your real-life discoveries'})).toBeVisible();
  await page.getByRole('button',{name:'Sanctuary',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Discover something good for today'})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3);
  expect(overflow).toBe(false);
});
