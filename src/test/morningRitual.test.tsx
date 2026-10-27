import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppProvider } from '@/context/AppContext';
import { MorningRitualView } from '@/components/MorningRitualView';

describe('MorningRitualView (BECOMING v0.8)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders morning greeting and feeling options', () => {
    render(
      <AppProvider>
        <MorningRitualView />
      </AppProvider>
    );

    expect(screen.getByTestId('morning-ritual-view')).toBeInTheDocument();
    expect(screen.getByTestId('feeling-option-calm')).toBeInTheDocument();
    expect(screen.getByTestId('feeling-option-energized')).toBeInTheDocument();
    expect(screen.getByTestId('feeling-option-anxious')).toBeInTheDocument();
  });

  it('allows selecting a feeling and setting an intention via quick chip', () => {
    render(
      <AppProvider>
        <MorningRitualView />
      </AppProvider>
    );

    // Select feeling
    const calmBtn = screen.getByTestId('feeling-option-calm');
    fireEvent.click(calmBtn);

    // Click quick intention chip
    const chip = screen.getByText('Protect my quiet pace and speak kindly to myself');
    fireEvent.click(chip);

    const intentionInput = screen.getByTestId('morning-intention-input') as HTMLInputElement;
    expect(intentionInput.value).toBe('Protect my quiet pace and speak kindly to myself');
  });

  it('commits morning intention and saves to localStorage', async () => {
    render(
      <AppProvider>
        <MorningRitualView />
      </AppProvider>
    );

    // Select feeling
    fireEvent.click(screen.getByTestId('feeling-option-energized'));

    // Type intention
    const intentionInput = screen.getByTestId('morning-intention-input');
    fireEvent.change(intentionInput, { target: { value: 'Stay present during meetings' } });

    // Pick action chip
    const actionChip = screen.getByText('Step outside for 2 minutes to breathe fresh morning air');
    fireEvent.click(actionChip);

    // Commit intention
    const commitBtn = screen.getByTestId('morning-commit-btn');
    fireEvent.click(commitBtn);

    await waitFor(() => {
      const stored = localStorage.getItem('becoming_morning_ritual_v1');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.feeling).toBe('energized');
      expect(parsed.intention).toBe('Stay present during meetings');
      expect(parsed.action).toBe('Step outside for 2 minutes to breathe fresh morning air');
    });

    // Check action completion checkbox
    const actionCheckbox = screen.getByTestId('morning-action-checkbox');
    expect(actionCheckbox).not.toBeChecked();
    fireEvent.click(actionCheckbox);
    expect(actionCheckbox).toBeChecked();
  });

  it('supports skipping action without guilt', async () => {
    render(
      <AppProvider>
        <MorningRitualView />
      </AppProvider>
    );

    const intentionInput = screen.getByTestId('morning-intention-input');
    fireEvent.change(intentionInput, { target: { value: 'Walk gently' } });

    const skipBtn = screen.getByTestId('skip-action-btn');
    fireEvent.click(skipBtn);

    await waitFor(() => {
      const stored = localStorage.getItem('becoming_morning_ritual_v1');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.intention).toBeDefined();
    });
  });
});
