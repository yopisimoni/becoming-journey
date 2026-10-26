/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { saveMediaItem } from '@/lib/storage/mediaDb';
import {
  Sparkles,
  Heart,
  Sun,
  Trash2,
  Upload,
  Image as ImageIcon,
  Film,
  X,
  Maximize2,
  Calendar,
} from 'lucide-react';

export function PersonalProgressView() {
  const {
    dict,
    cards,
    journalEntries,
    moments,
    addMomentWithMedia,
    deleteMoment,
    playSingingBowl,
  } = useApp();

  const [momentInput, setMomentInput] = useState('');
  const [mediaDataUrl, setMediaDataUrl] = useState<string | undefined>();
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; type: 'image' | 'video'; text: string } | null>(null);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const record = await saveMediaItem(file);
      setMediaDataUrl(record.dataUrl);
      setMediaType(record.type);
    } catch {
      // ignore
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentInput.trim() && !mediaDataUrl) return;

    addMomentWithMedia(
      momentInput.trim() || 'Visual Memory',
      mediaDataUrl,
      mediaType
    );

    setMomentInput('');
    setMediaDataUrl(undefined);
    setMediaType(undefined);
    playSingingBowl();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
            {dict.progress.title} & Visual Memories
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {dict.progress.subtitle}
        </p>
      </div>

      {/* Zero Streaks Philosophy Banner */}
      <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-3 shadow-xs">
        <Heart className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
        <p className="leading-relaxed font-medium">
          {dict.progress.noStreaksNotice}
        </p>
      </div>

      {/* Gentle Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {dict.progress.totalInsights}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {cards.length}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {dict.progress.totalReflections}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {journalEntries.length}
          </div>
        </div>
      </div>

      {/* Moments of Light & Visual Memory Board */}
      <section aria-labelledby="moments-title" className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <h2 id="moments-title" className="text-lg font-serif font-bold text-slate-900 dark:text-white">
              Visual Memories & {dict.progress.momentsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {dict.progress.momentsSubtitle} You can also attach photos and short videos from your device.
          </p>
        </div>

        {/* Add Moment Form with Media Attachment */}
        <form onSubmit={handleAddMoment} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={momentInput}
              onChange={(e) => setMomentInput(e.target.value)}
              placeholder={dict.progress.addMomentPlaceholder}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs font-normal"
            />

            <div className="flex items-center gap-2">
              <label className="px-3.5 py-2.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">{isUploading ? 'Loading...' : mediaDataUrl ? 'Media Attached' : 'Attach Photo/Video'}</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={!momentInput.trim() && !mediaDataUrl}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20 shrink-0"
              >
                {dict.progress.addMomentBtn}
              </button>
            </div>
          </div>

          {/* Media Preview thumbnail in form */}
          {mediaDataUrl && (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
              {mediaType === 'video' ? (
                <video src={mediaDataUrl} className="w-full h-full object-cover" muted />
              ) : (
                <img src={mediaDataUrl} alt="Preview" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => {
                  setMediaDataUrl(undefined);
                  setMediaType(undefined);
                }}
                className="absolute top-1 end-1 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </form>

        {/* Moments & Memories Visual Grid */}
        {moments.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {dict.progress.emptyMoments}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {moments.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3 group hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  {/* Photo or Video attachment card */}
                  {m.mediaDataUrl && (
                    <div
                      onClick={() =>
                        setLightboxItem({
                          url: m.mediaDataUrl!,
                          type: m.mediaType || 'image',
                          text: m.text,
                        })
                      }
                      className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-sm group/media"
                    >
                      {m.mediaType === 'video' ? (
                        <video src={m.mediaDataUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={m.mediaDataUrl} alt={m.text} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300" />
                      )}
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6 drop-shadow" />
                      </div>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {m.text}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{m.date}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteMoment(m.id)}
                    aria-label="Delete moment"
                    className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 end-4 p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full flex-1 flex items-center justify-center p-4">
              {lightboxItem.type === 'video' ? (
                <video src={lightboxItem.url} controls autoPlay className="max-w-full max-h-[70vh] rounded-2xl" />
              ) : (
                <img src={lightboxItem.url} alt={lightboxItem.text} className="max-w-full max-h-[70vh] object-contain rounded-2xl" />
              )}
            </div>

            {lightboxItem.text && (
              <div className="w-full p-4 bg-slate-900/90 text-center text-xs sm:text-sm text-slate-200 border-t border-white/10">
                {lightboxItem.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
