/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { HabitItem } from '@/types';
import { saveMediaItem } from '@/lib/storage/mediaDb';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Feather,
  Plus,
  Sparkles,
  Trash2,
  Image,
  Upload,
  CheckCircle2,
  Shield,
  Heart,
  TrendingUp,
  Timer,
  ShieldCheck,
  Scale,
  Anchor,
  HeartHandshake,
  Volume2,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';

export function HabitBalanceView() {
  const { dict, habits, addHabit, nurtureHabit, deleteHabit, playSingingBowl, addEvolutionXp, isRtl } = useApp();

  const [activeTab, setActiveTab] = useState<'seed' | 'weight' | 'shift'>('seed');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('mindfulness');
  const [mediaDataUrl, setMediaDataUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  // 60-Second Impulse Reset State
  const [isResetActive, setIsResetActive] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(60);
  const [resetCompleted, setResetCompleted] = useState(false);

  // Focus Anchor State
  const [focusPriority, setFocusPriority] = useState('');
  const [parkingLot, setParkingLot] = useState('');
  const [isFocusLocked, setIsFocusLocked] = useState(false);

  // Boundary Shield copied index
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);

  // Judgment Release state
  const [judgmentTarget, setJudgmentTarget] = useState('');
  const [judgmentReframe, setJudgmentReframe] = useState('');
  const [judgmentSaved, setJudgmentSaved] = useState(false);

  const seeds = habits.filter((h) => h.type === 'seed');
  const weights = habits.filter((h) => h.type === 'weight');

  // Countdown timer for 60s Impulse Reset
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResetActive && resetCountdown > 0) {
      interval = setInterval(() => {
        setResetCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isResetActive && resetCountdown === 0) {
      setIsResetActive(false);
      setResetCompleted(true);
      playSingingBowl();
      addEvolutionXp(20, 'Completed 60-Second Impulse Reset');
    }
    return () => clearInterval(interval);
  }, [isResetActive, resetCountdown, playSingingBowl, addEvolutionXp]);

  const handleStartReset = () => {
    setResetCountdown(60);
    setResetCompleted(false);
    setIsResetActive(true);
    playSingingBowl();
  };

  const handleStopReset = () => {
    setIsResetActive(false);
    setResetCountdown(60);
  };

  const handleCopyScript = (text: string, index: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2500);
  };

  const handleSaveJudgment = () => {
    if (!judgmentTarget.trim() && !judgmentReframe.trim()) return;
    setJudgmentSaved(true);
    playSingingBowl();
    addEvolutionXp(15, 'Practiced Compassionate Perspective Reframe');
    setTimeout(() => {
      setJudgmentTarget('');
      setJudgmentReframe('');
      setJudgmentSaved(false);
    }, 3000);
  };

  const boundaryScripts = [
    {
      title: 'The Unhurried No',
      script: '“Thank you for thinking of me. I do not have the capacity to take this on right now, so I must decline.”',
      context: 'When asked for favors or unreciprocated tasks.',
    },
    {
      title: 'The Emotional Sanctuary',
      script: '“I care about you, but I don’t have the emotional bandwidth to process this right now. Let’s talk when we are both rested.”',
      context: 'When someone dumps unprocessed chaos onto you.',
    },
    {
      title: 'Good, But Never Used',
      script: '“I value kindness and honesty in my life. I am stepping back from this dynamic because it does not feel safe or respectful.”',
      context: 'When someone tests your limits repeatedly.',
    },
  ];

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const record = await saveMediaItem(file);
      setMediaDataUrl(record.dataUrl);
    } catch {
      // ignore
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      title: newTitle.trim(),
      type: activeTab === 'weight' ? 'weight' : 'seed',
      category: newCategory,
      nurturedCount: 1,
      mediaDataUrl,
    });

    setNewTitle('');
    setMediaDataUrl(undefined);
    setIsAdding(false);
    playSingingBowl();
  };

  const handleNurture = (id: string) => {
    nurtureHabit(id);
    playSingingBowl();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
              {dict.habits?.title || 'The Habit Balance Ledger'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {dict.habits?.subtitle || 'Nurture good things you are planting, and celebrate heavy weights you have laid down.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'seed' ? 'Plant a New Seed' : 'Set Down a Weight'}</span>
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-xl mx-auto overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('seed')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'seed'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Seeds ({seeds.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'weight'
              ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Weights ({weights.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shift')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'shift'
              ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>The Shift (Mastery)</span>
        </button>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateHabit}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-fadeIn"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {activeTab === 'seed' ? 'Plant a Gentle Seed (Start Doing)' : 'Lay Down a Heavy Weight (Stop Doing)'}
          </h3>

          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={
              activeTab === 'seed'
                ? 'e.g. 10 minutes of morning silence before checking phone...'
                : 'e.g. Agreeing to obligations out of guilt, or doomscrolling after 11pm...'
            }
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Optional Media Attachment */}
          {activeTab === 'seed' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Inspiring Photo or Short Video (Optional)
              </label>

              <label className="px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer w-fit">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{isUploading ? 'Attaching media...' : mediaDataUrl ? 'Change Attached Media' : 'Attach Photo/Video'}</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>

              {mediaDataUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                  {mediaDataUrl.startsWith('data:video') ? (
                    <video src={mediaDataUrl} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={mediaDataUrl} alt="Attached inspiration" className="w-full h-full object-cover" />
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
            >
              Save to Ledger
            </button>
          </div>
        </form>
      )}

      {activeTab === 'shift' ? (
        <div className="space-y-8">
          {/* 1. Habit Liberation (60-Second Impulse Reset) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  <Timer className="w-4 h-4" />
                  <span>Habit Liberation • 60-Second Impulse Reset</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                  60-Second Impulse Reset
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  For sudden urges: smoking, doomscrolling, compulsive snacking, or toxic coping loops.
                </p>
              </div>

              {!isResetActive && (
                <button
                  type="button"
                  onClick={handleStartReset}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all self-start sm:self-auto"
                >
                  {resetCompleted ? 'Start Another Reset' : 'Trigger 60s Impulse Reset'}
                </button>
              )}
            </div>

            {/* Active Reset Countdown Box */}
            {isResetActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-5"
              >
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-rose-200 dark:border-rose-800 animate-ping opacity-25" />
                  <div className="w-24 h-24 rounded-full bg-rose-600 text-white flex items-center justify-center font-mono font-extrabold text-3xl shadow-lg shadow-rose-500/30">
                    {resetCountdown}s
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    Somatic Recalibration
                  </span>
                  <p className="text-sm font-serif italic text-slate-800 dark:text-slate-100 font-medium">
                    {resetCountdown > 40
                      ? '“Inhale cool air through your nose. Unclench your jaw and drop your shoulders. You are safe.”'
                      : resetCountdown > 20
                      ? '“Drink a cold glass of clean water. Step outside into the breeze. The craving is just chemical noise.”'
                      : '“The craving peak is passing. Notice the urge without obeying it. You are in control.”'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStopReset}
                  className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel Reset
                </button>
              </motion.div>
            )}

            {resetCompleted && !isResetActive && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  Impulse wave observed and released (+20 XP). You stood your ground in sovereignty.
                </span>
              </div>
            )}
          </div>

          {/* 2. The Boundary Shield ("Good, But Never Used") */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Boundary Sovereignty • Peaceful Armor</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                The Boundary Shield: &ldquo;Good, But Never Used&rdquo;
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Kindness without boundaries is self-destruction. You do not need to be mean or angry to say no.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {boundaryScripts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {item.title}
                    </span>
                    <p className="text-xs italic font-serif text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.script}
                    </p>
                    <p className="text-[10px] text-slate-500">{item.context}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyScript(item.script, idx)}
                    className="w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-100"
                  >
                    {copiedScriptIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied Script</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Release Judgment ("Everyone Has Their Own Battles") */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <HeartHandshake className="w-4 h-4" />
                <span>Radical Perspective • Healing Resentment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                Release Judgment: &ldquo;Everyone Has Their Own Battles&rdquo;
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                When someone acts bitter, cold, or short-tempered, realize they are fighting an unseen burden. Release the sting.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={judgmentTarget}
                onChange={(e) => setJudgmentTarget(e.target.value)}
                placeholder="Who hurt, irritated, or judged you recently? (e.g., A colleague, family member, stranger)"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />

              <textarea
                value={judgmentReframe}
                onChange={(e) => setJudgmentReframe(e.target.value)}
                rows={2}
                placeholder="What unseen battle, childhood wound, or exhaustion might they be carrying? Reframe with compassion."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  {judgmentSaved ? 'Perspective released into stillness ✓' : 'Privately stored in memory only.'}
                </span>

                <button
                  type="button"
                  onClick={handleSaveJudgment}
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  {judgmentSaved ? 'Judgment Released ✨' : 'Release This Resentment'}
                </button>
              </div>
            </div>
          </div>

          {/* 4. The Focus Anchor ("Stop Frantic Task Switching") */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                <Anchor className="w-4 h-4" />
                <span>Single-Task Sanctuary • Stopping Fragmentation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                The Focus Anchor: &ldquo;One Thing at a Time&rdquo;
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Jumping frantically from thought to thought drains your vitality. Pick one single focus for right now.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-teal-800 dark:text-teal-300 block">
                  My Single Non-Negotiable Priority Right Now
                </label>
                <input
                  type="text"
                  value={focusPriority}
                  disabled={isFocusLocked}
                  onChange={(e) => setFocusPriority(e.target.value)}
                  placeholder="e.g. Write Section 1 without opening email"
                  className="w-full p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Distraction Parking Lot (Thoughts to look at later)
                </label>
                <input
                  type="text"
                  value={parkingLot}
                  onChange={(e) => setParkingLot(e.target.value)}
                  placeholder="e.g. Check airline tickets, reply to text..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {isFocusLocked ? '🔒 Focus locked in. Stay with this one task.' : 'Commit your energy without opening 10 new tabs.'}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (!isFocusLocked && focusPriority.trim()) {
                    setIsFocusLocked(true);
                    playSingingBowl();
                    addEvolutionXp(10, 'Locked in Single Focus Anchor');
                  } else {
                    setIsFocusLocked(false);
                  }
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  isFocusLocked
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/25'
                }`}
              >
                {isFocusLocked ? 'Unlock Focus' : 'Lock In Anchor'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Habits List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeTab === 'seed' ? seeds : weights).map((habit) => {
              const isSeed = habit.type === 'seed';
              return (
                <div
                  key={habit.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isSeed ? (
                          <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                            <Sprout className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                            <Feather className="w-4 h-4" />
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          {isSeed ? 'Seed Planted' : 'Weight Released'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteHabit(habit.id)}
                        aria-label="Delete habit item"
                        className="p-1 text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {habit.title}
                    </h3>

                    {habit.mediaDataUrl && (
                      <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm mt-2">
                        {habit.mediaDataUrl.startsWith('data:video') ? (
                          <video src={habit.mediaDataUrl} className="w-full h-full object-cover" controls muted />
                        ) : (
                          <img src={habit.mediaDataUrl} alt={habit.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Counter */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 font-medium">
                      {isSeed ? 'Nurtured' : 'Honored'}:{' '}
                      <strong className="text-slate-900 dark:text-white font-mono">{habit.nurturedCount} times</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleNurture(habit.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                        isSeed
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isSeed ? 'Nurtured Today ✨' : 'Honored Today 🍃'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {(activeTab === 'seed' ? seeds : weights).length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <Sprout className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {activeTab === 'seed' ? 'No seeds planted yet.' : 'No weights listed yet.'}
              </p>
              <p className="text-xs text-slate-500">
                {activeTab === 'seed'
                  ? 'Plant positive micro-habits you want to gently nurture without guilt.'
                  : 'Record boundaries and heavy expectations you have decided to set down.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
