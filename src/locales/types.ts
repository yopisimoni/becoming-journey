import { EntryIntent, InteractionMode, GuidedStage } from '@/types';

export interface TranslationDictionary {
  localeName: string;
  isRtl: boolean;
  nav: {
    title: string;
    tagline: string;
    prototypeBadge: string;
    guidedMode: string;
    journalMode: string;
    listenMode: string;
    journeyMap: string;
    progress: string;
    safetyButton: string;
    wipeButton: string;
    exportButton: string;
    storageNotice: string;
    storageSession: string;
    storageLocal: string;
    reducedMotion: string;
  };
  disclaimer: {
    bannerText: string;
    learnMore: string;
    modalTitle: string;
    modalText: string;
    crisisHeading: string;
    crisisText: string;
    crisisHotlines: {
      name: string;
      number: string;
      description: string;
    }[];
    close: string;
  };
  welcome: {
    question: string;
    subtitle: string;
    selectPrompt: string;
    intents: Record<
      EntryIntent,
      {
        title: string;
        tagline: string;
        description: string;
      }
    >;
    chooseMode: string;
    modes: Record<
      InteractionMode,
      {
        name: string;
        description: string;
      }
    >;
  };
  stages: Record<GuidedStage, { label: string; stepNumber: number }>;
  scripts: Record<
    EntryIntent,
    {
      tone: string;
      supportTitle: string;
      supportSelectors: {
        id: string;
        label: string;
      }[];
      openPrompt: string;
      openPlaceholder: string;
      explorationMirror: string;
      draftInsight: string;
      optionalMicroStep: string;
      listenGrounding: string;
    }
  >;
  fallback: {
    heading: string;
    notice: string;
    suggestion: string;
    continueAnyway: string;
    rephrase: string;
  };
  guided: {
    expressStepTitle: string;
    expressStepSubtitle: string;
    supportStepTitle: string;
    supportStepSubtitle: string;
    exploreStepTitle: string;
    exploreStepSubtitle: string;
    confirmStepTitle: string;
    confirmStepSubtitle: string;
    confirmNotice: string;
    chooseStepTitle: string;
    chooseStepSubtitle: string;
    reflectStepTitle: string;
    reflectStepSubtitle: string;
    draftLabel: string;
    editableLabel: string;
    stepDraftLabel: string;
    confirmInsightBtn: string;
    editInsightBtn: string;
    discardInsightBtn: string;
    stepAcceptedBtn: string;
    stepSkippedBtn: string;
    saveToMapBtn: string;
    savedNotice: string;
    startOverBtn: string;
    nextStepBtn: string;
    prevStepBtn: string;
    charCount: string;
  };
  journal: {
    title: string;
    subtitle: string;
    privacyNotice: string;
    placeholder: string;
    wordCount: string;
    exportTxt: string;
    clearEntry: string;
    saveEntry: string;
    entrySaved: string;
    entriesHeading: string;
    noEntries: string;
    deleteEntry: string;
  };
  listen: {
    title: string;
    subtitle: string;
    calmMessage: string;
    breathPrompt: string;
    inBreath: string;
    holdBreath: string;
    outBreath: string;
    finishListening: string;
  };
  journeyMap: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    startReflection: string;
    statusConfirmed: string;
    statusDraft: string;
    statusDiscarded: string;
    microStepLabel: string;
    dateLabel: string;
    deleteCard: string;
  };
  progress: {
    title: string;
    subtitle: string;
    noStreaksNotice: string;
    momentsTitle: string;
    momentsSubtitle: string;
    addMomentPlaceholder: string;
    addMomentBtn: string;
    emptyMoments: string;
    totalInsights: string;
    totalReflections: string;
  };
  dataManagement: {
    wipeModalTitle: string;
    wipeModalWarning: string;
    confirmWipe: string;
    cancel: string;
    dataExported: string;
    exportJson: string;
    exportTxt: string;
    storageModeTitle: string;
    sessionModeDesc: string;
    localModeDesc: string;
    sharedDeviceWarning: string;
  };
}
