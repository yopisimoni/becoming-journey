'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';

export function JourneyActionLoop() {
  const { locale, goals, addGoal, toggleGoal, addMoment } = useApp();
  const [action, setAction] = useState('');
  const [insight, setInsight] = useState('');
  const [reviewed, setReviewed] = useState<string[]>([]);
  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem('becoming_reviewed_goal_ids_v1') || '[]');
      if (Array.isArray(parsed)) setReviewed(parsed.filter((x): x is string => typeof x === 'string'));
    } catch { /* Private mode works without local review tracking. */ }
  }, []);

  const pending = goals.find(g => !g.completed);
  const awaitingReview = goals.find(g => g.completed && !reviewed.includes(g.id));
  const isArabic = locale === 'ar';

  const saveAction = () => {
    if (!action.trim()) return;
    addGoal({ title: action.trim(), horizon: 'anytime', category: 'peace', completed: false });
    setAction('');
  };

  const saveReview = () => {
    if (!awaitingReview || !insight.trim()) return;
    addMoment(insight.trim());
    const updated = [...reviewed, awaitingReview.id];
    setReviewed(updated);
    try { localStorage.setItem('becoming_reviewed_goal_ids_v1', JSON.stringify(updated)); } catch {}
    setInsight('');
  };

  return (
    <section aria-label="Your next action" className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3 text-start">
      <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">{isArabic ? 'من التفكير إلى الفعل' : 'From reflection to action'}</h3>
      {awaitingReview ? (
        <>
          <p className="text-sm text-slate-700 dark:text-slate-200">{isArabic ? 'أكملت خطوة:' : 'You completed:'} {awaitingReview.title}</p>
          <label htmlFor="journey-insight" className="block text-sm text-slate-700 dark:text-slate-200">{isArabic ? 'ماذا لاحظت أو تعلمت؟' : 'What did you notice or learn?'}</label>
          <textarea id="journey-insight" rows={3} maxLength={1000} value={insight} onChange={e => setInsight(e.target.value)} className="w-full p-3 rounded-xl border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
          <button type="button" disabled={!insight.trim()} onClick={saveReview} className="w-full min-h-12 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-50">{isArabic ? 'احفظ المراجعة' : 'Save reflection'}</button>
        </>
      ) : pending ? (
        <>
          <p className="text-sm text-slate-700 dark:text-slate-200">{isArabic ? 'خطوتك القادمة:' : 'Your next action:'} <strong>{pending.title}</strong></p>
          <button type="button" onClick={() => toggleGoal(pending.id)} className="w-full min-h-12 rounded-xl bg-slate-900 text-white font-semibold">{isArabic ? 'أنجزت هذه الخطوة' : 'I completed this action'}</button>
          <p className="text-xs text-slate-500 dark:text-slate-400">{isArabic ? 'لا موعد نهائياً أو عقوبة. يمكنك العودة عندما تريد.' : 'No deadlines or streaks. Return when you choose.'}</p>
        </>
      ) : (
        <>
          <label htmlFor="journey-action" className="block text-sm text-slate-700 dark:text-slate-200">{isArabic ? 'اختر خطوة صغيرة واحدة لتجربتها' : 'Choose one small action to try'}</label>
          <input id="journey-action" maxLength={160} value={action} onChange={e => setAction(e.target.value)} placeholder={isArabic ? 'مثلاً: عشر دقائق للقراءة' : 'For example: take a ten-minute walk'} className="w-full min-h-12 px-3 rounded-xl border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
          <button type="button" disabled={!action.trim()} onClick={saveAction} className="w-full min-h-12 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-50">{isArabic ? 'احفظ خطوتي' : 'Save my next step'}</button>
        </>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400">{isArabic ? 'تُحفظ الأنشطة عبر نظام البيانات الحالي. المراجعة اختيارية.' : 'Actions use existing local goal storage. Reflections are optional.'}</p>
    </section>
  );
}
