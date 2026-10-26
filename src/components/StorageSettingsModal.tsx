'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { HardDrive, Clock, ShieldCheck, X } from 'lucide-react';

interface StorageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StorageSettingsModal({ isOpen, onClose }: StorageSettingsModalProps) {
  const { storageMode, setStorageMode, dict } = useApp();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="storage-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-charcoal/60 dark:bg-black/70 backdrop-blur-md"
    >
      <div className="bg-ivory-50 dark:bg-stone-900 border border-stone-border/80 dark:border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6 text-stone-charcoal dark:text-ivory-100">
        <div className="flex items-center justify-between pb-3 border-b border-stone-border/40 dark:border-white/10">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-violet-muted" />
            <h2 id="storage-modal-title" className="text-base font-serif font-semibold">
              {dict.dataManagement.storageModeTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-mist dark:text-stone-400 hover:text-stone-charcoal dark:hover:text-ivory-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 py-4 text-sm">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors bg-white/60 dark:bg-stone-800/60 hover:bg-white dark:hover:bg-stone-800 border-stone-border/80 dark:border-white/10">
            <input
              type="radio"
              name="storageMode"
              checked={storageMode === 'session'}
              onChange={() => setStorageMode('session')}
              className="mt-1 text-violet-deep focus:ring-violet-muted"
            />
            <div>
              <div className="font-semibold text-stone-charcoal dark:text-ivory-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-violet-muted" />
                {dict.nav.storageSession}
              </div>
              <p className="text-xs text-stone-mist dark:text-stone-400 mt-1">
                {dict.dataManagement.sessionModeDesc}
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors bg-white/60 dark:bg-stone-800/60 hover:bg-white dark:hover:bg-stone-800 border-stone-border/80 dark:border-white/10">
            <input
              type="radio"
              name="storageMode"
              checked={storageMode === 'local'}
              onChange={() => setStorageMode('local')}
              className="mt-1 text-violet-deep focus:ring-violet-muted"
            />
            <div>
              <div className="font-semibold text-stone-charcoal dark:text-ivory-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-mint-muted" />
                {dict.nav.storageLocal}
              </div>
              <p className="text-xs text-stone-mist dark:text-stone-400 mt-1">
                {dict.dataManagement.localModeDesc}
              </p>
            </div>
          </label>

          <div className="p-3 bg-peach-soft/50 dark:bg-peach-deep/20 border border-peach-muted/30 rounded-2xl text-xs text-stone-charcoal dark:text-stone-200">
            {dict.dataManagement.sharedDeviceWarning}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-stone-border/40 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-charcoal dark:bg-ivory-100 text-ivory-50 dark:text-stone-900 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {dict.disclaimer.close}
          </button>
        </div>
      </div>
    </div>
  );
}
