import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { SafetyModal } from '@/components/SafetyModal';

function SafetyTestHarness() {
  return (
    <AppProvider>
      <DisclaimerBanner />
      <SafetyModal />
    </AppProvider>
  );
}

describe('BCM-011: Safety Boundaries & Non-Clinical Guardrails', () => {
  it('renders the non-clinical disclaimer banner prominently', () => {
    render(<SafetyTestHarness />);

    expect(
      screen.getByText(/not therapy, medical advice, or crisis care/i)
    ).toBeInTheDocument();
  });

  it('opens safety modal with crisis resources and emergency hotlines on request', () => {
    render(<SafetyTestHarness />);

    const learnMoreBtn = screen.getByRole('button', { name: /Safety boundaries/i });
    fireEvent.click(learnMoreBtn);

    expect(screen.getByRole('heading', { name: /Safety, Privacy & Non-Clinical Scope/i })).toBeInTheDocument();
    expect(screen.getByText(/Immediate Support Resources/i)).toBeInTheDocument();
    expect(screen.getByText(/Suicide & Crisis Lifeline/i)).toBeInTheDocument();
    expect(screen.getByText(/988/i)).toBeInTheDocument();
  });
});
