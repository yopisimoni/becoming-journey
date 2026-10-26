'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GoalHorizon, GoalCategory, LifeGoal } from '@/types';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  Tag,
  Sunrise,
  Compass,
} from 'lucide-react';

export function HorizonCalendarView() {
  const {
    dict,
    goals,
    addGoal,
    toggleGoal,
    deleteGoal,
    moveGoalToTomorrow,
    playSingingBowl,
    isRtl,
    coreLifeDream,
    setCoreLifeDream,
    addEvolutionXp,
  } = useApp();

  const [activeHorizon, setActiveHorizon] = useState<GoalHorizon>('day');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('peace');
  const [newTargetDate, setNewTargetDate] = useState('');

  // Core Life Dream State
  const [isEditingDream, setIsEditingDream] = useState(false);
  const [dreamInputs, setDreamInputs] = useState({
    dreamTitle: coreLifeDream.dreamTitle,
    whyItMatters: coreLifeDream.whyItMatters,
    horizonAnchor: coreLifeDream.horizonAnchor,
    dailyActionCommitment: coreLifeDream.dailyActionCommitment,
  });

  const handleSaveDream = () => {
    setCoreLifeDream({
      ...dreamInputs,
      updatedAt: new Date().toISOString(),
    });
    setIsEditingDream(false);
    playSingingBowl();
    addEvolutionXp(25, 'Committed to Core Life Dream');
  };

  const horizons: { id: GoalHorizon; label: string; count: number }[] = [
    { id: 'day', label: dict.calendar?.dayHorizon || 'Today (Day)', count: goals.filter((g) => g.horizon === 'day' && !g.completed).length },
    { id: 'week', label: dict.calendar?.weekHorizon || 'This Week', count: goals.filter((g) => g.horizon === 'week' && !g.completed).length },
    { id: 'month', label: dict.calendar?.monthHorizon || 'This Month', count: goals.filter((g) => g.horizon === 'month' && !g.completed).length },
    { id: 'year', label: dict.calendar?.yearHorizon || 'This Year', count: goals.filter((g) => g.horizon === 'year' && !g.completed).length },
    { id: 'anytime', label: dict.calendar?.anytimeHorizon || 'Anytime Horizons', count: goals.filter((g) => g.horizon === 'anytime' && !g.completed).length },
  ];

  const categories: { id: GoalCategory; label: string; color: string }[] = [
    { id: 'peace', label: 'Peace & Mindfulness', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
    { id: 'work', label: 'Purpose & Work', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    { id: 'health', label: 'Body & Vitality', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { id: 'relationships', label: 'Love & Family', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
    { id: 'creativity', label: 'Art & Wonder', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' },
  ];

  const filteredGoals = goals.filter((g) => g.horizon === activeHorizon);
  const activeUncompleted = filteredGoals.filter((g) => !g.completed);
  const completedList = filteredGoals.filter((g) => g.completed);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addGoal({
      title: newTitle.trim(),
      horizon: activeHorizon,
      category: newCategory,
      completed: false,
      targetDate: newTargetDate || undefined,
    });

    setNewTitle('');
    setIsAdding(false);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    toggleGoal(id);
    if (!currentlyCompleted) {
      playSingingBowl();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
              {dict.calendar?.title || 'Multi-Horizon Goal Sanctuary'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {dict.calendar?.subtitle || 'Gentle milestones anchored across Day, Week, Month, and Year without guilt.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.calendar?.addGoal || 'Add Milestone'}</span>
        </button>
      </div>

      {/* My Core Life Dream Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-amber-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-amber-950/20 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sunrise className="w-4 h-4 text-amber-500" />
            <span>Dreams-to-Reality Bridge • Long-Term North Star</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isEditingDream) {
                handleSaveDream();
              } else {
                setIsEditingDream(true);
              }
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
          >
            {isEditingDream ? 'Save Dream' : 'Edit North Star'}
          </button>
        </div>

        {isEditingDream ? (
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                My Core Life Dream
              </label>
              <input
                type="text"
                value={dreamInputs.dreamTitle}
                onChange={(e) => setDreamInputs({ ...dreamInputs, dreamTitle: e.target.value })}
                placeholder="e.g. Build a self-sustaining eco-retreat & write poetry"
                className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Why It Deeply Matters
                </label>
                <input
                  type="text"
                  value={dreamInputs.whyItMatters}
                  onChange={(e) => setDreamInputs({ ...dreamInputs, whyItMatters: e.target.value })}
                  placeholder="e.g. Living in deep harmony with nature and creating beauty"
                  className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  1-Year Horizon Anchor
                </label>
                <input
                  type="text"
                  value={dreamInputs.horizonAnchor}
                  onChange={(e) => setDreamInputs({ ...dreamInputs, horizonAnchor: e.target.value })}
                  placeholder="e.g. Complete land search and save initial seed reserve"
                  className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Today&apos;s Single Micro-Action
              </label>
              <input
                type="text"
                value={dreamInputs.dailyActionCommitment}
                onChange={(e) => setDreamInputs({ ...dreamInputs, dailyActionCommitment: e.target.value })}
                placeholder="e.g. Spend 20 minutes learning about soil restoration"
                className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {coreLifeDream.dreamTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic font-serif">
              &ldquo;{coreLifeDream.whyItMatters}&rdquo;
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-indigo-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  1-Year Horizon Anchor
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {coreLifeDream.horizonAnchor}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-amber-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Today&apos;s Micro-Action
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {coreLifeDream.dailyActionCommitment}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Horizon Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {horizons.map((h) => {
          const isActive = activeHorizon === h.id;
          return (
            <button
              key={h.id}
              onClick={() => setActiveHorizon(h.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span>{h.label}</span>
              {h.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  {h.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-fadeIn"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {dict.calendar?.newGoalTitle || 'Create New Milestone for '}{horizons.find((h) => h.id === activeHorizon)?.label}
          </h3>

          <div className="space-y-1">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Read 20 pages with quiet tea, or complete chapter outline..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pillar Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards List */}
      <div className="space-y-3">
        {activeUncompleted.length === 0 && completedList.length === 0 && (
          <div className="p-8 text-center rounded-3xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No milestones recorded for {horizons.find((h) => h.id === activeHorizon)?.label} yet.
            </p>
            <p className="text-xs text-slate-500">
              Add small, gentle intentions without overwhelming yourself.
            </p>
          </div>
        )}

        {/* Active Uncompleted Goals */}
        {activeUncompleted.map((goal) => {
          const catMeta = categories.find((c) => c.id === goal.category) || categories[0];
          return (
            <div
              key={goal.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3 transition-all hover:border-slate-300"
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggle(goal.id, false)}
                  className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                  aria-label="Complete milestone"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {goal.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${catMeta.color}`}>
                      {catMeta.label}
                    </span>
                    {goal.targetDate && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{goal.targetDate}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Guilt-free "Move Gently to Tomorrow" button (for daily goals) */}
              <div className="flex items-center gap-1 shrink-0">
                {goal.horizon === 'day' && (
                  <button
                    type="button"
                    onClick={() => moveGoalToTomorrow(goal.id)}
                    title="Move gently to tomorrow with zero guilt"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Tomorrow</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  aria-label="Delete milestone"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Completed Goals Section */}
        {completedList.length > 0 && (
          <div className="pt-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Completed ({completedList.length})
            </div>
            {completedList.map((goal) => (
              <div
                key={goal.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3 text-slate-400 dark:text-slate-500"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(goal.id, true)}
                    className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    aria-label="Mark uncompleted"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <span className="text-xs line-through truncate">{goal.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  aria-label="Delete milestone"
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
