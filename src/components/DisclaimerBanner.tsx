'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Info } from 'lucide-react';

export function DisclaimerBanner() {
  const { dict, setSafetyModalOpen } = useApp();

  return (
    <aside
      aria-label="Non-clinical disclaimer banner"
      className="bg-slate-100/95 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 sm:py-2 text-xs sm:text-sm transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <span className="font-normal text-slate-700 dark:text-slate-300 leading-relaxed">
            {dict.disclaimer.bannerText}
          </span>
        </div>
        <span className="sm:hidden text-xs font-medium text-slate-600 dark:text-slate-300">Personal reflection, not medical care</span>
        <button
          onClick={() => setSafetyModalOpen(true)}
          className="inline-flex min-h-9 items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-0.5"
        >
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          {dict.disclaimer.learnMore}
        </button>
      </div>
    </aside>
  );
}
