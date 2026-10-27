'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { EntryIntent, InteractionMode } from '@/types';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import {
  SanctuaryLotusOrbArt,
  LostCompassMistArt,
  GoalMountainSunriseArt,
  StruggleWaterShelterArt,
  GrowBotanicalLeavesArt,
} from '@/components/illustrations/AtmosphereArt';
import { Volume2, VolumeX, ArrowLeft, Feather, Sparkles, Compass, Shield, Eye, Sun, Moon, Wind, CheckCircle2, ArrowRight } from 'lucide-react';
import { TheBecomingHorizon, AtmosphericOrb, CinematicReveal } from '@/components/motion';

export function WelcomeView() {
  const {
    dict,
    locale,
    sanctuaryStep,
    setSanctuaryStep,
    setCurrentIntent,
    setActiveMode,
    setActiveTab,
    soundPreset,
    setSoundPreset,
    reducedMotion,
    isRtl,
    user,
  } = useApp();

  const [showHorizon, setShowHorizon] = useState(false);
  const [journeyPhase, setJourneyPhase] = useState(0);
  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem('becoming_journey_phase_v1'));
      if (Number.isInteger(saved) && saved >= 0 && saved <= 4) setJourneyPhase(saved);
    } catch { /* Local storage can be unavailable in private browsing. */ }
  }, []);

  const changeJourneyPhase = (next: number) => {
    setJourneyPhase(next);
    try { window.localStorage.setItem('becoming_journey_phase_v1', String(next)); } catch { /* Ephemeral journey still works. */ }
  };

  const journeyCopy = locale === 'ar' ? {
    eyebrow: 'رحلتك الخاصة', title: 'ما خطوتك التالية؟', subtitle: 'اختر ما يفيدك الآن. لا نقاط ولا ضغط ولا عقاب على الغياب.',
    phases: ['اكتشف', 'افهم', 'اختر', 'جرّب', 'راجع'],
    descriptions: ['ابدأ بتحديد ما يشغل بالك', 'اكتب أفكارك لتفهمها', 'حدد خطوة واحدة صغيرة', 'جرّب ممارسة بسيطة', 'راجع ما تعلمته'],
    action: 'ابدأ هذه الخطوة', progress: 'يمكنك تغيير المرحلة متى شئت',
  } : locale === 'fr' ? {
    eyebrow: 'Votre parcours', title: 'Quelle est la prochaine étape ?', subtitle: 'Choisissez ce qui vous aide. Sans points ni séries obligatoires.',
    phases: ['Découvrir', 'Comprendre', 'Choisir', 'Pratiquer', 'Réfléchir'],
    descriptions: ['Repérer ce qui compte', 'Explorer vos pensées', 'Choisir une petite action', 'Essayer une pratique douce', 'Revoir ce que vous avez appris'],
    action: 'Commencer cette étape', progress: 'Changez d’étape à tout moment',
  } : locale === 'es' ? {
    eyebrow: 'Tu camino', title: '¿Cuál es tu próximo paso?', subtitle: 'Elige lo que te ayuda. Sin puntos ni rachas obligatorias.',
    phases: ['Descubrir', 'Entender', 'Elegir', 'Practicar', 'Reflexionar'],
    descriptions: ['Reconoce lo importante', 'Explora tus pensamientos', 'Elige un pequeño paso', 'Prueba una práctica suave', 'Revisa lo aprendido'],
    action: 'Empezar este paso', progress: 'Puedes cambiar de paso cuando quieras',
  } : locale === 'it' ? {
    eyebrow: 'Il tuo percorso', title: 'Qual è il prossimo passo?', subtitle: 'Scegli ciò che ti aiuta. Senza punti o serie obbligatorie.',
    phases: ['Scopri', 'Comprendi', 'Scegli', 'Pratica', 'Rifletti'],
    descriptions: ['Nota ciò che conta', 'Esplora i tuoi pensieri', 'Scegli un piccolo passo', 'Prova una pratica gentile', 'Rivedi ciò che hai imparato'],
    action: 'Inizia questo passo', progress: 'Puoi cambiare fase quando vuoi',
  } : {
    eyebrow: 'Your personal journey', title: 'What comes next for you?', subtitle: 'Choose what helps today. No scores, streaks or pressure.',
    phases: ['Discover', 'Understand', 'Choose', 'Practice', 'Reflect'],
    descriptions: ['Notice what is on your mind', 'Explore your thoughts in writing', 'Choose one meaningful step', 'Try a gentle daily practice', 'Look back at what you learned'],
    action: 'Start this step', progress: 'You can change steps at any time',
  };

  const startJourneyPhase = () => {
    if (journeyPhase === 0 || journeyPhase === 2) { setSanctuaryStep(1); return; }
    if (journeyPhase === 1) { setActiveMode('journal'); return; }
    if (journeyPhase === 3) { setActiveTab('morning'); return; }
    setActiveTab('map');
  };


  const handleBeginWithSound = () => {
    setSoundPreset('sanctuary');
    setSanctuaryStep(1);
  };

  const handleBeginSilence = () => {
    setSoundPreset('none');
    setSanctuaryStep(1);
  };

  const handleSelectIntent = (intent: EntryIntent) => {
    setCurrentIntent(intent);
    setActiveMode('guided');
  };

  const handleSelectMode = (mode: InteractionMode) => {
    setActiveMode(mode);
    setCurrentIntent(null);
  };

  const springTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 120, damping: 20 };

  const isSoundPlaying = soundPreset !== 'none';

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 sm:py-12 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
      {/* Ambient background glow orbs */}
      <AtmosphericOrb
        color="rgba(217, 119, 54, 0.18)"
        size={420}
        blur={100}
        className="-top-12 -start-12"
      />
      <AtmosphericOrb
        color="rgba(129, 140, 248, 0.15)"
        size={400}
        blur={90}
        delay={2}
        className="-bottom-16 -end-16"
      />

      <AnimatePresence mode="wait">
        {sanctuaryStep === 0 ? (
          /* STEP 0: INTERACTIVE HERO SANCTUARY ENTRANCE */
          <motion.div
            key="entrance-step-0"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -20, scale: 0.98 }}
            transition={springTransition}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="p-4 sm:p-12 rounded-[2.5rem] bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-stone-200/80 dark:border-slate-800 shadow-2xl text-center space-y-8 relative overflow-hidden">
              {/* Radial gradient sheen */}
              <div
                aria-hidden="true"
                className="absolute -top-28 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none"
              />

              {/* Personalized Greeting Badge & Horizon Toggle */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/40 dark:border-amber-700/40 text-xs font-semibold text-amber-800 dark:text-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {user ? `${dict.auth.welcomeBack}, ${user.name}` : 'Welcome to BECOMING'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHorizon(!showHorizon)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-stone-500" />
                  <span>{showHorizon ? 'Hide Sky' : 'Living Horizon'}</span>
                </button>
              </div>

              {/* Collapsible The Becoming Horizon Sky Bar */}
              <AnimatePresence>
                {showHorizon && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <TheBecomingHorizon compact className="my-2" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Optional journey guide: user chooses the stage, never an imposed streak. */}
              <section aria-label={journeyCopy.eyebrow} className="relative z-10 text-start rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/90 dark:bg-slate-800 p-4 sm:p-5 space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-300">{journeyCopy.eyebrow}</p>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">{journeyCopy.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{journeyCopy.subtitle}</p>
                <div className="grid grid-cols-5 gap-1.5" role="group" aria-label={journeyCopy.eyebrow}>
                  {journeyCopy.phases.map((phase, i) => (
                    <button key={phase} type="button" onClick={() => changeJourneyPhase(i)} aria-pressed={journeyPhase === i} aria-label={`${i + 1}. ${phase}`} className={`min-h-12 rounded-lg p-1 flex flex-col justify-center items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-500 ${journeyPhase === i ? 'bg-indigo-700 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-indigo-100 dark:border-slate-600'}`}>
                      {i < journeyPhase ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                      <span className="text-[10px] leading-tight break-words text-center">{phase}</span>
                    </button>
                  ))}
                </div>
                <p aria-live="polite" className="text-sm font-medium text-slate-800 dark:text-slate-100">{journeyCopy.descriptions[journeyPhase]}</p>
                <button type="button" onClick={startJourneyPhase} className="w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-indigo-300 text-white dark:text-slate-950 font-semibold text-sm focus-visible:ring-2 focus-visible:ring-indigo-500">
                  {journeyCopy.action} <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400">{journeyCopy.progress}</p>
              </section>

              {/* Centerpiece Sacred Orb Art */}
              <div className="flex flex-col items-center justify-center relative">
                <SanctuaryLotusOrbArt size="hero" />

                {/* Animated sound wave bars indicator when audio is active */}
                {isSoundPlaying && !reducedMotion && (
                  <div className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                    <span className="w-1 h-3 bg-amber-500 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-4 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-6 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                    <span className="ms-1.5">{dict.audio.sanctuary.split('(')[0]}</span>
                  </div>
                )}
              </div>

              {/* Headline & Subtitle with high-contrast text and editorial serif */}
              <div className="space-y-3 relative z-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 dark:text-white tracking-tight leading-tight">
                  &ldquo;{dict.sanctuary.headline}&rdquo;
                </h1>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans max-w-lg mx-auto leading-relaxed">
                  {dict.sanctuary.subtext}
                </p>
              </div>

              {/* High-Contrast Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 relative z-10">
                <button
                  type="button"
                  onClick={handleBeginWithSound}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 text-sm font-bold shadow-xl shadow-stone-950/15 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <Volume2 className="w-4 h-4 text-amber-400 dark:text-amber-600 group-hover:scale-110 transition-transform" />
                  <span>{dict.sanctuary.beginWithSound}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBeginSilence}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-stone-100 dark:bg-slate-800/80 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 text-stone-800 dark:text-white text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <VolumeX className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>{dict.sanctuary.beginSilence}</span>
                </button>
              </div>

              {/* Context-Aware Daily Ritual Quick Access */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveTab('morning')}
                  className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/70 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-colors"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{dict.nav.morningTab || 'Morning Ritual'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('evening')}
                  className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/70 text-xs font-semibold text-indigo-800 dark:text-indigo-300 transition-colors"
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{dict.nav.eveningTab || 'Evening Ritual'}</span>
                </button>
              </div>

              {/* Quiet Privacy & Local-First Badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-600 dark:text-slate-400 border-t border-stone-100 dark:border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span>Zero Cloud AI</span>
                </span>
                <span className="text-stone-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-500" />
                  <span>100% Private to Device</span>
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* STEP 1: INTENT SELECTION BENTO CARD DECK */
          <motion.div
            key="deck-step-1"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -20, scale: 0.98 }}
            transition={springTransition}
            className="space-y-8"
          >
            {/* Step Header with Back Button & Glowing Dots */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSanctuaryStep(0)}
                className="px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700 text-xs font-bold text-stone-800 dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-700 flex items-center gap-2 shadow-xs transition-colors"
              >
                <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{dict.sanctuary.cardBack}</span>
              </button>

              {/* Glowing Step Dots */}
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-slate-700" />
                <span className="w-3 h-3 rounded-full bg-amber-600 dark:bg-amber-400 ring-4 ring-amber-500/20" />
              </div>
            </div>

            {/* Question Heading with crisp legibility */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-stone-900 dark:text-white">
                {dict.welcome.question}
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
                {dict.welcome.subtitle}
              </p>
            </div>

            {/* 4 Rich Bento Intent Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 pt-2">
              {/* Card 1: Lost (Indigo Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('lost')}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-indigo-200/90 dark:border-indigo-900/50 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-md hover:shadow-indigo-500/10 transition-all text-start flex flex-col justify-between gap-3 sm:gap-4 group focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-indigo-100/80 dark:bg-indigo-950/50">
                    <LostCompassMistArt size="sm" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/90 dark:bg-indigo-950/60 px-2.5 sm:px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    {dict.welcome.intents.lost.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {dict.welcome.intents.lost.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed font-normal">
                    {dict.welcome.intents.lost.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 2: Goal (Amber/Coral Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('goal')}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-amber-500/[0.08] via-orange-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-amber-200/90 dark:border-amber-900/50 hover:border-amber-500 dark:hover:border-amber-400 shadow-md hover:shadow-amber-500/10 transition-all text-start flex flex-col justify-between gap-3 sm:gap-4 group focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-100/80 dark:bg-amber-950/50">
                    <GoalMountainSunriseArt size="sm" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 px-2.5 sm:px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    {dict.welcome.intents.goal.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {dict.welcome.intents.goal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed font-normal">
                    {dict.welcome.intents.goal.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 3: Struggle (Teal/Emerald Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('struggle')}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-teal-500/[0.08] via-emerald-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-teal-200/90 dark:border-teal-900/50 hover:border-teal-500 dark:hover:border-teal-400 shadow-md hover:shadow-teal-500/10 transition-all text-start flex flex-col justify-between gap-3 sm:gap-4 group focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-teal-100/80 dark:bg-teal-950/50">
                    <StruggleWaterShelterArt size="sm" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-100/90 dark:bg-teal-950/60 px-2.5 sm:px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                    {dict.welcome.intents.struggle.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {dict.welcome.intents.struggle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed font-normal">
                    {dict.welcome.intents.struggle.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 4: Grow (Rose/Mint Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('grow')}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-rose-500/[0.08] via-emerald-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-rose-200/90 dark:border-rose-900/50 hover:border-rose-500 dark:hover:border-rose-400 shadow-md hover:shadow-rose-500/10 transition-all text-start flex flex-col justify-between gap-3 sm:gap-4 group focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-rose-100/80 dark:bg-rose-950/50">
                    <GrowBotanicalLeavesArt size="sm" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/60 px-2.5 sm:px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                    {dict.welcome.intents.grow.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {dict.welcome.intents.grow.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed font-normal">
                    {dict.welcome.intents.grow.description}
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Quick Access Floating Pills for Journal and Just Listen */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => handleSelectMode('journal')}
                className="min-h-11 px-4 sm:px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs font-bold text-stone-800 dark:text-slate-100 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Feather className="w-3.5 h-3.5 text-emerald-500" />
                <span>{dict.welcome.modes.journal.name}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('listen')}
                className="min-h-11 px-4 sm:px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs font-bold text-stone-800 dark:text-slate-100 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Wind className="w-3.5 h-3.5 text-sky-500" />
                <span>{dict.welcome.modes.listen.name}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
