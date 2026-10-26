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

describe('v0.6: Cinematic Onboarding Welcome Modal & Mandatory Consent Gate', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders Card 1 with sanctuary philosophy on opening', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /A Quiet Human Sanctuary in a Loud Digital World/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Who We Are & Why We're Here/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Zero Cost Forever, 100% Local Privacy, and Unhurried Presence/i)).toBeInTheDocument();
  });

  it('cycles through motion cards: Card 1 -> Card 2 -> Card 3', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    // Card 1 -> Card 2
    const nextBtn1 = document.getElementById('onboarding-next-btn')!;
    expect(nextBtn1).toBeTruthy();
    fireEvent.click(nextBtn1);

    expect(screen.getByRole('heading', { name: /Tools Designed to Mirror Your Mind, Not Boss It/i })).toBeInTheDocument();
    expect(screen.getByText(/Breathing & Somatic Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/The Mind Vault & Dissolution/i)).toBeInTheDocument();

    // Card 2 -> Card 3
    const nextBtn2 = document.getElementById('onboarding-next-btn')!;
    expect(nextBtn2).toBeTruthy();
    fireEvent.click(nextBtn2);

    expect(screen.getByRole('heading', { name: /Life is Short\. You Are Not an Angel\. You Are Free\./i })).toBeInTheDocument();
    expect(screen.getByText(/Mandatory Agreement & Sanctuary Consent Gate/i)).toBeInTheDocument();
  });

  it('enforces mandatory consent gate before unlocking the Agree & Enter button', () => {
    render(
      <AppProvider>
        <OnboardingHarness autoOpen={true} />
      </AppProvider>
    );

    // Navigate to Card 3
    fireEvent.click(document.getElementById('onboarding-next-btn')!);
    fireEvent.click(document.getElementById('onboarding-next-btn')!);

    const agreeBtn = screen.getByRole('button', { name: /Agree & Enter Sanctuary/i });
    const checkbox = screen.getByRole('checkbox', {
      name: /I understand that BECOMING is a personal self-reflection and wellness sanctuary/i,
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
