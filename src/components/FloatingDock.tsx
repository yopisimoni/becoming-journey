'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Compass,
  Feather,
  Map,
  Sparkles,
  LayoutGrid,
  Wind,
  Navigation,
  Calendar,
  Scale,
  Lock,
  Settings,
  SunMedium,
  Sun,
  Moon,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [studiosOpen, setStudiosOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close studios menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setStudiosOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTab = (tabId: 'sanctuary' | 'journal' | 'map' | 'moments') => {
    setStudiosOpen(false);
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
  const isStudioActive = [
    'breathe',
    'quiz',
    'dashboard',
    'calendar',
    'habits',
    'vault',
    'settings',
    'morning',
    'evening',
    'goodvibes',
  ].includes(activeTab);

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

  const studios = [
    {
      id: 'morning' as const,
      label: dict.nav.morningTab || 'Morning Ritual',
      icon: Sun,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      action: () => setActiveTab('morning'),
    },
    {
      id: 'evening' as const,
      label: dict.nav.eveningTab || 'Evening Ritual',
      icon: Moon,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
      action: () => setActiveTab('evening'),
    },
    {
      id: 'goodvibes' as const,
      label: dict.nav.goodVibesTab || 'Good Vibes Studio',
      icon: Share2,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
      action: () => setActiveTab('goodvibes'),
    },
    {
      id: 'breathe' as const,
      label: dict.nav.breatheTab || 'Breathing Studio',
      icon: Wind,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40',
      action: () => setActiveTab('breathe'),
    },
    {
      id: 'quiz' as const,
      label: dict.nav.quizTab || 'Inner Compass Quiz',
      icon: Navigation,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
      action: () => setActiveTab('quiz'),
    },
    {
      id: 'dashboard' as const,
      label: 'Daily Dashboard',
      icon: SunMedium,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      action: () => setActiveTab('dashboard'),
    },
    {
      id: 'calendar' as const,
      label: dict.nav.calendarTab || 'Life Horizons',
      icon: Calendar,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      action: () => setActiveTab('calendar'),
    },
    {
      id: 'habits' as const,
      label: 'Balance Ledger',
      icon: Scale,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40',
      action: () => setActiveTab('habits'),
    },
    {
      id: 'vault' as const,
      label: dict.nav.vaultTab || 'Mind Vault',
      icon: Lock,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
      action: () => setActiveTab('vault'),
    },
    {
      id: 'settings' as const,
      label: dict.nav.settingsTab || 'Settings & About',
      icon: Settings,
      color: 'text-slate-500 bg-slate-50 dark:bg-slate-800/40',
      action: () => setActiveTab('settings'),
    },
  ];

  return (
    <nav
      aria-label="Sanctuary Navigation Dock"
      className="fixed bottom-5 inset-x-0 mx-auto w-fit max-w-[96vw] z-40 pointer-events-auto"
      ref={popoverRef}
    >
      {/* Studios Popover Menu */}
      <AnimatePresence>
        {studiosOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.18 }}
            className="absolute bottom-full mb-3 inset-x-0 mx-auto w-72 sm:w-80 p-3 rounded-3xl backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-950/5 z-50 text-xs"
          >
            <div className="px-2 py-1 mb-1 font-bold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sanctuary Studios & Spaces
            </div>
            <div className="grid grid-cols-1 gap-1">
              {studios.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`dock-studio-${item.id}`}
                    type="button"
                    onClick={() => {
                      item.action();
                      setStudiosOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-2xl text-start transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-md'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : item.color
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className={`relative p-2.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 select-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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

        {/* Studio Drawer Button */}
        <button
          id="floating-dock-tab-studios"
          type="button"
          onClick={() => setStudiosOpen(!studiosOpen)}
          aria-label="Sanctuary Studios"
          className={`relative p-2.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 select-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isStudioActive
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline">Studios</span>
        </button>
      </div>
    </nav>
  );
}
