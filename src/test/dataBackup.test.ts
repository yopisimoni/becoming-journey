import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApp, AppProvider } from '@/context/AppContext';
import type { SanctuaryBackupPayload, MomentOfLight } from '@/types';

describe('Sanctuary Data Backup & Restoration (BECOMING v0.8)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exports payload adhering strictly to schemaVersion 0.8.0', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    // Seed some moments and rituals
    act(() => {
      result.current.addMoment('Morning cup of sunlight');
    });

    localStorage.setItem(
      'becoming_morning_ritual_v1',
      JSON.stringify({
        date: '2026-10-26',
        feeling: 'calm',
        intention: 'Breathe softly',
        action: 'Water the plants',
        actionCompleted: true,
      })
    );

    let capturedPayload: SanctuaryBackupPayload | null = null;
    window.URL.createObjectURL = vi.fn((blob: Blob) => {
      // In node/JSDOM, read text synchronously or via FileReader
      const reader = new FileReader();
      reader.onload = () => {
        try {
          capturedPayload = JSON.parse(reader.result as string);
        } catch {}
      };
      reader.readAsText(blob);
      return 'blob:mock-url';
    });

    act(() => {
      result.current.exportDataJson();
    });

    // Wait for FileReader
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(capturedPayload).not.toBeNull();
    const parsed: SanctuaryBackupPayload = capturedPayload!;
    expect(parsed.schemaVersion).toBe('0.8.0');
    expect(parsed.app).toBe('BECOMING');
    expect(parsed.moments?.some((m: MomentOfLight) => m.text === 'Morning cup of sunlight')).toBe(true);
    expect(parsed.morningRitual?.intention).toBe('Breathe softly');
  });

  it('restores backup successfully when valid JSON payload is provided', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    const backupPayload: SanctuaryBackupPayload = {
      schemaVersion: '0.8.0',
      exportedAt: new Date().toISOString(),
      app: 'BECOMING',
      journeyCards: [
        {
          id: 'card-restored-1',
          createdAt: '2026-10-26T12:00:00Z',
          intent: 'grow',
          draftInsight: 'I am expanding my awareness.',
          confirmedInsight: 'I am expanding my awareness.',
          microStep: 'Read poetry',
          isConfirmed: true,
          status: 'confirmed',
        },
      ],
      journalEntries: [
        {
          id: 'j-restored-1',
          createdAt: '2026-10-26T12:00:00Z',
          content: 'Finding silence within.',
          wordCount: 3,
          lastModifiedAt: '2026-10-26T12:00:00Z',
        },
      ],
      momentsOfLight: [
        {
          id: 'm-restored-1',
          date: '2026-10-26',
          text: 'Restored sunset memory',
        },
      ],
      lifeGoals: [
        {
          id: 'g-restored-1',
          horizon: 'week',
          title: 'Sleep 8 hours nightly',
          category: 'health',
          createdAt: '2026-10-26',
          completed: false,
        },
      ],
      habitLedger: [],
      vaultSecretsCount: 0,
      storageMode: 'local',
      locale: 'en',
      themeMode: 'light',
      atmosphereMode: 'twilight',
      isGuest: true,
      morningRitual: {
        id: 'morning_2026-10-26',
        date: '2026-10-26',
        feeling: 'energized',
        intention: 'Build with care',
        microAction: 'Review mobile capacitor audit',
        actionCompleted: false,
        reflectionText: 'Quiet wisdom',
        completedAt: '2026-10-26T12:00:00Z',
      },
    };

    let importRes: { success: boolean; message?: string; error?: string } = { success: false, message: '' };
    act(() => {
      importRes = result.current.importDataJson(JSON.stringify(backupPayload));
    });

    expect(importRes.success).toBe(true);
    expect(result.current.cards.some((c) => c.id === 'card-restored-1')).toBe(true);
    expect(result.current.journalEntries.some((j) => j.id === 'j-restored-1')).toBe(true);
    expect(result.current.moments.some((m) => m.text === 'Restored sunset memory')).toBe(true);
    expect(result.current.goals.some((g) => g.title === 'Sleep 8 hours nightly')).toBe(true);

    const storedMorning = localStorage.getItem('becoming_morning_ritual_v1');
    expect(storedMorning).not.toBeNull();
    expect(JSON.parse(storedMorning!).intention).toBe('Build with care');
  });

  it('rejects invalid or corrupted JSON payloads', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    const corruptedJson = '{ invalid_json: true ';
    const res1 = result.current.importDataJson(corruptedJson);
    expect(res1.success).toBe(false);

    const nonPayloadJson = JSON.stringify({ randomKey: 'not a becoming backup' });
    const res2 = result.current.importDataJson(nonPayloadJson);
    expect(res2.success).toBe(false);
  });
});

describe('Activity backup round-trip', () => {
  it('restores activity attempts and seen/tried markers from a valid backup', () => {
    const {result} = renderHook(()=>useApp(),{wrapper:AppProvider});
    const payload = {
      app:'BECOMING',schemaVersion:'0.8.0',exportedAt:new Date().toISOString(),
      activityHistory:[{id:'calm-senses',title:'A private activity',date:new Date().toISOString()}],
      activitySeen:['calm-senses'],activityTried:['calm-senses'],
    };
    let outcome: {success:boolean}|undefined;
    act(()=>{outcome=result.current.importDataJson(JSON.stringify(payload));});
    expect(outcome?.success).toBe(true);
    const store = result.current.storageMode === 'local' ? localStorage : sessionStorage;
    expect(JSON.parse(store.getItem('becoming_activity_journey_v1')||'[]')[0].title).toBe('A private activity');
    expect(JSON.parse(store.getItem('becoming_activity_seen_v1')||'[]')).toEqual(['calm-senses']);
    expect(JSON.parse(store.getItem('becoming_activity_tried_v1')||'[]')).toEqual(['calm-senses']);
  });
});
