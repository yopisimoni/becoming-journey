'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DailyQuote } from '@/types';
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
  } = useApp();

  const [savedQuoteToMoments, setSavedQuoteToMoments] = useState(false);

  // Curated Daily Wisdom Quotes (rotates cyclically by day of year)
  const dailyQuotes: DailyQuote[] = [
    {
      quote: 'You do not have to be good. You only have to let the soft animal of your body love what it loves.',
      author: 'Mary Oliver',
      theme: 'Radical Grace',
    },
    {
      quote: 'Almost everything will work again if you unplug it for a few minutes, including you.',
      author: 'Anne Lamott',
      theme: 'Rest & Renewal',
    },
    {
      quote: 'Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.',
      author: 'Wayne Dyer',
      theme: 'Acceptance',
    },
    {
      quote: 'Between stimulus and response there is a space. In that space is our power to choose our response.',
      author: 'Viktor Frankl',
      theme: 'Inner Freedom',
    },
    {
      quote: 'Do not hurry, do not rest. Move with the unhurried grace of deep water.',
      author: 'Goethe',
      theme: 'Unhurried Pace',
    },
    {
      quote: 'The soul should always stand ajar, ready to welcome the ecstatic experience.',
      author: 'Emily Dickinson',
      theme: 'Soul Presence',
    },
    {
      quote: 'Simplicity is about subtracting the obvious and adding the meaningful.',
      author: 'John Maeda',
      theme: 'Essential Living',
    },
  ];

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const todayQuote = dailyQuotes[dayOfYear % dailyQuotes.length];

  const handleSaveQuoteToMoments = () => {
    addMoment(`“${todayQuote.quote}” — ${todayQuote.author}`);
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
      {/* Welcome Greeting */}
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

      {/* Quote of the Day Card */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Quote className="w-4 h-4" />
            <span>Daily Wisdom • {todayQuote.theme}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Day #{dayOfYear % 365}</span>
        </div>

        <blockquote className="text-lg sm:text-xl font-serif italic text-slate-900 dark:text-white font-medium leading-relaxed">
          &ldquo;{todayQuote.quote}&rdquo;
        </blockquote>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-indigo-100/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            — {todayQuote.author}
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
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Journey Cards
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {cards.length}
          </div>
          <div className="text-[11px] text-slate-500">Confirmed insights</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Private Notes
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">
            {journalEntries.length}
          </div>
          <div className="text-[11px] text-slate-500">Local entries saved</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Light Moments
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {moments.length}
          </div>
          <div className="text-[11px] text-slate-500">Gratitude & memories</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Habit Seeds
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {nurturedHabitsCount}
          </div>
          <div className="text-[11px] text-slate-500">Times nurtured</div>
        </div>
      </div>

      {/* Quick Launch Studios */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
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
