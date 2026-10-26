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
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
            {dict.progress.title}
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {dict.progress.subtitle}
        </p>
      </div>

      {/* Zero Streaks / Zero Guilt Philosophy Banner */}
      <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-3 shadow-xs">
        <Heart className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
        <p className="leading-relaxed font-medium">
          {dict.progress.noStreaksNotice}
        </p>
      </div>

      {/* Gentle Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {dict.progress.totalInsights}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {cards.length}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {dict.progress.totalReflections}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {journalEntries.length}
          </div>
        </div>
      </div>

      {/* Moments of Light Section */}
      <section aria-labelledby="moments-title" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <h2 id="moments-title" className="text-lg font-serif font-bold text-slate-900 dark:text-white">
              {dict.progress.momentsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
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
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs font-normal"
          />
          <button
            type="submit"
            disabled={!momentInput.trim()}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20"
          >
            {dict.progress.addMomentBtn}
          </button>
        </form>

        {/* Moments List */}
        {moments.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic py-3">
            {dict.progress.emptyMoments}
          </p>
        ) : (
          <div className="space-y-2">
            {moments.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-sm shadow-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-medium">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{m.text}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  <span>{new Date(m.date).toLocaleDateString()}</span>
                  <button
                    type="button"
                    onClick={() => deleteMoment(m.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
