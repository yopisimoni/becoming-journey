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
  EvolutionProgress,
  DailyLivingPillars,
  CoreLifeDream,
  FrameworkId,
  AtmosphereMode,
  SanctuaryBackupPayload,
  MorningRitualEntry,
  EveningRitualEntry,
} from '@/types';
import { getDictionary, defaultLocale, TranslationDictionary } from '@/locales';
import { soundEngine, SoundscapePreset } from '@/lib/audio/soundEngine';
import { AISettings, DEFAULT_AI_SETTINGS } from '@/lib/engine/aiAdapter';
import { clearAllMedia } from '@/lib/storage/mediaDb';
import { INITIAL_EVOLUTION_PROGRESS, calculateEvolutionLevel } from '@/lib/evolution/evolutionEngine';
import {
  isFirebaseConfigured,
  firebaseSignUp,
  firebaseSignIn,
  firebaseSignOut,
  firebaseDeleteAccount,
  subscribeToAuthChanges,
} from '@/lib/auth/firebaseAuth';

export type ThemeMode = 'light' | 'twilight';

interface StoredAccount extends UserProfile {
  passwordHash: string;
}

interface AppContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: TranslationDictionary;
  isRtl: boolean;

  // User Authentication & Profile
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signUp: (name: string, email: string, password: string, avatar?: AvatarId) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  deleteAccount: (passwordConfirm: string) => Promise<{ success: boolean; error?: string }>;
  importDataJson: (jsonStr: string) => { success: boolean; message?: string; error?: string };

  // Theme (Light vs Twilight Sanctuary)
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Atmosphere Canvas (Mood Shifting Backgrounds)
  atmosphere: AtmosphereMode;
  setAtmosphere: (mode: AtmosphereMode, isManual?: boolean) => void;
  autoAtmosphere: boolean;
  setAutoAtmosphere: (enabled: boolean) => void;

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

  // Evolution System (Zero to Hero)
  evolution: EvolutionProgress;
  addEvolutionXp: (amount: number, reason: string) => void;

  // The 4 Daily Pillars of Living Right
  dailyPillars: DailyLivingPillars;
  updateDailyPillars: (pillars: Partial<DailyLivingPillars>) => void;

  // Core Life Dream
  coreLifeDream: CoreLifeDream;
  setCoreLifeDream: (dream: CoreLifeDream) => void;

  // Active Scientific Framework
  activeFramework: FrameworkId;
  setActiveFramework: (framework: FrameworkId) => void;

  // Data Sovereignty
  wipeAllData: () => void;
  exportDataJson: () => void;
  exportDataTxt: () => void;

  // Safety Modal
  isSafetyModalOpen: boolean;
  setSafetyModalOpen: (open: boolean) => void;

  // Onboarding & Consent Gate (v0.6)
  isOnboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  hasConsented: boolean;
  completeOnboarding: () => void;
}

const STORAGE_KEY_CARDS = 'becoming_journey_cards_v1';
const STORAGE_KEY_JOURNAL = 'becoming_journal_entries_v1';
const STORAGE_KEY_MOMENTS = 'becoming_moments_v1';
const STORAGE_KEY_GOALS = 'becoming_goals_v1';
const STORAGE_KEY_HABITS = 'becoming_habits_v1';
const STORAGE_KEY_VAULT = 'becoming_vault_secrets_v1';
const STORAGE_KEY_EVOLUTION = 'becoming_evolution_v1';
const STORAGE_KEY_PILLARS = 'becoming_daily_pillars_v1';
const STORAGE_KEY_DREAM = 'becoming_core_dream_v1';
const STORAGE_KEY_MODE = 'becoming_storage_mode_v1';
const STORAGE_KEY_LOCALE = 'becoming_locale_v1';
const STORAGE_KEY_MOTION = 'becoming_reduced_motion_v1';
const STORAGE_KEY_THEME = 'becoming_theme_mode_v1';
const STORAGE_KEY_AI = 'becoming_ai_settings_v1';
const STORAGE_KEY_REGISTERED_USERS = 'becoming_registered_users_v1';
const STORAGE_KEY_ACTIVE_USER = 'becoming_active_user_v1';
const STORAGE_KEY_ONBOARDED = 'becoming_onboarded';
const STORAGE_KEY_CONSENT = 'becoming_consent_agreed';
const STORAGE_KEY_ATMOSPHERE = 'becoming_atmosphere_mode';
const STORAGE_KEY_AUTO_ATMOSPHERE = 'becoming_auto_atmosphere';
const STORAGE_KEY_MORNING = 'becoming_morning_ritual_v1';
const STORAGE_KEY_EVENING = 'becoming_evening_ritual_v1';

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
  const [atmosphere, setAtmosphereState] = useState<AtmosphereMode>('dawn');
  const [preferredAtmosphere, setPreferredAtmosphere] = useState<AtmosphereMode>('dawn');
  const [autoAtmosphere, setAutoAtmosphereState] = useState<boolean>(true);
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
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  // App Data
  const [cards, setCards] = useState<JourneyMapCard[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moments, setMoments] = useState<MomentOfLight[]>([]);
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [vaultSecrets, setVaultSecrets] = useState<VaultSecret[]>([]);

  // v0.5 Data
  const [evolution, setEvolution] = useState<EvolutionProgress>(INITIAL_EVOLUTION_PROGRESS);
  const [dailyPillars, setDailyPillars] = useState<DailyLivingPillars>({
    date: new Date().toISOString().split('T')[0],
    beautifulMoment: '',
    healthyNourishment: '',
    helpingThoseWhoMoveYou: '',
    notAnAngelAffirmation: false,
  });
  const [coreLifeDream, setCoreLifeDreamState] = useState<CoreLifeDream>({
    dreamTitle: 'Live with grounded peace, self-mastery, and clear purpose',
    whyItMatters: 'To make my highest potential real and be a steady blessing to those I love',
    horizonAnchor: 'This Year',
    dailyActionCommitment: 'Take small responsible steps every morning and protect my quiet evening peace',
    updatedAt: new Date().toISOString(),
  });
  const [activeFramework, setActiveFramework] = useState<FrameworkId>('compass');

  const dict = useMemo(() => getDictionary(locale), [locale]);
  const isRtl = useMemo(() => locale === 'ar', [locale]);

  const getUserScopedKey = (
    type: 'cards' | 'journal' | 'moments' | 'goals' | 'habits' | 'vault' | 'evolution' | 'pillars' | 'dream',
    userId?: string
  ) => {
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
      case 'evolution':
        return STORAGE_KEY_EVOLUTION;
      case 'pillars':
        return STORAGE_KEY_PILLARS;
      case 'dream':
        return STORAGE_KEY_DREAM;
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

      const evolutionKey = getUserScopedKey('evolution', targetUser?.id);
      const savedEvolution = store.getItem(evolutionKey);
      setEvolution(savedEvolution ? JSON.parse(savedEvolution) : INITIAL_EVOLUTION_PROGRESS);

      const pillarsKey = getUserScopedKey('pillars', targetUser?.id);
      const savedPillars = store.getItem(pillarsKey);
      if (savedPillars) {
        setDailyPillars(JSON.parse(savedPillars));
      }

      const dreamKey = getUserScopedKey('dream', targetUser?.id);
      const savedDream = store.getItem(dreamKey);
      if (savedDream) {
        setCoreLifeDreamState(JSON.parse(savedDream));
      }
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

      const savedAtmosphere = (store.getItem(STORAGE_KEY_ATMOSPHERE) ||
        localStorage.getItem(STORAGE_KEY_ATMOSPHERE)) as AtmosphereMode | null;
      if (savedAtmosphere && ['twilight', 'moss', 'dawn', 'midnight'].includes(savedAtmosphere)) {
        setAtmosphereState(savedAtmosphere);
        setPreferredAtmosphere(savedAtmosphere);
        if (savedAtmosphere === 'twilight' || savedAtmosphere === 'midnight') {
          setThemeModeState('twilight');
        } else if (savedAtmosphere === 'dawn') {
          setThemeModeState('light');
        }
      } else if (savedTheme === 'twilight') {
        setAtmosphereState('twilight');
        setPreferredAtmosphere('twilight');
      }

      const savedAutoAtmosphere =
        store.getItem(STORAGE_KEY_AUTO_ATMOSPHERE) ||
        localStorage.getItem(STORAGE_KEY_AUTO_ATMOSPHERE);
      if (savedAutoAtmosphere !== null) {
        setAutoAtmosphereState(savedAutoAtmosphere === 'true');
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

      // Onboarding & Mandatory Consent Gate check
      try {
        const onboarded = localStorage.getItem(STORAGE_KEY_ONBOARDED);
        const consented = localStorage.getItem(STORAGE_KEY_CONSENT);
        if (onboarded === 'true' && consented === 'true') {
          setHasConsented(true);
        } else {
          setOnboardingOpen(true);
        }
      } catch {
        // Storage might be disabled
      }
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

  // Update theme class and data-atmosphere on HTML element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-atmosphere', atmosphere);
      if (themeMode === 'twilight' || atmosphere === 'twilight' || atmosphere === 'midnight') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [themeMode, atmosphere]);

  // Contextual Auto-Atmosphere based on active studio
  useEffect(() => {
    if (!autoAtmosphere) return;

    if (activeTab === 'vault') {
      setAtmosphereState('midnight');
    } else if (activeTab === 'breathe' || (activeTab === 'home' && activeMode === 'listen')) {
      setAtmosphereState('moss');
    } else {
      setAtmosphereState(preferredAtmosphere);
    }
  }, [activeTab, activeMode, autoAtmosphere, preferredAtmosphere]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_LOCALE, newLocale);
    } catch {
      // ignore
    }
  };

  const setAtmosphere = (newAtmosphere: AtmosphereMode, isManual = true) => {
    setAtmosphereState(newAtmosphere);
    if (isManual) {
      setPreferredAtmosphere(newAtmosphere);
      try {
        const store = storageMode === 'local' ? localStorage : sessionStorage;
        store.setItem(STORAGE_KEY_ATMOSPHERE, newAtmosphere);
        localStorage.setItem(STORAGE_KEY_ATMOSPHERE, newAtmosphere);
      } catch {
        // ignore
      }
      if (newAtmosphere === 'twilight' || newAtmosphere === 'midnight') {
        setThemeModeState('twilight');
      } else if (newAtmosphere === 'dawn') {
        setThemeModeState('light');
      }
    }
  };

  const setAutoAtmosphere = (enabled: boolean) => {
    setAutoAtmosphereState(enabled);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY_AUTO_ATMOSPHERE, String(enabled));
      localStorage.setItem(STORAGE_KEY_AUTO_ATMOSPHERE, String(enabled));
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
    if (newMode === 'twilight' && atmosphere === 'dawn') {
      setAtmosphere('twilight', true);
    } else if (newMode === 'light' && (atmosphere === 'twilight' || atmosphere === 'midnight')) {
      setAtmosphere('dawn', true);
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

  const completeOnboarding = () => {
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDED, 'true');
      localStorage.setItem(STORAGE_KEY_CONSENT, 'true');
    } catch {
      // ignore
    }
    setHasConsented(true);
    setOnboardingOpen(false);
    playSingingBowl();
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

  const signUp = async (name: string, email: string, password: string, avatar: AvatarId = 'lotus') => {
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured()) {
      const fbRes = await firebaseSignUp(name, email, password, avatar);
      if (!fbRes.success) {
        return { success: false, error: fbRes.error };
      }
      if (fbRes.user) {
        setUser(fbRes.user);
        setStorageModeState('local');
        localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(fbRes.user));
        loadUserData(fbRes.user, localStorage);
      }
      return { success: true };
    }

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
        isGuest: false,
        authProvider: 'local',
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

      loadUserData(newProfile, localStorage);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to access local storage.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured()) {
      const fbRes = await firebaseSignIn(email, password);
      if (!fbRes.success) {
        return { success: false, error: fbRes.error };
      }
      if (fbRes.user) {
        setUser(fbRes.user);
        setStorageModeState('local');
        localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(fbRes.user));
        loadUserData(fbRes.user, localStorage);
      }
      return { success: true };
    }

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
        isGuest: false,
        authProvider: 'local',
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

  const signOut = async () => {
    try {
      if (isFirebaseConfigured()) {
        await firebaseSignOut();
      }
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    } catch {
      // ignore
    }
    setUser(null);
    const store = storageMode === 'local' ? localStorage : sessionStorage;
    loadUserData(null, store);
  };

  const deleteAccount = async (passwordConfirm: string) => {
    try {
      if (isFirebaseConfigured() && user?.authProvider === 'firebase') {
        const fbRes = await firebaseDeleteAccount(passwordConfirm);
        if (!fbRes.success) {
          return { success: false, error: fbRes.error };
        }
      } else if (user) {
        const usersStr = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
        const registered: StoredAccount[] = usersStr ? JSON.parse(usersStr) : [];
        const filtered = registered.filter((u) => u.id !== user.id);
        localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(filtered));
      }

      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
      setUser(null);
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      loadUserData(null, store);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete account.' };
    }
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
    addEvolutionXp(40, 'Confirmed a Soul Insight & Step');
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
    addEvolutionXp(30, 'Deepened Free Journal Reflection');
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
    addEvolutionXp(20, 'Anchored a Moment of Light');
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
    addEvolutionXp(25, 'Planted a Life Horizon Milestone');
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('goals'), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleGoal = (id: string) => {
    let wasCompleted = false;
    const updated = goals.map((g) => {
      if (g.id === id) {
        wasCompleted = !g.completed;
        return { ...g, completed: !g.completed };
      }
      return g;
    });
    setGoals(updated);
    if (wasCompleted) {
      addEvolutionXp(35, 'Completed Life Milestone');
    }
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
    addEvolutionXp(25, 'Nurtured Healthy Habit Seed');
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
    addEvolutionXp(25, 'Nurtured Healthy Habit Seed');
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
    addEvolutionXp(25, 'Nurtured Healthy Habit Seed');
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

  // v0.5 Evolution Engine
  const addEvolutionXp = (amount: number, reason: string) => {
    setEvolution((prev) => {
      const newXp = prev.totalXp + amount;
      const newLevel = calculateEvolutionLevel(newXp);
      const updated: EvolutionProgress = {
        totalXp: newXp,
        currentLevel: newLevel,
        activitiesCompleted: prev.activitiesCompleted + 1,
        history: [
          {
            activity: reason,
            xpEarned: amount,
            timestamp: new Date().toISOString(),
          },
          ...prev.history.slice(0, 24),
        ],
      };
      try {
        const store = storageMode === 'local' ? localStorage : sessionStorage;
        store.setItem(getUserScopedKey('evolution'), JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // v0.5 4 Daily Pillars
  const updateDailyPillars = (partial: Partial<DailyLivingPillars>) => {
    setDailyPillars((prev) => {
      const updated: DailyLivingPillars = {
        ...prev,
        ...partial,
        date: new Date().toISOString().split('T')[0],
      };
      try {
        const store = storageMode === 'local' ? localStorage : sessionStorage;
        store.setItem(getUserScopedKey('pillars'), JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addEvolutionXp(20, 'Nurtured Daily Living Pillar');
  };

  // v0.5 Core Life Dream
  const setCoreLifeDream = (dream: CoreLifeDream) => {
    setCoreLifeDreamState(dream);
    try {
      const store = storageMode === 'local' ? localStorage : sessionStorage;
      store.setItem(getUserScopedKey('dream'), JSON.stringify(dream));
    } catch {
      // ignore
    }
    addEvolutionXp(30, 'Anchored Core Life Dream to Reality');
  };

  const wipeAllData = () => {
    setCards([]);
    setJournalEntries([]);
    setMoments([]);
    setGoals([]);
    setHabits([]);
    setVaultSecrets([]);
    setEvolution(INITIAL_EVOLUTION_PROGRESS);
    setDailyPillars({
      date: new Date().toISOString().split('T')[0],
      beautifulMoment: '',
      healthyNourishment: '',
      helpingThoseWhoMoveYou: '',
      notAnAngelAffirmation: false,
    });
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
      store.removeItem(getUserScopedKey('evolution'));
      store.removeItem(getUserScopedKey('pillars'));
      store.removeItem(getUserScopedKey('dream'));
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
    let morningData: MorningRitualEntry[] = [];
    let eveningData: EveningRitualEntry[] = [];
    try {
      const mStr = localStorage.getItem(STORAGE_KEY_MORNING);
      if (mStr) morningData = [JSON.parse(mStr)];
      const eStr = localStorage.getItem(STORAGE_KEY_EVENING);
      if (eStr) eveningData = [JSON.parse(eStr)];
    } catch {
      // ignore
    }

    const exportPayload: SanctuaryBackupPayload = {
      app: 'BECOMING',
      schemaVersion: '0.8.0',
      exportedAt: new Date().toISOString(),
      userId: user?.id,
      isGuest: !user,
      storageMode,
      locale,
      themeMode,
      atmosphereMode: atmosphere,
      cards,
      journeyCards: cards,
      journalEntries,
      moments,
      momentsOfLight: moments,
      goals,
      lifeGoals: goals,
      habits,
      habitLedger: habits,
      vaultSecretsCount: vaultSecrets.length,
      morningRitual: morningData[0],
      morningRituals: morningData,
      eveningRitual: eveningData[0],
      eveningRituals: eveningData,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `becoming-sanctuary-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJson = (jsonString: string): { success: boolean; message?: string; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || parsed.app !== 'BECOMING') {
        return { success: false, error: 'Invalid file: Not a recognized BECOMING backup file.' };
      }

      let restoredCount = 0;
      const store = storageMode === 'local' ? localStorage : sessionStorage;

      // Restore Journey Cards
      const rawCards = parsed.cards || parsed.journeyCards;
      if (Array.isArray(rawCards)) {
        setCards(rawCards);
        store.setItem(getUserScopedKey('cards'), JSON.stringify(rawCards));
        restoredCount += rawCards.length;
      }

      // Restore Journal Entries
      if (Array.isArray(parsed.journalEntries)) {
        setJournalEntries(parsed.journalEntries);
        store.setItem(getUserScopedKey('journal'), JSON.stringify(parsed.journalEntries));
        restoredCount += parsed.journalEntries.length;
      }

      // Restore Moments of Light
      const rawMoments = parsed.moments || parsed.momentsOfLight;
      if (Array.isArray(rawMoments)) {
        setMoments(rawMoments);
        store.setItem(getUserScopedKey('moments'), JSON.stringify(rawMoments));
        restoredCount += rawMoments.length;
      }

      // Restore Life Goals
      const rawGoals = parsed.goals || parsed.lifeGoals;
      if (Array.isArray(rawGoals)) {
        setGoals(rawGoals);
        store.setItem(getUserScopedKey('goals'), JSON.stringify(rawGoals));
        restoredCount += rawGoals.length;
      }

      // Restore Habit Ledger
      const rawHabits = parsed.habits || parsed.habitLedger;
      if (Array.isArray(rawHabits)) {
        setHabits(rawHabits);
        store.setItem(getUserScopedKey('habits'), JSON.stringify(rawHabits));
        restoredCount += rawHabits.length;
      }

      // Restore Morning Rituals if present
      const morningEntry = parsed.morningRitual || (Array.isArray(parsed.morningRituals) ? parsed.morningRituals[0] : null);
      if (morningEntry) {
        localStorage.setItem(STORAGE_KEY_MORNING, JSON.stringify(morningEntry));
      }

      // Restore Evening Rituals if present
      const eveningEntry = parsed.eveningRitual || (Array.isArray(parsed.eveningRituals) ? parsed.eveningRituals[0] : null);
      if (eveningEntry) {
        localStorage.setItem(STORAGE_KEY_EVENING, JSON.stringify(eveningEntry));
      }

      return {
        success: true,
        message: `Successfully imported backup with ${restoredCount} restored sanctuary items.`,
      };
    } catch {
      return { success: false, error: 'JSON parsing failed. Ensure file is uncorrupted.' };
    }
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
    deleteAccount,
    importDataJson,

    themeMode,
    setThemeMode,

    atmosphere,
    setAtmosphere,
    autoAtmosphere,
    setAutoAtmosphere,

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

    // v0.5 Evolution & Human Awakening
    evolution,
    addEvolutionXp,
    dailyPillars,
    updateDailyPillars,
    coreLifeDream,
    setCoreLifeDream,
    activeFramework,
    setActiveFramework,

    wipeAllData,
    exportDataJson,
    exportDataTxt,

    isSafetyModalOpen,
    setSafetyModalOpen,

    // v0.6 Onboarding & Consent
    isOnboardingOpen,
    setOnboardingOpen,
    hasConsented,
    completeOnboarding,
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
