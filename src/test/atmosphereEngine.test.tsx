import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AtmosphereSwitcher } from '@/components/AtmosphereSwitcher';
import { AtmosphereBackground } from '@/components/AtmosphereBackground';
import { getDictionary } from '@/locales';
import { Locale } from '@/types';

function TestHarness() {
  const { atmosphere, themeMode, autoAtmosphere, setActiveTab, setActiveMode } = useApp();

  return (
    <div>
      <AtmosphereBackground />
      <AtmosphereSwitcher />
      <div data-testid="current-atmosphere">{atmosphere}</div>
      <div data-testid="current-theme">{themeMode}</div>
      <div data-testid="auto-atmosphere-state">{String(autoAtmosphere)}</div>
      <button
        data-testid="enter-vault-btn"
        onClick={() => setActiveTab('vault')}
      >
        Enter Vault
      </button>
      <button
        data-testid="enter-breathe-btn"
        onClick={() => setActiveTab('breathe')}
      >
        Enter Breathe
      </button>
      <button
        data-testid="enter-home-btn"
        onClick={() => {
          setActiveTab('home');
          setActiveMode('guided');
        }}
      >
        Enter Home
      </button>
    </div>
  );
}

describe('v0.7: Living Atmospheric Canvas & Dynamic Mood Shifting Backgrounds', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-atmosphere');
    document.documentElement.classList.remove('dark');
  });

  it('renders Atmosphere Switcher with current atmosphere pill', () => {
    render(
      <AppProvider>
        <TestHarness />
      </AppProvider>
    );

    const switcher = screen.getByTestId('atmosphere-switcher');
    expect(switcher).toBeInTheDocument();
    expect(screen.getByTestId('atmosphere-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('current-atmosphere').textContent).toBe('dawn');
  });

  it('opens atmosphere menu with 4 moods and auto-atmosphere toggle', () => {
    render(
      <AppProvider>
        <TestHarness />
      </AppProvider>
    );

    const switcher = screen.getByTestId('atmosphere-switcher');
    fireEvent.click(switcher);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByTestId('atmosphere-option-twilight')).toBeInTheDocument();
    expect(screen.getByTestId('atmosphere-option-moss')).toBeInTheDocument();
    expect(screen.getByTestId('atmosphere-option-dawn')).toBeInTheDocument();
    expect(screen.getByTestId('atmosphere-option-midnight')).toBeInTheDocument();
    expect(screen.getByTestId('auto-atmosphere-toggle')).toBeInTheDocument();
  });

  it('switches mood to Twilight Calm and updates data-atmosphere and dark mode', () => {
    render(
      <AppProvider>
        <TestHarness />
      </AppProvider>
    );

    // Open switcher
    fireEvent.click(screen.getByTestId('atmosphere-switcher'));

    // Select Twilight Calm
    fireEvent.click(screen.getByTestId('atmosphere-option-twilight'));

    expect(screen.getByTestId('current-atmosphere').textContent).toBe('twilight');
    expect(document.documentElement.getAttribute('data-atmosphere')).toBe('twilight');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('becoming_atmosphere_mode')).toBe('twilight');
  });

  it('switches mood to Grounded Moss', () => {
    render(
      <AppProvider>
        <TestHarness />
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId('atmosphere-switcher'));
    fireEvent.click(screen.getByTestId('atmosphere-option-moss'));

    expect(screen.getByTestId('current-atmosphere').textContent).toBe('moss');
    expect(document.documentElement.getAttribute('data-atmosphere')).toBe('moss');
    expect(localStorage.getItem('becoming_atmosphere_mode')).toBe('moss');
  });

  it('switches mood to Midnight Sanctuary and updates data-atmosphere and dark mode', () => {
    render(
      <AppProvider>
        <TestHarness />
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId('atmosphere-switcher'));
    fireEvent.click(screen.getByTestId('atmosphere-option-midnight'));

    expect(screen.getByTestId('current-atmosphere').textContent).toBe('midnight');
    expect(document.documentElement.getAttribute('data-atmosphere')).toBe('midnight');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('becoming_atmosphere_mode')).toBe('midnight');
  });

  it('contextual auto-atmosphere automatically adapts palette in Vault & Breathe studios', () => {
    render(
      <AppProvider>
        <TestHarness />
      </AppProvider>
    );

    // Initial is dawn
    expect(screen.getByTestId('current-atmosphere').textContent).toBe('dawn');

    // Enter Secret Vault -> auto shifts to midnight
    act(() => {
      fireEvent.click(screen.getByTestId('enter-vault-btn'));
    });
    expect(screen.getByTestId('current-atmosphere').textContent).toBe('midnight');
    expect(document.documentElement.getAttribute('data-atmosphere')).toBe('midnight');

    // Enter Breathing Studio -> auto shifts to moss
    act(() => {
      fireEvent.click(screen.getByTestId('enter-breathe-btn'));
    });
    expect(screen.getByTestId('current-atmosphere').textContent).toBe('moss');
    expect(document.documentElement.getAttribute('data-atmosphere')).toBe('moss');

    // Return Home -> restores preferred atmosphere (dawn)
    act(() => {
      fireEvent.click(screen.getByTestId('enter-home-btn'));
    });
    expect(screen.getByTestId('current-atmosphere').textContent).toBe('dawn');
    expect(document.documentElement.getAttribute('data-atmosphere')).toBe('dawn');
  });

  it('persists atmosphere translations across all 5 locales', () => {
    const locales: Locale[] = ['en', 'ar', 'fr', 'es', 'it'];

    locales.forEach((loc) => {
      const dict = getDictionary(loc);
      expect(dict.atmosphere).toBeDefined();
      expect(dict.atmosphere?.switcherTitle).toBeTruthy();
      expect(dict.atmosphere?.twilightName).toBeTruthy();
      expect(dict.atmosphere?.mossName).toBeTruthy();
      expect(dict.atmosphere?.dawnName).toBeTruthy();
      expect(dict.atmosphere?.midnightName).toBeTruthy();
      expect(dict.atmosphere?.autoAtmosphere).toBeTruthy();
    });
  });
});
