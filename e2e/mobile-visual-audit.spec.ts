import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('becoming_onboarded', 'true');
    localStorage.setItem('becoming_consent_agreed', 'true');
  });
});

for (const theme of ['light','twilight'] as const) {
  test(`mobile visual audit ${theme}`, async ({ page }, testInfo) => {
    await page.goto('/');
    if (theme === 'twilight') {
      await page.getByRole('button',{name:'Open sanctuary controls'}).click();
      await page.locator('#mobile-twilight-toggle').click();
      await page.getByRole('button',{name:'Close sanctuary controls'}).click();
    }
    const path = `test-results/audit-${testInfo.project.name.replace(/\W+/g,'-')}-${theme}.png`;
    await page.screenshot({path,fullPage:true,animations:'disabled'});
    const overflows = await page.evaluate(() => Array.from(document.querySelectorAll('main *, header *, nav *')).filter(el => {
      const r=el.getBoundingClientRect();
      return r.width > 0 && (r.left < -3 || r.right > window.innerWidth + 3) && getComputedStyle(el).position !== 'absolute';
    }).slice(0,12).map(el=>({tag:el.tagName, className:String(el.className).slice(0,70),text:el.textContent?.slice(0,40)})));
    console.log(JSON.stringify({viewport:testInfo.project.name,theme,overflows}));
    expect(overflows).toEqual([]);
    await page.getByRole('button',{name:'Open sanctuary controls'}).click();
    await expect(page.getByRole('dialog',{name:'Sanctuary controls'})).toBeVisible();
    await page.screenshot({path:`test-results/menu-${testInfo.project.name.replace(/\W+/g,'-')}-${theme}.png`,animations:'disabled'});
    const menuIssues = await page.locator('#mobile-sanctuary-menu').evaluate(menu => ({
      scrollable: menu.scrollHeight <= menu.clientHeight || getComputedStyle(menu).overflowY === 'auto',
      clipping: Array.from(menu.querySelectorAll('button, span, label')).filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 4 && getComputedStyle(el).textOverflow !== 'ellipsis').map(el => el.textContent?.trim().slice(0,45)).slice(0,8),
    }));
    expect(menuIssues.scrollable).toBe(true);
    expect(menuIssues.clipping).toEqual([]);
  });
}
