'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Locale,
  EntryIntent,
  InteractionMode,
  JourneyMapCard,
  JournalEntry,
  MomentOfLight,
} from '@/types';
import { getDictionary, defaultLocale, TranslationDictionary } from '@/locales';

interface AppContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: TranslationDictionary;
  isRtl: boolean;

  // Navigation / View State
  activeMode: InteractionMode;
  setActiveMode: (mode: InteractionMode) => void;
  currentIntent: EntryIntent | null;
  setCurrentIntent: (intent: EntryIntent | null) => void;
  activeTab: 'home' | 'map' | 'progress';
  setActiveTab: (tab: 'home' | 'map' | 'progress') => void;

  // Reduced Motion
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;

  // Storage Settings
  storageMode: 'session' | 'local';
  setStorageMode: (mode: 'session' | 'local') => void;

  // Journey Map Data
  cards: JourneyMapCard[];
  saveCard: (card: Omit<JourneyMapCard, 'id' | 'createdAt'>) => void;
  deleteCard: (id: string) => void;

  // Journal Data
  journalEntries: JournalEntry[];
  saveJournalEntry: (content: string) => void;
  deleteJournalEntry: (id: string) => void;

  // Moments of Light
  moments: MomentOfLight[];
  addMoment: (text: string) => void;
  deleteMoment: (id: string) => void;

  // Data Sovereignty
  wipeAllData: () => void;
  exportDataJson: () => void;
  exportDataTxt: () => void;

  // Safety Modal
  isSafetyModalOpen: boolean;
  setSafetyModalOpen: (open: boolean) => void;
}

const STORAGE_KEY_CARDS = 'becoming_journey_cards_v1';
const STORAGE_KEY_JOURNAL = 'becoming_journal_entries_v1';
const STORAGE_KEY_MOMENTS = 'becoming_moments_v1';
const STORAGE_KEY_MODE = 'becoming_storage_mode_v1';
const STORAGE_KEY_LOCALE = 'becoming_locale_v1';
const STORAGE_KEY_MOTION = 'becoming_reduced_motion_v1';

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [activeMode, setActiveMode] = useState<InteractionMode>('guided');
  const [currentIntent, setCurrentIntent] = useState<EntryIntent | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'progress'>('home');
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [storageMode, setStorageModeState] = useState<'session' | 'local'>('session');
  const [isSafetyModalOpen, setSafetyModalOpen] = useState(false);

  const [cards, setCards] = useState<JourneyMapCard[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moments, setMoments] = useState<MomentOfLight[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from storage on client mount
  useEffect(() => {
    try {
      // Check system reduced motion
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mq.matches) {
          setReducedMotionState(true);
        }
      }

      const savedMode = (localStorage.getItem(STORAGE_KEY_MODE) ||
        sessionStorage.getItem(STORAGE_KEY_MODE)) as 'session' | 'local' | null;
      const initialStorageMode = savedMode === 'local' ? 'local' : 'session';
      setStorageModeState(initialStorageMode);

      const store = initialStorageMode === 'local' ? localStorage : sessionStorage;

      const savedLocale = store.getItem(STORAGE_KEY_LOCALE) as Locale | null;
      if (savedLocale && ['en', 'ar', 'fr', 'es', 'it'].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }

      const savedMotion = store.getItem(STORAGE_KEY_MOTION);
      if (savedMotion !== null) {
        setReducedMotionState(savedMotion === 'true');
      }

      const savedCards = store.getItem(STORAGE_KEY_CARDS);
      if (savedCards) setCards(JSON.parse(savedCards));

      const savedJournal = store.getItem(STORAGE_KEY_JOURNAL);
      if (savedJournal) setJournalEntries(JSON.parse(savedJournal));

      const savedMoments = store.getItem(STORAGE_KEY_MOMENTS);
      if (savedMoments) setMoments(JSON.parse(savedMoments));
    } catch {
      // Storage might be disabled in private mode; fallback gracefully
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Update document direction and lang attribute whenever locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRtl = locale === 'ar';
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

  const dict = useMemo(() => getDictionary(locale), [locale]);
  const isRtl = locale === 'ar';

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_LOCALE, newLocale);
    } catch {
      // ignore
    }
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_MOTION, String(enabled));
    } catch {
      // ignore
    }
  };

  const setStorageMode = (newMode: 'session' | 'local') => {
    setStorageModeState(newMode);
    try {
      if (newMode === 'local') {
        // Migrate session to local
        localStorage.setItem(STORAGE_KEY_MODE, 'local');
        localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
        localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journalEntries));
        localStorage.setItem(STORAGE_KEY_MOMENTS, JSON.stringify(moments));
        localStorage.setItem(STORAGE_KEY_LOCALE, locale);
        localStorage.setItem(STORAGE_KEY_MOTION, String(reducedMotion));
        sessionStorage.clear();
      } else {
        // Migrate local to session
        sessionStorage.setItem(STORAGE_KEY_MODE, 'session');
        sessionStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
        sessionStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journalEntries));
        sessionStorage.setItem(STORAGE_KEY_MOMENTS, JSON.stringify(moments));
        sessionStorage.setItem(STORAGE_KEY_LOCALE, locale);
        sessionStorage.setItem(STORAGE_KEY_MOTION, String(reducedMotion));
        localStorage.clear();
      }
    } catch {
      // ignore
    }
  };

  const saveCard = (cardData: Omit<JourneyMapCard, 'id' | 'createdAt'>) => {
    const newCard: JourneyMapCard = {
      ...cardData,
      id: 'card_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    const updated = [newCard, ...cards];
    setCards(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_CARDS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteCard = (id: string) => {
    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_CARDS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const saveJournalEntry = (content: string) => {
    if (!content.trim()) return;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const newEntry: JournalEntry = {
      id: 'entry_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      content: content.trim(),
      wordCount: words,
      lastModifiedAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter((e) => e.id !== id);
    setJournalEntries(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const addMoment = (text: string) => {
    if (!text.trim()) return;
    const newMoment: MomentOfLight = {
      id: 'moment_' + Date.now(),
      date: new Date().toISOString(),
      text: text.trim(),
    };
    const updated = [newMoment, ...moments];
    setMoments(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_MOMENTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteMoment = (id: string) => {
    const updated = moments.filter((m) => m.id !== id);
    setMoments(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_MOMENTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const wipeAllData = () => {
    setCards([]);
    setJournalEntries([]);
    setMoments([]);
    setCurrentIntent(null);
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
  };

  const exportDataJson = () => {
    const exportPayload = {
      app: 'BECOMING',
      version: '0.1.0',
      exportedAt: new Date().toISOString(),
      storageMode,
      locale,
      journeyCards: cards,
      journalEntries,
      momentsOfLight: moments,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `becoming-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDataTxt = () => {
    let txt = `=================================================\n`;
    txt += `BECOMING — Private Personal Reflection Export\n`;
    txt += `Exported: ${new Date().toLocaleString()}\n`;
    txt += `Note: All reflections were generated & kept locally.\n`;
    txt += `=================================================\n\n`;

    txt += `--- CONFIRMED JOURNEY MAP CARDS (${cards.length}) ---\n\n`;
    cards.forEach((card, idx) => {
      txt += `[Card ${idx + 1}] — Intent: ${card.intent.toUpperCase()} (${new Date(card.createdAt).toLocaleDateString()})\n`;
      txt += `Confirmed Insight: ${card.confirmedInsight}\n`;
      if (card.microStep) {
        txt += `Self-Chosen Micro-Step: ${card.microStep}\n`;
      }
      txt += `Status: ${card.status}\n\n`;
    });

    txt += `\n--- FREE JOURNAL ENTRIES (${journalEntries.length}) ---\n\n`;
    journalEntries.forEach((entry, idx) => {
      txt += `[Entry ${idx + 1}] — ${new Date(entry.createdAt).toLocaleDateString()} (${entry.wordCount} words)\n`;
      txt += `${entry.content}\n\n`;
      txt += `-------------------------------------------------\n`;
    });

    txt += `\n--- MOMENTS OF LIGHT (${moments.length}) ---\n\n`;
    moments.forEach((m, idx) => {
      txt += `[${idx + 1}] ${new Date(m.date).toLocaleDateString()}: ${m.text}\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `becoming-reflections-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const value = {
    locale,
    setLocale,
    dict,
    isRtl,
    activeMode,
    setActiveMode,
    currentIntent,
    setCurrentIntent,
    activeTab,
    setActiveTab,
    reducedMotion,
    setReducedMotion,
    storageMode,
    setStorageMode,
    cards,
    saveCard,
    deleteCard,
    journalEntries,
    saveJournalEntry,
    deleteJournalEntry,
    moments,
    addMoment,
    deleteMoment,
    wipeAllData,
    exportDataJson,
    exportDataTxt,
    isSafetyModalOpen,
    setSafetyModalOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
