import { EntryIntent, InteractionMode, GuidedStage } from '@/types';

export interface DiagnosticOption {
  id: string;
  label: string;
  detail: string;
}

export interface IntentDiagnostic {
  diagnosticQuestion: string;
  diagnosticOptions: DiagnosticOption[];
  deepeningQuestion: string;
  deepeningOptions: { id: string; label: string }[];
  threeInsights: [string, string, string];
  threeSteps: [string, string, string];
}

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
    themeToggle: string;
    aiSettingsBtn: string;
    sanctuaryTab: string;
    journalTab: string;
    mapTab: string;
    momentsTab: string;
    breatheTab?: string;
    quizTab?: string;
    calendarTab?: string;
    vaultTab?: string;
    settingsTab?: string;
    morningTab?: string;
    eveningTab?: string;
    goodVibesTab?: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    guest: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    avatarLabel: string;
    createAccount: string;
    signInPrompt: string;
    signUpPrompt: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    welcomeBack: string;
    privacyNote: string;
    invalidCredentials: string;
    emailExists: string;
    profile: string;
    lotusAvatar: string;
    mountainAvatar: string;
    waveAvatar: string;
    leafAvatar: string;
    starAvatar: string;
    forgotPassword?: string;
    sendResetLink?: string;
    resetSentMessage?: string;
    continueAsGuest?: string;
    deleteAccount?: string;
    deleteAccountWarning?: string;
    firebaseNotice?: string;
    localGuestNotice?: string;
  };
  sanctuary: {
    headline: string;
    subtext: string;
    beginWithSound: string;
    beginSilence: string;
    cardProgressStep: string;
    cardBack: string;
    writeOwnWordsPrompt: string;
    orSelectBelow: string;
    pickInsightHeading: string;
    pickStepHeading: string;
    customStepPlaceholder: string;
  };
  audio: {
    pillLabel: string;
    sanctuary: string;
    rain: string;
    bowl: string;
    mute: string;
    studioTitle?: string;
    studioSubtitle?: string;
    volumeLabel?: string;
    catCalm?: string;
    catFocus?: string;
    catNature?: string;
    solfeggio?: string;
    ocean?: string;
    alpha?: string;
    rhodes?: string;
    brown?: string;
    breeze?: string;
    hearth?: string;
  };
  breathing?: {
    studioTitle: string;
    studioSubtitle: string;
    inhale: string;
    hold: string;
    exhale: string;
    rest: string;
    secondsLabel: string;
    cyclesCompleted: string;
    pause: string;
    resume: string;
    t478Name: string;
    t478Tagline: string;
    tBoxName: string;
    tBoxTagline: string;
    tCoherentName: string;
    tCoherentTagline: string;
    somaticTitle: string;
    somaticSubtitle: string;
    unclenchJaw: string;
    dropShoulders: string;
    softenEyes: string;
    openHands: string;
    released: string;
  };
  quiz?: {
    title: string;
    subtitle: string;
    chooseLength: string;
    retake: string;
  };
  calendar?: {
    title: string;
    subtitle: string;
    addGoal: string;
    dayHorizon: string;
    weekHorizon: string;
    monthHorizon: string;
    yearHorizon: string;
    anytimeHorizon: string;
    newGoalTitle: string;
  };
  habits?: {
    title: string;
    subtitle: string;
  };
  vault?: {
    title: string;
    subtitle: string;
    lockboxTitle: string;
  };
  aiBridge: {
    modalTitle: string;
    description: string;
    enableToggle: string;
    endpointLabel: string;
    apiKeyLabel: string;
    modelLabel: string;
    saveBtn: string;
    privacyNotice: string;
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
  onboarding?: {
    tourBadge: string;
    stepOf: string;
    card1: {
      badge: string;
      title: string;
      subtitle: string;
      paragraphs: string[];
    };
    card2: {
      badge: string;
      title: string;
      subtitle: string;
      tools: {
        title: string;
        desc: string;
      }[];
    };
    card3: {
      badge: string;
      title: string;
      subtitle: string;
      paragraphs: string[];
    };
    consentCheckbox: string;
    agreeButton: string;
    nextButton: string;
    prevButton: string;
    closeTour: string;
  };
  atmosphere?: {
    switcherTitle: string;
    twilightName: string;
    twilightDesc: string;
    mossName: string;
    mossDesc: string;
    dawnName: string;
    dawnDesc: string;
    midnightName: string;
    midnightDesc: string;
    autoAtmosphere: string;
    autoAtmosphereDesc: string;
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
      diagnostic: IntentDiagnostic;
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
  evolution?: {
    stageTitle: string;
    xpLabel: string;
    levelLabel: string;
    nextStageLabel: string;
  };
  pillars?: {
    title: string;
    subtitle: string;
    beautiful: string;
    healthy: string;
    helping: string;
    notAnAngel: string;
  };
  shift?: {
    impulseResetTitle: string;
    impulseResetSubtitle: string;
    triggerBtn: string;
    boundaryShieldTitle: string;
    releaseJudgmentTitle: string;
    focusAnchorTitle: string;
  };
  rituals?: {
    morningTitle: string;
    morningSubtitle: string;
    howDoYouFeel: string;
    feelings: Record<string, string>;
    setIntention: string;
    intentionPlaceholder: string;
    microActionLabel: string;
    microActionPlaceholder: string;
    morningReflection: string;
    startBreathing: string;
    saveIntention: string;
    markActionDone: string;
    actionDoneCelebration: string;
    skipStep: string;
    eveningTitle: string;
    eveningSubtitle: string;
    shiftToNight: string;
    somaticRelax: string;
    goodMomentsPrompt: string;
    privateReleasePrompt: string;
    dissolveIntoNight: string;
    leaveTomorrowForTomorrow: string;
    closingSlumber: string;
  };
  goodVibes?: {
    studioTitle: string;
    studioSubtitle: string;
    selectTemplate: string;
    templates: Record<string, string>;
    contentTypes: Record<string, string>;
    quoteSource: string;
    downloadPng: string;
    shareCard: string;
    copyText: string;
    copied: string;
    watermarkLabel: string;
    privacyDisclaimer: string;
  };
  privacyData?: {
    title: string;
    subtitle: string;
    exportBackup: string;
    importBackup: string;
    importSuccess: string;
    importError: string;
    confirmImport: string;
    localDataOverview: string;
    whatIsStoredLocally: string;
    whatIsSentToFirebase: string;
    whatIsNeverShared: string;
  };
}
