'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, ShieldCheck, X } from 'lucide-react';

export function AiBridgeSettingsModal() {
  const { isAiModalOpen, setAiModalOpen, aiSettings, setAiSettings, dict } = useApp();

  const [enabled, setEnabled] = useState(aiSettings.enabled);
  const [endpoint, setEndpoint] = useState(aiSettings.endpoint);
  const [apiKey, setApiKey] = useState(aiSettings.apiKey);
  const [model, setModel] = useState(aiSettings.model);

  if (!isAiModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAiSettings({
      enabled,
      endpoint: endpoint.trim(),
      apiKey: apiKey.trim(),
      model: model.trim() || 'gpt-4o-mini',
    });
    setAiModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-charcoal/60 backdrop-blur-sm"
    >
      <div className="bg-ivory-50 dark:bg-stone-900 border border-stone-border dark:border-white/10 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-stone-charcoal dark:text-ivory-100">
        <div className="flex items-center justify-between pb-3 border-b border-ivory-300 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-violet-soft dark:bg-violet-deep/40 flex items-center justify-center text-violet-deep dark:text-violet-soft">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 id="ai-modal-title" className="text-base font-semibold">
              {dict.aiBridge.modalTitle}
            </h2>
          </div>
          <button
            onClick={() => setAiModalOpen(false)}
            className="p-1 rounded-lg text-stone-mist hover:text-stone-charcoal dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 py-4 text-xs sm:text-sm">
          <p className="text-stone-mist dark:text-stone-300 text-xs leading-relaxed">
            {dict.aiBridge.description}
          </p>

          <label className="flex items-center gap-3 p-3 rounded-2xl bg-ivory-100 dark:bg-white/5 border border-stone-border dark:border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded text-violet-deep focus:ring-violet-muted w-4 h-4"
            />
            <span className="font-medium text-stone-charcoal dark:text-white">
              {dict.aiBridge.enableToggle}
            </span>
          </label>

          {enabled && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-stone-mist mb-1">
                  {dict.aiBridge.endpointLabel}
                </label>
                <input
                  type="url"
                  placeholder="https://api.openai.com/v1/chat/completions"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-white/5 border border-stone-border dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-violet-muted"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-mist mb-1">
                  {dict.aiBridge.apiKeyLabel}
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-white/5 border border-stone-border dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-violet-muted font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-mist mb-1">
                  {dict.aiBridge.modelLabel}
                </label>
                <input
                  type="text"
                  placeholder="gpt-4o-mini"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-white/5 border border-stone-border dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-violet-muted"
                />
              </div>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-mint-soft/80 dark:bg-mint-deep/20 border border-mint-muted/30 text-[11px] text-mint-deep dark:text-mint-soft flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{dict.aiBridge.privacyNotice}</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-ivory-300 dark:border-white/10">
            <button
              type="button"
              onClick={() => setAiModalOpen(false)}
              className="px-4 py-2 border border-stone-border rounded-xl text-xs font-medium hover:bg-ivory-200 dark:hover:bg-white/5"
            >
              {dict.dataManagement.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-deep text-ivory-50 rounded-xl text-xs font-medium hover:bg-violet-deep/90 shadow-sm"
            >
              {dict.aiBridge.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
