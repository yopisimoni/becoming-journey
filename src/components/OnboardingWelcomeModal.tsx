'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Compass,
  Heart,
  Wind,
  Lock,
  Layers,
  CheckCircle2,
  X,
  Feather,
} from 'lucide-react';

export function OnboardingWelcomeModal() {
  const { isOnboardingOpen, setOnboardingOpen, hasConsented, completeOnboarding, dict, isRtl } =
    useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasAgreedConsent, setHasAgreedConsent] = useState(false);

  const t = dict.onboarding;

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (currentStep < 2) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (!hasAgreedConsent) return;
    completeOnboarding();
  };

  const variants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isRtl ? -60 : 60) : (isRtl ? 60 : -60),
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? (isRtl ? 60 : -60) : (isRtl ? -60 : 60),
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.25, ease: 'easeIn' },
    }),
  };

  const steps = [
    { label: t?.card1.badge.split('•')[1]?.trim() || 'Who We Are', id: 0 },
    { label: t?.card2.badge.split('•')[1]?.trim() || 'How We Help', id: 1 },
    { label: t?.card3.badge.split('•')[1]?.trim() || 'Sovereign Consent', id: 2 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Top Header & Step Progress Bar */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                BECOMING Sanctuary
              </span>
              <h2 id="onboarding-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                First Steps &amp; Sovereign Welcome
              </h2>
            </div>
          </div>

          {/* Close button only available if user already consented previously */}
          {hasConsented && (
            <button
              type="button"
              onClick={() => setOnboardingOpen(false)}
              aria-label="Close tour"
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 3 Step Indicator Pills */}
        <div className="px-6 pt-4 flex items-center justify-center gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setDirection(idx > currentStep ? 1 : -1);
                setCurrentStep(idx);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentStep === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : currentStep > idx
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="hidden sm:inline">{s.label}</span>
              {currentStep > idx && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>

        {/* Card Body with Animated Carousel */}
        <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence custom={direction} mode="wait">
            {/* ============================================================== */}
            {/* CARD 1: WHO WE ARE & WHY WE'RE HERE */}
            {/* ============================================================== */}
            {currentStep === 0 && (
              <motion.div
                key="card-1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Card 1 of 3 • Who We Are &amp; Why We&apos;re Here
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                    A Quiet Human Sanctuary in a Loud Digital World
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Not a corporation. Not a clinical algorithm. A safe harbor for your mind.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <p>
                    <strong>BECOMING</strong> was created out of a simple observation: modern digital life is hurried, extractive, and noisy. Every app wants your attention, streaks, and data.
                  </p>
                  <p>
                    This sanctuary was built with an opposite philosophy: <strong>Zero Cost Forever, 100% Local Privacy, and Unhurried Presence</strong>. There are no algorithmic feeds, no tracking pixels, and no remote databases harvesting your private journals.
                  </p>
                  <p>
                    Everything you type, explore, or feel exists strictly in your device&apos;s browser memory. When you are here, you are safe to pause, unclench, and be honest with yourself.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong>100% Private &amp; Local:</strong> No external AI API calls unless you explicitly configure your own private key in Settings.
                  </span>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* CARD 2: HOW WE HELP YOU */}
            {/* ============================================================== */}
            {currentStep === 1 && (
              <motion.div
                key="card-2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Card 2 of 3 • How We Help You
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                    Tools Designed to Mirror Your Mind, Not Boss It
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    You choose the tool that speaks to your current energy.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Wind className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Breathing &amp; Somatic Studio</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      10 procedural Web Audio soundscapes and guided tension releases for jaw, eyes, and shoulders.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Inner Compass Quizzes</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      Exploratory questionnaires inspired by 5 personality frameworks across Work, Life, and Soul.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Feather className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>The Balance Ledger &amp; The Shift</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      Plant seeds of light and tenderly release habits you outgrew, with 60-second impulse resets.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Lock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <span>The Mind Vault &amp; Dissolution</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      A PIN-protected lockbox or disappearing chamber to let burdens vanish into the void.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* CARD 3: YOUR SOVEREIGN BOUNDARIES & MANDATORY CONSENT GATE */}
            {/* ============================================================== */}
            {currentStep === 2 && (
              <motion.div
                key="card-3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Card 3 of 3 • Your Sovereign Boundaries
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                    Life is Short. You Are Not an Angel. You Are Free.
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                    Growth happens through patience, responsibility, and self-compassion.
                  </p>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <p>
                    You do not need to be perfect to be worthy of peace. You will make mistakes, stumble, and have days where you just want to rest. That is an honorable part of the human journey.
                  </p>
                  <p>
                    BECOMING will never tell you what to do. You are the sole, sovereign creator of your decisions.
                  </p>
                </div>

                {/* Mandatory Consent Box */}
                <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Mandatory Agreement &amp; Sanctuary Consent Gate</span>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="onboarding-consent-checkbox"
                      checked={hasAgreedConsent}
                      onChange={(e) => setHasAgreedConsent(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded-lg border-amber-400 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-serif leading-relaxed">
                      I understand that BECOMING is a personal self-reflection and wellness sanctuary, not medical care, therapy, or professional coaching. I am in 100% control of my own life, choices, and peace.
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Navigation Toolbar */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-4">
            <div>
              {currentStep > 0 ? (
                <button
                  type="button"
                  id="onboarding-prev-btn"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  <span>Previous</span>
                </button>
              ) : (
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Welcome to BECOMING
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentStep < 2 ? (
                <button
                  type="button"
                  id="onboarding-next-btn"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>{currentStep === 0 ? 'How We Help' : 'Sovereign Boundaries'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  type="button"
                  id="onboarding-agree-btn"
                  onClick={handleComplete}
                  disabled={!hasAgreedConsent}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                    hasAgreedConsent
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 hover:scale-105 cursor-pointer animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Agree &amp; Enter Sanctuary</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
