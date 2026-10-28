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
  Upload,
  CheckCircle2,
  Lock,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
  EyeOff,
  ExternalLink,
  Sparkles,
  Palette,
  Wand2,
  HardDrive,
  Cloud,
  RotateCcw,
} from 'lucide-react';

export function SettingsAndAboutView() {
  const {
    dict,
    themeMode,
    setThemeMode,
    atmosphere,
    setAtmosphere,
    autoAtmosphere,
    setAutoAtmosphere,
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
    importDataJson,
    wipeAllData,
    setOnboardingOpen,
    resetOnboarding,
    addressingPreference,
    setAddressingPreference,
    user,
    deleteAccount,
  } = useApp();

  const sectionLabels: Record<string, string[]> = {
    en: ['Language & Locale (5 Supported)','Stored on This Device','Never Shared Anywhere','Local storage does not sync automatically across devices or browsers. On shared devices, use test data and clear it afterwards.','Terms of Use & Non-Clinical Boundaries','Safety & Compassionate Self-Direction'],
    ar: ['اللغة والإعدادات المحلية (5 لغات)','محفوظ على هذا الجهاز','لا يُشارك مع جهات خارجية','لا تتزامن البيانات المحلية تلقائياً بين الأجهزة أو المتصفحات. على الأجهزة المشتركة استخدم بيانات تجريبية وامسحها بعد الانتهاء.','شروط الاستخدام وحدود الخدمة غير الطبية','السلامة والتوجيه الذاتي'],
    fr: ['Langue et région (5 langues)','Stocké sur cet appareil','Aucun partage externe','Les données locales ne se synchronisent pas automatiquement entre appareils ou navigateurs. Sur un appareil partagé, utilisez des données fictives et effacez-les après usage.','Conditions d’utilisation et limites non médicales','Sécurité et autonomie'],
    es: ['Idioma y región (5 idiomas)','Guardado en este dispositivo','Sin compartir con terceros','Los datos locales no se sincronizan automáticamente entre dispositivos o navegadores. En un dispositivo compartido, usa datos ficticios y bórralos al terminar.','Condiciones de uso y límites no clínicos','Seguridad y autonomía'],
    it: ['Lingua e impostazioni locali (5 lingue)','Memorizzato su questo dispositivo','Nessuna condivisione esterna','I dati locali non vengono sincronizzati automaticamente tra dispositivi o browser. Sui dispositivi condivisi usa dati di prova e cancellali dopo.','Condizioni d’uso e limiti non clinici','Sicurezza e autonomia'],
  };
  const labels = sectionLabels[locale] || sectionLabels.en;
  const [activeTab, setActiveTab] = useState<'preferences' | 'about' | 'privacy' | 'terms'>('preferences');
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importDataJson(content);
        if (res.success) {
          setImportStatus({ success: true, message: res.message || 'Backup restored successfully!' });
        } else {
          setImportStatus({ success: false, message: res.error || 'Failed to import backup.' });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setDeleteError(null);
    try {
      const res = await deleteAccount(deletePassword);
      if (!res.success) {
        setDeleteError(res.error || 'Failed to delete account.');
      } else {
        setShowDeleteAccountConfirm(false);
        setDeletePassword('');
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

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

      {/* Prominent Non-Medical & Non-Coaching Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/70 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Non-Medical &amp; Non-Coaching Disclaimer</span>
        </div>
        <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-serif">
          BECOMING is a personal self-reflection sanctuary created to help you think, breathe, and find your own clarity. We are not doctors, therapists, or professional coaches. This app is for personal reflection and wellness only. If you are facing a serious medical, psychological, or life crisis, please reach out to a qualified professional, doctor, or local emergency service immediately.
        </p>
        <div className="pt-1">
          <a
            href="https://findahelpline.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 underline underline-offset-2 transition-colors"
          >
            <span>Find A Helpline (Global Support Directory)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
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

            {/* Atmosphere Mood Weather */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{dict.atmosphere?.switcherTitle || 'Atmosphere Canvas (Mood Shifting Backgrounds)'}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Living ambient color palette and background gradient transitions.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  data-testid="settings-atmosphere-twilight"
                  onClick={() => setAtmosphere('twilight', true)}
                  className={`p-2.5 rounded-xl border text-start transition-all ${
                    atmosphere === 'twilight'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {dict.atmosphere?.twilightName || 'Twilight Calm'}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  data-testid="settings-atmosphere-moss"
                  onClick={() => setAtmosphere('moss', true)}
                  className={`p-2.5 rounded-xl border text-start transition-all ${
                    atmosphere === 'moss'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {dict.atmosphere?.mossName || 'Grounded Moss'}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  data-testid="settings-atmosphere-dawn"
                  onClick={() => setAtmosphere('dawn', true)}
                  className={`p-2.5 rounded-xl border text-start transition-all ${
                    atmosphere === 'dawn'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 ring-1 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {dict.atmosphere?.dawnName || 'Dawn Alabaster'}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  data-testid="settings-atmosphere-midnight"
                  onClick={() => setAtmosphere('midnight', true)}
                  className={`p-2.5 rounded-xl border text-start transition-all ${
                    atmosphere === 'midnight'
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-500 ring-1 ring-slate-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {dict.atmosphere?.midnightName || 'Midnight Sanctuary'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Contextual Auto-Atmosphere */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-medium text-xs text-slate-800 dark:text-slate-200">
                    {dict.atmosphere?.autoAtmosphere || 'Contextual Auto-Atmosphere'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {dict.atmosphere?.autoAtmosphereDesc ||
                      'Softly adapts ambient colors when entering Breathing & Vault studios'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoAtmosphere}
                  onChange={(e) => setAutoAtmosphere(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
              {labels[0]}
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
                  <div className="text-[10px] uppercase font-mono text-slate-600 dark:text-slate-400">{l.code}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Addressing Preference */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
              Personal Addressing Preference
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'man' as const, label: 'Man' },
                { id: 'woman' as const, label: 'Woman' },
                { id: 'unspecified' as const, label: 'Prefer not to say' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  data-testid={`settings-addressing-${opt.id}`}
                  onClick={() => setAddressingPreference(opt.id)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    addressingPreference === opt.id
                      ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-200 font-bold ring-2 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Default Audio & Volume */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
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

            {/* Transparent BYOK AI Privacy Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bring Your Own Key (BYOK) Privacy Notice</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Your API key is saved strictly in your browser&apos;s local storage (<code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700">localStorage</code>) on this device and is never transmitted to any central server or database owned by us. When you use the AI assistant, your prompt is sent directly from your browser to your chosen provider (OpenAI, DeepSeek, Google, etc.) under their respective privacy terms.
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
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
                  data-testid="export-json-btn"
                  onClick={exportDataJson}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  JSON
                </button>
                <button
                  type="button"
                  data-testid="export-txt-btn"
                  onClick={exportDataTxt}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  TXT
                </button>
              </div>
            </div>

            {/* Import Backup (JSON) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {dict.privacyData?.importBackup || 'Restore Sanctuary Backup (JSON)'}
                </div>
                <div className="text-xs text-slate-500">
                  Safely merge or restore a previously exported BECOMING backup file.
                </div>
              </div>
              <div>
                <label
                  htmlFor="import-backup-file"
                  className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Backup File</span>
                </label>
                <input
                  id="import-backup-file"
                  data-testid="import-backup-file"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>
            </div>

            {importStatus && (
              <div
                data-testid="import-status-banner"
                className={`p-3 rounded-2xl text-xs font-medium ${
                  importStatus.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}
              >
                {importStatus.message}
              </div>
            )}

            {/* Delete Account (if signed in) */}
            {user && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {dict.auth.deleteAccount || 'Delete Cloud Account'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {dict.auth.deleteAccountWarning ||
                      'Permanently remove your account login. Local device reflections will remain safe.'}
                  </div>
                </div>
                {!showDeleteAccountConfirm ? (
                  <button
                    type="button"
                    data-testid="delete-account-btn"
                    onClick={() => setShowDeleteAccountConfirm(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 w-full sm:w-auto">
                    {deleteError && (
                      <p className="text-[11px] text-rose-600 font-medium">{deleteError}</p>
                    )}
                    <input
                      type="password"
                      data-testid="delete-account-password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Confirm password"
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-testid="confirm-delete-account-btn"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold disabled:opacity-50"
                      >
                        {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteAccountConfirm(false);
                          setDeletePassword('');
                          setDeleteError(null);
                        }}
                        className="px-3 py-1 rounded-xl border text-xs text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

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

          {/* Onboarding Tour Controls */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
              Sanctuary Onboarding Experience
            </h2>
            <p className="text-xs text-slate-500">
              Re-experience the cinematic universe introduction, language setup, and sovereign consent gate.
            </p>
            <div className="pt-1 flex flex-wrap gap-2.5">
              <button
                type="button"
                id="reset-onboarding-btn"
                onClick={() => resetOnboarding()}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Onboarding Experience</span>
              </button>
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

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 mt-4">
              <div className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Non-Medical &amp; Non-Coaching Notice</span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-serif">
                BECOMING is a personal self-reflection sanctuary created to help you think, breathe, and find your own clarity. We are not doctors, therapists, or professional coaches. This app is for personal reflection and wellness only. If you are facing a serious medical, psychological, or life crisis, please reach out to a qualified professional, doctor, or local emergency service immediately.
              </p>
              <div className="pt-1">
                <a
                  href="https://findahelpline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 underline underline-offset-2 hover:text-amber-700"
                >
                  <span>Find A Helpline (Global Support Directory)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5 justify-start">
              <button
                type="button"
                id="review-onboarding-btn"
                onClick={() => setOnboardingOpen(true)}
                className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Review Onboarding &amp; Sovereign Boundaries</span>
              </button>

              <button
                type="button"
                id="reset-onboarding-btn"
                onClick={() => resetOnboarding()}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Onboarding Experience</span>
              </button>
            </div>
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

            {/* Educational Data Transparency Matrix (Phase 5) */}
            <div className="pt-4 space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {dict.privacyData?.localDataOverview || 'How Your Sanctuary Stays 100% Private'}
                </h3>
                <p className="text-xs text-slate-500">
                  {dict.privacyData?.subtitle || 'Full client-side backup, safe JSON restoration, and educational data transparency.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="privacy-transparency-grid">
                {/* Column 1: Stored on Device */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <HardDrive className="w-4 h-4" />
                    <span>{labels[1]}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dict.privacyData?.whatIsStoredLocally ||
                      'All reflections, Mind Vault secrets, audio preferences, and micro-goals reside exclusively on your browser storage.'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    {labels[3]}
                  </p>
                </div>

                {/* Column 2: Sent to Firebase */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                    <Cloud className="w-4 h-4" />
                    <span>Sent to Firebase</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dict.privacyData?.whatIsSentToFirebase ||
                      'Only your email address and authentication credentials if you deliberately choose to create a cloud login.'}
                  </p>
                </div>

                {/* Column 3: Never Shared */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{labels[2]}</span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {dict.privacyData?.whatIsNeverShared ||
                      'Journals, vault notes, personal scores, or tracking data. Zero analytics, zero ad networks, zero sale.'}
                  </p>
                </div>
              </div>
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
                {labels[4]}
              </h2>
              <p className="text-xs text-slate-500">{labels[5]}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="font-bold text-amber-900 dark:text-amber-200 text-xs">Non-Medical &amp; Non-Coaching Disclaimer:</div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-serif">
                BECOMING is a personal self-reflection sanctuary created to help you think, breathe, and find your own clarity. We are not doctors, therapists, or professional coaches. This app is for personal reflection and wellness only. If you are facing a serious medical, psychological, or life crisis, please reach out to a qualified professional, doctor, or local emergency service immediately.
              </p>
              <div className="pt-1">
                <a
                  href="https://findahelpline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 underline underline-offset-2 hover:text-amber-700"
                >
                  <span>Find A Helpline (Global Support Directory)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <p>
              If you are experiencing acute distress, self-harm ideation, or an emotional crisis, please immediately reach out to certified human professionals who care deeply about your wellbeing:
            </p>

            <ul className="list-disc ps-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><strong>United States & Canada:</strong> Call or text <strong>988</strong> (Suicide & Crisis Lifeline)</li>
              <li><strong>United Kingdom:</strong> Call <strong>111</strong> (NHS Mental Health Services) or text <strong>SHOUT to 85258</strong></li>
              <li><strong>European Union:</strong> Call <strong>112</strong> (General Emergency Services)</li>
              <li><strong>International:</strong> Visit <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="underline font-mono">findahelpline.com</a> for immediate free confidential support worldwide.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
