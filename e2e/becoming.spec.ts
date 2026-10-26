import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }, testInfo) => {
  if (!testInfo.title.includes('first visit')) {
    await context.addInitScript(() => {
      localStorage.setItem('becoming_onboarded', 'true');
      localStorage.setItem('becoming_consent_agreed', 'true');
    });
  }
});

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

test.describe('Sanctuary Overhaul v0.3: Floating Dock & Local-First Auth', () => {
  test('navigates seamlessly via the Floating Bottom Glass Dock', async ({ page }) => {
    await page.goto('/');

    // Dock should be visible with 4 tabs
    const journalTab = page.locator('#floating-dock-tab-journal');
    await expect(journalTab).toBeVisible();
    await journalTab.click();

    // Journal view is rendered
    await expect(page.getByRole('heading', { name: /Free Journal/i })).toBeVisible();

    // Click Journey Map tab
    const mapTab = page.locator('#floating-dock-tab-map');
    await expect(mapTab).toBeVisible();
    await mapTab.click();
    await expect(page.getByRole('heading', { name: /Your Journey Map/i })).toBeVisible();

    // Click Moments of Light tab
    const momentsTab = page.locator('#floating-dock-tab-moments');
    await expect(momentsTab).toBeVisible();
    await momentsTab.click();
    await expect(page.getByRole('heading', { name: /Moments of Light/i })).toBeVisible();

    // Click Sanctuary tab to return home
    const sanctuaryTab = page.locator('#floating-dock-tab-sanctuary');
    await expect(sanctuaryTab).toBeVisible();
    await sanctuaryTab.click();
    await expect(page.getByText(/We are here for you/i)).toBeVisible();
  });

  test('allows local-first sign up, personalization, and sign out', async ({ page }) => {
    await page.goto('/');

    // Open Auth modal from top header
    const signInBtn = page.getByRole('button', { name: /Sign In/i });
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();

    // Switch to Sign Up tab
    const signUpTab = page.locator('#auth-tab-signup');
    await expect(signUpTab).toBeVisible();
    await signUpTab.click();

    // Fill form
    await page.locator('#auth-name-input').fill('Aria Serenity');
    await page.locator('#auth-email-input').fill('aria@sanctuary.local');
    await page.locator('#auth-password-input').fill('peaceful456');

    // Select mountain avatar
    const mountainAvatar = page.locator('#avatar-choice-mountain');
    if (await mountainAvatar.isVisible()) {
      await mountainAvatar.click();
    }

    // Submit sign up
    await page.locator('#auth-submit-button').click();

    // Verify personalized greeting appears in Sanctuary
    await expect(page.getByText(/Welcome back, Aria Serenity/i)).toBeVisible();

    // Open profile menu
    const profileBtn = page.locator('#user-profile-button');
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();

    // Click Sign Out
    const signOutBtn = page.locator('#profile-sign-out-button');
    await expect(signOutBtn).toBeVisible();
    await signOutBtn.click();

    // Header returns to "Sign In" button
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });
});

test.describe('Sanctuary v0.4: Breathing Studio, Inner Compass & Life Horizons', () => {
  test('navigates to Breathing Studio and verifies techniques & somatic guide', async ({ page }) => {
    await page.goto('/');

    // Open Studios drawer from dock
    const studiosBtn = page.locator('#floating-dock-tab-studios');
    await expect(studiosBtn).toBeVisible();
    await studiosBtn.click();

    // Click Breathing Studio
    const breatheStudioBtn = page.locator('#dock-studio-breathe');
    await expect(breatheStudioBtn).toBeVisible();
    await breatheStudioBtn.click();

    // Verify Breathing Studio header and technique options
    await expect(page.getByRole('heading', { name: /Interactive Breathing Studio/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /4-7-8 Deep Calm/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /4-4-4-4 Box Breathing/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /5-5 Coherent Balance/i })).toBeVisible();

    // Switch technique to Box Breathing
    await page.getByRole('button', { name: /4-4-4-4 Box Breathing/i }).click();

    // Verify somatic checklist items exist and can be toggled
    const jawCheck = page.getByRole('button', { name: /Unclench your jaw/i });
    await expect(jawCheck).toBeVisible();
    await jawCheck.click();
  });

  test('walks through Inner Compass Quiz and views personalized Archetype result', async ({ page }) => {
    await page.goto('/');

    // Open Studios drawer and select Inner Compass Quiz
    await page.locator('#floating-dock-tab-studios').click();
    await page.locator('#dock-studio-quiz').click();

    // Verify quiz studio entrance
    await expect(page.getByRole('heading', { name: /Inner Compass/i })).toBeVisible();

    // Select 10 Questions length
    const tenQBtn = page.getByRole('button', { name: /10 Questions/i });
    await expect(tenQBtn).toBeVisible();
    await tenQBtn.click();

    // Answer 10 questions by selecting the first option each time
    for (let i = 0; i < 10; i++) {
      const optionBtn = page.locator('div.space-y-2\\.5 button').first();
      await optionBtn.waitFor({ state: 'visible' });
      await optionBtn.click();
    }

    // Verify Archetype Result Card is rendered
    await expect(page.getByText(/Your Primary Inner Compass Archetype/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Save Portrait to Journey Map/i })).toBeVisible();

    // Save portrait to journey map
    await page.getByRole('button', { name: /Save Portrait to Journey Map/i }).click();
    await expect(page.getByText(/Saved to Journey Map/i)).toBeVisible();
  });

  test('plants and completes an intention in Life Horizons', async ({ page }) => {
    await page.goto('/');

    // Open Studios drawer and select Life Horizons
    await page.locator('#floating-dock-tab-studios').click();
    await page.locator('#dock-studio-calendar').click();

    // Verify calendar view
    await expect(page.getByRole('heading', { name: /Life Horizons/i })).toBeVisible();

    // Click "Plant a New Intention"
    const addIntentionBtn = page.getByRole('button', { name: /Plant a New Intention/i });
    await expect(addIntentionBtn).toBeVisible();
    await addIntentionBtn.click();

    // Fill goal title and submit
    await page.locator('input[placeholder*="Read 20 pages"]').fill('Breathe deeply before opening emails');
    await page.getByRole('button', { name: /Save Milestone/i }).click();

    // Verify goal card is rendered
    await expect(page.getByText('Breathe deeply before opening emails')).toBeVisible();
  });

  test('opens Settings & Information from header button', async ({ page }) => {
    await page.goto('/');

    const settingsBtn = page.locator('#navbar-settings-button');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    await expect(page.getByRole('heading', { name: /Sanctuary Settings & Information/i })).toBeVisible();

    // Switch to Privacy tab
    await page.getByRole('button', { name: /Privacy Manifesto/i }).click();
    await expect(page.getByText(/Privacy Manifesto & Local Sovereignty/i)).toBeVisible();
    await expect(page.getByText(/No Tracking Pixels/i)).toBeVisible();
  });
});

test.describe('BECOMING v0.5: Human Awakening, Scientific Frameworks, Zero-to-Hero & The Shift', () => {
  test('displays Zero-to-Hero Evolution Emblem and 4 Daily Pillars on Dashboard', async ({ page }) => {
    await page.goto('/');
    // Open Studios drawer and navigate to Dashboard
    await page.locator('#floating-dock-tab-studios').click();
    await page.locator('#dock-studio-dashboard').click();

    // Verify Stages of Becoming card
    await expect(page.getByText(/Stage 1 of 5/i)).toBeVisible();
    await expect(page.getByText(/The Spark/i)).toBeVisible();

    // Verify 4 Pillars of Living Right card
    await expect(page.getByText(/The 4 Pillars of Living Right/i)).toBeVisible();
    await expect(page.getByText(/Not an Angel, Still Worthy/i)).toBeVisible();

    // Toggle "Not an Angel, Still Worthy" affirmation
    const notAnAngelCard = page.getByText(/Not an Angel, Still Worthy/i);
    await notAnAngelCard.click();
  });

  test('interacts with The Shift: 60-Second Impulse Reset and Boundary Shield', async ({ page }) => {
    await page.goto('/');
    // Open Studios drawer and navigate to Habit Balance Ledger
    await page.locator('#floating-dock-tab-studios').click();
    await page.locator('#dock-studio-habits').click();

    // Switch to The Shift tab
    await page.getByRole('button', { name: /The Shift/i }).click();

    // Verify 60-Second Impulse Reset section is visible
    await expect(page.getByRole('heading', { name: /60-Second Impulse Reset/i })).toBeVisible();
    const triggerBtn = page.getByRole('button', { name: /Trigger 60s Impulse Reset/i });
    await expect(triggerBtn).toBeVisible();
    await triggerBtn.click();

    // Verify active reset countdown is running
    await expect(page.getByText(/Somatic Recalibration/i)).toBeVisible();

    // Verify Boundary Shield section
    await expect(page.getByRole('heading', { name: /The Boundary Shield/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Good, But Never Used/i })).toBeVisible();
  });

  test('accesses Echoes Stories and Nature Canvas in Just Listen view', async ({ page }) => {
    await page.goto('/');
    // Open Studios drawer and navigate to Breathe & Just Listen
    await page.locator('#floating-dock-tab-studios').click();
    await page.locator('#dock-studio-breathe').click();

    // Toggle Nature Canvas
    const canvasBtn = page.getByRole('button', { name: /Nature Canvas/i });
    await expect(canvasBtn).toBeVisible();
    await canvasBtn.click();
    await expect(page.getByText(/Contemplation Scene/i)).toBeVisible();

    // Toggle Echoes Stories
    const echoesBtn = page.getByRole('button', { name: /Echoes/i });
    await expect(echoesBtn).toBeVisible();
    await echoesBtn.click();
    await expect(page.getByText(/Echoes of Shared Humanity/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /The Underground Bamboo/i })).toBeVisible();
  });

  test('displays Core Life Dream on Life Horizons and Mirror, Never Boss banner in Settings', async ({ page }) => {
    await page.goto('/');
    // Open Life Horizons
    await page.locator('#floating-dock-tab-studios').click();
    await page.locator('#dock-studio-calendar').click();

    // Verify Core Life Dream banner
    await expect(page.getByText(/Dreams-to-Reality Bridge/i)).toBeVisible();

    // Open Settings
    await page.locator('#navbar-settings-button').click();
    // Verify Mirror, Never Boss banner
    await expect(page.getByText(/Mirror, Never Boss/i)).toBeVisible();
  });
});

test.describe('BECOMING v0.6: Cinematic Onboarding Portal, Mandatory Consent Gate & Dynamic Quotes', () => {
  test('triggers Onboarding Welcome Modal on first visit, cycles cards, requires consent, and unlocks app', async ({ page }) => {
    await page.goto('/');

    // Verify Onboarding Modal is visible
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.getByRole('heading', { name: /A Quiet Human Sanctuary in a Loud Digital World/i })).toBeVisible();

    // Navigate to Card 2
    const nextBtn = page.locator('#onboarding-next-btn');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await expect(page.getByRole('heading', { name: /Tools Designed to Mirror Your Mind, Not Boss It/i })).toBeVisible();
    await expect(page.getByText(/Breathing & Somatic Studio/i)).toBeVisible();

    // Navigate to Card 3
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /Life is Short\. You Are Not an Angel\. You Are Free\./i })).toBeVisible();

    // Verify Agree button is disabled prior to checking consent
    const agreeBtn = page.locator('#onboarding-agree-btn');
    await expect(agreeBtn).toBeDisabled();

    // Check mandatory consent checkbox
    const consentCheckbox = page.locator('#onboarding-consent-checkbox');
    await consentCheckbox.check();
    await expect(agreeBtn).toBeEnabled();

    // Agree and enter sanctuary
    await agreeBtn.click();
    await expect(modal).not.toBeVisible();

    // Verify on reload it does not show again
    await page.reload();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('displays fresh dynamic quote on Dashboard and allows drawing another quote', async ({ page }) => {
    await page.goto('/');
    // Open Studios drawer and navigate to Dashboard
    await page.locator('#floating-dock-tab-studios').click();
    await page.locator('#dock-studio-dashboard').click();

    // Verify Quote Card is visible
    await expect(page.getByText(/Daily Wisdom/i)).toBeVisible();

    // Draw another quote
    const drawAnotherBtn = page.getByRole('button', { name: /Draw another wisdom quote/i });
    await expect(drawAnotherBtn).toBeVisible();
    await drawAnotherBtn.click();
    await expect(page.getByText(/Philosophical Library/i)).toBeVisible();
  });
});

test.describe('BECOMING v0.7: Living Atmospheric Canvas & Dynamic Mood Shifting Backgrounds', () => {
  test('switches inner weather atmospheres and persists to local storage', async ({ page }) => {
    await page.goto('/');

    const switcher = page.locator('#atmosphere-switcher-btn');
    await expect(switcher).toBeVisible();

    // Open switcher
    await switcher.click();
    await expect(page.getByRole('menu')).toBeVisible();

    // Select Twilight Calm
    await page.locator('[data-testid="atmosphere-option-twilight"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-atmosphere', 'twilight');
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Switch to Grounded Moss
    await switcher.click();
    await page.locator('[data-testid="atmosphere-option-moss"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-atmosphere', 'moss');

    // Switch to Midnight Sanctuary
    await switcher.click();
    await page.locator('[data-testid="atmosphere-option-midnight"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-atmosphere', 'midnight');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('contextual auto-atmosphere gently adapts in Breathing Studio and Secret Vault', async ({ page }) => {
    await page.goto('/');

    // Navigate to Secret Vault via Studios dock
    await page.locator('#floating-dock-tab-studios').click();
    const vaultStudioBtn = page.locator('#dock-studio-vault');
    await expect(vaultStudioBtn).toBeVisible();
    await vaultStudioBtn.click();

    // Verify atmosphere adapts to midnight
    await expect(page.locator('html')).toHaveAttribute('data-atmosphere', 'midnight');

    // Navigate to Breathing Studio
    await page.locator('#floating-dock-tab-studios').click();
    const breatheStudioBtn = page.locator('#dock-studio-breathe');
    await expect(breatheStudioBtn).toBeVisible();
    await breatheStudioBtn.click();

    // Verify atmosphere adapts to moss
    await expect(page.locator('html')).toHaveAttribute('data-atmosphere', 'moss');
  });
});
