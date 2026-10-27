'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants, useReducedMotion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Locale, AddressingPreference } from '@/types';
import { supportedLocales } from '@/locales';
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
  CheckCircle2,
  X,
  Feather,
  Globe,
  User,
  Sun,
  Moon,
  Eye,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { AtmosphericOrb, LivingIdentity3D } from '@/components/motion';

export function OnboardingWelcomeModal() {
  const {
    isOnboardingOpen,
    setOnboardingOpen,
    hasConsented,
    completeOnboarding,
    dict,
    isRtl,
    locale,
    setLocale,
    addressingPreference,
    setAddressingPreference,
  } = useApp();

  const shouldReduceMotion = useReducedMotion();

  // Steps:
  // 0: Cinematic Motion Intro
  // 1: Language Selection
  // 2: Gender / Addressing Preference
  // 3: About the App
  // 4: Understand & Agree (Mandatory Consent Gate)
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasAgreedConsent, setHasAgreedConsent] = useState(false);
  const [introAutoPassed, setIntroAutoPassed] = useState(false);

  const t = dict.onboarding;

  // Auto-advance intro after 4.5s if user hasn't advanced and not reduced motion
  useEffect(() => {
    if (currentStep === 0 && !introAutoPassed && !shouldReduceMotion) {
      const timer = setTimeout(() => {
        // We do not force advance if user is inactive, but give a gentle indication
        setIntroAutoPassed(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, introAutoPassed, shouldReduceMotion]);

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
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

  const handleSkipIntro = () => {
    setDirection(1);
    setCurrentStep(1);
  };

  const handleComplete = () => {
    if (!hasAgreedConsent) return;
    completeOnboarding();
  };

  const variants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isRtl ? -40 : 40) : isRtl ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? (isRtl ? 40 : -40) : isRtl ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.25, ease: 'easeIn' },
    }),
  };

  const progressLabels: Record<string, string[]> = {
    en: ['Intro', 'Language', 'Addressing', 'About', 'Agreement'],
    ar: ['المقدمة', 'اللغة', 'طريقة المخاطبة', 'عن التطبيق', 'الموافقة'],
    fr: ['Introduction', 'Langue', 'Formule d’adresse', 'Présentation', 'Accord'],
    es: ['Introducción', 'Idioma', 'Tratamiento', 'Acerca de', 'Consentimiento'],
    it: ['Introduzione', 'Lingua', 'Come rivolgerci a te', 'Presentazione', 'Consenso'],
  };
  const stepsList = (progressLabels[locale] ?? progressLabels.en).map((label, id) => ({ id, label }));
  const stepIndicator = (n: number) =>
    locale === 'ar' ? `الخطوة ${n} من 5` :
    locale === 'fr' ? `Étape ${n} sur 5` :
    locale === 'es' ? `Paso ${n} de 5` :
    locale === 'it' ? `Passaggio ${n} di 5` : `Step ${n} of 5`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto"
    >
      {/* Background ambient celestial orbs */}
      <AtmosphericOrb
        color="rgba(217, 119, 54, 0.2)"
        size={460}
        blur={110}
        className="-top-24 -start-24"
      />
      <AtmosphericOrb
        color="rgba(129, 140, 248, 0.2)"
        size={440}
        blur={100}
        delay={2}
        className="-bottom-20 -end-20"
      />

      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0B0F19]/95 border border-stone-200/90 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden my-auto backdrop-blur-xl">
        {/* Top Header & Step Progress Bar */}
        <div className="p-5 sm:p-6 pb-3 border-b border-stone-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                BECOMING
              </span>
              <h2 id="onboarding-step-indicator" className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
                {stepIndicator(currentStep + 1)} • {stepsList[currentStep].label}
              </h2>
            </div>
          </div>

          {/* Close button only available if user already consented previously */}
          {hasConsented && (
            <button
              type="button"
              onClick={() => setOnboardingOpen(false)}
              aria-label="Close tour"
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 5 Step Indicator Pills */}
        <div className="px-6 pt-3 flex items-center justify-center gap-1.5 sm:gap-2">
          {stepsList.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setDirection(idx > currentStep ? 1 : -1);
                setCurrentStep(idx);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                currentStep === idx
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                  : currentStep > idx
                  ? 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400'
              }`}
            >
              <span>{idx + 1}</span>
              <span className="hidden sm:inline">{s.label}</span>
              {currentStep > idx && <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
            </button>
          ))}
        </div>

        {/* Card Body with Animated Transitions */}
        <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence custom={direction} mode="wait">
            {/* ============================================================== */}
            {/* STEP 1: CINEMATIC MOTION INTRO */}
            {/* ============================================================== */}
            {currentStep === 0 && (
              <motion.div
                key="step-intro"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6 text-center py-4"
              >
                {/* Luminous 3D Living Identity Sculpture */}
                <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                  <LivingIdentity3D
                    currentStep={currentStep}
                    size={260}
                    interactive={true}
                    reducedMotion={shouldReduceMotion ?? false}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-4 rounded-full bg-amber-400/15 dark:bg-purple-500/20 blur-3xl pointer-events-none -z-10 animate-pulse"
                  />
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {t?.intro?.badge || 'First Steps • Celestial Awakening'}
                  </span>
                  <h1
                    id="onboarding-title"
                    className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 dark:text-white tracking-widest"
                  >
                    {t?.intro?.title || 'BECOMING'}
                  </h1>
                  <h2 className="text-sm sm:text-base font-serif font-medium text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                    {t?.intro?.subtitle ||
                      'A calm space to understand yourself'}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Step into an unhurried digital sanctuary built for clarity, self-compassion, and deep rest.
                  Zero cost forever, 100% private to your device, and zero surveillance.
                </p>

                <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Zero Cloud AI</span>
                  </span>
                  <span className="text-stone-300 dark:text-slate-700">•</span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Local-First Memory</span>
                  </span>
                  <span className="text-stone-300 dark:text-slate-700">•</span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Non-Judgmental</span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: LANGUAGE SELECTION */}
            {/* ============================================================== */}
            {currentStep === 1 && (
              <motion.div
                key="step-language"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-2xl bg-slate-900/40 border border-white/5 shadow-inner overflow-hidden">
                    <LivingIdentity3D
                      currentStep={1}
                      size={80}
                      interactive={true}
                      reducedMotion={shouldReduceMotion ?? false}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {t?.languageSelect?.badge || 'Step 2 • Sanctuary Language'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                      {t?.languageSelect?.title || 'Choose your language'}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {t?.languageSelect?.subtitle ||
                        'Select the language that speaks most intimately to your mind and reflections.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {supportedLocales.map((loc) => {
                    const isSelected = locale === loc.code;
                    return (
                      <button
                        key={loc.code}
                        type="button"
                        data-testid={`onboarding-language-${loc.code}`}
                        onClick={() => setLocale(loc.code as Locale)}
                        className={`p-4 rounded-2xl border text-start flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 ring-2 ring-amber-500/30 shadow-sm'
                            : 'border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 bg-stone-50/60 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                              isSelected
                                ? 'bg-amber-500 text-white'
                                : 'bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300'
                            }`}
                          >
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-stone-900 dark:text-white">
                              {loc.name}
                            </div>
                            <div className="text-xs text-stone-500 dark:text-slate-400">
                              {loc.isRtl ? 'Arabic • RTL' : loc.code.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: GENDER / ADDRESSING PREFERENCE */}
            {/* ============================================================== */}
            {currentStep === 2 && (
              <motion.div
                key="step-addressing"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-2xl bg-slate-900/40 border border-white/5 shadow-inner overflow-hidden">
                    <LivingIdentity3D
                      currentStep={2}
                      size={80}
                      interactive={true}
                      reducedMotion={shouldReduceMotion ?? false}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {t?.genderSelect?.badge || 'Step 3 • Respectful Addressing'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                      {t?.genderSelect?.title || 'How Would You Like Us to Address You?'}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {t?.genderSelect?.subtitle ||
                        'This is optional and helps us personalize grammar and reflections respectfully.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {[
                    {
                      id: 'man' as AddressingPreference,
                      label: t?.genderSelect?.options?.man || 'Man',
                      subtext: 'Personalize reflections with masculine phrasing where applicable',
                      icon: User,
                    },
                    {
                      id: 'woman' as AddressingPreference,
                      label: t?.genderSelect?.options?.woman || 'Woman',
                      subtext: 'Personalize reflections with feminine phrasing where applicable',
                      icon: User,
                    },
                    {
                      id: 'unspecified' as AddressingPreference,
                      label: t?.genderSelect?.options?.preferNotToSay || 'Prefer not to say',
                      subtext: 'Use neutral, universal phrasing across all reflection modules',
                      icon: Heart,
                    },
                  ].map((opt) => {
                    const isSelected = addressingPreference === opt.id;
                    const Icon = opt.icon;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        data-testid={`onboarding-gender-${opt.id}`}
                        onClick={() => setAddressingPreference(opt.id)}
                        className={`p-4 rounded-2xl border text-start flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 ring-2 ring-amber-500/30 shadow-sm'
                            : 'border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 bg-stone-50/60 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                              isSelected
                                ? 'bg-amber-500 text-white'
                                : 'bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-stone-900 dark:text-white">
                              {opt.label}
                            </div>
                            <div className="text-xs text-stone-500 dark:text-slate-400">
                              {opt.subtext}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-stone-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex items-center gap-2.5 text-xs text-stone-600 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    {t?.genderSelect?.helper ||
                      'Stored privately on this device only. You may change this anytime in Settings.'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* STEP 4: ABOUT THE APP */}
            {/* ============================================================== */}
            {currentStep === 3 && (
              <motion.div
                key="step-about"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-2xl bg-slate-900/40 border border-white/5 shadow-inner overflow-hidden">
                    <LivingIdentity3D
                      currentStep={3}
                      size={80}
                      interactive={true}
                      reducedMotion={shouldReduceMotion ?? false}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {stepIndicator(4)} • BECOMING
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                      {t?.card2?.title ?? "Tools to help you find your own way"}
                    </h3>
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      {t?.card2?.subtitle ?? "Explore at your own pace."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white">
                      <Wind className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{t?.card2?.tools?.[0]?.title ?? "Explore"}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-slate-400 leading-snug">
                      {t?.card2?.tools?.[0]?.desc ?? ""}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white">
                      <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{t?.card2?.tools?.[1]?.title ?? "Explore"}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-slate-400 leading-snug">
                      {t?.card2?.tools?.[1]?.desc ?? ""}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white">
                      <Feather className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t?.card2?.tools?.[2]?.title ?? "Explore"}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-slate-400 leading-snug">
                      {t?.card2?.tools?.[2]?.desc ?? ""}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white">
                      <Lock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <span>{t?.card2?.tools?.[3]?.title ?? "Explore"}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-slate-400 leading-snug">
                      {t?.card2?.tools?.[3]?.desc ?? ""}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    <strong>Not a doctor, therapist, or coach:</strong> BECOMING provides quiet self-reflection tools without unsolicited advice or clinical claims.
                  </span>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* STEP 5: UNDERSTAND & AGREE (MANDATORY CONSENT GATE) */}
            {/* ============================================================== */}
            {currentStep === 4 && (
              <motion.div
                key="step-agreement"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-2xl bg-slate-900/40 border border-white/5 shadow-inner overflow-hidden">
                    <LivingIdentity3D
                      currentStep={4}
                      size={80}
                      interactive={true}
                      reducedMotion={shouldReduceMotion ?? false}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {stepIndicator(5)} • {stepsList[4].label}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                      {t?.card3?.title ?? "Your choices remain yours"}
                    </h3>
                    <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
                      {t?.card3?.subtitle ?? "Take your time."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                  <p>
                    {t?.card3?.paragraphs?.[0] ?? "Your journey is yours."}
                  </p>
                  <p>
                    {t?.card3?.paragraphs?.[1] ?? "Choose your own path."}
                  </p>
                </div>

                {/* Mandatory Consent Box */}
                <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{locale === "ar" ? "الموافقة على المتابعة" : locale === "fr" ? "Consentement" : locale === "es" ? "Consentimiento" : locale === "it" ? "Consenso" : "Consent to continue"}</span>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="onboarding-consent-checkbox"
                      checked={hasAgreedConsent}
                      onChange={(e) => setHasAgreedConsent(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded-lg border-amber-400 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-serif leading-relaxed">
                      {t?.consentCheckbox ?? "I understand and agree to continue."}
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Navigation Toolbar */}
          <div className="pt-6 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-4">
            <div>
              {currentStep > 0 ? (
                <button
                  type="button"
                  id="onboarding-prev-btn"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  <span>{t?.prevButton || 'Previous'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSkipIntro}
                  className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 font-medium py-1"
                >
                  {t?.intro?.skipButton || 'Skip Intro'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentStep < 4 ? (
                <button
                  type="button"
                  id="onboarding-next-btn"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold shadow-lg shadow-stone-900/15 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span>
                    {currentStep === 0
                      ? t?.intro?.beginButton || 'Step into the Sanctuary'
                      : t?.nextButton || 'Next'}
                  </span>
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
                      : 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t?.agreeButton || 'Agree & Enter Sanctuary'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
