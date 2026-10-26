'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Map, Trash2, CheckCircle2, Compass, Plus } from 'lucide-react';

export function JourneyMapView() {
  const {
    dict,
    cards,
    deleteCard,
    setActiveTab,
    setCurrentIntent,
    setActiveMode,
  } = useApp();

  const handleStartNew = () => {
    setCurrentIntent(null);
    setActiveMode('guided');
    setActiveTab('home');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-violet-muted" />
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-charcoal dark:text-ivory-100">
              {dict.journeyMap.title}
            </h1>
          </div>
          <p className="text-sm text-stone-mist dark:text-stone-300">
            {dict.journeyMap.subtitle}
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2 rounded-2xl bg-violet-deep dark:bg-violet-muted text-ivory-50 text-xs sm:text-sm font-medium hover:opacity-90 flex items-center gap-1.5 shadow-sm transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.journeyMap.startReflection}</span>
        </button>
      </div>

      {/* Cards List or Empty State */}
      {cards.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-border/80 dark:border-white/10 space-y-4 shadow-sm dark:shadow-none">
          <div className="w-12 h-12 rounded-full bg-ivory-200 dark:bg-stone-800 text-stone-mist dark:text-stone-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-semibold text-stone-charcoal dark:text-ivory-100">
              {dict.journeyMap.emptyTitle}
            </h2>
            <p className="text-sm text-stone-mist dark:text-stone-300 max-w-md mx-auto">
              {dict.journeyMap.emptyDesc}
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="px-5 py-2.5 rounded-2xl bg-violet-deep dark:bg-violet-muted text-ivory-50 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {dict.journeyMap.startReflection}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const intentMeta = dict.welcome.intents[card.intent];
            return (
              <div
                key={card.id}
                className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-border/80 dark:border-white/10 flex flex-col justify-between gap-4 shadow-sm dark:shadow-none hover:border-violet-muted/40 dark:hover:border-violet-muted/60 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-soft dark:bg-violet-deep/30 text-violet-deep dark:text-violet-soft border border-violet-muted/20 dark:border-violet-muted/30">
                      {intentMeta?.title || card.intent}
                    </span>
                    <span className="text-[11px] text-stone-mist dark:text-stone-400">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <blockquote className="text-base sm:text-lg font-serif italic text-stone-charcoal dark:text-ivory-100 leading-relaxed pt-1">
                    &ldquo;{card.confirmedInsight}&rdquo;
                  </blockquote>

                  {card.microStep && (
                    <div className="p-3 rounded-2xl bg-mint-soft/80 dark:bg-mint-deep/20 border border-mint-muted/30 dark:border-mint-muted/40 text-xs text-mint-deep dark:text-mint-soft space-y-0.5">
                      <div className="font-semibold uppercase tracking-wider text-[10px]">
                        {dict.journeyMap.microStepLabel}
                      </div>
                      <p className="text-stone-charcoal dark:text-stone-200">{card.microStep}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-border/40 dark:border-white/10 text-xs text-stone-mist dark:text-stone-400">
                  <span className="flex items-center gap-1 text-mint-deep dark:text-mint-soft font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {dict.journeyMap.statusConfirmed}
                  </span>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-1.5 rounded-lg text-stone-mist dark:text-stone-400 hover:text-peach-deep dark:hover:text-peach-soft hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    title={dict.journeyMap.deleteCard}
                    aria-label={`${dict.journeyMap.deleteCard} from ${new Date(card.createdAt).toLocaleDateString()}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
