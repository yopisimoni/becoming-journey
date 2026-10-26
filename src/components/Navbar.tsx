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
} from 'lucide-react';
import { WipeDataModal } from './WipeDataModal';
import { StorageSettingsModal } from './StorageSettingsModal';

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
    setSafetyModalOpen,
    exportDataJson,
    exportDataTxt,
    setCurrentIntent,
  } = useApp();

  const [isWipeOpen, setWipeOpen] = useState(false);
  const [isStorageOpen, setStorageOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'map' | 'progress') => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentIntent(null);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur border-b border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 text-start focus:outline-none focus:ring-2 focus:ring-violet-muted rounded-lg"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-deep flex items-center justify-center text-ivory-50 font-bold text-sm shadow-sm">
                  B
                </div>
                <div>
                  <span className="text-base font-semibold tracking-wide text-stone-charcoal">
                    {dict.nav.title}
                  </span>
                  <span className="hidden md:inline-block ms-2 text-xs text-stone-mist font-normal">
                    {dict.nav.tagline}
                  </span>
                </div>
              </button>
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-mint-soft text-mint-deep border border-mint-muted/30">
                {dict.nav.prototypeBadge}
              </span>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'home'
                    ? 'bg-violet-soft text-violet-deep font-semibold'
                    : 'text-stone-mist hover:text-stone-charcoal hover:bg-ivory-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{dict.welcome.question.split('?')[0]}</span>
              </button>
              <button
                onClick={() => handleNavClick('map')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'map'
                    ? 'bg-violet-soft text-violet-deep font-semibold'
                    : 'text-stone-mist hover:text-stone-charcoal hover:bg-ivory-200'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>{dict.nav.journeyMap}</span>
              </button>
              <button
                onClick={() => handleNavClick('progress')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'progress'
                    ? 'bg-violet-soft text-violet-deep font-semibold'
                    : 'text-stone-mist hover:text-stone-charcoal hover:bg-ivory-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{dict.nav.progress}</span>
              </button>
            </nav>

            {/* Desktop Controls (Language, Storage, Export, Wipe, Safety) */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative inline-flex items-center">
                <Globe className="w-3.5 h-3.5 text-stone-mist absolute start-2 pointer-events-none" />
                <select
                  aria-label="Select Language Desktop"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="ps-7 pe-6 py-1 text-xs rounded-xl bg-ivory-100 border border-stone-border text-stone-charcoal hover:bg-ivory-200 focus:outline-none focus:ring-2 focus:ring-violet-muted cursor-pointer font-medium"
                >
                  {supportedLocales.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reduced Motion Toggle */}
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                title={dict.nav.reducedMotion}
                aria-pressed={reducedMotion}
                className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition-colors ${
                  reducedMotion
                    ? 'bg-peach-soft text-peach-deep border-peach-muted/40 font-medium'
                    : 'bg-ivory-100 text-stone-mist border-stone-border hover:bg-ivory-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden xl:inline">{dict.nav.reducedMotion}</span>
              </button>

              {/* Storage Mode Pill */}
              <button
                onClick={() => setStorageOpen(true)}
                title="Storage Settings"
                className="px-2 py-1 rounded-xl border border-stone-border bg-ivory-100 hover:bg-ivory-200 text-xs text-stone-charcoal flex items-center gap-1 font-medium"
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
                  className="p-1.5 rounded-xl border border-stone-border bg-ivory-100 hover:bg-ivory-200 text-stone-charcoal text-xs flex items-center gap-1"
                  title={dict.nav.exportButton}
                >
                  <Download className="w-3.5 h-3.5 text-stone-mist" />
                  <span className="text-[11px] hidden lg:inline">{dict.nav.exportButton}</span>
                </button>
                {isExportMenuOpen && (
                  <div className="absolute end-0 mt-1 w-44 bg-ivory-50 border border-stone-border rounded-xl shadow-lg py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        exportDataJson();
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-start px-3 py-1.5 hover:bg-ivory-200 text-stone-charcoal"
                    >
                      {dict.dataManagement.exportJson}
                    </button>
                    <button
                      onClick={() => {
                        exportDataTxt();
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-start px-3 py-1.5 hover:bg-ivory-200 text-stone-charcoal"
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
                className="p-1.5 rounded-xl border border-peach-muted/30 bg-peach-soft/60 hover:bg-peach-soft text-peach-deep text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Safety Modal Button */}
              <button
                onClick={() => setSafetyModalOpen(true)}
                title={dict.nav.safetyButton}
                className="px-2.5 py-1 rounded-xl bg-violet-soft hover:bg-violet-muted/30 text-violet-deep text-xs font-medium flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{dict.nav.safetyButton}</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={() => setSafetyModalOpen(true)}
                className="p-1.5 rounded-xl bg-violet-soft text-violet-deep"
                aria-label="Safety support"
              >
                <Shield className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-xl bg-ivory-200 text-stone-charcoal"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-ivory-300 bg-ivory-50 px-4 pt-3 pb-4 space-y-3">
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-start px-3 py-2 rounded-xl text-sm font-medium ${
                  activeTab === 'home'
                    ? 'bg-violet-soft text-violet-deep font-semibold'
                    : 'text-stone-charcoal hover:bg-ivory-200'
                }`}
              >
                {dict.welcome.question}
              </button>
              <button
                onClick={() => handleNavClick('map')}
                className={`w-full text-start px-3 py-2 rounded-xl text-sm font-medium ${
                  activeTab === 'map'
                    ? 'bg-violet-soft text-violet-deep font-semibold'
                    : 'text-stone-charcoal hover:bg-ivory-200'
                }`}
              >
                {dict.nav.journeyMap}
              </button>
              <button
                onClick={() => handleNavClick('progress')}
                className={`w-full text-start px-3 py-2 rounded-xl text-sm font-medium ${
                  activeTab === 'progress'
                    ? 'bg-violet-soft text-violet-deep font-semibold'
                    : 'text-stone-charcoal hover:bg-ivory-200'
                }`}
              >
                {dict.nav.progress}
              </button>
            </nav>

            <div className="pt-2 border-t border-ivory-300 grid grid-cols-2 gap-2 text-xs">
              <div className="col-span-2">
                <label htmlFor="mobile-lang-select" className="block text-[11px] text-stone-mist mb-1">Language</label>
                <select
                  id="mobile-lang-select"
                  aria-label="Select Language Mobile"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="w-full py-1.5 px-2 rounded-xl bg-ivory-100 border border-stone-border text-stone-charcoal font-medium"
                >
                  {supportedLocales.map((l) => (
                    <option key={l.code} value={l.code}>
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
                className="p-2 rounded-xl border border-stone-border bg-ivory-100 text-stone-charcoal text-start font-medium flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-violet-muted" />
                <span>Motion: {reducedMotion ? 'Off' : 'On'}</span>
              </button>

              <button
                onClick={() => {
                  setStorageOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl border border-stone-border bg-ivory-100 text-stone-charcoal text-start font-medium flex items-center gap-1.5"
              >
                <HardDrive className="w-3.5 h-3.5 text-violet-muted" />
                <span>Store: {storageMode === 'local' ? 'Device' : 'Session'}</span>
              </button>

              <button
                onClick={() => {
                  exportDataJson();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl border border-stone-border bg-ivory-100 text-stone-charcoal text-start font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-stone-mist" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  exportDataTxt();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl border border-stone-border bg-ivory-100 text-stone-charcoal text-start font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-stone-mist" />
                <span>Export TXT</span>
              </button>

              <button
                onClick={() => {
                  setWipeOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 p-2 rounded-xl border border-peach-muted/40 bg-peach-soft text-peach-deep text-center font-medium flex items-center justify-center gap-1.5"
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
    </>
  );
}
