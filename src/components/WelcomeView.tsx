'use client';

import React from 'react';
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
import { Volume2, VolumeX, ArrowLeft, Feather, Sparkles } from 'lucide-react';

export function WelcomeView() {
  const {
    dict,
    sanctuaryStep,
    setSanctuaryStep,
    setCurrentIntent,
    setActiveMode,
    soundPreset,
    setSoundPreset,
    reducedMotion,
    isRtl,
    user,
  } = useApp();

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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {sanctuaryStep === 0 ? (
          /* STEP 0: INTERACTIVE HERO SANCTUARY ENTRANCE */
          <motion.div
            key="entrance-step-0"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -30, scale: 0.97 }}
            transition={springTransition}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl text-center space-y-8 relative overflow-hidden">
              {/* Background ambient glow inside card */}
              <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
              />

              {/* Personalized Greeting Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  {user ? `${dict.auth.welcomeBack}, ${user.name}` : 'Welcome to BECOMING'}
                </span>
              </div>

              {/* Centerpiece Sacred Orb Art */}
              <div className="flex flex-col items-center justify-center relative">
                <SanctuaryLotusOrbArt size="hero" />

                {/* Animated sound wave bars indicator when audio is active */}
                {isSoundPlaying && !reducedMotion && (
                  <div className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                    <span className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-4 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-6 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                    <span className="ms-1.5">{dict.audio.sanctuary.split('(')[0]}</span>
                  </div>
                )}
              </div>

              {/* Headline & Subtitle with high-contrast text */}
              <div className="space-y-3 relative z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  &ldquo;{dict.sanctuary.headline}&rdquo;
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans max-w-lg mx-auto leading-relaxed">
                  {dict.sanctuary.subtext}
                </p>
              </div>

              {/* High-Contrast Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 relative z-10">
                <button
                  type="button"
                  onClick={handleBeginWithSound}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Volume2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>{dict.sanctuary.beginWithSound}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBeginSilence}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-900/5 dark:bg-white/10 hover:bg-slate-900/10 dark:hover:bg-white/15 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <VolumeX className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{dict.sanctuary.beginSilence}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* STEP 1: INTENT SELECTION BENTO CARD DECK */
          <motion.div
            key="deck-step-1"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -40, scale: 0.97 }}
            transition={springTransition}
            className="space-y-8"
          >
            {/* Step Header with Back Button & Glowing Dots */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSanctuaryStep(0)}
                className="px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 shadow-xs transition-colors"
              >
                <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{dict.sanctuary.cardBack}</span>
              </button>

              {/* Glowing Step Dots */}
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 ring-4 ring-indigo-500/20" />
              </div>
            </div>

            {/* Question Heading with crisp legibility */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {dict.welcome.question}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                {dict.welcome.subtitle}
              </p>
            </div>

            {/* 4 Rich Bento Intent Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Card 1: Lost (Indigo Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -6, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('lost')}
                className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-indigo-200/90 dark:border-indigo-900/50 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-lg hover:shadow-indigo-500/10 transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 rounded-2xl bg-indigo-100/80 dark:bg-indigo-950/50">
                    <LostCompassMistArt size="sm" />
                  </div>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/90 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    {dict.welcome.intents.lost.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {dict.welcome.intents.lost.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {dict.welcome.intents.lost.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 2: Goal (Amber/Coral Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -6, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('goal')}
                className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/[0.08] via-orange-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-amber-200/90 dark:border-amber-900/50 hover:border-amber-500 dark:hover:border-amber-400 shadow-lg hover:shadow-amber-500/10 transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 rounded-2xl bg-amber-100/80 dark:bg-amber-950/50">
                    <GoalMountainSunriseArt size="sm" />
                  </div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    {dict.welcome.intents.goal.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {dict.welcome.intents.goal.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {dict.welcome.intents.goal.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 3: Struggle (Teal/Emerald Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -6, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('struggle')}
                className="p-6 rounded-3xl bg-gradient-to-br from-teal-500/[0.08] via-emerald-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-teal-200/90 dark:border-teal-900/50 hover:border-teal-500 dark:hover:border-teal-400 shadow-lg hover:shadow-teal-500/10 transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 rounded-2xl bg-teal-100/80 dark:bg-teal-950/50">
                    <StruggleWaterShelterArt size="sm" />
                  </div>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-100/90 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                    {dict.welcome.intents.struggle.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {dict.welcome.intents.struggle.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {dict.welcome.intents.struggle.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 4: Grow (Rose/Mint Accent) */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -6, scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.99 }}
                onClick={() => handleSelectIntent('grow')}
                className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/[0.08] via-emerald-500/[0.03] to-white dark:to-slate-900/90 backdrop-blur-xl border border-rose-200/90 dark:border-rose-900/50 hover:border-rose-500 dark:hover:border-rose-400 shadow-lg hover:shadow-rose-500/10 transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 rounded-2xl bg-rose-100/80 dark:bg-rose-950/50">
                    <GrowBotanicalLeavesArt size="sm" />
                  </div>
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                    {dict.welcome.intents.grow.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {dict.welcome.intents.grow.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {dict.welcome.intents.grow.description}
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Quick Access Floating Pills for Journal and Just Listen */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectMode('journal')}
                className="px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Feather className="w-3.5 h-3.5 text-emerald-500" />
                <span>{dict.welcome.modes.journal.name}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('listen')}
                className="px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{dict.welcome.modes.listen.name}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
