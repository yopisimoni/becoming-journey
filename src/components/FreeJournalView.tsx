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
          <Feather className="w-5 h-5 text-mint-muted" />
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-charcoal">
            {dict.journal.title}
          </h1>
        </div>
        <p className="text-sm text-stone-mist">
          {dict.journal.subtitle}
        </p>
      </div>

      {/* Privacy Notice Pill */}
      <div className="p-3 bg-mint-soft/80 border border-mint-muted/30 rounded-xl text-xs text-mint-deep flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>{dict.journal.privacyNotice}</span>
      </div>

      {/* Writing Box */}
      <div className="space-y-3">
        <textarea
          rows={10}
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder={dict.journal.placeholder}
          className="w-full p-4 sm:p-6 rounded-2xl bg-ivory-50 border border-stone-border text-stone-charcoal placeholder-stone-mist/60 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-mint-muted shadow-xs resize-y"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-mist">
          <span>
            {wordCount} {dict.journal.wordCount}
          </span>

          <div className="flex items-center gap-2">
            {justSaved && (
              <span className="text-mint-deep flex items-center gap-1 font-medium animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {dict.journal.entrySaved}
              </span>
            )}

            {currentText.trim() && (
              <>
                <button
                  onClick={() => setCurrentText('')}
                  className="px-3 py-1.5 rounded-xl border border-stone-border hover:bg-ivory-200 text-stone-mist hover:text-stone-charcoal"
                >
                  {dict.journal.clearEntry}
                </button>
                <button
                  onClick={handleDownloadSingleNote}
                  className="px-3 py-1.5 rounded-xl border border-stone-border hover:bg-ivory-200 text-stone-charcoal flex items-center gap-1 font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-stone-mist" />
                  <span>{dict.journal.exportTxt}</span>
                </button>
              </>
            )}

            <button
              onClick={handleSave}
              disabled={!currentText.trim()}
              className="px-5 py-2 rounded-xl bg-mint-deep text-ivory-50 font-medium text-xs sm:text-sm hover:bg-mint-deep/90 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-mint-muted shadow-xs transition-colors"
            >
              {dict.journal.saveEntry}
            </button>
          </div>
        </div>
      </div>

      {/* Saved Entries List */}
      <section aria-labelledby="saved-entries-heading" className="pt-8 border-t border-ivory-300 space-y-4">
        <h2 id="saved-entries-heading" className="text-base font-semibold text-stone-charcoal">
          {dict.journal.entriesHeading} ({journalEntries.length})
        </h2>

        {journalEntries.length === 0 ? (
          <p className="text-xs sm:text-sm text-stone-mist italic py-4">
            {dict.journal.noEntries}
          </p>
        ) : (
          <div className="space-y-3">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-ivory-100 border border-stone-border space-y-2 text-stone-charcoal text-sm"
              >
                <div className="flex items-center justify-between text-xs text-stone-mist">
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3">
                    <span>{entry.wordCount} {dict.journal.wordCount}</span>
                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="text-stone-mist hover:text-peach-deep p-1 rounded hover:bg-ivory-200"
                      title={dict.journal.deleteEntry}
                      aria-label={`${dict.journal.deleteEntry} from ${new Date(entry.createdAt).toLocaleDateString()}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-stone-charcoal">
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
