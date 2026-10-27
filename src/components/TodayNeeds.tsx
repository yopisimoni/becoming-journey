'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle, Wind, Target, Moon } from 'lucide-react';

const labels = {
  en: { heading: 'What would help right now?', detail: 'Choose one. You can change your mind any time.', talk: 'Put thoughts into words', calm: 'Ease some pressure', focus: 'Find one next step', rest: 'Unwind gently' },
  ar: { heading: 'ما الذي قد يساعدك الآن؟', detail: 'اختر ما يناسبك، ويمكنك تغييره في أي وقت.', talk: 'أريد التعبير عن أفكاري', calm: 'أحتاج إلى بعض الهدوء', focus: 'أريد خطوة واضحة', rest: 'أريد الاسترخاء' },
  fr: { heading: 'De quoi avez-vous besoin ?', detail: 'Choisissez librement, sans pression.', talk: 'Exprimer mes pensées', calm: 'Relâcher la pression', focus: 'Trouver une étape', rest: 'Me détendre' },
  es: { heading: '¿Qué te ayudaría ahora?', detail: 'Elige libremente, sin presión.', talk: 'Expresar mis ideas', calm: 'Soltar la presión', focus: 'Elegir un paso', rest: 'Descansar' },
  it: { heading: 'Cosa ti aiuterebbe ora?', detail: 'Scegli liberamente, senza pressione.', talk: 'Esprimere i pensieri', calm: 'Ridurre la tensione', focus: 'Trovare un passo', rest: 'Rilassarmi' },
} as const;

export function TodayNeeds() {
  const { locale, setActiveTab, setActiveMode, setCurrentIntent, setSanctuaryStep } = useApp();
  const copy = labels[locale] ?? labels.en;
  const choices = [
    { label: copy.talk, icon: MessageCircle, action: () => { setActiveTab('home'); setActiveMode('journal'); } },
    { label: copy.calm, icon: Wind, action: () => setActiveTab('breathe') },
    { label: copy.focus, icon: Target, action: () => { setActiveTab('home'); setActiveMode('guided'); setCurrentIntent('goal'); setSanctuaryStep(1); } },
    { label: copy.rest, icon: Moon, action: () => setActiveTab('evening') },
  ];
  return (
    <section aria-labelledby="becoming-today-needs" className="relative z-10 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 p-4 sm:p-5 text-start space-y-3">
      <h2 id="becoming-today-needs" className="font-serif font-bold text-xl text-slate-900 dark:text-white">{copy.heading}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">{copy.detail}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {choices.map(({label,icon:Icon,action}) => (
          <button key={label} type="button" onClick={action} className="min-h-12 w-full text-start flex items-center gap-3 rounded-xl border border-stone-200 dark:border-slate-700 px-3 py-3 bg-stone-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-amber-500">
            <Icon className="w-5 h-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true"/>
            <span className="font-medium text-sm leading-snug">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
