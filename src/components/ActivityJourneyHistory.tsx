'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';

type JourneyRecord = { id:string; title:string; date:string; reflection?:string };
const KEY = 'becoming_activity_journey_v1';
function readHistory(): JourneyRecord[] {
  try {
    const raw:unknown=JSON.parse(localStorage.getItem(KEY)||'[]');
    return Array.isArray(raw) ? raw.filter((v):v is JourneyRecord => typeof v==='object' && v!==null && typeof v.id==='string' && typeof v.title==='string' && typeof v.date==='string').slice(0,100) : [];
  } catch { return []; }
}
export function ActivityJourneyHistory(){
  const { locale, setActiveTab } = useApp();
  const [history,setHistory]=useState<JourneyRecord[]>([]);
  useEffect(()=>{
    const refresh=()=>setHistory(readHistory());
    refresh();
    window.addEventListener('becoming-activity-journey-updated',refresh);
    window.addEventListener('storage',refresh);
    return ()=>{window.removeEventListener('becoming-activity-journey-updated',refresh);window.removeEventListener('storage',refresh);};
  },[]);
  return <section aria-label="Activities I tried" className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 space-y-3">
    <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-white">{locale==='ar'?'تجاربك خارج الشاشة':'Your real-life discoveries'}</h2>
    <p className="text-sm text-slate-600 dark:text-slate-300">{locale==='ar'?'أنشطة قلت إنك جربتها. يمكنك الرجوع إليها دون نقاط أو ضغط.':'Activities you reported trying, not a score of your wellbeing.'}</p>
    {history.length===0 ? <p className="text-sm text-slate-600 dark:text-slate-300">{locale==='ar'?'لم تسجل أي تجربة بعد. يمكنك اكتشاف نشاط من الصفحة الرئيسية.':'No activities recorded yet. Explore something from the home screen.'}</p> :
    <ul className="space-y-2">{history.map(v=><li key={v.id} className="rounded-xl bg-stone-50 dark:bg-slate-800 p-3 text-start">
      <p className="font-semibold text-sm text-slate-900 dark:text-white">{v.title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-300">{new Date(v.date).toLocaleDateString(locale)}</p>
      {v.reflection && <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 whitespace-pre-wrap break-words">{v.reflection}</p>}
    </li>)}</ul>}
    <button type="button" onClick={()=>setActiveTab('home')} className="min-h-11 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm">{locale==='ar'?'اكتشف تجربة جديدة':'Explore another activity'}</button>
  </section>;
}
