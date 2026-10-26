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
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-charcoal">
            {dict.progress.title}
          </h1>
        </div>
        <p className="text-sm text-stone-mist">
          {dict.progress.subtitle}
        </p>
      </div>

      {/* Zero Streaks / Zero Guilt Philosophy Banner */}
      <div className="p-4 rounded-2xl bg-mint-soft/80 border border-mint-muted/30 text-xs sm:text-sm text-mint-deep flex items-start gap-3">
        <Heart className="w-5 h-5 shrink-0 mt-0.5 text-mint-muted" />
        <p className="leading-relaxed">
          {dict.progress.noStreaksNotice}
        </p>
      </div>

      {/* Gentle Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-ivory-100 border border-stone-border space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist">
            {dict.progress.totalInsights}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-violet-deep">
            {cards.length}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-ivory-100 border border-stone-border space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist">
            {dict.progress.totalReflections}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-mint-deep">
            {journalEntries.length}
          </div>
        </div>
      </div>

      {/* Moments of Light Section */}
      <section aria-labelledby="moments-title" className="space-y-4 pt-4 border-t border-ivory-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-peach-muted" />
            <h2 id="moments-title" className="text-lg font-semibold text-stone-charcoal">
              {dict.progress.momentsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-mist">
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-ivory-50 border border-stone-border text-sm text-stone-charcoal placeholder-stone-mist/60 focus:outline-none focus:ring-2 focus:ring-mint-muted"
          />
          <button
            type="submit"
            disabled={!momentInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-stone-charcoal text-ivory-50 text-xs sm:text-sm font-medium hover:bg-stone-charcoal/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {dict.progress.addMomentBtn}
          </button>
        </form>

        {/* Moments List */}
        {moments.length === 0 ? (
          <p className="text-xs sm:text-sm text-stone-mist italic py-3">
            {dict.progress.emptyMoments}
          </p>
        ) : (
          <div className="space-y-2">
            {moments.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-ivory-100 border border-stone-border flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2 text-stone-charcoal">
                  <Sun className="w-4 h-4 text-peach-muted shrink-0" />
                  <span>{m.text}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-xs text-stone-mist">
                  <span>{new Date(m.date).toLocaleDateString()}</span>
                  <button
                    onClick={() => deleteMoment(m.id)}
                    className="p-1 rounded text-stone-mist hover:text-peach-deep"
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
