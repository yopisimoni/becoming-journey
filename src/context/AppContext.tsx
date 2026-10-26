'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Locale,
  EntryIntent,
  InteractionMode,
  NavigationTab,
  JourneyMapCard,
  JournalEntry,
  MomentOfLight,
  UserProfile,
  AvatarId,
  LifeGoal,
  HabitItem,
  VaultSecret,
} from '@/types';
import { getDictionary, defaultLocale, TranslationDictionary } from '@/locales';
import { soundEngine, SoundscapePreset } from '@/lib/audio/soundEngine';
import { AISettings, DEFAULT_AI_SETTINGS } from '@/lib/engine/aiAdapter';
import { clearAllMedia } from '@/lib/storage/mediaDb';

export type ThemeMode = 'light' | 'twilight';

interface StoredAccount extends UserProfile {
  passwordHash: string;
}

interface AppContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: TranslationDictionary;
  isRtl: boolean;

  // Local-First User Authentication & Profile
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signUp: (name: string, email: string, password: string, avatar?: AvatarId) => { success: boolean; error?: string };
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signOut: () => void;

  // Theme (Light vs Twilight Sanctuary)
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Soundscape
  soundPreset: SoundscapePreset;
  setSoundPreset: (preset: SoundscapePreset) => void;
  soundVolume: number;
  setSoundVolume: (val: number) => void;
  playSingingBowl: () => void;

  // AI Bridge Settings (Optional)
  aiSettings: AISettings;
  setAiSettings: (settings: AISettings) => void;
  isAiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;

  // Sanctuary Entrance Step (0 = Entrance, 1 = Card Deck)
  sanctuaryStep: number;
  setSanctuaryStep: (step: number) => void;

  // Navigation / View State
  activeMode: InteractionMode;
  setActiveMode: (mode: InteractionMode) => void;
  currentIntent: EntryIntent | null;
  setCurrentIntent: (intent: EntryIntent | null) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

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
  addMomentWithMedia: (text: string, mediaDataUrl?: string, mediaType?: 'image' | 'video') => void;
  deleteMoment: (id: string) => void;

  // Multi-Horizon Goals
  goals: LifeGoal[];
  addGoal: (goal: Omit<LifeGoal, 'id' | 'createdAt'>) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  moveGoalToTomorrow: (id: string) => void;

  // Habit Seeds & Weights
  habits: HabitItem[];
  addHabit: (habit: Omit<HabitItem, 'id' | 'createdAt'>) => void;
  nurtureHabit: (id: string) => void;
  deleteHabit: (id: string) => void;

  // Vault Secrets
  vaultSecrets: VaultSecret[];
  addVaultSecret: (secret: Omit<VaultSecret, 'id' | 'createdAt'>) => void;
  deleteVaultSecret: (id: string) => void;

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
const STORAGE_KEY_GOALS = 'becoming_goals_v1';
const STORAGE_KEY_HABITS = 'becoming_habits_v1';
const STORAGE_KEY_VAULT = 'becoming_vault_secrets_v1';
const STORAGE_KEY_MODE = 'becoming_storage_mode_v1';
const STORAGE_KEY_LOCALE = 'becoming_locale_v1';
const STORAGE_KEY_MOTION = 'becoming_reduced_motion_v1';
const STORAGE_KEY_THEME = 'becoming_theme_mode_v1';
const STORAGE_KEY_AI = 'becoming_ai_settings_v1';
const STORAGE_KEY_REGISTERED_USERS = 'becoming_registered_users_v1';
const STORAGE_KEY_ACTIVE_USER = 'becoming_active_user_v1';

const hashPassword = (pwd: string) => {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${hash}`;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [soundPreset, setSoundPresetState] = useState<SoundscapePreset>('none');
  const [soundVolume, setSoundVolumeState] = useState<number>(0.65);
  const [aiSettings, setAiSettingsState] = useState<AISettings>(DEFAULT_AI_SETTINGS);
  const [isAiModalOpen, setAiModalOpen] = useState(false);
  const [sanctuaryStep, setSanctuaryStep] = useState(0);

  // User Authentication
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Navigation
  const [activeMode, setActiveMode] = useState<InteractionMode>('guided');
  const [currentIntent, setCurrentIntent] = useState<EntryIntent | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  // Accessibility & Storage
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [storageMode, setStorageModeState] = useState<'session' | 'local'>('session');
  const [isSafetyModalOpen, setSafetyModalOpen] = useState(false);

  // App Data
  const [cards, setCards] = useState<JourneyMapCard[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moments, setMoments] = useState<MomentOfLight[]>([]);
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [vaultSecrets, setVaultSecrets] = useState<VaultSecret[]>([]);

  const dict = useMemo(() => getDictionary(locale), [locale]);
  const isRtl = useMemo(() => locale === 'ar', [locale]);

  const getUserScopedKey = (type: 'cards' | 'journal' | 'moments' | 'goals' | 'habits' | 'vault', userId?: string) => {
    const activeId = userId || user?.id;
    if (activeId) {
      return `becoming_${activeId}_${type}_v1`;
    }
    switch (type) {
      case 'cards':
        return STORAGE_KEY_CARDS;
      case 'journal':
        return STORAGE_KEY_JOURNAL;
      case 'moments':
        return STORAGE_KEY_MOMENTS;
      case 'goals':
        return STORAGE_KEY_GOALS;
      case 'habits':
        return STORAGE_KEY_HABITS;
      case 'vault':
        return STORAGE_KEY_VAULT;
    }
  };

  const loadUserData = (targetUser: UserProfile | null, store: Storage) => {
    try {
      const cardsKey = getUserScopedKey('cards', targetUser?.id);
      const journalKey = getUserScopedKey('journal', targetUser?.id);
      const momentsKey = getUserScopedKey('moments', targetUser?.id);
      const goalsKey = getUserScopedKey('goals', targetUser?.id);
      const habitsKey = getUserScopedKey('habits', targetUser?.id);
      const vaultKey = getUserScopedKey('vault', targetUser?.id);

      const savedCards = store.getItem(cardsKey);
      setCards(savedCards ? JSON.parse(savedCards) : []);

      const savedJournal = store.getItem(journalKey);
      setJournalEntries(savedJournal ? JSON.parse(savedJournal) : []);

      const savedMoments = store.getItem(momentsKey);
      setMoments(savedMoments ? JSON.parse(savedMoments) : []);

      const savedGoals = store.getItem(goalsKey);
      setGoals(savedGoals ? JSON.parse(savedGoals) : []);

      const savedHabits = store.getItem(habitsKey);
      setHabits(savedHabits ? JSON.parse(savedHabits) : []);

      const savedVault = store.getItem(vaultKey);
      setVaultSecrets(savedVault ? JSON.parse(savedVault) : []);
    } catch {
      // ignore
    }
  };

  // Initialize from storage on client mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mq.matches) {
          setReducedMotionState(true);
        }
      }

      const savedUserStr = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      let initialUser: UserProfile | null = null;
      if (savedUserStr) {
        try {
          initialUser = JSON.parse(savedUserStr);
          setUser(initialUser);
        } catch {
          // ignore
        }
      }

      const savedMode = (localStorage.getItem(STORAGE_KEY_MODE) ||
        sessionStorage.getItem(STORAGE_KEY_MODE)) as 'session' | 'local' | null;
      const initialStorageMode = initialUser ? 'local' : (savedMode === 'local' ? 'local' : 'session');
      setStorageModeState(initialStorageMode);

      const store = initialStorageMode === 'local' ? localStorage : sessionStorage;

      const savedLocale = store.getItem(STORAGE_KEY_LOCALE) as Locale | null;
      if (savedLocale && ['en', 'ar', 'fr', 'es', 'it'].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }

      const savedTheme = store.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
      if (savedTheme === 'twilight' || savedTheme === 'light') {
        setThemeModeState(savedTheme);
      }

      const savedAi = store.getItem(STORAGE_KEY_AI);
      if (savedAi) {
        setAiSettingsState(JSON.parse(savedAi));
      }

      const savedMotion = store.getItem(STORAGE_KEY_MOTION);
      if (savedMotion !== null) {
        setReducedMotionState(savedMotion === 'true');
      }

      loadUserData(initialUser, store);
    } catch {
      // Storage might be disabled in private mode
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update document direction and lang attribute whenever locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRtl = locale === 'ar';
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

  // Update theme class on HTML element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (themeMode === 'twilight') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [themeMode]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_LOCALE, newLocale);
    } catch {
      // ignore
    }
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setThemeModeState(newMode);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_THEME, newMode);
    } catch {
      // ignore
    }
  };

  const setSoundPreset = (preset: SoundscapePreset) => {
    setSoundPresetState(preset);
    soundEngine.setPreset(preset);
  };

  const setSoundVolume = (val: number) => {
    setSoundVolumeState(val);
    soundEngine.setVolume(val);
  };

  const playSingingBowl = () => {
    soundEngine.playSingingBowlChime();
  };

  const setAiSettings = (newSettings: AISettings) => {
    setAiSettingsState(newSettings);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_AI, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_MOTION, String(reduced));
    } catch {
      // ignore
    }
  };

  const setStorageMode = (mode: 'session' | 'local') => {
    setStorageModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY_MODE, mode);
      sessionStorage.setItem(STORAGE_KEY_MODE, mode);
      const targetStore = mode === 'local' ? localStorage : sessionStorage;

      targetStore.setItem(getUserScopedKey('cards'), JSON.stringify(cards));
      targetStore.setItem(getUserScopedKey('journal'), JSON.stringify(journalEntries));
      targetStore.setItem(getUserScopedKey('moments'), JSON.stringify(moments));
      targetStore.setItem(getUserScopedKey('goals'), JSON.stringify(goals));
      targetStore.setItem(getUserScopedKey('habits'), JSON.stringify(habits));
      targetStore.setItem(getUserScopedKey('vault'), JSON.stringify(vaultSecrets));
    } catch {
      // ignore
    }
  };

  const signUp = (name: string, email: string, password: string, avatar: AvatarId = 'lotus') => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const usersStr = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      const registered: StoredAccount[] = usersStr ? JSON.parse(usersStr) : [];

      if (registered.some((u) => u.email === cleanEmail)) {
        return { success: false, error: dict.auth.emailExists };
      }

      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        avatar,
        createdAt: new Date().toISOString(),
      };

      const account: StoredAccount = {
        ...newProfile,
        passwordHash: hashPassword(password),
      };

      const updatedUsers = [...registered, account];
      localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(updatedUsers));
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(newProfile));
      setUser(newProfile);
      setStorageModeState('local');
      localStorage.setItem(STORAGE_KEY_MODE, 'local');

      // Migrate guest data if any
      const userCardsKey = getUserScopedKey('cards', newProfile.id);
      const userJournalKey = getUserScopedKey('journal', newProfile.id);
      const userMomentsKey = getUserScopedKey('moments', newProfile.id);
      const userGoalsKey = getUserScopedKey('goals', newProfile.id);
      const userHabitsKey = getUserScopedKey('habits', newProfile.id);
      const userVaultKey = getUserScopedKey('vault', newProfile.id);

      if (cards.length > 0) localStorage.setItem(userCardsKey, JSON.stringify(cards));
      if (journalEntries.length > 0) localStorage.setItem(userJournalKey, JSON.stringify(journalEntries));
      if (moments.length > 0) localStorage.setItem(userMomentsKey, JSON.stringify(moments));
      if (goals.length > 0) localStorage.setItem(userGoalsKey, JSON.stringify(goals));
      if (habits.length > 0) localStorage.setItem(userHabitsKey, JSON.stringify(habits));
      if (vaultSecrets.length > 0) localStorage.setItem(userVaultKey, JSON.stringify(vaultSecrets));

      return { success: true };
    } catch {
      return { success: false, error: 'Failed to access local storage.' };
    }
  };

  const signIn = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const usersStr = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      const registered: StoredAccount[] = usersStr ? JSON.parse(usersStr) : [];
      const found = registered.find((u) => u.email === cleanEmail);
      if (!found || found.passwordHash !== hashPassword(password)) {
        return { success: false, error: dict.auth.invalidCredentials };
      }

      const profile: UserProfile = {
        id: found.id,
        name: found.name,
        email: found.email,
        avatar: found.avatar,
        createdAt: found.createdAt,
      };

      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(profile));
      setUser(profile);
      setStorageModeState('local');
      localStorage.setItem(STORAGE_KEY_MODE, 'local');

      loadUserData(profile, localStorage);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to access local storage.' };
    }
  };

  const signOut = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    } catch {
      // ignore
    }
    setUser(null);
    const store = storageMode === 'local' ? localStorage : sessionStorage;
    loadUserData(null, store);
  };

  // Cards
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
      store.setItem(getUserScopedKey('cards'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteCard = (id: string) => {
    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('cards'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Journal
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
      store.setItem(getUserScopedKey('journal'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter((e) => e.id !== id);
    setJournalEntries(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('journal'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Moments
  const addMoment = (text: string) => {
    addMomentWithMedia(text);
  };

  const addMomentWithMedia = (text: string, mediaDataUrl?: string, mediaType?: 'image' | 'video') => {
    if (!text.trim() && !mediaDataUrl) return;
    const newMoment: MomentOfLight = {
      id: 'moment_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
      mediaDataUrl,
      mediaType,
    };
    const updated = [newMoment, ...moments];
    setMoments(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('moments'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteMoment = (id: string) => {
    const updated = moments.filter((m) => m.id !== id);
    setMoments(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('moments'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Goals
  const addGoal = (goalData: Omit<LifeGoal, 'id' | 'createdAt'>) => {
    const newGoal: LifeGoal = {
      ...goalData,
      id: 'goal_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('goals'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleGoal = (id: string) => {
    const updated = goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g));
    setGoals(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('goals'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('goals'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const moveGoalToTomorrow = (id: string) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { ...g, targetDate: tomorrow.toISOString().split('T')[0] };
      }
      return g;
    });
    setGoals(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('goals'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Habits
  const addHabit = (habitData: Omit<HabitItem, 'id' | 'createdAt'>) => {
    const newHabit: HabitItem = {
      ...habitData,
      id: 'habit_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newHabit, ...habits];
    setHabits(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('habits'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const nurtureHabit = (id: string) => {
    const updated = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            nurturedCount: h.nurturedCount + 1,
            lastNurturedDate: new Date().toISOString().split('T')[0],
          }
        : h
    );
    setHabits(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('habits'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('habits'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Vault
  const addVaultSecret = (secretData: Omit<VaultSecret, 'id' | 'createdAt'>) => {
    const newSecret: VaultSecret = {
      ...secretData,
      id: 'vault_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newSecret, ...vaultSecrets];
    setVaultSecrets(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('vault'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteVaultSecret = (id: string) => {
    const updated = vaultSecrets.filter((s) => s.id !== id);
    setVaultSecrets(updated);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('vault'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const wipeAllData = () => {
    setCards([]);
    setJournalEntries([]);
    setMoments([]);
    setGoals([]);
    setHabits([]);
    setVaultSecrets([]);
    setCurrentIntent(null);
    setSanctuaryStep(0);
    clearAllMedia().catch(() => {});
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.removeItem(getUserScopedKey('cards'));
      store.removeItem(getUserScopedKey('journal'));
      store.removeItem(getUserScopedKey('moments'));
      store.removeItem(getUserScopedKey('goals'));
      store.removeItem(getUserScopedKey('habits'));
      store.removeItem(getUserScopedKey('vault'));
      localStorage.removeItem('becoming_vault_pin_v1');
      if (!user) {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch {
      // ignore
    }
  };

  const exportDataJson = () => {
    const exportPayload = {
      app: 'BECOMING',
      version: '0.4.0',
      themeMode,
      exportedAt: new Date().toISOString(),
      storageMode,
      locale,
      journeyCards: cards,
      journalEntries,
      momentsOfLight: moments,
      lifeGoals: goals,
      habitLedger: habits,
      vaultSecretsCount: vaultSecrets.length,
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
    txt += `BECOMING — Complete Life Sanctuary Export (v0.4)\n`;
    txt += `Exported: ${new Date().toLocaleString()}\n`;
    txt += `Theme: ${themeMode}\n`;
    txt += `Note: All reflections & memories are strictly local.\n`;
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
      txt += `[${idx + 1}] ${m.date}: ${m.text}\n`;
    });

    txt += `\n--- LIFE GOALS & HORIZONS (${goals.length}) ---\n\n`;
    goals.forEach((g, idx) => {
      txt += `[${idx + 1}] [${g.horizon.toUpperCase()}] ${g.title} (${g.completed ? 'COMPLETED' : 'ACTIVE'})\n`;
    });

    txt += `\n--- HABIT BALANCE LEDGER (${habits.length}) ---\n\n`;
    habits.forEach((h, idx) => {
      txt += `[${idx + 1}] [${h.type.toUpperCase()}] ${h.title} (Nurtured: ${h.nurturedCount} times)\n`;
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

    user,
    isAuthModalOpen,
    setAuthModalOpen,
    signUp,
    signIn,
    signOut,

    themeMode,
    setThemeMode,

    soundPreset,
    setSoundPreset,
    soundVolume,
    setSoundVolume,
    playSingingBowl,

    aiSettings,
    setAiSettings,
    isAiModalOpen,
    setAiModalOpen,

    sanctuaryStep,
    setSanctuaryStep,

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
    addMomentWithMedia,
    deleteMoment,

    goals,
    addGoal,
    toggleGoal,
    deleteGoal,
    moveGoalToTomorrow,

    habits,
    addHabit,
    nurtureHabit,
    deleteHabit,

    vaultSecrets,
    addVaultSecret,
    deleteVaultSecret,

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
