import { test, expect } from '@playwright/test';

const cases = [
  {locale:'en', title:'Sanctuary Settings & Information', warning:'Not medical advice or professional coaching'},
  {locale:'ar', title:'إعدادات التطبيق ومعلوماته', warning:'ليس استشارة طبية أو تدريباً مهنياً'},
  {locale:'fr', title:'Paramètres et informations du sanctuaire', warning:'Ni conseil médical ni coaching professionnel'},
  {locale:'es', title:'Ajustes e información del espacio', warning:'No es asesoramiento médico ni coaching profesional'},
  {locale:'it', title:'Impostazioni e informazioni', warning:'Non è consulenza medica né coaching professionale'},
] as const;

for (const data of cases) {
 test(`beta settings copy ${data.locale} mobile`, async ({page}) => {
  await page.addInitScript(locale=>{
   localStorage.setItem('becoming_onboarded','true');
   localStorage.setItem('becoming_consent_agreed','true');
   sessionStorage.setItem('becoming_locale_v1',locale);
  },data.locale);
  await page.goto('/');
  const menu = page.locator('#mobile-sanctuary-menu');
  const open = page.locator('button[aria-label="Open sanctuary controls"]');
  await open.click();
  await expect(menu).toBeVisible();
  await menu.locator('button').filter({hasText:/settings|paramètres|ajustes|impostazioni|الإعدادات/i}).first().click();
  await expect(page.getByRole('heading',{name:data.title})).toBeVisible();
  await expect(page.getByText(data.warning).first()).toBeVisible();
  const dir = await page.locator('html').getAttribute('dir');
  expect(dir).toBe(data.locale==='ar'?'rtl':'ltr');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+3)).toBe(true);
 });
}
