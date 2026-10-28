'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { activityLabel } from '@/components/TodayNeeds';

type JourneyRecord = { id:string; title:string; date:string; reflection?:string };
const KEY = 'becoming_activity_journey_v1';
function readHistory(store: Storage, key: string): JourneyRecord[] {
  try {
    const raw:unknown=JSON.parse(store.getItem(key)||'[]');
    return Array.isArray(raw) ? raw.filter((v):v is JourneyRecord => typeof v==='object' && v!==null && typeof v.id==='string' && typeof v.title==='string' && typeof v.date==='string').slice(0,100) : [];
  } catch { return []; }
}
const historyText: Record<string,string[]> = {
 en: ['Your real-life discoveries','Activities you reported trying, not a score of your wellbeing.','No activities recorded yet. Explore something from the home screen.','Explore another activity'],
 ar: ['تجاربك خارج الشاشة','الأنشطة التي جربتها، وليست تقييماً لصحتك.','لم تسجل أنشطة بعد. اكتشف نشاطاً من الصفحة الرئيسية.','اكتشف نشاطاً آخر'],
 fr: ['Vos découvertes dans la vie réelle','Les activités que vous avez essayées, sans jugement ni note.','Aucune activité enregistrée. Explorez une activité depuis l’accueil.','Découvrir une autre activité'],
 es: ['Tus descubrimientos en la vida real','Actividades que probaste, sin puntuación ni juicio.','Todavía no hay actividades. Explora alguna desde el inicio.','Descubrir otra actividad'],
 it: ['Le tue scoperte nella vita reale','Le attività che hai provato, senza punteggi né giudizi.','Non hai ancora registrato attività. Esplorane una dalla schermata iniziale.','Scopri un’altra attività'],
};
export function ActivityJourneyHistory(){
  const { locale, setActiveTab, storageMode, user } = useApp();
  const labels = historyText[locale] || historyText.en;
  const [history,setHistory]=useState<JourneyRecord[]>([]);
  useEffect(()=>{
    const refresh=()=>setHistory(readHistory(storageMode === 'local' ? localStorage : sessionStorage, user?.id ? `${KEY}_${user.id}` : KEY));
    refresh();
    window.addEventListener('becoming-activity-journey-updated',refresh);
    window.addEventListener('storage',refresh);
    return ()=>{window.removeEventListener('becoming-activity-journey-updated',refresh);window.removeEventListener('storage',refresh);};
  },[storageMode,user?.id]);
  return <section aria-label="Activities I tried" className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 space-y-3">
    <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-white">{labels[0]}</h2>
    <p className="text-sm text-slate-600 dark:text-slate-300">{labels[1]}</p>
    {history.length===0 ? <p className="text-sm text-slate-600 dark:text-slate-300">{labels[2]}</p> :
    <ul className="space-y-2">{history.map(v=><li key={`${v.id}-${v.date}`} className="rounded-xl bg-stone-50 dark:bg-slate-800 p-3 text-start">
      <p className="font-semibold text-sm text-slate-900 dark:text-white">{activityLabel(locale,v.id,'title') || v.title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-300">{new Date(v.date).toLocaleDateString(locale)}</p>
      {v.reflection && <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 whitespace-pre-wrap break-words">{v.reflection}</p>}
    </li>)}</ul>}
    <button type="button" onClick={()=>setActiveTab('home')} className="min-h-11 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm">{labels[3]}</button>
  </section>;
}
