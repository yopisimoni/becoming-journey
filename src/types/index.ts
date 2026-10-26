export type Locale = 'en' | 'ar' | 'fr' | 'es' | 'it';

export type EntryIntent = 'lost' | 'goal' | 'struggle' | 'grow';

export type InteractionMode = 'guided' | 'journal' | 'listen';

export type GuidedStage = 'express' | 'explore' | 'confirm' | 'choose' | 'reflect';

export type NavigationTab =
  | 'home'
  | 'map'
  | 'progress'
  | 'breathe'
  | 'quiz'
  | 'dashboard'
  | 'calendar'
  | 'vault'
  | 'habits'
  | 'settings';

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
  mediaId?: string;
  mediaType?: 'image' | 'video';
  mediaDataUrl?: string;
}

export type AvatarId = 'lotus' | 'mountain' | 'wave' | 'leaf' | 'star';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: AvatarId;
  createdAt: string;
}

export interface UserSessionData {
  storageMode: 'session' | 'local';
  acknowledgedNotice: boolean;
  cards: JourneyMapCard[];
  journalEntries: JournalEntry[];
  moments: MomentOfLight[];
}

// v0.4 Studio Types

export type BreathingTechniqueId = '478' | 'box' | 'coherent';

export interface BreathingTechnique {
  id: BreathingTechniqueId;
  name: string;
  subtitle: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  description: string;
}

export type QuizDimension = 'work' | 'life' | 'soul';
export type QuizLength = 10 | 20 | 30 | 40;
export type ArchetypeId = 'architect' | 'visionary' | 'creator' | 'seeker';

export interface QuizQuestion {
  id: string;
  dimension: QuizDimension;
  question: string;
  options: {
    id: string;
    label: string;
    archetypeScore: ArchetypeId;
  }[];
}

export interface QuizResult {
  id: string;
  completedAt: string;
  length: QuizLength;
  archetype: ArchetypeId;
  archetypeName: string;
  tagline: string;
  summary: string;
  dimensionScores: {
    work: number;
    life: number;
    soul: number;
    clarity: number;
  };
  fuels: string[];
  drains: string[];
}

export type GoalHorizon = 'day' | 'week' | 'month' | 'year' | 'anytime';
export type GoalCategory = 'peace' | 'work' | 'health' | 'relationships' | 'creativity';

export interface LifeGoal {
  id: string;
  title: string;
  horizon: GoalHorizon;
  category: GoalCategory;
  completed: boolean;
  createdAt: string;
  targetDate?: string;
  notes?: string;
}

export interface HabitItem {
  id: string;
  title: string;
  type: 'seed' | 'weight'; // seed = start doing, weight = stop doing
  category: string;
  nurturedCount: number;
  lastNurturedDate?: string;
  mediaId?: string;
  mediaDataUrl?: string;
  createdAt: string;
}

export interface VaultSecret {
  id: string;
  createdAt: string;
  title: string;
  sealedContent: string;
  category: string;
}

export interface DailyQuote {
  quote: string;
  author: string;
  theme: string;
}

// --- v0.5 SCIENTIFIC FRAMEWORKS & HUMAN AWAKENING ---
export type FrameworkId =
  | 'compass'
  | 'big5'
  | 'locus_of_control'
  | 'empathizing_systemizing'
  | 'mbti16'
  | 'true_colours';

export interface ScientificFrameworkMeta {
  id: FrameworkId;
  name: string;
  tagline: string;
  scientificOrigin: string;
  description: string;
  questionCount: number;
  timeEstimate: string;
}

export interface GenericQuizQuestion {
  id: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    scoreKey: string;
    scoreValue: number;
  }[];
}

export interface GenericQuizResult {
  frameworkId: FrameworkId;
  frameworkName: string;
  completedAt: string;
  primaryResult: string;
  subtitle: string;
  summary: string;
  scores: Record<string, number>;
  strengths: string[];
  growthEdges: string[];
  empoweringMantra: string;
}

// --- v0.5 ZERO TO HERO EVOLUTION SYSTEM ---
export type EvolutionStageLevel = 1 | 2 | 3 | 4 | 5;

export interface EvolutionStageInfo {
  level: EvolutionStageLevel;
  title: string;
  subtitle: string;
  mantra: string;
  description: string;
  requiredXp: number;
}

export interface EvolutionProgress {
  totalXp: number;
  currentLevel: EvolutionStageLevel;
  activitiesCompleted: number;
  history: {
    activity: string;
    xpEarned: number;
    timestamp: string;
  }[];
}

// --- v0.5 4 PILLARS OF LIVING RIGHT ---
export interface DailyLivingPillars {
  date: string;
  beautifulMoment: string;
  healthyNourishment: string;
  helpingThoseWhoMoveYou: string;
  notAnAngelAffirmation: boolean;
}

// --- v0.5 LIFE DREAM ---
export interface CoreLifeDream {
  dreamTitle: string;
  whyItMatters: string;
  horizonAnchor: string;
  dailyActionCommitment: string;
  updatedAt: string;
}

// --- v0.5 ECHOES STORIES ---
export interface EchoStory {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  narrative: string[];
  takeaway: string;
  authorOrOrigin: string;
}
