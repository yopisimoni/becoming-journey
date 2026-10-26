'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Info } from 'lucide-react';

export function DisclaimerBanner() {
  const { dict, setSafetyModalOpen } = useApp();

  return (
    <aside
      aria-label="Non-clinical disclaimer banner"
      className="bg-ivory-200/90 dark:bg-stone-900/90 border-b border-ivory-300 dark:border-white/10 text-ivory-900 dark:text-stone-300 px-4 py-2 text-xs sm:text-sm backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-peach-muted shrink-0" aria-hidden="true" />
          <span className="font-normal text-stone-charcoal dark:text-stone-300 leading-relaxed">
            {dict.disclaimer.bannerText}
          </span>
        </div>
        <button
          onClick={() => setSafetyModalOpen(true)}
          className="inline-flex items-center gap-1 font-medium text-violet-deep dark:text-violet-soft hover:underline focus:outline-none focus:ring-2 focus:ring-violet-muted rounded px-1.5 py-0.5"
        >
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          {dict.disclaimer.learnMore}
        </button>
      </div>
    </aside>
  );
}
