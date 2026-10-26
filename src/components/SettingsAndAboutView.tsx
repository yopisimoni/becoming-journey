'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supportedLocales } from '@/locales';
import { SoundscapePreset, SOUNDSCAPE_TRACKS } from '@/lib/audio/soundEngine';
import {
  Settings,
  Shield,
  FileText,
  Info,
  Sun,
  Moon,
  Volume2,
  Globe,
  Sliders,
  Cpu,
  Trash2,
  Download,
  CheckCircle2,
  Lock,
  HeartHandshake,
} from 'lucide-react';

export function SettingsAndAboutView() {
  const {
    dict,
    themeMode,
    setThemeMode,
    locale,
    setLocale,
    soundPreset,
    setSoundPreset,
    soundVolume,
    setSoundVolume,
    reducedMotion,
    setReducedMotion,
    storageMode,
    setStorageMode,
    setAiModalOpen,
    exportDataJson,
    exportDataTxt,
    wipeAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preferences' | 'about' | 'privacy' | 'terms'>('preferences');
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
          Sanctuary Settings & Information
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Control your local preferences, audio defaults, privacy boundaries, and data export.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'about'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>About BECOMING</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Manifesto</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'terms'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Boundaries</span>
        </button>
      </div>

      {/* TAB 1: PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Theme & Display */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
              Sanctuary Theme & Atmosphere
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Appearance</div>
                <div className="text-xs text-slate-500">
                  Switch between Daylight Alabaster and Twilight Sanctuary Midnight.
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    themeMode === 'light'
                      ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Daylight</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('twilight')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    themeMode === 'twilight'
                      ? 'bg-indigo-950 border-indigo-700 text-indigo-200 shadow-sm'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Twilight</span>
                </button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Reduced Motion</div>
                <div className="text-xs text-slate-500">Minimize spring animations and background swells.</div>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Language & Locale (5 Supported)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {supportedLocales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLocale(l.code)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    locale === l.code
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 font-bold ring-2 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold">{l.name}</div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">{l.code}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Default Audio & Volume */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Procedural Soundscape Studio
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Active Soundscape</div>
                  <div className="text-xs text-slate-500">10 procedural ambient tracks available.</div>
                </div>
                <select
                  value={soundPreset}
                  onChange={(e) => setSoundPreset(e.target.value as SoundscapePreset)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="none">Mute (Silence)</option>
                  {SOUNDSCAPE_TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.defaultLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Master Volume</span>
                  <span className="font-mono">{Math.round(soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* AI Bridge & Privacy Settings */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Optional AI Bridge Configuration
            </h2>

            {/* Mirror, Never Boss Philosophy Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                <HeartHandshake className="w-4 h-4" />
                <span>Foundational Principle: &ldquo;Mirror, Never Boss&rdquo;</span>
              </div>
              <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed font-serif">
                AI must never dictate what you should do, never judge you, and never act as an authority. It exists solely as a quiet mirror to reflect your own deepest wisdom back to you. You are the ultimate sovereign author of your life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">AI Companion API Mode</div>
                <div className="text-xs text-slate-500">
                  Default is 100% offline local templates. You can optionally connect a personal API endpoint.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors self-start sm:self-auto"
              >
                Configure API Bridge
              </button>
            </div>
          </div>

          {/* Storage & Data Sovereignty */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Data Sovereignty, Export & Deletion
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Export Reflections & Journal</div>
                <div className="text-xs text-slate-500">Download all your confirmed insights and notes.</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportDataJson}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={exportDataTxt}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  TXT
                </button>
              </div>
            </div>

            {/* Wipe Data */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-rose-600 dark:text-rose-400">Wipe All Local Data</div>
                <div className="text-xs text-slate-500">Permanently erase cards, notes, moments, and goals.</div>
              </div>
              {!showWipeConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowWipeConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold transition-colors"
                >
                  Wipe Data
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      wipeAllData();
                      setShowWipeConfirm(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                  >
                    Confirm Wipe
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWipeConfirm(false)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT US */}
      {activeTab === 'about' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              The Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
              Why We Built BECOMING
            </h2>
          </div>

          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              In a digital world dominated by algorithmic feeds, compulsive notifications, gamified streaks, and clinical surveillance, <strong>BECOMING</strong> is an intentional sanctuary.
            </p>
            <p>
              We believe self-discovery should never feel like a high-pressure corporate checklist or a therapy substitute. It should feel like stepping into a peaceful, quiet cedar room with soft morning light and zero eyes upon you.
            </p>
            <p>
              Every decision in BECOMING reflects our core commitments:
            </p>
            <ul className="list-disc ps-5 space-y-2 font-medium">
              <li><strong>Zero Cloud Databases:</strong> We have no interest in your thoughts. Your journal and moments belong solely to you on your device.</li>
              <li><strong>Zero Telemetry or Ads:</strong> No trackers, no analytics pixels, no behavioral profiling, no data sales.</li>
              <li><strong>Zero Cost Forever:</strong> Static web technologies with procedural Web Audio synthesize peaceful soundscapes with no expensive cloud servers.</li>
              <li><strong>Unhurried Presence:</strong> No streaks, no guilt, no pressure. Move at the unhurried speed of nature.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY MANIFESTO */}
      {activeTab === 'privacy' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                Privacy Manifesto & Local Sovereignty
              </h2>
              <p className="text-xs text-slate-500">Effective Date: October 2026 • Lifetime Guarantee</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              At BECOMING, privacy is not a legal disclaimer; it is the fundamental architectural constraint of our application.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">Our 5 Zero-Compromise Pledges:</div>
              <ul className="list-disc ps-5 space-y-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                <li><strong>No Remote Databases:</strong> We run no Firebase, Supabase, Postgres, or MongoDB.</li>
                <li><strong>No Tracking Pixels:</strong> We run zero Google Analytics, Meta Pixels, Mixpanel, Sentry, or PostHog.</li>
                <li><strong>No Remote Fonts/CDNs:</strong> All SVG illustrations, icons, and system fonts are bundled locally.</li>
                <li><strong>Complete Data Wipe:</strong> One click permanently purges all localStorage, IndexedDB, and memory data.</li>
                <li><strong>Zero AI API Exfiltration:</strong> By default, all reflections are 100% deterministic local algorithms.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TERMS & BOUNDARIES */}
      {activeTab === 'terms' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                Terms of Use & Non-Clinical Boundaries
              </h2>
              <p className="text-xs text-slate-500">Safety & Compassionate Self-Direction</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="font-bold text-amber-900 dark:text-amber-200 text-xs">Non-Clinical Disclaimer:</div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                BECOMING is a tool for personal mindfulness, contemplation, and creative journaling. It is <strong>NOT</strong> licensed therapy, clinical psychology, medical treatment, or emergency crisis care.
              </p>
            </div>

            <p>
              If you are experiencing acute distress, self-harm ideation, or an emotional crisis, please immediately reach out to certified human professionals who care deeply about your wellbeing:
            </p>

            <ul className="list-disc ps-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><strong>United States & Canada:</strong> Call or text <strong>988</strong> (Suicide & Crisis Lifeline)</li>
              <li><strong>United Kingdom:</strong> Call <strong>111</strong> (NHS Mental Health Services) or text <strong>SHOUT to 85258</strong></li>
              <li><strong>European Union:</strong> Call <strong>112</strong> (General Emergency Services)</li>
              <li><strong>International:</strong> Visit <span className="underline font-mono">findahelpline.com</span> for immediate free confidential support worldwide.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
