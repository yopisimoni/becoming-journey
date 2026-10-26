'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supportedLocales } from '@/locales';
import { Locale } from '@/types';
import {
  Globe,
  Compass,
  Map,
  Sparkles,
  Shield,
  Trash2,
  Download,
  HardDrive,
  Eye,
  Menu,
  X,
  Moon,
  Sun,
  Cpu,
} from 'lucide-react';
import { WipeDataModal } from './WipeDataModal';
import { StorageSettingsModal } from './StorageSettingsModal';
import { SoundscapeControlPill } from './SoundscapeControlPill';
import { AiBridgeSettingsModal } from './AiBridgeSettingsModal';

export function Navbar() {
  const {
    locale,
    setLocale,
    dict,
    activeTab,
    setActiveTab,
    reducedMotion,
    setReducedMotion,
    storageMode,
    themeMode,
    setThemeMode,
    setSafetyModalOpen,
    setAiModalOpen,
    exportDataJson,
    exportDataTxt,
    setCurrentIntent,
    setSanctuaryStep,
  } = useApp();

  const [isWipeOpen, setWipeOpen] = useState(false);
  const [isStorageOpen, setStorageOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'map' | 'progress') => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentIntent(null);
      setSanctuaryStep(0);
    }
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'twilight' ? 'light' : 'twilight');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-ivory-50/80 dark:bg-stone-900/80 backdrop-blur-xl border-b border-ivory-300 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 text-start focus:outline-none focus:ring-2 focus:ring-violet-muted rounded-xl"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-deep text-ivory-50 flex items-center justify-center font-bold text-sm shadow-md">
                  B
                </div>
                <div>
                  <span className="text-base font-semibold tracking-wide text-stone-charcoal dark:text-ivory-100">
                    {dict.nav.title}
                  </span>
                  <span className="hidden md:inline-block ms-2 text-xs text-stone-mist dark:text-stone-400 font-normal">
                    {dict.nav.tagline}
                  </span>
                </div>
              </button>
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-mint-soft dark:bg-mint-deep/30 text-mint-deep dark:text-mint-soft border border-mint-muted/30">
                {dict.nav.prototypeBadge}
              </span>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'home'
                    ? 'bg-violet-soft dark:bg-violet-deep/40 text-violet-deep dark:text-violet-soft font-semibold'
                    : 'text-stone-mist dark:text-stone-300 hover:text-stone-charcoal dark:hover:text-white hover:bg-ivory-200 dark:hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{dict.welcome.question.split('?')[0]}</span>
              </button>
              <button
                onClick={() => handleNavClick('map')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'map'
                    ? 'bg-violet-soft dark:bg-violet-deep/40 text-violet-deep dark:text-violet-soft font-semibold'
                    : 'text-stone-mist dark:text-stone-300 hover:text-stone-charcoal dark:hover:text-white hover:bg-ivory-200 dark:hover:bg-white/5'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>{dict.nav.journeyMap}</span>
              </button>
              <button
                onClick={() => handleNavClick('progress')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'progress'
                    ? 'bg-violet-soft dark:bg-violet-deep/40 text-violet-deep dark:text-violet-soft font-semibold'
                    : 'text-stone-mist dark:text-stone-300 hover:text-stone-charcoal dark:hover:text-white hover:bg-ivory-200 dark:hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{dict.nav.progress}</span>
              </button>
            </nav>

            {/* Desktop Controls (Sound, Theme, Language, AI, Storage, Export, Wipe, Safety) */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Soundscape Control Pill */}
              <SoundscapeControlPill />

              {/* Twilight Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                title={themeMode === 'twilight' ? 'Daylight Sanctuary' : 'Twilight Sanctuary'}
                aria-label="Toggle Twilight Theme"
                className="p-1.5 rounded-full border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 hover:bg-ivory-200 text-stone-charcoal dark:text-ivory-100 transition-colors shadow-xs"
              >
                {themeMode === 'twilight' ? (
                  <Sun className="w-3.5 h-3.5 text-peach-muted" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-violet-muted" />
                )}
              </button>

              {/* Language Selector */}
              <div className="relative inline-flex items-center">
                <Globe className="w-3.5 h-3.5 text-stone-mist absolute start-2 pointer-events-none" />
                <select
                  aria-label="Select Language Desktop"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="ps-7 pe-6 py-1 text-xs rounded-full bg-ivory-100 dark:bg-white/5 border border-stone-border dark:border-white/10 text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-violet-muted"
                >
                  {supportedLocales.map((l) => (
                    <option key={l.code} value={l.code} className="dark:bg-stone-900">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Bridge Button */}
              <button
                onClick={() => setAiModalOpen(true)}
                title={dict.nav.aiSettingsBtn}
                className="p-1.5 rounded-full border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 hover:bg-ivory-200 text-stone-charcoal dark:text-ivory-100 text-xs shadow-xs"
              >
                <Cpu className="w-3.5 h-3.5 text-violet-muted" />
              </button>

              {/* Reduced Motion Toggle */}
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                title={dict.nav.reducedMotion}
                aria-pressed={reducedMotion}
                className={`p-1.5 rounded-full border text-xs flex items-center gap-1 transition-colors ${
                  reducedMotion
                    ? 'bg-peach-soft text-peach-deep border-peach-muted/40 font-medium'
                    : 'bg-ivory-100 dark:bg-white/5 text-stone-mist border-stone-border dark:border-white/10'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              {/* Storage Mode Pill */}
              <button
                onClick={() => setStorageOpen(true)}
                title="Storage Settings"
                className="px-2.5 py-1 rounded-full border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 hover:bg-ivory-200 text-xs text-stone-charcoal dark:text-ivory-100 flex items-center gap-1 font-medium"
              >
                <HardDrive className="w-3 h-3 text-violet-muted" />
                <span className="text-[11px]">
                  {storageMode === 'local' ? 'Device' : 'Session'}
                </span>
              </button>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen(!isExportMenuOpen)}
                  className="p-1.5 rounded-full border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 hover:bg-ivory-200 text-stone-charcoal dark:text-ivory-100 text-xs flex items-center gap-1"
                  title={dict.nav.exportButton}
                >
                  <Download className="w-3.5 h-3.5 text-stone-mist" />
                </button>
                {isExportMenuOpen && (
                  <div className="absolute end-0 mt-1 w-44 bg-ivory-50 dark:bg-stone-900 border border-stone-border dark:border-white/10 rounded-2xl shadow-xl py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        exportDataJson();
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-start px-3 py-1.5 hover:bg-ivory-200 dark:hover:bg-white/5 text-stone-charcoal dark:text-ivory-100"
                    >
                      {dict.dataManagement.exportJson}
                    </button>
                    <button
                      onClick={() => {
                        exportDataTxt();
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-start px-3 py-1.5 hover:bg-ivory-200 dark:hover:bg-white/5 text-stone-charcoal dark:text-ivory-100"
                    >
                      {dict.dataManagement.exportTxt}
                    </button>
                  </div>
                )}
              </div>

              {/* Wipe Data */}
              <button
                onClick={() => setWipeOpen(true)}
                title={dict.nav.wipeButton}
                className="p-1.5 rounded-full border border-peach-muted/30 bg-peach-soft/60 hover:bg-peach-soft text-peach-deep text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Safety Modal Button */}
              <button
                onClick={() => setSafetyModalOpen(true)}
                title={dict.nav.safetyButton}
                className="px-3 py-1 rounded-full bg-violet-soft dark:bg-violet-deep/50 hover:bg-violet-muted/30 text-violet-deep dark:text-violet-soft text-xs font-medium flex items-center gap-1 shadow-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{dict.nav.safetyButton}</span>
              </button>
            </div>

            {/* Mobile Bar Controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              <SoundscapeControlPill />
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-ivory-200 dark:bg-white/10 text-stone-charcoal dark:text-ivory-100"
                aria-label="Toggle Twilight Theme"
              >
                {themeMode === 'twilight' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSafetyModalOpen(true)}
                className="p-1.5 rounded-full bg-violet-soft dark:bg-violet-deep/50 text-violet-deep dark:text-violet-soft"
                aria-label="Safety support"
              >
                <Shield className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-full bg-ivory-200 dark:bg-white/10 text-stone-charcoal dark:text-ivory-100"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-ivory-300 dark:border-white/10 bg-ivory-50/95 dark:bg-stone-900/95 backdrop-blur-xl px-4 pt-3 pb-4 space-y-3">
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-start px-3 py-2 rounded-xl text-sm font-medium ${
                  activeTab === 'home'
                    ? 'bg-violet-soft dark:bg-violet-deep/40 text-violet-deep dark:text-violet-soft font-semibold'
                    : 'text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 dark:hover:bg-white/5'
                }`}
              >
                {dict.welcome.question}
              </button>
              <button
                onClick={() => handleNavClick('map')}
                className={`w-full text-start px-3 py-2 rounded-xl text-sm font-medium ${
                  activeTab === 'map'
                    ? 'bg-violet-soft dark:bg-violet-deep/40 text-violet-deep dark:text-violet-soft font-semibold'
                    : 'text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 dark:hover:bg-white/5'
                }`}
              >
                {dict.nav.journeyMap}
              </button>
              <button
                onClick={() => handleNavClick('progress')}
                className={`w-full text-start px-3 py-2 rounded-xl text-sm font-medium ${
                  activeTab === 'progress'
                    ? 'bg-violet-soft dark:bg-violet-deep/40 text-violet-deep dark:text-violet-soft font-semibold'
                    : 'text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 dark:hover:bg-white/5'
                }`}
              >
                {dict.nav.progress}
              </button>
            </nav>

            <div className="pt-2 border-t border-ivory-300 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div className="col-span-2">
                <label htmlFor="mobile-lang-select" className="block text-[11px] text-stone-mist dark:text-stone-400 mb-1">
                  Language
                </label>
                <select
                  id="mobile-lang-select"
                  aria-label="Select Language Mobile"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="w-full py-2 px-3 rounded-xl bg-ivory-100 dark:bg-white/5 border border-stone-border dark:border-white/10 text-stone-charcoal dark:text-ivory-100 font-medium"
                >
                  {supportedLocales.map((l) => (
                    <option key={l.code} value={l.code} className="dark:bg-stone-900">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setReducedMotion(!reducedMotion);
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 text-stone-charcoal dark:text-ivory-100 text-start font-medium flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-violet-muted" />
                <span>Motion: {reducedMotion ? 'Off' : 'On'}</span>
              </button>

              <button
                onClick={() => {
                  setAiModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 text-stone-charcoal dark:text-ivory-100 text-start font-medium flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-violet-muted" />
                <span>AI Bridge</span>
              </button>

              <button
                onClick={() => {
                  setStorageOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 text-stone-charcoal dark:text-ivory-100 text-start font-medium flex items-center gap-1.5"
              >
                <HardDrive className="w-3.5 h-3.5 text-violet-muted" />
                <span>Store: {storageMode === 'local' ? 'Device' : 'Session'}</span>
              </button>

              <button
                onClick={() => {
                  exportDataJson();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 text-stone-charcoal dark:text-ivory-100 text-start font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-stone-mist" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  setWipeOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 p-2.5 rounded-xl border border-peach-muted/40 bg-peach-soft dark:bg-peach-deep/30 text-peach-deep dark:text-peach-soft text-center font-medium flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{dict.nav.wipeButton}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <WipeDataModal isOpen={isWipeOpen} onClose={() => setWipeOpen(false)} />
      <StorageSettingsModal isOpen={isStorageOpen} onClose={() => setStorageOpen(false)} />
      <AiBridgeSettingsModal />
    </>
  );
}
