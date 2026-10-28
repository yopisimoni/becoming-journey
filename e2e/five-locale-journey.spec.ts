import {test,expect} from '@playwright/test';
const locales=[
 {id:'en',heading:'Discover something good for today',activity:'A gentle breathing pause'},
 {id:'ar',heading:'اكتشف شيئاً مفيداً اليوم',activity:'استراحة تنفس هادئة'},
 {id:'fr',heading:'Découvrez une activité pour aujourd’hui',activity:'Une pause pour respirer'},
 {id:'es',heading:'Descubre algo bueno para hoy',activity:'Una pausa para respirar'},
 {id:'it',heading:'Scopri qualcosa di bello oggi',activity:'Una pausa per respirare'},
] as const;
for(const data of locales){
 test(`locale ${data.id} home to journey map and back`,async({page})=>{
  await page.addInitScript(id=>{
   localStorage.setItem('becoming_onboarded','true');localStorage.setItem('becoming_consent_agreed','true');
   sessionStorage.setItem('becoming_locale_v1',id);
  },data.id);
  await page.goto('/');
  await expect(page.getByRole('heading',{name:data.heading})).toBeVisible();
  await expect(page.getByRole('heading',{name:data.activity})).toBeVisible();
  await page.locator('#floating-dock-tab-map').click();
  await expect(page.locator('section[aria-label="Activities I tried"]')).toBeVisible();
  await page.locator('#floating-dock-tab-sanctuary').click();
  await expect(page.getByRole('heading',{name:data.heading})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3)).toBe(true);
 });
}
