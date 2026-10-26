import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('BCM-009: Local-Only Storage & Data Sovereignty', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('initializes with session storage by default', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.storageMode).toBe('session');
    expect(result.current.cards).toHaveLength(0);
    expect(result.current.journalEntries).toHaveLength(0);
  });

  it('supports saving journal entries locally with word count', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => {
      result.current.saveJournalEntry('Today I noticed the quiet morning light.');
    });

    expect(result.current.journalEntries).toHaveLength(1);
    expect(result.current.journalEntries[0].wordCount).toBe(7);
    expect(result.current.journalEntries[0].content).toBe('Today I noticed the quiet morning light.');
  });

  it('wiping all data purges cards, journal entries, and moments completely', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => {
      result.current.saveJournalEntry('Private journal note');
      result.current.addMoment('Gratitude for coffee');
      result.current.saveCard({
        intent: 'grow',
        draftInsight: 'Draft',
        confirmedInsight: 'Confirmed insight',
        isConfirmed: true,
        status: 'confirmed',
      });
    });

    expect(result.current.journalEntries).toHaveLength(1);
    expect(result.current.moments).toHaveLength(1);
    expect(result.current.cards).toHaveLength(1);

    act(() => {
      result.current.wipeAllData();
    });

    expect(result.current.journalEntries).toHaveLength(0);
    expect(result.current.moments).toHaveLength(0);
    expect(result.current.cards).toHaveLength(0);
  });

  it('switches between session and local storage mode', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => {
      result.current.setStorageMode('local');
    });

    expect(result.current.storageMode).toBe('local');
  });
});
