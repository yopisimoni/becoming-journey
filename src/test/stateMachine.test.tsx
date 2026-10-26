import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { GuidedReflectionView } from '@/components/GuidedReflectionView';
import { WelcomeView } from '@/components/WelcomeView';
import { JourneyMapView } from '@/components/JourneyMapView';

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

function GuidedTestHarness() {
  const { currentIntent, setCurrentIntent } = useApp();

  return (
    <div>
      {!currentIntent ? (
        <button
          onClick={() => setCurrentIntent('lost')}
          data-testid="select-lost-intent"
        >
          Select Lost
        </button>
      ) : (
        <GuidedReflectionView />
      )}
      <JourneyMapView />
    </div>
  );
}

describe('BCM-007 & BCM-008: Scripted Reflection State Machine & Confirm-Before-Save', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('navigates through the 5 stages and only saves card if insight is explicitly confirmed', async () => {
    render(
      <TestWrapper>
        <GuidedTestHarness />
      </TestWrapper>
    );

    // Initial state: select intent
    fireEvent.click(screen.getByTestId('select-lost-intent'));

    // STAGE 1: Express
    expect(screen.getByRole('heading', { name: /1\. Express/i })).toBeInTheDocument();
    const expressInput = screen.getByPlaceholderText(/Take your time/i);
    fireEvent.change(expressInput, { target: { value: 'Feeling overwhelmed with life decisions' } });

    // Click Continue to Stage 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // STAGE 2: Explore
    expect(screen.getByRole('heading', { name: /2\. Exploration/i })).toBeInTheDocument();
    expect(screen.getByText(/Feeling overwhelmed with life decisions/i)).toBeInTheDocument();

    // Click Continue to Stage 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // STAGE 3: Confirm Insight
    expect(screen.getByRole('heading', { name: /3\. Confirm Draft Insight/i })).toBeInTheDocument();

    // Notice that without confirming, journey map has 0 cards
    expect(screen.getByText(/Your map is currently open and clear/i)).toBeInTheDocument();

    // Confirm the insight
    const confirmBtn = screen.getByRole('button', { name: /Confirm Insight/i });
    fireEvent.click(confirmBtn);

    // Click Continue to Stage 4
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // STAGE 4: Choose Micro-step
    expect(screen.getByRole('heading', { name: /4\. Choose a Micro-Step/i })).toBeInTheDocument();
    const acceptStepBtn = screen.getByRole('button', { name: /Accept This Step/i });
    fireEvent.click(acceptStepBtn);

    // Save to Journey Map
    const saveToMapBtn = screen.getByRole('button', { name: /Save to Journey Map/i });
    fireEvent.click(saveToMapBtn);

    // STAGE 5: Reflect (Completed)
    expect(screen.getByRole('heading', { name: /5\. Journey Reflection Saved/i })).toBeInTheDocument();

    // Verify card is now present in Journey Map
    expect(screen.getByText(/Confirmed by You/i)).toBeInTheDocument();
    expect(screen.getAllByText(/I am not behind in life/i).length).toBeGreaterThanOrEqual(2);
  });

  it('does NOT save card to Journey Map if insight is discarded', async () => {
    render(
      <TestWrapper>
        <GuidedTestHarness />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('select-lost-intent'));

    // Move to Stage 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Move to Stage 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Discard the insight
    const discardBtn = screen.getByRole('button', { name: /Discard Insight/i });
    fireEvent.click(discardBtn);

    // Move to Stage 4
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Skip step and commit
    fireEvent.click(screen.getByRole('button', { name: /Skip Micro-Step/i }));
    fireEvent.click(screen.getByRole('button', { name: /Save to Journey Map/i }));

    // Verify card was NOT saved to map
    expect(screen.getByText(/Your map is currently open and clear/i)).toBeInTheDocument();
  });
});
