'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Compass, Feather, Map, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function FloatingDock() {
  const {
    dict,
    activeTab,
    setActiveTab,
    activeMode,
    setActiveMode,
    setCurrentIntent,
    setSanctuaryStep,
    reducedMotion,
  } = useApp();

  const handleSelectTab = (tabId: 'sanctuary' | 'journal' | 'map' | 'moments') => {
    if (tabId === 'sanctuary') {
      setActiveTab('home');
      setActiveMode('guided');
      setCurrentIntent(null);
      setSanctuaryStep(0);
    } else if (tabId === 'journal') {
      setActiveTab('home');
      setActiveMode('journal');
    } else if (tabId === 'map') {
      setActiveTab('map');
    } else if (tabId === 'moments') {
      setActiveTab('progress');
    }
  };

  const isSanctuaryActive = activeTab === 'home' && activeMode !== 'journal';
  const isJournalActive = activeTab === 'home' && activeMode === 'journal';
  const isMapActive = activeTab === 'map';
  const isMomentsActive = activeTab === 'progress';

  const tabs = [
    {
      id: 'sanctuary' as const,
      label: dict.nav.sanctuaryTab || 'Sanctuary',
      icon: Compass,
      isActive: isSanctuaryActive,
    },
    {
      id: 'journal' as const,
      label: dict.nav.journalTab || 'Journal',
      icon: Feather,
      isActive: isJournalActive,
    },
    {
      id: 'map' as const,
      label: dict.nav.mapTab || 'Journey Map',
      icon: Map,
      isActive: isMapActive,
    },
    {
      id: 'moments' as const,
      label: dict.nav.momentsTab || 'Moments of Light',
      icon: Sparkles,
      isActive: isMomentsActive,
    },
  ];

  return (
    <nav
      aria-label="Sanctuary Navigation Dock"
      className="fixed bottom-5 inset-x-0 mx-auto w-fit max-w-[94vw] z-40 pointer-events-auto"
    >
      <div className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-full backdrop-blur-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 ring-1 ring-slate-950/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <button
              key={tab.id}
              id={`floating-dock-tab-${tab.id}`}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              aria-label={tab.label}
              className={`relative p-2.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 select-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                active
                  ? 'text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-dock-pill"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 350, damping: 30 }
                  }
                  className="absolute inset-0 bg-slate-900 dark:bg-white rounded-full shadow-md -z-10"
                />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
