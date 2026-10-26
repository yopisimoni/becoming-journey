'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AlertTriangle, X } from 'lucide-react';

interface WipeDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WipeDataModal({ isOpen, onClose }: WipeDataModalProps) {
  const { dict, wipeAllData } = useApp();

  if (!isOpen) return null;

  const handleConfirm = () => {
    wipeAllData();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wipe-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-charcoal/60 dark:bg-black/70 backdrop-blur-md"
    >
      <div className="bg-ivory-50 dark:bg-stone-900 border border-peach-muted/40 dark:border-peach-muted/30 rounded-3xl shadow-2xl max-w-md w-full p-6 text-stone-charcoal dark:text-ivory-100">
        <div className="flex items-center justify-between pb-3 border-b border-stone-border/40 dark:border-white/10">
          <div className="flex items-center gap-2 text-peach-deep dark:text-peach-soft">
            <AlertTriangle className="w-5 h-5 text-peach-muted" />
            <h2 id="wipe-modal-title" className="text-base font-serif font-semibold">
              {dict.dataManagement.wipeModalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-mist dark:text-stone-400 hover:text-stone-charcoal dark:hover:text-ivory-100 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label={dict.dataManagement.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="py-4 text-sm text-stone-mist dark:text-stone-300 leading-relaxed">
          {dict.dataManagement.wipeModalWarning}
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-border/40 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-border/80 dark:border-white/15 rounded-2xl text-sm font-medium text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 dark:hover:bg-stone-800 transition-colors"
          >
            {dict.dataManagement.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-peach-deep text-ivory-50 rounded-2xl text-sm font-medium hover:bg-peach-deep/90 focus:outline-none focus:ring-2 focus:ring-peach-muted transition-colors shadow-sm"
          >
            {dict.dataManagement.confirmWipe}
          </button>
        </div>
      </div>
    </div>
  );
}
