import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { OnboardingWelcomeModal } from '@/components/OnboardingWelcomeModal';

function OnboardingHarness({ autoOpen = true }: { autoOpen?: boolean }) {
  const { setOnboardingOpen } = useApp();

  React.useEffect(() => {
    if (autoOpen) {
      setOnboardingOpen(true);
    }
  }, [autoOpen, setOnboardingOpen]);

  return <OnboardingWelcomeModal />;
}

describe('v0.9.1: Cinematic 5-Step First-Time Onboarding Experience', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders Step 1 (Cinematic Motion Intro) on first opening', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /BECOMING/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /A calm space to understand yourself/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Step into an unhurried digital sanctuary/i)
    ).toBeInTheDocument();

    const nextBtn = document.getElementById('onboarding-next-btn');
    expect(nextBtn).toBeInTheDocument();
  });

  it('progresses to Step 2 (Language Selection) and updates locale & RTL immediately', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    // Advance to Step 2
    fireEvent.click(document.getElementById('onboarding-next-btn')!);

    expect(
      screen.getByRole('heading', { name: /Choose your language/i })
    ).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Italiano')).toBeInTheDocument();

    // Select Arabic
    const arabicBtn = screen.getByTestId('onboarding-language-ar');
    fireEvent.click(arabicBtn);

    // Document element should be RTL
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBe('ar');

    // Switch back to English
    const englishBtn = screen.getByTestId('onboarding-language-en');
    fireEvent.click(englishBtn);
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  it('progresses to Step 3 (Gender / Addressing Preference) and persists choice locally', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    // Step 1 -> Step 2
    fireEvent.click(document.getElementById('onboarding-next-btn')!);
    // Step 2 -> Step 3
    fireEvent.click(document.getElementById('onboarding-next-btn')!);

    expect(
      screen.getByRole('heading', {
        name: /How Would You Like Us to Address You\?/i,
      })
    ).toBeInTheDocument();

    const manOption = screen.getByTestId('onboarding-gender-man');
    const womanOption = screen.getByTestId('onboarding-gender-woman');
    const neutralOption = screen.getByTestId('onboarding-gender-unspecified');

    expect(manOption).toBeInTheDocument();
    expect(womanOption).toBeInTheDocument();
    expect(neutralOption).toBeInTheDocument();

    // Select woman
    fireEvent.click(womanOption);
    expect(localStorage.getItem('becoming_addressing_preference')).toBe('woman');

    // Select neutral
    fireEvent.click(neutralOption);
    expect(localStorage.getItem('becoming_addressing_preference')).toBe('unspecified');
  });

  it('progresses to Step 4 (About the App) explaining gentle morning-to-night support', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    // Step 1 -> 2 -> 3 -> 4
    fireEvent.click(document.getElementById('onboarding-next-btn')!);
    fireEvent.click(document.getElementById('onboarding-next-btn')!);
    fireEvent.click(document.getElementById('onboarding-next-btn')!);

    expect(
      screen.getByRole('heading', {
        name: /Tools to help you find your own way/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/Breathing & Somatic Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/The Balance Ledger & The Shift/i)).toBeInTheDocument();
    expect(screen.getByText(/Inner Compass Quizzes/i)).toBeInTheDocument();
    expect(screen.getByText(/The Mind Vault & Dissolution/i)).toBeInTheDocument();
  });

  it('enforces mandatory consent gate on Step 5 before unlocking Agree & Enter button', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    // Step 1 -> 2 -> 3 -> 4 -> 5
    fireEvent.click(document.getElementById('onboarding-next-btn')!);
    fireEvent.click(document.getElementById('onboarding-next-btn')!);
    fireEvent.click(document.getElementById('onboarding-next-btn')!);
    fireEvent.click(document.getElementById('onboarding-next-btn')!);

    expect(
      screen.getByRole('heading', {
        name: /Your choices remain yours/i,
      })
    ).toBeInTheDocument();

    const agreeBtn = screen.getByRole('button', { name: /Agree & Enter Sanctuary/i });
    const checkbox = screen.getByRole('checkbox', {
      name: /I understand that BECOMING is for personal reflection/i,
    });

    // Initially disabled
    expect(agreeBtn).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    // Check consent box
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(agreeBtn).not.toBeDisabled();

    // Submit agreement
    fireEvent.click(agreeBtn);

    // Verify localStorage consent keys set
    expect(localStorage.getItem('becoming_onboarded')).toBe('true');
    expect(localStorage.getItem('becoming_consent_agreed')).toBe('true');
  });
});
