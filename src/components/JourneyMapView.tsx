'use client';

import React from 'react';
import { ActivityJourneyHistory } from '@/components/ActivityJourneyHistory';
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
            <Map className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
              {dict.journeyMap.title}
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {dict.journeyMap.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartNew}
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.journeyMap.startReflection}</span>
        </button>
      </div>

      <ActivityJourneyHistory />
      {/* Cards List or Empty State */}
      {cards.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800">
            <Compass className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
              {dict.journeyMap.emptyTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {dict.journeyMap.emptyDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartNew}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
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
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4 shadow-md hover:border-indigo-500/40 transition-all text-slate-900 dark:text-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {intentMeta?.title || card.intent}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <blockquote className="text-base sm:text-lg font-serif italic text-slate-900 dark:text-white font-medium leading-relaxed pt-1">
                    &ldquo;{card.confirmedInsight}&rdquo;
                  </blockquote>

                  {card.microStep && (
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-0.5">
                      <div className="font-bold uppercase tracking-wider text-[10px]">
                        {dict.journeyMap.microStepLabel}
                      </div>
                      <p className="text-slate-900 dark:text-white font-medium">{card.microStep}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    {dict.journeyMap.statusConfirmed}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteCard(card.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
