import { test, expect } from '@playwright/test';

const cases = [
  {locale:'ar', heading:'اكتشف شيئاً مفيداً اليوم', activity:'استراحة تنفس هادئة', cta:'سأجربها'},
  {locale:'fr', heading:'Découvrez une activité pour aujourd’hui', activity:'Une pause pour respirer', cta:'Essayer hors ligne'},
  {locale:'es', heading:'Descubre algo bueno para hoy', activity:'Una pausa para respirar', cta:'Probar sin conexión'},
  {locale:'it', heading:'Scopri qualcosa di bello oggi', activity:'Una pausa per respirare', cta:'Prova senza connessione'},
] as const;

for (const data of cases) {
  test(`Discover respects locale ${data.locale}`, async ({ page }) => {
    await page.addInitScript(locale => {
      sessionStorage.setItem('becoming_locale_v1', locale);
      localStorage.setItem('becoming_onboarded','true');
      localStorage.setItem('becoming_consent_agreed','true');
    }, data.locale);
    await page.goto('/');
    await expect(page.getByRole('heading',{name:data.heading})).toBeVisible();
    await expect(page.getByRole('heading',{name:data.activity})).toBeVisible();
    await expect(page.getByRole('button',{name:data.cta})).toBeVisible();
  });
}
