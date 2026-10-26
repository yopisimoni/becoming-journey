'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, X, PhoneCall, HeartHandshake } from 'lucide-react';

export function SafetyModal() {
  const { isSafetyModalOpen, setSafetyModalOpen, dict } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-charcoal/60 dark:bg-black/70 backdrop-blur-md"
    >
      <div className="bg-ivory-50 dark:bg-stone-900 border border-stone-border/80 dark:border-white/10 rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 text-stone-charcoal dark:text-ivory-100">
        <div className="flex items-center justify-between pb-4 border-b border-stone-border/40 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-peach-soft dark:bg-peach-deep/30 flex items-center justify-center text-peach-deep dark:text-peach-soft">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 id="safety-modal-title" className="text-lg font-serif font-semibold text-stone-charcoal dark:text-ivory-100">
              {dict.disclaimer.modalTitle}
            </h2>
          </div>
          <button
            onClick={() => setSafetyModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-mist dark:text-stone-400 hover:text-stone-charcoal dark:hover:text-ivory-100 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-violet-muted"
            aria-label={dict.disclaimer.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-sm leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 font-serif leading-relaxed">
            BECOMING is a personal self-reflection sanctuary created to help you think, breathe, and find your own clarity. We are not doctors, therapists, or professional coaches. This app is for personal reflection and wellness only. If you are facing a serious medical, psychological, or life crisis, please reach out to a qualified professional, doctor, or local emergency service immediately.
          </div>

          <p className="text-stone-mist dark:text-stone-300">{dict.disclaimer.modalText}</p>

          <div className="p-4 rounded-2xl bg-peach-soft/60 dark:bg-peach-deep/20 border border-peach-muted/30">
            <div className="flex items-center gap-2 mb-2 text-peach-deep dark:text-peach-soft font-medium">
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>{dict.disclaimer.crisisHeading}</span>
            </div>
            <p className="text-xs text-stone-charcoal dark:text-stone-200 mb-3">{dict.disclaimer.crisisText}</p>
            <ul className="space-y-2.5">
              {dict.disclaimer.crisisHotlines.map((hotline, idx) => (
                <li
                  key={idx}
                  className="bg-white/80 dark:bg-stone-800/80 p-2.5 rounded-xl border border-peach-muted/20 text-xs"
                >
                  <div className="font-semibold text-stone-charcoal dark:text-ivory-100">{hotline.name}</div>
                  <div className="font-mono text-peach-deep dark:text-peach-soft text-sm my-0.5">{hotline.number}</div>
                  <div className="text-stone-mist dark:text-stone-400">{hotline.description}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-2.5 border-t border-peach-muted/20">
              <a
                href="https://findahelpline.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-peach-deep dark:text-peach-soft underline underline-offset-2"
              >
                <span>Find A Helpline (Global Support Directory) &rarr;</span>
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-mint-soft dark:bg-mint-deep/20 rounded-2xl text-xs text-mint-deep dark:text-mint-soft">
            <HeartHandshake className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Your reflections are 100% private and stay in your browser. No third party or AI system can read your input.
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-border/40 dark:border-white/10 flex justify-end">
          <button
            onClick={() => setSafetyModalOpen(false)}
            className="px-5 py-2 bg-stone-charcoal dark:bg-ivory-100 text-ivory-50 dark:text-stone-900 rounded-2xl text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-muted transition-opacity"
          >
            {dict.disclaimer.close}
          </button>
        </div>
      </div>
    </div>
  );
}
