export type Locale = 'en' | 'ar' | 'fr' | 'es' | 'it';

export type EntryIntent = 'lost' | 'goal' | 'struggle' | 'grow';

export type InteractionMode = 'guided' | 'journal' | 'listen';

export type GuidedStage = 'express' | 'explore' | 'confirm' | 'choose' | 'reflect';

export interface SupportSelectorOption {
  id: string;
  label: string;
  description?: string;
}

export interface DeterministicScript {
  intent: EntryIntent;
  tone: string;
  supportSelectors: SupportSelectorOption[];
  openPrompt: string;
  explorationMirror: string;
  draftInsight: string;
  optionalMicroStep: string;
  listenGrounding: string;
}

export interface JourneyMapCard {
  id: string;
  createdAt: string;
  intent: EntryIntent;
  draftInsight: string;
  confirmedInsight: string;
  microStep?: string;
  isConfirmed: boolean;
  status: 'draft' | 'confirmed' | 'discarded';
  notes?: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  content: string;
  wordCount: number;
  lastModifiedAt: string;
}

export interface MomentOfLight {
  id: string;
  date: string;
  text: string;
}

export interface UserSessionData {
  storageMode: 'session' | 'local';
  acknowledgedNotice: boolean;
  cards: JourneyMapCard[];
  journalEntries: JournalEntry[];
  moments: MomentOfLight[];
}
