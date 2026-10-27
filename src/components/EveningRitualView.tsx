'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { EveningRitualEntry } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Sparkles,
  Heart,
  Feather,
  Wind,
  Check,
  CheckCircle2,
  Trash2,
  Lock,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AtmosphericOrb } from '@/components/motion';

const STORAGE_KEY_EVENING = 'becoming_evening_ritual_v1';

export function EveningRitualView() {
  const {
    dict,
    setAtmosphere,
    atmosphere,
    themeMode,
    setThemeMode,
    soundPreset,
    setSoundPreset,
    playSingingBowl,
    addMoment,
    user,
  } = useApp();

  const todayDate = new Date().toISOString().split('T')[0];

  const [goodMoment1, setGoodMoment1] = useState('');
  const [goodMoment2, setGoodMoment2] = useState('');
  const [goodMoment3, setGoodMoment3] = useState('');

  // Somatic checklist
  const [unclenchedJaw, setUnclenchedJaw] = useState(false);
  const [droppedShoulders, setDroppedShoulders] = useState(false);
  const [deepBreathsDone, setDeepBreathsDone] = useState(false);

  // Private release space
  const [privateReleaseText, setPrivateReleaseText] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [dissolvedSuccess, setDissolvedSuccess] = useState(false);

  // Leave tomorrow for tomorrow
  const [leaveTomorrow, setLeaveTomorrow] = useState(true);

  // Committed state
  const [isCommitted, setIsCommitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVENING);
      if (stored) {
        const parsed: EveningRitualEntry = JSON.parse(stored);
        if (parsed.date === todayDate) {
          if (parsed.goodMoments[0]) setGoodMoment1(parsed.goodMoments[0]);
          if (parsed.goodMoments[1]) setGoodMoment2(parsed.goodMoments[1]);
          if (parsed.goodMoments[2]) setGoodMoment3(parsed.goodMoments[2]);
          setPrivateReleaseText(parsed.eveningRelease);
          setLeaveTomorrow(parsed.leaveTomorrowForTomorrow);
          setIsCommitted(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [todayDate]);

  const handleShiftToNight = () => {
    setAtmosphere('twilight', true);
    setThemeMode('twilight');
    playSingingBowl();
  };

  const handleToggleSound = () => {
    if (soundPreset === 'none') {
      setSoundPreset('sanctuary');
    } else {
      setSoundPreset('none');
    }
  };

  const handleDissolveRelease = () => {
    if (!privateReleaseText.trim()) return;
    setIsDissolving(true);
    setTimeout(() => {
      setPrivateReleaseText('');
      setIsDissolving(false);
      setDissolvedSuccess(true);
      playSingingBowl();
      setTimeout(() => setDissolvedSuccess(false), 4000);
    }, 1200);
  };

  const handleSaveEveningRitual = () => {
    const moments = [goodMoment1.trim(), goodMoment2.trim(), goodMoment3.trim()].filter(Boolean);

    // Save non-empty moments to Moments of Light
    moments.forEach((m) => {
      addMoment(m);
    });

    const entry: EveningRitualEntry = {
      id: `evening_${todayDate}`,
      date: todayDate,
      goodMoments: moments,
      gratitude: moments,
      eveningRelease: privateReleaseText.trim(),
      releaseWritten: Boolean(privateReleaseText.trim() || isDissolving || dissolvedSuccess),
      leaveTomorrowForTomorrow: leaveTomorrow,
      tomorrowAffirmed: leaveTomorrow,
      peaceMantra: 'You did enough today. Rest deeply. Peace be with you.',
      completedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_EVENING, JSON.stringify(entry));
    } catch {
      // Storage might be restricted
    }

    setIsCommitted(true);
    playSingingBowl();
  };

  const rDict = dict.rituals;

  return (
    <div
      data-testid="evening-ritual-view"
      className="relative max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-500 overflow-hidden"
    >
      <AtmosphericOrb
        color="rgba(129, 140, 248, 0.22)"
        size={380}
        blur={90}
        className="-top-12 -start-12"
      />
      {/* Header Banner with Night Atmosphere */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-slate-700 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-white/15 text-white">
              <Moon className="w-5 h-5 text-white" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">
              {rDict?.eveningTitle || 'Ready to Sleep'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Ambient Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 rounded-xl min-h-11 min-w-11 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs flex items-center gap-1.5 transition-all"
              title="Toggle Night Ambient Sound"
            >
              {soundPreset !== 'none' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline text-[11px]">
                {soundPreset !== 'none' ? 'Sound On' : 'Quiet Silence'}
              </span>
            </button>

            {/* Night Atmosphere Shift Button */}
            <button
              type="button"
              data-testid="shift-night-btn"
              onClick={handleShiftToNight}
              className={`min-h-11 max-w-full px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors text-start ${
                atmosphere === 'twilight' || atmosphere === 'midnight'
                  ? 'bg-indigo-600 text-white border-indigo-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/40'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="break-words">{rDict?.shiftToNight || 'Shift to Night'}</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {user ? `Peaceful evening, ${user.name.split(' ')[0]}.` : 'Peaceful evening.'}
          </h1>
          <p className="text-sm text-slate-100 mt-1 max-w-xl">
            {rDict?.eveningSubtitle ||
              'Gently release today, quiet your mind, and prepare for restorative slumber.'}
          </p>
        </div>
      </div>

      {/* Committed Evening Blessing Card (Shown when completed) */}
      {isCommitted && (
        <div
          data-testid="evening-summary-card"
          className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 dark:bg-slate-900/90 border border-indigo-900/60 shadow-2xl space-y-6 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <Moon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white">
              {rDict?.closingSlumber || 'You did enough today. Rest deeply. Peace be with you.'}
            </h2>
            <p className="text-xs text-indigo-300/80 max-w-md mx-auto">
              Your reflections have been safely folded away into your local device. Set down screens and allow your body to surrender to rest.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsCommitted(false)}
              className="text-xs text-indigo-400 hover:text-indigo-200 underline"
            >
              Review Evening Reflection
            </button>
          </div>
        </div>
      )}

      {/* Interactive Evening Journey (Shown if not committed or reviewing) */}
      {!isCommitted && (
        <div className="space-y-6">
          {/* Section 1: Somatic Decompression */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {rDict?.somaticRelax || 'Somatic Release: Unclench jaw, drop shoulders, breathe deeply'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                htmlFor="jaw-checkbox"
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  unclenchedJaw
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  id="jaw-checkbox"
                  data-testid="somatic-jaw"
                  type="checkbox"
                  checked={unclenchedJaw}
                  onChange={(e) => setUnclenchedJaw(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium">Unclench your jaw</span>
              </label>

              <label
                htmlFor="shoulders-checkbox"
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  droppedShoulders
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  id="shoulders-checkbox"
                  data-testid="somatic-shoulders"
                  type="checkbox"
                  checked={droppedShoulders}
                  onChange={(e) => setDroppedShoulders(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium">Drop your shoulders</span>
              </label>

              <label
                htmlFor="breaths-checkbox"
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  deepBreathsDone
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  id="breaths-checkbox"
                  data-testid="somatic-breaths"
                  type="checkbox"
                  checked={deepBreathsDone}
                  onChange={(e) => setDeepBreathsDone(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium">3 slow exhales</span>
              </label>
            </div>
          </div>

          {/* Section 2: Today's Good Moments (Gratitude) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {rDict?.goodMomentsPrompt || 'What brought a gentle spark or light to your day?'}
              </h2>
            </div>
            <div className="space-y-2.5">
              <input
                data-testid="good-moment-input-1"
                type="text"
                value={goodMoment1}
                onChange={(e) => setGoodMoment1(e.target.value)}
                placeholder="1. A quiet moment, warm drink, or small relief..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <input
                data-testid="good-moment-input-2"
                type="text"
                value={goodMoment2}
                onChange={(e) => setGoodMoment2(e.target.value)}
                placeholder="2. Something that made you smile or breathe a little easier..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <input
                data-testid="good-moment-input-3"
                type="text"
                value={goodMoment3}
                onChange={(e) => setGoodMoment3(e.target.value)}
                placeholder="3. A person or thought you are grateful for right now..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Section 3: Private Release Space ("Write and Leave It Here") */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Private Release
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Strictly local & private</span>
            </div>

            <textarea
              data-testid="evening-release-input"
              rows={3}
              value={privateReleaseText}
              onChange={(e) => setPrivateReleaseText(e.target.value)}
              placeholder={rDict?.privateReleasePrompt || 'Write what feels heavy and leave it here tonight...'}
              className={`w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                isDissolving ? 'opacity-20 blur-xs transition-all duration-1000' : ''
              }`}
            />

            <div className="flex items-center justify-between gap-3">
              {dissolvedSuccess ? (
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  Dissolved into the quiet night.
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  You can keep this locally or dissolve it away completely.
                </span>
              )}

              {privateReleaseText.trim().length > 0 && (
                <button
                  type="button"
                  data-testid="dissolve-btn"
                  onClick={handleDissolveRelease}
                  disabled={isDissolving}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{rDict?.dissolveIntoNight || 'Dissolve into the Night'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Leave Tomorrow for Tomorrow Affirmation */}
          <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50">
            <label
              htmlFor="leave-tomorrow-checkbox"
              className="flex items-start gap-3 cursor-pointer select-none"
            >
              <input
                id="leave-tomorrow-checkbox"
                data-testid="leave-tomorrow-checkbox"
                type="checkbox"
                checked={leaveTomorrow}
                onChange={(e) => setLeaveTomorrow(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {rDict?.leaveTomorrowForTomorrow ||
                    'I leave tomorrow for tomorrow. Tonight is solely for rest.'}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tasks, to-do lists, and unsolved puzzles have their own daylight. You are allowed to unplug.
                </p>
              </div>
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              id="evening-commit-btn"
              data-testid="evening-commit-btn"
              type="button"
              onClick={handleSaveEveningRitual}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Moon className="w-4 h-4" />
              <span>Conclude Evening & Surrender to Rest</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
