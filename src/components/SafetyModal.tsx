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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-charcoal/60 backdrop-blur-sm"
    >
      <div className="bg-ivory-50 border border-stone-border rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 text-stone-charcoal">
        <div className="flex items-center justify-between pb-4 border-b border-ivory-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-peach-soft flex items-center justify-center text-peach-deep">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 id="safety-modal-title" className="text-lg font-semibold">
              {dict.disclaimer.modalTitle}
            </h2>
          </div>
          <button
            onClick={() => setSafetyModalOpen(false)}
            className="p-1 rounded-lg text-stone-mist hover:text-stone-charcoal hover:bg-ivory-200 focus:outline-none focus:ring-2 focus:ring-violet-muted"
            aria-label={dict.disclaimer.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-sm leading-relaxed">
          <p className="text-stone-mist">{dict.disclaimer.modalText}</p>

          <div className="p-4 rounded-xl bg-peach-soft/60 border border-peach-muted/30">
            <div className="flex items-center gap-2 mb-2 text-peach-deep font-medium">
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>{dict.disclaimer.crisisHeading}</span>
            </div>
            <p className="text-xs text-stone-charcoal mb-3">{dict.disclaimer.crisisText}</p>
            <ul className="space-y-2.5">
              {dict.disclaimer.crisisHotlines.map((hotline, idx) => (
                <li
                  key={idx}
                  className="bg-ivory-50 p-2.5 rounded-lg border border-peach-muted/20 text-xs"
                >
                  <div className="font-semibold text-stone-charcoal">{hotline.name}</div>
                  <div className="font-mono text-peach-deep text-sm my-0.5">{hotline.number}</div>
                  <div className="text-stone-mist">{hotline.description}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-2 p-3 bg-mint-soft rounded-lg text-xs text-mint-deep">
            <HeartHandshake className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Your reflections are 100% private and stay in your browser. No third party or AI system can read your input.
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-ivory-300 flex justify-end">
          <button
            onClick={() => setSafetyModalOpen(false)}
            className="px-4 py-2 bg-stone-charcoal text-ivory-50 rounded-xl text-sm font-medium hover:bg-stone-charcoal/90 focus:outline-none focus:ring-2 focus:ring-violet-muted"
          >
            {dict.disclaimer.close}
          </button>
        </div>
      </div>
    </div>
  );
}
