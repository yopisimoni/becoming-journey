'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { EntryIntent, InteractionMode } from '@/types';
import {
  Compass,
  Target,
  Heart,
  Sprout,
  MessageSquareQuote,
  Feather,
  Volume2,
} from 'lucide-react';

export function WelcomeView() {
  const { dict, setCurrentIntent, setActiveMode } = useApp();

  const handleSelectIntent = (intent: EntryIntent) => {
    setCurrentIntent(intent);
    setActiveMode('guided');
  };

  const handleSelectMode = (mode: InteractionMode) => {
    setActiveMode(mode);
    if (!intentSelected) {
      setCurrentIntent('lost');
    }
  };

  const intentIcons: Record<EntryIntent, React.ReactNode> = {
    lost: <Compass className="w-5 h-5 text-violet-muted" />,
    goal: <Target className="w-5 h-5 text-mint-muted" />,
    struggle: <Heart className="w-5 h-5 text-peach-muted" />,
    grow: <Sprout className="w-5 h-5 text-mint-muted" />,
  };

  const modeIcons: Record<InteractionMode, React.ReactNode> = {
    guided: <MessageSquareQuote className="w-5 h-5 text-violet-muted" />,
    journal: <Feather className="w-5 h-5 text-mint-muted" />,
    listen: <Volume2 className="w-5 h-5 text-peach-muted" />,
  };

  const intentOrder: EntryIntent[] = ['lost', 'goal', 'struggle', 'grow'];
  const modeOrder: InteractionMode[] = ['guided', 'journal', 'listen'];

  const intentSelected = false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Hero Heading */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-semibold text-stone-charcoal tracking-tight">
          {dict.welcome.question}
        </h1>
        <p className="text-sm sm:text-base text-stone-mist max-w-xl mx-auto leading-relaxed">
          {dict.welcome.subtitle}
        </p>
      </div>

      {/* 4 Core Entry Intent Cards */}
      <section aria-labelledby="intent-selection-heading" className="space-y-4">
        <h2
          id="intent-selection-heading"
          className="text-xs font-semibold uppercase tracking-wider text-stone-mist text-center"
        >
          {dict.welcome.selectPrompt}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {intentOrder.map((intentKey) => {
            const item = dict.welcome.intents[intentKey];
            return (
              <button
                key={intentKey}
                onClick={() => handleSelectIntent(intentKey)}
                className="group p-5 rounded-2xl bg-ivory-100 hover:bg-ivory-200 border border-stone-border hover:border-violet-muted/50 transition-all text-start flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="p-2.5 rounded-xl bg-ivory-50 border border-stone-border group-hover:scale-105 transition-transform">
                    {intentIcons[intentKey]}
                  </span>
                  <span className="text-xs text-stone-mist font-medium tracking-wide">
                    {item.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-stone-charcoal group-hover:text-violet-deep transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-mist mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3 Interaction Modes (Direct entry option) */}
      <section aria-labelledby="mode-selection-heading" className="pt-6 border-t border-ivory-300 space-y-4">
        <h2
          id="mode-selection-heading"
          className="text-xs font-semibold uppercase tracking-wider text-stone-mist text-center"
        >
          {dict.welcome.chooseMode}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modeOrder.map((modeKey) => {
            const mode = dict.welcome.modes[modeKey];
            return (
              <button
                key={modeKey}
                onClick={() => handleSelectMode(modeKey)}
                className="p-4 rounded-xl bg-ivory-50 hover:bg-ivory-100 border border-stone-border transition-colors text-start flex flex-col gap-2 focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <div className="flex items-center gap-2">
                  {modeIcons[modeKey]}
                  <span className="text-sm font-semibold text-stone-charcoal">
                    {mode.name}
                  </span>
                </div>
                <p className="text-xs text-stone-mist leading-relaxed">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
