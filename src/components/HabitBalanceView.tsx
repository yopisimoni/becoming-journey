/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HabitItem } from '@/types';
import { saveMediaItem } from '@/lib/storage/mediaDb';
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
} from 'lucide-react';

export function HabitBalanceView() {
  const { dict, habits, addHabit, nurtureHabit, deleteHabit, playSingingBowl } = useApp();

  const [activeTab, setActiveTab] = useState<'seed' | 'weight'>('seed');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('mindfulness');
  const [mediaDataUrl, setMediaDataUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const seeds = habits.filter((h) => h.type === 'seed');
  const weights = habits.filter((h) => h.type === 'weight');

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
      type: activeTab,
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
      <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('seed')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'seed'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Seeds I Am Planting ({seeds.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'weight'
              ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Weights I Am Putting Down ({weights.length})</span>
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
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {isSeed ? 'Seed Planted' : 'Weight Released'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteHabit(habit.id)}
                    aria-label="Delete habit item"
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
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
    </div>
  );
}
