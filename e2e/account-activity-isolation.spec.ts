import { test, expect } from '@playwright/test';

// Simulate authenticated identities using the same persisted profile representation
// consumed by AppContext at startup. No live accounts or external service involved.
test('A → B → guest → A: private activity history remains scoped', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('becoming_onboarded', 'true');
    localStorage.setItem('becoming_consent_agreed', 'true');
    localStorage.setItem('becoming_storage_mode_v1', 'local');
    localStorage.setItem('becoming_activity_journey_v1_A', JSON.stringify([{ id:'calm-breathe', title:'PRIVATE_A_ONLY', date: new Date().toISOString() }]));
    localStorage.setItem('becoming_activity_journey_v1_B', JSON.stringify([{ id:'calm-breathe', title:'PRIVATE_B_ONLY', date: new Date().toISOString() }]));
    localStorage.setItem('becoming_activity_journey_v1', JSON.stringify([{ id:'calm-breathe', title:'GUEST_ONLY', date: new Date().toISOString() }]));
  });
  const switchIdentity = async (id: string | null) => {
    await page.evaluate((identity) => {
      if (identity) {
        localStorage.setItem('becoming_active_user_v1', JSON.stringify({ id:identity, name:identity, email:identity+'@example.invalid', avatar:'lotus', createdAt:new Date().toISOString(), isGuest:false, authProvider:'local' }));
      } else {
        localStorage.removeItem('becoming_active_user_v1');
      }
    }, id);
    await page.reload();
    await page.getByRole('button', {name:'Journey Map'}).click();
  };
  for (const [identity, expected, forbidden] of [
    ['A','PRIVATE_A_ONLY',['PRIVATE_B_ONLY','GUEST_ONLY']],
    ['B','PRIVATE_B_ONLY',['PRIVATE_A_ONLY','GUEST_ONLY']],
    [null,'GUEST_ONLY',['PRIVATE_A_ONLY','PRIVATE_B_ONLY']],
    ['A','PRIVATE_A_ONLY',['PRIVATE_B_ONLY','GUEST_ONLY']],
  ] as const) {
    await switchIdentity(identity);
    await expect(page.getByText(expected)).toBeVisible();
    for (const other of forbidden) await expect(page.getByText(other)).toHaveCount(0);
  }
});

test('guest Session storage never displays persistent Local activity', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('becoming_onboarded', 'true');
    localStorage.setItem('becoming_consent_agreed', 'true');
    localStorage.setItem('becoming_storage_mode_v1', 'session');
    localStorage.removeItem('becoming_active_user_v1');
    localStorage.setItem('becoming_activity_journey_v1', JSON.stringify([{id:'rest-silence',title:'LOCAL_SECRET',date:new Date().toISOString()}]));
    sessionStorage.setItem('becoming_activity_journey_v1', JSON.stringify([{id:'rest-silence',title:'SESSION_VISIBLE',date:new Date().toISOString()}]));
  });
  await page.reload();
  await page.getByRole('button', {name:'Journey Map'}).click();
  await expect(page.getByText('SESSION_VISIBLE')).toBeVisible();
  await expect(page.getByText('LOCAL_SECRET')).toHaveCount(0);
});
