import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppProvider } from '@/context/AppContext';
import { EveningRitualView } from '@/components/EveningRitualView';

describe('EveningRitualView (BECOMING v0.8)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders evening sanctuary view and somatic checklist', () => {
    render(
      <AppProvider>
        <EveningRitualView />
      </AppProvider>
    );

    expect(screen.getByTestId('evening-ritual-view')).toBeInTheDocument();
    expect(screen.getByTestId('somatic-jaw')).toBeInTheDocument();
    expect(screen.getByTestId('somatic-shoulders')).toBeInTheDocument();
    expect(screen.getByTestId('somatic-breaths')).toBeInTheDocument();
  });

  it('toggles somatic release checkboxes and updates state', () => {
    render(
      <AppProvider>
        <EveningRitualView />
      </AppProvider>
    );

    const jawCheck = screen.getByTestId('somatic-jaw');
    expect(jawCheck).not.toBeChecked();
    fireEvent.click(jawCheck);
    expect(jawCheck).toBeChecked();

    const shouldersCheck = screen.getByTestId('somatic-shoulders');
    fireEvent.click(shouldersCheck);
    expect(shouldersCheck).toBeChecked();
  });

  it('saves gratitude moments and commits evening ritual to localStorage', async () => {
    render(
      <AppProvider>
        <EveningRitualView />
      </AppProvider>
    );

    // Fill gratitude
    const g1 = screen.getByTestId('good-moment-input-1');
    fireEvent.change(g1, { target: { value: 'A quiet cup of warm tea' } });

    // Fill private release
    const releaseTextarea = screen.getByTestId('evening-release-input');
    fireEvent.change(releaseTextarea, { target: { value: 'Stress about tomorrow morning presentation' } });

    // Dissolve into night
    const dissolveBtn = screen.getByTestId('dissolve-btn');
    fireEvent.click(dissolveBtn);

    // Affirm tomorrow for tomorrow is checked by default
    const affirmCheckbox = screen.getByTestId('leave-tomorrow-checkbox');
    expect(affirmCheckbox).toBeChecked();

    // Save ritual
    const saveBtn = screen.getByTestId('evening-commit-btn');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const stored = localStorage.getItem('becoming_evening_ritual_v1');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.gratitude).toContain('A quiet cup of warm tea');
      expect(parsed.tomorrowAffirmed).toBe(true);
      expect(parsed.releaseWritten).toBe(true);
    });

    // Check closing slumber message is shown
    expect(screen.getByTestId('evening-summary-card')).toBeInTheDocument();
  });
});
