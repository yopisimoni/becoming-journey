'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Feather, Download, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export function FreeJournalView() {
  const {
    dict,
    journalEntries,
    saveJournalEntry,
    deleteJournalEntry,
  } = useApp();

  const [currentText, setCurrentText] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const wordCount = currentText.trim()
    ? currentText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleSave = () => {
    if (!currentText.trim()) return;
    saveJournalEntry(currentText);
    setCurrentText('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleDownloadSingleNote = () => {
    if (!currentText.trim()) return;
    const blob = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `becoming-note-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Feather className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {dict.journal.title}
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {dict.journal.subtitle}
        </p>
      </div>

      {/* Privacy Notice Pill */}
      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>{dict.journal.privacyNotice}</span>
      </div>

      {/* Writing Box */}
      <div className="space-y-3">
        <textarea
          rows={10}
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder={dict.journal.placeholder}
          className="w-full p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md resize-y font-normal"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">
            {wordCount} {dict.journal.wordCount}
          </span>

          <div className="flex items-center gap-2">
            {justSaved && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                {dict.journal.entrySaved}
              </span>
            )}

            {currentText.trim() && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentText('')}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {dict.journal.clearEntry}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSingleNote}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{dict.journal.exportTxt}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={!currentText.trim()}
              className="px-7 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
            >
              {dict.journal.saveEntry}
            </button>
          </div>
        </div>
      </div>

      {/* Saved Entries List */}
      <section aria-labelledby="saved-entries-heading" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h2 id="saved-entries-heading" className="text-base font-bold text-slate-900 dark:text-white">
          {dict.journal.entriesHeading} ({journalEntries.length})
        </h2>

        {journalEntries.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic py-4">
            {dict.journal.noEntries}
          </p>
        ) : (
          <div className="space-y-3">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-slate-900 dark:text-white text-sm shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3">
                    <span>{entry.wordCount} {dict.journal.wordCount}</span>
                    <button
                      type="button"
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={dict.journal.deleteEntry}
                      aria-label={`${dict.journal.deleteEntry} from ${new Date(entry.createdAt).toLocaleDateString()}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
