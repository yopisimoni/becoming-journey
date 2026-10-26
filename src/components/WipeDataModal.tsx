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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-charcoal/60 backdrop-blur-sm"
    >
      <div className="bg-ivory-50 border border-peach-muted/40 rounded-2xl shadow-xl max-w-md w-full p-6 text-stone-charcoal">
        <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
          <div className="flex items-center gap-2 text-peach-deep">
            <AlertTriangle className="w-5 h-5 text-peach-muted" />
            <h2 id="wipe-modal-title" className="text-base font-semibold">
              {dict.dataManagement.wipeModalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-mist hover:text-stone-charcoal"
            aria-label={dict.dataManagement.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="py-4 text-sm text-stone-mist leading-relaxed">
          {dict.dataManagement.wipeModalWarning}
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ivory-300">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-border rounded-xl text-sm font-medium text-stone-charcoal hover:bg-ivory-200"
          >
            {dict.dataManagement.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-peach-deep text-ivory-50 rounded-xl text-sm font-medium hover:bg-peach-deep/90 focus:outline-none focus:ring-2 focus:ring-peach-muted"
          >
            {dict.dataManagement.confirmWipe}
          </button>
        </div>
      </div>
    </div>
  );
}
