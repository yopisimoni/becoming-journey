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
    setSoundPreset,
    reducedMotion,
    isRtl,
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
    : { type: 'spring', stiffness: 100, damping: 20 };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-14 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {sanctuaryStep === 0 ? (
          /* STEP 0: SANCTUARY ENTRANCE */
          <motion.div
            key="entrance-step-0"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
            transition={springTransition}
            className="text-center space-y-8 max-w-2xl mx-auto"
          >
            {/* Sacred Lotus / Orb Art */}
            <div className="flex justify-center">
              <SanctuaryLotusOrbArt size="hero" />
            </div>

            {/* Sanctuary Headline */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-serif italic text-stone-charcoal dark:text-ivory-100 tracking-tight leading-relaxed">
                &ldquo;{dict.sanctuary.headline}&rdquo;
              </h1>
              <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 font-sans max-w-md mx-auto leading-relaxed">
                {dict.sanctuary.subtext}
              </p>
            </div>

            {/* Entrance Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={handleBeginWithSound}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-violet-deep text-ivory-50 text-sm font-medium hover:bg-violet-deep/90 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <Volume2 className="w-4 h-4 text-peach-soft group-hover:scale-110 transition-transform" />
                <span>{dict.sanctuary.beginWithSound}</span>
              </button>

              <button
                onClick={handleBeginSilence}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-ivory-100/90 dark:bg-white/10 hover:bg-ivory-200 dark:hover:bg-white/15 border border-stone-border dark:border-white/10 text-stone-charcoal dark:text-ivory-100 text-sm font-medium transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <VolumeX className="w-4 h-4 text-stone-mist" />
                <span>{dict.sanctuary.beginSilence}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* STEP 1: INTENT SELECTION CARD DECK */
          <motion.div
            key="deck-step-1"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            transition={springTransition}
            className="space-y-8"
          >
            {/* Step Header with Back Button & Glowing Dots */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSanctuaryStep(0)}
                className="px-3 py-1.5 rounded-full bg-ivory-100/80 dark:bg-white/5 border border-stone-border dark:border-white/10 text-xs font-medium text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{dict.sanctuary.cardBack}</span>
              </button>

              {/* Glowing Step Dots */}
              <div className="flex items-center gap-2 text-xs text-stone-mist">
                <span className="w-2 h-2 rounded-full bg-stone-border dark:bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-violet-deep dark:bg-violet-soft ring-4 ring-violet-muted/20" />
              </div>
            </div>

            {/* Question Heading */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-4xl font-semibold text-stone-charcoal dark:text-ivory-100 tracking-tight">
                {dict.welcome.question}
              </h1>
              <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 max-w-lg mx-auto">
                {dict.welcome.subtitle}
              </p>
            </div>

            {/* 4 Luxury Intent Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Card 1: Lost */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                onClick={() => handleSelectIntent('lost')}
                className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <div className="flex items-start justify-between w-full">
                  <LostCompassMistArt size="sm" />
                  <span className="text-[11px] font-semibold text-violet-deep dark:text-violet-soft bg-violet-soft/80 dark:bg-violet-deep/30 px-2.5 py-1 rounded-full border border-violet-muted/20">
                    {dict.welcome.intents.lost.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-charcoal dark:text-ivory-100 group-hover:text-violet-deep transition-colors">
                    {dict.welcome.intents.lost.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 mt-1 leading-relaxed">
                    {dict.welcome.intents.lost.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 2: Goal */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                onClick={() => handleSelectIntent('goal')}
                className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-mint-muted"
              >
                <div className="flex items-start justify-between w-full">
                  <GoalMountainSunriseArt size="sm" />
                  <span className="text-[11px] font-semibold text-mint-deep dark:text-mint-soft bg-mint-soft/80 dark:bg-mint-deep/30 px-2.5 py-1 rounded-full border border-mint-muted/20">
                    {dict.welcome.intents.goal.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-charcoal dark:text-ivory-100 group-hover:text-mint-deep transition-colors">
                    {dict.welcome.intents.goal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 mt-1 leading-relaxed">
                    {dict.welcome.intents.goal.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 3: Struggle */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                onClick={() => handleSelectIntent('struggle')}
                className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-peach-muted"
              >
                <div className="flex items-start justify-between w-full">
                  <StruggleWaterShelterArt size="sm" />
                  <span className="text-[11px] font-semibold text-peach-deep dark:text-peach-soft bg-peach-soft/80 dark:bg-peach-deep/30 px-2.5 py-1 rounded-full border border-peach-muted/20">
                    {dict.welcome.intents.struggle.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-charcoal dark:text-ivory-100 group-hover:text-peach-deep transition-colors">
                    {dict.welcome.intents.struggle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 mt-1 leading-relaxed">
                    {dict.welcome.intents.struggle.description}
                  </p>
                </div>
              </motion.button>

              {/* Card 4: Grow */}
              <motion.button
                whileHover={reducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                onClick={() => handleSelectIntent('grow')}
                className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all text-start flex flex-col justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-mint-muted"
              >
                <div className="flex items-start justify-between w-full">
                  <GrowBotanicalLeavesArt size="sm" />
                  <span className="text-[11px] font-semibold text-mint-deep dark:text-mint-soft bg-mint-soft/80 dark:bg-mint-deep/30 px-2.5 py-1 rounded-full border border-mint-muted/20">
                    {dict.welcome.intents.grow.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-charcoal dark:text-ivory-100 group-hover:text-mint-deep transition-colors">
                    {dict.welcome.intents.grow.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 mt-1 leading-relaxed">
                    {dict.welcome.intents.grow.description}
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Quick Access Floating Pills for Journal and Just Listen */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleSelectMode('journal')}
                className="px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-stone-border dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-xs font-medium text-stone-charcoal dark:text-ivory-100 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Feather className="w-3.5 h-3.5 text-mint-muted" />
                <span>{dict.welcome.modes.journal.name}</span>
              </button>

              <button
                onClick={() => handleSelectMode('listen')}
                className="px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-stone-border dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-xs font-medium text-stone-charcoal dark:text-ivory-100 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-peach-muted" />
                <span>{dict.welcome.modes.listen.name}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
