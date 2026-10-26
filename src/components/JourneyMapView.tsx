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
            <h1 className="text-2xl sm:text-3xl font-semibold text-stone-charcoal">
              {dict.journeyMap.title}
            </h1>
          </div>
          <p className="text-sm text-stone-mist">
            {dict.journeyMap.subtitle}
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2 rounded-xl bg-violet-deep text-ivory-50 text-xs sm:text-sm font-medium hover:bg-violet-deep/90 flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.journeyMap.startReflection}</span>
        </button>
      </div>

      {/* Cards List or Empty State */}
      {cards.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-ivory-100 border border-stone-border space-y-4">
          <div className="w-12 h-12 rounded-full bg-ivory-200 text-stone-mist flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-stone-charcoal">
              {dict.journeyMap.emptyTitle}
            </h2>
            <p className="text-sm text-stone-mist max-w-md mx-auto">
              {dict.journeyMap.emptyDesc}
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="px-5 py-2.5 rounded-xl bg-violet-deep text-ivory-50 text-xs sm:text-sm font-medium hover:bg-violet-deep/90"
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
                className="p-5 sm:p-6 rounded-2xl bg-ivory-100 border border-stone-border flex flex-col justify-between gap-4 shadow-xs hover:border-violet-muted/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-soft text-violet-deep border border-violet-muted/20">
                      {intentMeta?.title || card.intent}
                    </span>
                    <span className="text-[11px] text-stone-mist">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <blockquote className="text-base sm:text-lg font-serif italic text-stone-charcoal leading-relaxed pt-1">
                    &ldquo;{card.confirmedInsight}&rdquo;
                  </blockquote>

                  {card.microStep && (
                    <div className="p-3 rounded-xl bg-mint-soft/80 border border-mint-muted/30 text-xs text-mint-deep space-y-0.5">
                      <div className="font-semibold uppercase tracking-wider text-[10px]">
                        {dict.journeyMap.microStepLabel}
                      </div>
                      <p className="text-stone-charcoal">{card.microStep}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-ivory-300 text-xs text-stone-mist">
                  <span className="flex items-center gap-1 text-mint-deep font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {dict.journeyMap.statusConfirmed}
                  </span>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-1 rounded text-stone-mist hover:text-peach-deep hover:bg-ivory-200"
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
