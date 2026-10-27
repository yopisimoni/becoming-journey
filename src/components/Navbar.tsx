'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supportedLocales } from '@/locales';
import { Locale } from '@/types';
import {
  Globe,
  Moon,
  Sun,
  User,
  LogOut,
  Cpu,
  HardDrive,
  Shield,
  Download,
  Trash2,
  ChevronDown,
  Sparkles,
  Mountain,
  Waves,
  Feather,
  Compass,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { WipeDataModal } from './WipeDataModal';
import { StorageSettingsModal } from './StorageSettingsModal';
import { SoundscapeControlPill } from './SoundscapeControlPill';
import { AtmosphereSwitcher } from './AtmosphereSwitcher';
import { AiBridgeSettingsModal } from './AiBridgeSettingsModal';
import { AuthModal } from './AuthModal';
import { LivingLightIdentity } from '@/components/motion';

export function Navbar() {
  const {
    locale,
    setLocale,
    dict,
    setActiveTab,
    themeMode,
    setThemeMode,
    user,
    signOut,
    setAuthModalOpen,
    setSafetyModalOpen,
    setAiModalOpen,
    exportDataJson,
    exportDataTxt,
    setCurrentIntent,
    setSanctuaryStep,
  } = useApp();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWipeOpen, setWipeOpen] = useState(false);
  const [isStorageOpen, setStorageOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  const handleLogoClick = () => {
    setActiveTab('home');
    setCurrentIntent(null);
    setSanctuaryStep(0);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'twilight' ? 'light' : 'twilight');
  };

  // Close dropdown and mobile menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileTriggerRef.current &&
        !mobileTriggerRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const renderAvatarIcon = (avatarId?: string) => {
    switch (avatarId) {
      case 'mountain':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'wave':
        return <Waves className="w-3.5 h-3.5" />;
      case 'leaf':
        return <Feather className="w-3.5 h-3.5" />;
      case 'star':
        return <Compass className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 sm:bg-white/80 sm:dark:bg-slate-900/80 sm:backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 min-w-0">
            {/* Start: Brand Logo & Prototype Badge */}
            <div className="flex items-center gap-2 min-w-0 shrink">
              <button
                type="button"
                onClick={handleLogoClick}
                className="flex items-center gap-2.5 text-start focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shrink-0" aria-hidden="true">
                  <span className="font-serif text-2xl font-semibold text-white dark:text-slate-900 leading-none">B</span>
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    {dict.nav.title}
                  </span>
                  <span className="hidden sm:inline-block ms-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
                    {dict.nav.tagline}
                  </span>
                </div>
              </button>

              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {dict.nav.prototypeBadge}
              </span>
            </div>

            <button
              ref={mobileTriggerRef}
              type="button"
              aria-label="Open sanctuary controls"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-sanctuary-menu"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden min-w-11 min-h-11 shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {/* End: Controls (Sound Pill, Language, Theme Toggle, User Account) */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              {/* Atmosphere Mood Switcher */}
              <AtmosphereSwitcher />

              {/* Soundscape Control Pill */}
              <SoundscapeControlPill />

              {/* Twilight Sanctuary Dark Mode Toggle */}
              <button
                id="twilight-theme-toggle"
                onClick={toggleTheme}
                title={themeMode === 'twilight' ? 'Daylight Sanctuary' : 'Twilight Sanctuary'}
                aria-label="Toggle Twilight Theme"
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
              >
                {themeMode === 'twilight' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>

              {/* Settings & About Button */}
              <button
                id="navbar-settings-button"
                onClick={() => setActiveTab('settings')}
                title={dict.nav.settingsTab || 'Settings & About'}
                aria-label="Settings and About Sanctuary"
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Language Selector (Desktop & Mobile) */}
              <div className="relative inline-flex items-center">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 pointer-events-none" />
                <select
                  id="mobile-lang-select"
                  aria-label="Select Language Desktop"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="ps-7 pe-6 py-1.5 text-xs rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                >
                  {supportedLocales.map((l) => (
                    <option key={l.code} value={l.code} className="dark:bg-slate-900 dark:text-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Account / Sign In Dropdown */}
              <div className="relative" ref={menuRef}>
                {user ? (
                  <button
                    id="user-profile-button"
                    type="button"
                    onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                    aria-label="User profile menu"
                    className="flex items-center gap-2 ps-1.5 pe-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/70 text-indigo-950 dark:text-indigo-200 text-xs font-semibold transition-all shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      {renderAvatarIcon(user.avatar)}
                    </div>
                    <span className="hidden sm:inline truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-indigo-400" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-900/5 dark:bg-white/10 hover:bg-slate-900/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{dict.auth.signIn}</span>
                  </button>
                )}

                {/* Profile & Settings Dropdown Menu */}
                {isProfileMenuOpen && user && (
                  <div className="absolute end-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                    {/* User Header */}
                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                        {renderAvatarIcon(user.avatar)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      </div>
                    </div>

                    <div className="py-1">
                      {/* AI Companion Settings */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setAiModalOpen(true);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-start hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{dict.aiBridge.modalTitle}</span>
                      </button>

                      {/* Storage Settings */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setStorageOpen(true);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-start hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{dict.dataManagement.storageModeTitle}</span>
                      </button>

                      {/* Safety Support */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setSafetyModalOpen(true);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-start hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{dict.nav.safetyButton}</span>
                      </button>

                      {/* Settings & Sanctuary Hub */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setActiveTab('settings');
                        }}
                        className="w-full px-3 py-2 rounded-xl text-start hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{dict.nav.settingsTab || 'Settings & About'}</span>
                      </button>

                      {/* Export Data */}
                      <div className="px-3 py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-2">
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dict.nav.exportButton}</span>
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={exportDataJson}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-semibold"
                          >
                            JSON
                          </button>
                          <button
                            type="button"
                            onClick={exportDataTxt}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-semibold"
                          >
                            TXT
                          </button>
                        </div>
                      </div>

                      {/* Wipe Data */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setWipeOpen(true);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-start hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{dict.nav.wipeButton}</span>
                      </button>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        id="profile-sign-out-button"
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          signOut();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-start hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{dict.auth.signOut}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
        <button type="button" aria-label="Dismiss sanctuary controls" className="sm:hidden fixed inset-0 z-40 bg-slate-950/45" onClick={() => setMobileMenuOpen(false)} />
        <div
          ref={mobileMenuRef}
          id="mobile-sanctuary-menu"
          className="sm:hidden fixed top-16 inset-x-0 z-50 p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-2xl max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"
          role="region"
          aria-label="Sanctuary controls"
        >
          <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Sanctuary controls</div>
          <div className="flex flex-wrap gap-3 items-center mb-4"><AtmosphereSwitcher /><SoundscapeControlPill /></div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button id="mobile-twilight-toggle" type="button" onClick={toggleTheme} className="min-h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-800 dark:text-white">{themeMode === 'twilight' ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}<span>{themeMode === 'twilight' ? 'Light' : 'Twilight'}</span></button>
            <button id="mobile-navbar-settings" type="button" onClick={() => {setActiveTab('settings'); setMobileMenuOpen(false);}} className="min-h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-800 dark:text-white"><Settings className="w-5 h-5" />{dict.nav.settingsTab || 'Settings'}</button>
          </div>
          <label className="block text-sm font-medium text-slate-800 dark:text-white" htmlFor="mobile-sanctuary-language">Language</label>
          <select id="mobile-sanctuary-language" value={locale} onChange={e => setLocale(e.target.value as Locale)} className="w-full min-h-12 mt-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">{supportedLocales.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button type="button" onClick={() => {setSafetyModalOpen(true);setMobileMenuOpen(false);}} className="min-h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">{dict.nav.safetyButton}</button>
            <button id="mobile-auth-button" type="button" onClick={() => {if (user) {signOut();} else {setAuthModalOpen(true);} setMobileMenuOpen(false);}} className="min-h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">{user ? dict.auth.signOut : dict.auth.signIn}</button>
          </div>
          <button type="button" onClick={() => setMobileMenuOpen(false)} className="mt-3 w-full min-h-11 text-sm font-medium rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors">{dict.disclaimer?.close || 'Close'}</button>
        </div>
        </>
      )}
      {/* Modals */}
      <AuthModal />
      <WipeDataModal isOpen={isWipeOpen} onClose={() => setWipeOpen(false)} />
      <StorageSettingsModal isOpen={isStorageOpen} onClose={() => setStorageOpen(false)} />
      <AiBridgeSettingsModal />
    </>
  );
}
