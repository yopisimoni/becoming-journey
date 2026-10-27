'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getStageInfo, getNextStageInfo } from '@/lib/evolution/evolutionEngine';
import {
  getSessionQuote,
  rotateSessionQuote,
  fetchAiStageGreeting,
  WisdomQuote,
} from '@/lib/quotes/quoteEngine';
import { AtmosphereSwitcher } from './AtmosphereSwitcher';
import { TheBecomingHorizon } from '@/components/motion';
import {
  Compass,
  Wind,
  Calendar,
  Lock,
  Sparkles,
  Feather,
  Quote,
  CheckCircle2,
  BookmarkPlus,
  ArrowRight,
  ShieldCheck,
  Heart,
  TrendingUp,
  Award,
  Zap,
  Coffee,
  Apple,
  Users,
  Smile,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Share2,
} from 'lucide-react';

export function DashboardView() {
  const {
    dict,
    user,
    cards,
    journalEntries,
    moments,
    goals,
    habits,
    addMoment,
    setActiveTab,
    setActiveMode,
    playSingingBowl,
    isRtl,
    evolution,
    addEvolutionXp,
    dailyPillars,
    updateDailyPillars,
    aiSettings,
  } = useApp();

  const [savedQuoteToMoments, setSavedQuoteToMoments] = useState(false);
  const [editingPillars, setEditingPillars] = useState(false);
  const [pillarInputs, setPillarInputs] = useState({
    beautiful: dailyPillars.beautifulMoment || '',
    healthy: dailyPillars.healthyNourishment || '',
    helping: dailyPillars.helpingThoseWhoMoveYou || '',
  });

  const [sessionQuote, setSessionQuote] = useState<WisdomQuote>(() => getSessionQuote());

  const currentStage = getStageInfo(evolution.currentLevel);
  const nextStage = getNextStageInfo(evolution.currentLevel);
  const prevRequired = currentStage.requiredXp;
  const nextRequired = nextStage ? nextStage.requiredXp : currentStage.requiredXp;
  const xpInLevel = Math.max(0, evolution.totalXp - prevRequired);
  const xpNeeded = Math.max(1, nextRequired - prevRequired);
  const progressPercent = nextStage ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

  // Background AI Stage Greeting if BYOK AI is configured
  useEffect(() => {
    if (aiSettings?.enabled && aiSettings?.apiKey?.trim() && !sessionQuote.isAiGenerated) {
      let cancelled = false;
      fetchAiStageGreeting(aiSettings, currentStage.title, currentStage.subtitle).then((aiQuote) => {
        if (!cancelled && aiQuote) {
          setSessionQuote(aiQuote);
        }
      });
      return () => {
        cancelled = true;
      };
    }
  }, [aiSettings, currentStage, sessionQuote.isAiGenerated]);

  const handleRotateQuote = () => {
    const next = rotateSessionQuote();
    setSessionQuote(next);
    setSavedQuoteToMoments(false);
    playSingingBowl();
  };

  const handleToggleNotAnAngel = () => {
    const nextVal = !dailyPillars.notAnAngelAffirmation;
    updateDailyPillars({ notAnAngelAffirmation: nextVal });
    if (nextVal) {
      playSingingBowl();
      addEvolutionXp(15, 'Affirmed Daily Self-Worth & Flaw Acceptance');
    }
  };

  const handleSavePillars = () => {
    updateDailyPillars({
      beautifulMoment: pillarInputs.beautiful,
      healthyNourishment: pillarInputs.healthy,
      helpingThoseWhoMoveYou: pillarInputs.helping,
    });
    setEditingPillars(false);
    playSingingBowl();
    addEvolutionXp(15, 'Completed Daily Living Compass');
  };

  const handleSaveQuoteToMoments = () => {
    addMoment(`“${sessionQuote.quote}” — ${sessionQuote.author}`);
    setSavedQuoteToMoments(true);
    playSingingBowl();
  };

  const handleReflectOnQuote = () => {
    setActiveTab('home');
    setActiveMode('journal');
  };

  const activeGoalsCount = goals.filter((g) => !g.completed).length;
  const nurturedHabitsCount = habits.reduce((acc, h) => acc + h.nurturedCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Welcome Greeting & Inner Weather Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Personal Sanctuary Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
            {user ? `Peace and presence, ${user.name.split(' ')[0]}.` : 'Your Sanctuary Dashboard'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A calm holistic overview of your reflections, breathing rituals, milestones, and inner discoveries.
          </p>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {dict.atmosphere?.switcherTitle || 'Inner Weather'}
          </span>
          <AtmosphereSwitcher variant="dashboard" />
        </div>
      </div>

      {/* The Becoming Horizon — Circadian Atmospheric Arc */}
      <TheBecomingHorizon />

      {/* Zero to Hero Evolution System Card */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Stage {evolution.currentLevel} of 5
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                  {evolution.totalXp} Total XP
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                {currentStage.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentStage.subtitle}
              </p>
            </div>
          </div>

          <div className="text-end hidden sm:block">
            <span className="text-xs font-semibold text-slate-500">
              {nextStage ? `${nextRequired - evolution.totalXp} XP to ${nextStage.title}` : 'Sovereign Master (Max Stage)'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Progress to Next Stage</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stage Mantra & Philosophy */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-serif italic text-indigo-950 dark:text-indigo-200 font-medium">
              {currentStage.mantra}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentStage.description}
            </p>
          </div>
        </div>
      </div>

      {/* The 4 Daily Pillars of Living Right Card */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Compass className="w-4 h-4" />
              <span>Daily Living Compass • 4 Pillars</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              The 4 Pillars of Living Right
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (editingPillars) {
                handleSavePillars();
              } else {
                setEditingPillars(true);
              }
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            {editingPillars ? 'Save Pillars' : 'Edit Notes'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pillar 1: Something Beautiful */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <Coffee className="w-4 h-4" />
              <span>1. Something Beautiful to Do</span>
            </div>
            {editingPillars ? (
              <input
                type="text"
                value={pillarInputs.beautiful}
                onChange={(e) => setPillarInputs({ ...pillarInputs, beautiful: e.target.value })}
                placeholder="e.g., Watch sunset, brew tea slowly, listen to music"
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-100"
              />
            ) : (
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {dailyPillars.beautifulMoment || 'Take in a small quiet beauty: a warm cup, morning birds, or walking slowly.'}
              </p>
            )}
          </div>

          {/* Pillar 2: Something Healthy */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <Apple className="w-4 h-4" />
              <span>2. Something Healthy to Eat</span>
            </div>
            {editingPillars ? (
              <input
                type="text"
                value={pillarInputs.healthy}
                onChange={(e) => setPillarInputs({ ...pillarInputs, healthy: e.target.value })}
                placeholder="e.g., Fresh greens, clean water, wholesome home meal"
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-800 dark:text-slate-100"
              />
            ) : (
              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {dailyPillars.healthyNourishment || 'Honor your body today with fresh, pure food and unhurried hydration.'}
              </p>
            )}
          </div>

          {/* Pillar 3: Helping Those Who Move You */}
          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 space-y-2">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>3. Helping Those Who Move You</span>
            </div>
            {editingPillars ? (
              <input
                type="text"
                value={pillarInputs.helping}
                onChange={(e) => setPillarInputs({ ...pillarInputs, helping: e.target.value })}
                placeholder="e.g., A kind word, listening to someone, helping quietly"
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 text-slate-800 dark:text-slate-100"
              />
            ) : (
              <p className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
                {dailyPillars.helpingThoseWhoMoveYou || 'Offer an honest kind word or quiet help to someone without expecting praise.'}
              </p>
            )}
          </div>

          {/* Pillar 4: Not an Angel, Still Worthy */}
          <div
            onClick={handleToggleNotAnAngel}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              dailyPillars.notAnAngelAffirmation
                ? 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
                <Heart className="w-4 h-4" />
                <span>4. Not an Angel, Still Worthy</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  dailyPillars.notAnAngelAffirmation
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {dailyPillars.notAnAngelAffirmation && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic font-serif leading-relaxed">
              &ldquo;I am human. I have flaws, I make mistakes, but I am still worthy of deep love and peace today.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Quote of the Day / Dynamic Session Wisdom Card */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Quote className="w-4 h-4" />
            <span>
              {sessionQuote.isAiGenerated ? 'AI Sanctuary Greeting' : 'Daily Wisdom'} • {sessionQuote.theme}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRotateQuote}
              title="Draw another wisdom quote"
              aria-label="Draw another wisdom quote"
              className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800 transition-all flex items-center gap-1 text-[11px] font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Draw Another</span>
            </button>
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              {sessionQuote.isAiGenerated ? 'Live Companion' : 'Philosophical Library'}
            </span>
          </div>
        </div>

        <blockquote className="text-lg sm:text-xl font-serif italic text-slate-900 dark:text-white font-medium leading-relaxed">
          &ldquo;{sessionQuote.quote}&rdquo;
        </blockquote>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-indigo-100/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            — {sessionQuote.author}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveQuoteToMoments}
              disabled={savedQuoteToMoments}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                savedQuoteToMoments
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {savedQuoteToMoments ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
              <span>{savedQuoteToMoments ? 'Saved to Moments' : 'Save to Moments'}</span>
            </button>

            <button
              type="button"
              onClick={handleReflectOnQuote}
              className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Reflect in Journal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sanctuary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Journey Cards
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {cards.length}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Confirmed insights</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Private Notes
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">
            {journalEntries.length}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Local entries saved</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Light Moments
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {moments.length}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Gratitude & memories</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Habit Seeds
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {nurturedHabitsCount}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Times nurtured</div>
        </div>
      </div>

      {/* Daily Rituals & Good Vibes */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Daily Rituals &amp; Radiance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            data-testid="dashboard-morning-btn"
            onClick={() => setActiveTab('morning')}
            className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-slate-900 border border-amber-200/80 dark:border-amber-800/60 shadow-sm hover:border-amber-400 text-start flex flex-col justify-between group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {dict.rituals?.morningTitle || 'Morning Ritual'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Ready to Start Your Day
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 pt-2 border-t border-amber-100/60 dark:border-amber-900/40">
              <span>Set Intention &amp; Breathe</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <button
            type="button"
            data-testid="dashboard-evening-btn"
            onClick={() => setActiveTab('evening')}
            className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent dark:from-indigo-950/30 dark:via-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm hover:border-indigo-400 text-start flex flex-col justify-between group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {dict.rituals?.eveningTitle || 'Evening Ritual'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Ready to Sleep &amp; Release
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400 pt-2 border-t border-indigo-100/60 dark:border-indigo-900/40">
              <span>Gratitude &amp; Unclench</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <button
            type="button"
            data-testid="dashboard-goodvibes-btn"
            onClick={() => setActiveTab('goodvibes')}
            className="p-5 rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-950/30 dark:via-slate-900 border border-rose-200/80 dark:border-rose-800/60 shadow-sm hover:border-rose-400 text-start flex flex-col justify-between group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {dict.goodVibes?.studioTitle || 'Good Vibes Studio'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Share Inspiration &amp; Wisdom
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-rose-700 dark:text-rose-400 pt-2 border-t border-rose-100/60 dark:border-rose-900/40">
              <span>Craft Canvas &amp; Share</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Quick Launch Studios */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Explore Sanctuary Studios
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('breathe')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-indigo-400 text-start flex items-center justify-between group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Breathing & Somatic Studio
                </div>
                <div className="text-xs text-slate-500">
                  4-7-8, Box Breathing & tension unclench
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-indigo-400 text-start flex items-center justify-between group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Inner Compass Quizzes
                </div>
                <div className="text-xs text-slate-500">
                  Work, Life & Soul self-discovery (10-40 Qs)
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-indigo-400 text-start flex items-center justify-between group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Multi-Horizon Goal Sanctuary
                </div>
                <div className="text-xs text-slate-500">
                  Day, Week, Month & Year ({activeGoalsCount} active)
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('habits')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-indigo-400 text-start flex items-center justify-between group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  The Mind Vault & Balance Ledger
                </div>
                <div className="text-xs text-slate-500">
                  PIN-protected secrets & habit seeds
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
