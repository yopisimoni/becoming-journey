'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, Heart, Sun, Trash2, ShieldAlert } from 'lucide-react';

export function PersonalProgressView() {
  const {
    dict,
    cards,
    journalEntries,
    moments,
    addMoment,
    deleteMoment,
  } = useApp();

  const [momentInput, setMomentInput] = useState('');

  const handleAddMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentInput.trim()) return;
    addMoment(momentInput);
    setMomentInput('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-mint-muted" />
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-charcoal dark:text-ivory-100">
            {dict.progress.title}
          </h1>
        </div>
        <p className="text-sm text-stone-mist dark:text-stone-300">
          {dict.progress.subtitle}
        </p>
      </div>

      {/* Zero Streaks / Zero Guilt Philosophy Banner */}
      <div className="p-4 rounded-3xl bg-mint-soft/80 dark:bg-mint-deep/20 border border-mint-muted/30 dark:border-mint-muted/40 text-xs sm:text-sm text-mint-deep dark:text-mint-soft flex items-start gap-3 backdrop-blur-md">
        <Heart className="w-5 h-5 shrink-0 mt-0.5 text-mint-muted" />
        <p className="leading-relaxed">
          {dict.progress.noStreaksNotice}
        </p>
      </div>

      {/* Gentle Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-border/80 dark:border-white/10 space-y-1 shadow-sm dark:shadow-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
            {dict.progress.totalInsights}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-violet-deep dark:text-violet-soft">
            {cards.length}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-border/80 dark:border-white/10 space-y-1 shadow-sm dark:shadow-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
            {dict.progress.totalReflections}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-mint-deep dark:text-mint-soft">
            {journalEntries.length}
          </div>
        </div>
      </div>

      {/* Moments of Light Section */}
      <section aria-labelledby="moments-title" className="space-y-4 pt-4 border-t border-stone-border/40 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-peach-muted" />
            <h2 id="moments-title" className="text-lg font-serif font-semibold text-stone-charcoal dark:text-ivory-100">
              {dict.progress.momentsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-300">
            {dict.progress.momentsSubtitle}
          </p>
        </div>

        {/* Add Moment Form */}
        <form onSubmit={handleAddMoment} className="flex gap-2">
          <input
            type="text"
            value={momentInput}
            onChange={(e) => setMomentInput(e.target.value)}
            placeholder={dict.progress.addMomentPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-md border border-stone-border/80 dark:border-white/10 text-sm text-stone-charcoal dark:text-ivory-100 placeholder-stone-mist/60 dark:placeholder-stone-400/60 focus:outline-none focus:ring-2 focus:ring-mint-muted"
          />
          <button
            type="submit"
            disabled={!momentInput.trim()}
            className="px-4 py-2.5 rounded-2xl bg-stone-charcoal dark:bg-ivory-100 text-ivory-50 dark:text-stone-900 text-xs sm:text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-sm"
          >
            {dict.progress.addMomentBtn}
          </button>
        </form>

        {/* Moments List */}
        {moments.length === 0 ? (
          <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 italic py-3">
            {dict.progress.emptyMoments}
          </p>
        ) : (
          <div className="space-y-2">
            {moments.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-border/80 dark:border-white/10 flex items-center justify-between gap-3 text-sm shadow-sm dark:shadow-none"
              >
                <div className="flex items-center gap-2 text-stone-charcoal dark:text-ivory-100">
                  <Sun className="w-4 h-4 text-peach-muted shrink-0" />
                  <span>{m.text}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-xs text-stone-mist dark:text-stone-400">
                  <span>{new Date(m.date).toLocaleDateString()}</span>
                  <button
                    onClick={() => deleteMoment(m.id)}
                    className="p-1 rounded-lg text-stone-mist dark:text-stone-400 hover:text-peach-deep dark:hover:text-peach-soft hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    aria-label="Delete moment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
