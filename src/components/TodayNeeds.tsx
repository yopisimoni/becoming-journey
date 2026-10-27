'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, Compass } from 'lucide-react';

type Topic = 'calm' | 'habits' | 'care' | 'move' | 'learn' | 'create' | 'connect' | 'inspire' | 'reflect' | 'rest';
type Activity = { id: string; topic: Topic; title: string; idea: string; minutes: number };
const activities: Activity[] = [
  {id:'calm-breathe',topic:'calm',title:'A gentle breathing pause',idea:'Breathe comfortably and notice the air for two minutes. No breath holding needed.',minutes:2},
  {id:'calm-senses',topic:'calm',title:'Notice five things',idea:'Look around and name five ordinary things you can see.',minutes:3},
  {id:'calm-sounds',topic:'calm',title:'Listen to the room',idea:'Notice near and distant sounds without needing to change anything.',minutes:3},
  {id:'habit-read',topic:'habits',title:'Read one page',idea:'Pick something that interests you and read just one page.',minutes:5},
  {id:'habit-tidy',topic:'habits',title:'Reset a small space',idea:'Choose one surface and organize it gently.',minutes:5},
  {id:'habit-plan',topic:'habits',title:'Make tomorrow easier',idea:'Write one tiny practical step you might try tomorrow.',minutes:3},
  {id:'care-water',topic:'care',title:'A simple refresh',idea:'Take a comfortable pause, have some water if you want, and notice what you need.',minutes:3},
  {id:'care-boundary',topic:'care',title:'Give yourself permission',idea:'Write one thing you can postpone without guilt.',minutes:5},
  {id:'care-comfort',topic:'care',title:'Make a cozy corner',idea:'Find a comfortable place and spend a quiet moment there.',minutes:5},
  {id:'move-walk',topic:'move',title:'Curiosity walk',idea:'If it is safe and accessible, take a short walk and notice three details.',minutes:10},
  {id:'move-stretch',topic:'move',title:'Gentle stretching',idea:'Try a few comfortable movements within your range; stop if anything hurts.',minutes:5},
  {id:'move-dance',topic:'move',title:'Move to a favorite song',idea:'Choose music you enjoy and move however feels comfortable.',minutes:5},
  {id:'learn-question',topic:'learn',title:'Follow one question',idea:'Pick a question you are curious about and find one credible answer.',minutes:10},
  {id:'learn-word',topic:'learn',title:'Learn a new word',idea:'Discover a word in another language and try using it.',minutes:5},
  {id:'learn-fact',topic:'learn',title:'Explore a new topic',idea:'Read a short explanation of something outside your usual interests.',minutes:10},
  {id:'create-sketch',topic:'create',title:'Sketch without pressure',idea:'Draw an object near you. It does not have to look perfect.',minutes:5},
  {id:'create-story',topic:'create',title:'Start a tiny story',idea:'Write three lines about an imaginary place.',minutes:5},
  {id:'create-photo',topic:'create',title:'Capture a color',idea:'If you enjoy photography, find a beautiful color and take a picture.',minutes:5},
  {id:'connect-hello',topic:'connect',title:'Send a thoughtful hello',idea:'If you want, check in with someone you trust.',minutes:5},
  {id:'connect-memory',topic:'connect',title:'Remember a good moment',idea:'Think of a kind interaction and what made it meaningful.',minutes:3},
  {id:'connect-kind',topic:'connect',title:'One small kindness',idea:'Choose a simple helpful act that feels comfortable and appropriate.',minutes:10},
  {id:'inspire-music',topic:'inspire',title:'Listen to something uplifting',idea:'Play a favorite positive song or a short original audio reflection.',minutes:5},
  {id:'inspire-quote',topic:'inspire',title:'Write your own encouragement',idea:'Write a kind sentence you would say to a friend.',minutes:3},
  {id:'inspire-possibility',topic:'inspire',title:'Imagine a possibility',idea:'Name one enjoyable experience you might like to try someday.',minutes:5},
  {id:'reflect-gratitude',topic:'reflect',title:'Notice a bright spot',idea:'Write one thing that went reasonably well, however small.',minutes:3},
  {id:'reflect-values',topic:'reflect',title:'What matters today?',idea:'Name one value you want to bring into your next decision.',minutes:5},
  {id:'reflect-lesson',topic:'reflect',title:'One thing I learned',idea:'Write a thought or discovery from your day.',minutes:5},
  {id:'rest-silence',topic:'rest',title:'A screen-free pause',idea:'Put your device aside for a few minutes if that feels helpful.',minutes:5},
  {id:'rest-nature',topic:'rest',title:'A view of nature',idea:'Look outside or at a natural object and notice its details.',minutes:5},
  {id:'rest-unwind',topic:'rest',title:'An easy evening ritual',idea:'Choose a quiet activity you enjoy before resting.',minutes:10},
];
const topics: {id:Topic; label:string}[] = [
  {id:'calm',label:'Mindfulness & less stress'}, {id:'habits',label:'Better habits'},
  {id:'care',label:'Self-care'}, {id:'move',label:'Movement & walking'},
  {id:'learn',label:'Learn something'}, {id:'create',label:'Creativity'},
  {id:'connect',label:'Human connection'}, {id:'inspire',label:'Inspiration'},
  {id:'reflect',label:'Self-discovery'}, {id:'rest',label:'Rest & recharge'}
];
const SEEN_KEY = 'becoming_activity_seen_v1';
const TRIED_KEY = 'becoming_activity_tried_v1';
function readIds(key:string): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((v):v is string=>typeof v==='string').slice(-100) : []; } catch { return []; }
}
export function TodayNeeds() {
  const {locale, setActiveTab, setActiveMode, addMoment} = useApp();
  const [topic,setTopic] = useState<Topic>('calm');
  const [seen,setSeen] = useState<string[]>([]);
  const [tried,setTried] = useState<string[]>([]);
  const [selected,setSelected] = useState<string | null>(null);
  const [offset,setOffset] = useState(0);
  const [reviewing,setReviewing] = useState<Activity | null>(null);
  const [reflection,setReflection] = useState('');
  useEffect(()=>{setSeen(readIds(SEEN_KEY));setTried(readIds(TRIED_KEY));},[]);
  const ordered = useMemo(()=> {
    const byTopic = activities.filter(a=>a.topic===topic);
    return [...byTopic.filter(a=>!seen.includes(a.id)),...byTopic.filter(a=>seen.includes(a.id))];
  },[topic,seen]);
  const suggestion = ordered[offset % Math.max(ordered.length,1)];
  const mark = (key:string, current:string[], id:string, update:(v:string[])=>void) => {
    const next = Array.from(new Set([...current,id])).slice(-100);
    update(next);
    try {localStorage.setItem(key,JSON.stringify(next));} catch { /* optional activity history */ }
  };
  const another = () => { if(suggestion) mark(SEEN_KEY,seen,suggestion.id,setSeen); setSelected(null);setOffset(n=>n+1); };
  const finishReview = () => { if (reflection.trim()) addMoment(reflection.trim()); setReflection('');setReviewing(null);another(); };
  return (
    <section aria-labelledby="becoming-today-needs" className="relative z-10 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 p-4 sm:p-5 text-start space-y-3">
      <h2 id="becoming-today-needs" className="font-serif font-bold text-xl text-slate-900 dark:text-white">{locale==='ar'?'اكتشف شيئاً مفيداً لك اليوم':'Discover something good for today'}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">{locale==='ar'?'اختر مجالاً يثير اهتمامك، أو جرّب شيئاً جديداً. لا ضغط ولا نقاط إلزامية.':'Explore an activity that interests you. No pressure, streaks or mandatory points.'}</p>
      <label htmlFor="activity-topic" className="block text-sm font-semibold text-slate-800 dark:text-white">{locale==='ar'?'ماذا تريد أن تستكشف؟':'What would you like to explore?'}</label>
      <select id="activity-topic" value={topic} onChange={e=>{setTopic(e.target.value as Topic);setOffset(0);setSelected(null);}} className="w-full min-h-12 rounded-xl border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm">
        {topics.map(t=><option value={t.id} key={t.id}>{t.label}</option>)}
      </select>
      {suggestion && <div className="rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-amber-800 dark:text-amber-300">YOUR NEXT POSSIBILITY</span><span className="text-xs text-slate-500 dark:text-slate-300">{suggestion.minutes} min</span></div>
        <h3 className="font-semibold text-base text-slate-900 dark:text-white">{suggestion.title}</h3>
        <p className="text-sm text-slate-700 dark:text-slate-200">{suggestion.idea}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button type="button" onClick={()=>{mark(SEEN_KEY,seen,suggestion.id,setSeen);setSelected(suggestion.id);}} className="min-h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold px-3">{locale==='ar'?'سأجربها':'Try it offline'}</button>
          <button type="button" onClick={another} className="min-h-11 rounded-xl border border-stone-300 dark:border-slate-600 text-slate-800 dark:text-white text-sm font-semibold px-3 flex items-center justify-center gap-2"><Sparkles className="w-4 h-4"/>{locale==='ar'?'اقتراح آخر':'Another idea'}</button>
        </div>
        {selected===suggestion.id && <div className="border-t border-stone-200 dark:border-slate-600 pt-3 space-y-2" aria-live="polite">
          <p className="text-sm text-slate-700 dark:text-slate-200">{locale==='ar'?'يمكنك ترك الشاشة والتجربة. عند العودة، اختر ما يناسبك.':'You can put your phone away and try this. When you return, choose what fits.'}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={()=>{mark(TRIED_KEY,tried,suggestion.id,setTried);setReviewing(suggestion);setSelected(null);}} className="min-h-11 bg-emerald-800 text-white rounded-xl px-2 text-sm font-semibold">{locale==='ar'?'جربتها':'I tried it'}</button>
            <button type="button" onClick={another} className="min-h-11 border border-stone-300 dark:border-slate-600 text-slate-800 dark:text-white rounded-xl px-2 text-sm">{locale==='ar'?'ليس مناسباً لي':'Not for me'}</button>
          </div>
        </div>}
      </div>}
      {reviewing && <div className="rounded-xl border border-emerald-700/40 bg-emerald-50 dark:bg-slate-800 p-3 space-y-2" aria-live="polite">
        <h3 className="font-semibold text-slate-900 dark:text-white">{locale==='ar'?'جرّبت نشاطاً، ماذا بعد؟':'You gave it a try. What next?'}</h3>
        <p className="text-sm text-slate-700 dark:text-slate-200">{reviewing.title}. {locale==='ar'?'يمكنك تدوين ما لاحظته، أو تخطي ذلك.':'You can note what you noticed, or skip this.'}</p>
        <label htmlFor="activity-reflection" className="block text-sm text-slate-700 dark:text-slate-200">{locale==='ar'?'ملاحظة اختيارية':'Optional reflection'}</label>
        <textarea id="activity-reflection" rows={2} maxLength={500} value={reflection} onChange={e=>setReflection(e.target.value)} className="w-full rounded-xl p-3 border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={finishReview} className="min-h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold">{locale==='ar'?'متابعة':'Continue'}</button>
          <button type="button" onClick={()=>{setReflection('');setReviewing(null);}} className="min-h-11 rounded-xl border border-stone-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm">{locale==='ar'?'إنهاء الجلسة':'Finish for now'}</button>
        </div>
      </div>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500 dark:text-slate-300">{locale==='ar'? `أنشطة جرّبتها: ${tried.length}` : `Activities you chose to try: ${tried.length}`}</p>
        <button type="button" onClick={()=>{setTopic(topics[(topics.findIndex(t=>t.id===topic)+1)%topics.length].id);setOffset(0);setSelected(null);}} className="text-xs font-semibold underline text-amber-800 dark:text-amber-300 flex items-center gap-1"><Compass className="w-4 h-4"/>{locale==='ar'?'فاجئني بمجال آخر':'Surprise me'}</button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{locale==='ar'?'محفوظ محلياً على الجهاز. لا نستنتج حالتك الصحية أو النفسية.':'Activity history stays on this device. We do not infer your mental or medical state.'}</p>
      <button type="button" onClick={()=>{setActiveTab('home');setActiveMode('journal');}} className="text-xs underline text-slate-600 dark:text-slate-300">{locale==='ar'?'أفضل الكتابة الآن':'I would rather journal'}</button>
    </section>
  );
}
