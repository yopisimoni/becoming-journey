'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MorningFeeling, MorningRitualEntry } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Sparkles,
  Compass,
  CheckCircle2,
  Wind,
  Feather,
  Check,
  ChevronRight,
  ArrowRight,
  Heart,
  Smile,
  Zap,
  Coffee,
} from 'lucide-react';
import { getSessionQuote } from '@/lib/quotes/quoteEngine';

const STORAGE_KEY_MORNING = 'becoming_morning_ritual_v1';

const FEELING_OPTIONS: { id: MorningFeeling; icon: React.ReactNode; color: string }[] = [
  { id: 'calm', icon: <Feather className="w-4 h-4" />, color: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200' },
  { id: 'energized', icon: <Zap className="w-4 h-4" />, color: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200' },
  { id: 'anxious', icon: <Compass className="w-4 h-4" />, color: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200' },
  { id: 'grateful', icon: <Heart className="w-4 h-4" />, color: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200' },
  { id: 'tender', icon: <Sparkles className="w-4 h-4" />, color: 'bg-violet-50 dark:bg-violet-950/60 border-violet-300 dark:border-violet-700 text-violet-800 dark:text-violet-200' },
  { id: 'sluggish', icon: <Coffee className="w-4 h-4" />, color: 'bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200' },
  { id: 'seeking', icon: <Smile className="w-4 h-4" />, color: 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200' },
];

const QUICK_INTENTIONS = [
  'Protect my quiet pace and speak kindly to myself',
  'Choose presence and focus over frantic rush',
  'Listen before reacting and give grace to others',
  'Honor my energy boundaries without guilt',
  'Take one mindful breath before opening screens',
];

const QUICK_ACTIONS = [
  'Step outside for 2 minutes to breathe fresh morning air',
  'Drink a tall glass of water in silence before checking emails',
  'Write down 1 thing within my direct control today',
  'Stretch my shoulders and neck gently for 60 seconds',
  'Send one genuine note of kindness or gratitude',
];

export function MorningRitualView() {
  const { dict, setActiveTab, playSingingBowl, user } = useApp();
  const todayDate = new Date().toISOString().split('T')[0];

  const [feeling, setFeeling] = useState<MorningFeeling>('calm');
  const [intention, setIntention] = useState('');
  const [microAction, setMicroAction] = useState('');
  const [actionDone, setActionDone] = useState(false);
  const [reflectionQuote, setReflectionQuote] = useState(() => getSessionQuote());
  const [isCommitted, setIsCommitted] = useState(false);

  // In-line optional breathing state
  const [isBreathingOpen, setBreathingOpen] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(60);
  const [isBreathingActive, setBreathingActive] = useState(false);

  // Load existing today's ritual
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MORNING);
      if (stored) {
        const parsed: MorningRitualEntry = JSON.parse(stored);
        if (parsed.date === todayDate) {
          setFeeling(parsed.feeling);
          setIntention(parsed.intention);
          setMicroAction(parsed.microAction);
          setActionDone(parsed.actionCompleted);
          setIsCommitted(true);
        }
      }
    } catch {
      // Ignore parse error
    }
  }, [todayDate]);

  // Mini breathing timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive && breathTimer > 0) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathingActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathTimer]);

  // Phase cycling for breathing
  useEffect(() => {
    let phaseInterval: NodeJS.Timeout;
    if (isBreathingActive) {
      phaseInterval = setInterval(() => {
        setBreathPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
      }, 5000);
    }
    return () => clearInterval(phaseInterval);
  }, [isBreathingActive]);

  const handleSaveRitual = () => {
    const entry: MorningRitualEntry = {
      id: `morning_${todayDate}`,
      date: todayDate,
      feeling,
      intention: intention.trim() || QUICK_INTENTIONS[0],
      microAction: microAction.trim() || QUICK_ACTIONS[0],
      action: microAction.trim() || QUICK_ACTIONS[0],
      actionCompleted: actionDone,
      reflectionText: `"${reflectionQuote.quote}" — ${reflectionQuote.author}`,
      completedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_MORNING, JSON.stringify(entry));
    } catch {
      // Storage might be restricted
    }

    setIsCommitted(true);
    playSingingBowl();
  };

  const handleToggleActionDone = () => {
    const updated = !actionDone;
    setActionDone(updated);

    try {
      const stored = localStorage.getItem(STORAGE_KEY_MORNING);
      if (stored) {
        const parsed: MorningRitualEntry = JSON.parse(stored);
        parsed.actionCompleted = updated;
        localStorage.setItem(STORAGE_KEY_MORNING, JSON.stringify(parsed));
      }
    } catch {
      // Ignore
    }
  };

  const rDict = dict.rituals;

  return (
    <div
      data-testid="morning-ritual-view"
      className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-500"
    >
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent border border-amber-200/80 dark:border-amber-900/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Sun className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {rDict?.morningTitle || 'Ready to Start Your Day'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
          {user ? `Good morning, ${user.name.split(' ')[0]}.` : 'Good morning, friend.'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
          {rDict?.morningSubtitle ||
            'A gentle morning sanctuary to set your feeling, chosen intention, and a quiet micro-step.'}
        </p>
      </div>

      {/* Committed Ritual Summary Card (if already saved today) */}
      {isCommitted && (
        <div
          data-testid="morning-summary-card"
          className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Today’s Morning Intention
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCommitted(false)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Edit Intention
            </button>
          </div>

          {/* Intention Text */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Chosen Intention
            </span>
            <p className="text-lg font-serif font-semibold text-slate-900 dark:text-white">
              “{intention || QUICK_INTENTIONS[0]}”
            </p>
          </div>

          {/* Micro-Action with Interactive Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Today’s Micro-Action
            </span>
            <label
              htmlFor="morning-action-checkbox"
              className="flex items-start gap-3 cursor-pointer select-none"
            >
              <input
                id="morning-action-checkbox"
                data-testid="morning-action-checkbox"
                type="checkbox"
                checked={actionDone}
                onChange={handleToggleActionDone}
                className="mt-1 w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    actionDone
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {microAction || QUICK_ACTIONS[0]}
                </p>
                {actionDone && (
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5" />
                    {rDict?.actionDoneCelebration || 'Micro-action complete. You honored yourself today.'}
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Morning Reflection Quote */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {rDict?.morningReflection || 'Morning Wisdom'}:
            </span>
            <p className="italic text-slate-700 dark:text-slate-300">
              “{reflectionQuote.quote}” — {reflectionQuote.author}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Questionnaire Form (Shown if not committed or editing) */}
      {!isCommitted && (
        <div className="space-y-6">
          {/* Step 1: Feeling Selector */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {rDict?.howDoYouFeel || 'How does your heart feel this morning?'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FEELING_OPTIONS.map((f) => {
                const isSelected = feeling === f.id;
                const label = rDict?.feelings?.[f.id] || f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    data-testid={`feeling-option-${f.id}`}
                    onClick={() => setFeeling(f.id)}
                    className={`p-3 rounded-2xl border text-start transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? `${f.color} ring-2 ring-amber-500/30 font-semibold shadow-xs`
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="shrink-0">{f.icon}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Set Meaningful Intention */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-500" />
              {rDict?.setIntention || 'One Meaningful Intention for Today'}
            </h2>
            <textarea
              data-testid="morning-intention-input"
              rows={2}
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder={rDict?.intentionPlaceholder || 'e.g., Protect my quiet pace and speak kindly to myself'}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
            {/* Quick Inspiration Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Quick Inspirations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_INTENTIONS.map((qi, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIntention(qi)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-all text-start"
                  >
                    {qi}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: One Small Achievable Micro-Action */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Feather className="w-4 h-4 text-emerald-500" />
              {rDict?.microActionLabel || 'One Small Achievable Action'}
            </h2>
            <input
              data-testid="morning-action-input"
              type="text"
              value={microAction}
              onChange={(e) => setMicroAction(e.target.value)}
              placeholder={rDict?.microActionPlaceholder || 'e.g., Step outside for 2 minutes of fresh air'}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
            {/* Quick Micro-Action Chips */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((qa, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMicroAction(qa)}
                  className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-all text-start"
                >
                  {qa}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Optional 60-Second Breathing Reset */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {rDict?.startBreathing || 'Optional 60s Morning Reset Breath'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBreathingOpen(!isBreathingOpen)}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                {isBreathingOpen ? 'Close Breath' : 'Open Breath'}
              </button>
            </div>

            {isBreathingOpen && (
              <div className="p-6 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/50 flex flex-col items-center text-center space-y-4 animate-fadeIn">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: isBreathingActive ? (breathPhase === 'inhale' ? 1.3 : 0.8) : 1 }}
                    transition={{ duration: 5, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400/80 shadow-lg shadow-teal-500/30 flex items-center justify-center text-white font-bold text-xs"
                  >
                    {isBreathingActive ? (breathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out') : 'Ready'}
                  </motion.div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {breathTimer > 0 ? `${breathTimer} seconds remaining` : 'Reset complete. Carry this calm.'}
                  </p>
                  <p className="text-[11px] text-slate-500">5-second coherent heart-rate balance.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBreathingActive(!isBreathingActive);
                    if (!isBreathingActive && breathTimer === 0) setBreathTimer(60);
                  }}
                  className="px-4 py-1.5 rounded-full bg-teal-600 text-white font-semibold text-xs shadow-md hover:bg-teal-700 transition-all"
                >
                  {isBreathingActive ? 'Pause' : 'Start 60s Breath'}
                </button>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              data-testid="skip-action-btn"
              onClick={() => {
                setIntention(QUICK_INTENTIONS[0]);
                setMicroAction(QUICK_ACTIONS[0]);
                handleSaveRitual();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2"
            >
              {rDict?.skipStep || 'Skip without pressure'}
            </button>

            <button
              id="morning-commit-btn"
              data-testid="morning-commit-btn"
              type="button"
              onClick={handleSaveRitual}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Sun className="w-4 h-4" />
              <span>{rDict?.saveIntention || 'Commit Morning Intention'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
