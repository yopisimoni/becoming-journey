'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { GoodVibesTemplateId, GoodVibesContentType } from '@/types';
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  Palette,
  Sun,
  Moon,
  Feather,
  Compass,
  Heart,
  Award,
  ShieldAlert,
} from 'lucide-react';
import { getSessionQuote } from '@/lib/quotes/quoteEngine';
import { AtmosphericOrb } from '@/components/motion';

interface TemplateConfig {
  id: GoodVibesTemplateId;
  nameKey: string;
  defaultName: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  subColor: string;
  borderClass: string;
  accentDot: string;
  canvasBg: [string, string];
  canvasTextColor: string;
  canvasSubColor: string;
  canvasBorderColor: string;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: 'sunrise',
    nameKey: 'sunrise',
    defaultName: 'Sunrise Hope',
    bgGradient: 'from-amber-100 via-rose-100 to-orange-100 dark:from-amber-950/80 dark:to-orange-950/80',
    cardBg: 'bg-gradient-to-br from-[#FFF5EB] to-[#FFE8DA] dark:from-[#2B1B15] dark:to-[#381F17]',
    textColor: 'text-amber-950 dark:text-amber-100',
    subColor: 'text-amber-800/80 dark:text-amber-300/80',
    borderClass: 'border-amber-300 dark:border-amber-800',
    accentDot: 'bg-amber-500',
    canvasBg: ['#FFF5EB', '#FFE8DA'],
    canvasTextColor: '#451A03',
    canvasSubColor: '#92400E',
    canvasBorderColor: '#FCD34D',
  },
  {
    id: 'twilight',
    nameKey: 'twilight',
    defaultName: 'Twilight Calm',
    bgGradient: 'from-indigo-900 via-slate-900 to-purple-950',
    cardBg: 'bg-gradient-to-br from-[#0F1424] to-[#251B3D]',
    textColor: 'text-indigo-100',
    subColor: 'text-indigo-300/80',
    borderClass: 'border-indigo-700/60',
    accentDot: 'bg-indigo-400',
    canvasBg: ['#0F1424', '#251B3D'],
    canvasTextColor: '#E0E7FF',
    canvasSubColor: '#A5B4FC',
    canvasBorderColor: '#6366F1',
  },
  {
    id: 'moss',
    nameKey: 'moss',
    defaultName: 'Grounded Moss',
    bgGradient: 'from-emerald-950 via-teal-950 to-stone-900',
    cardBg: 'bg-gradient-to-br from-[#0B1A13] to-[#122A1E]',
    textColor: 'text-emerald-100',
    subColor: 'text-emerald-300/80',
    borderClass: 'border-emerald-700/60',
    accentDot: 'bg-emerald-400',
    canvasBg: ['#0B1A13', '#122A1E'],
    canvasTextColor: '#ECFDF5',
    canvasSubColor: '#6EE7B7',
    canvasBorderColor: '#10B981',
  },
  {
    id: 'dawn',
    nameKey: 'dawn',
    defaultName: 'Dawn Alabaster',
    bgGradient: 'from-amber-50 via-stone-100 to-rose-50',
    cardBg: 'bg-gradient-to-br from-[#FAF7F2] to-[#FFFDF9]',
    textColor: 'text-slate-900',
    subColor: 'text-slate-600',
    borderClass: 'border-slate-300',
    accentDot: 'bg-amber-400',
    canvasBg: ['#FAF7F2', '#FFFDF9'],
    canvasTextColor: '#0F172A',
    canvasSubColor: '#475569',
    canvasBorderColor: '#CBD5E1',
  },
  {
    id: 'cosmic',
    nameKey: 'cosmic',
    defaultName: 'Cosmic Reflection',
    bgGradient: 'from-black via-slate-950 to-indigo-950',
    cardBg: 'bg-gradient-to-br from-[#05060A] to-[#0E101A]',
    textColor: 'text-slate-100',
    subColor: 'text-slate-400',
    borderClass: 'border-slate-800',
    accentDot: 'bg-indigo-300',
    canvasBg: ['#05060A', '#0E101A'],
    canvasTextColor: '#F8FAFC',
    canvasSubColor: '#94A3B8',
    canvasBorderColor: '#334155',
  },
];

export function GoodVibesStudioView() {
  const { dict, moments, evolution } = useApp();

  const [activeTemplate, setActiveTemplate] = useState<GoodVibesTemplateId>('sunrise');
  const [contentType, setContentType] = useState<GoodVibesContentType>('quote');
  const [customText, setCustomText] = useState('');
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  // Default quote from library
  const [quoteItem, setQuoteItem] = useState(() => getSessionQuote());

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gvDict = dict.goodVibes;
  const currentConfig = TEMPLATES.find((t) => t.id === activeTemplate) || TEMPLATES[0];

  // Derive active headline & body text
  const getCardContent = () => {
    switch (contentType) {
      case 'moment':
        return {
          headline: 'A Moment of Light',
          body: customText || (moments[0]?.text ?? 'A quiet cup of tea and a moment to simply breathe without rush.'),
          subText: 'Reflected in Silence • Preserved Locally',
        };
      case 'achievement':
        return {
          headline: `Evolution Milestone: Stage ${evolution.currentLevel}`,
          body: customText || `Walking the path of awakening. Total ${evolution.totalXp} XP grounded in daily mindfulness.`,
          subText: 'BECOMING Personal Evolution',
        };
      case 'gratitude':
        return {
          headline: 'A Note of Gratitude',
          body: customText || 'Grateful for the gentle patience within me, and for the quiet blessings that arrive unannounced.',
          subText: 'Living Right Sanctuary',
        };
      case 'quiz_summary':
        return {
          headline: 'Inner Compass Reflection',
          body: customText || 'Exploring my natural archetypes, creative fuels, and emotional rhythms with curiosity and self-compassion.',
          subText: 'Reflective Exploration • Entertainment Only',
        };
      case 'quote':
      default:
        return {
          headline: 'Daily Philosophy & Light',
          body: customText || `“${quoteItem.quote}”`,
          subText: `— ${quoteItem.author}`,
        };
    }
  };

  const cardContent = getCardContent();

  /**
   * Client-side high-resolution PNG rendering via HTML5 Canvas
   */
  const renderCardToCanvas = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
      grad.addColorStop(0, currentConfig.canvasBg[0]);
      grad.addColorStop(1, currentConfig.canvasBg[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1200);

      // Outer Decorative Border
      ctx.strokeStyle = currentConfig.canvasBorderColor;
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, 1120, 1120);

      // Inner Soft Border
      ctx.strokeStyle = currentConfig.canvasBorderColor + '66';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1090, 1090);

      // Top Icon Badge
      ctx.fillStyle = currentConfig.canvasTextColor;
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ ✦ ✦', 600, 220);

      // Headline
      ctx.fillStyle = currentConfig.canvasSubColor;
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(cardContent.headline.toUpperCase(), 600, 320);

      // Body text wrapping
      ctx.fillStyle = currentConfig.canvasTextColor;
      ctx.font = 'italic 52px serif';
      const words = cardContent.body.split(' ');
      let line = '';
      const lines: string[] = [];
      const maxWidth = 940;
      const lineHeight = 76;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const startY = 480 - (lines.length * lineHeight) / 4;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].trim(), 600, startY + i * lineHeight);
      }

      // SubText / Author
      if (cardContent.subText) {
        ctx.fillStyle = currentConfig.canvasSubColor;
        ctx.font = '500 36px sans-serif';
        ctx.fillText(cardContent.subText, 600, startY + lines.length * lineHeight + 60);
      }

      // Optional Watermark
      if (includeWatermark) {
        ctx.fillStyle = currentConfig.canvasSubColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('BECOMING • PERSONAL SANCTUARY', 600, 1080);
      }

      resolve(canvas.toDataURL('image/png'));
    });
  };

  const handleDownload = async () => {
    setIsRendering(true);
    try {
      const dataUrl = await renderCardToCanvas();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `becoming-vibe-${activeTemplate}-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsRendering(false);
    }
  };

  const handleShare = async () => {
    const textToShare = `${cardContent.headline}\n\n${cardContent.body}\n\n${cardContent.subText || ''}\n\nvia BECOMING Sanctuary`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: cardContent.headline,
          text: textToShare,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    const textToShare = `${cardContent.headline}\n\n${cardContent.body}\n\n${cardContent.subText || ''}\n\nvia BECOMING Sanctuary`;
    navigator.clipboard.writeText(textToShare).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div
      data-testid="good-vibes-view"
      className="relative max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-in fade-in duration-500 overflow-hidden"
    >
      <AtmosphericOrb
        color="rgba(129, 140, 248, 0.16)"
        size={400}
        blur={90}
        className="-top-12 -end-12"
      />
      {/* Hidden canvas for high-resolution PNG generation */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {gvDict?.studioTitle || 'Good Vibes Sharing Studio'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
          Craft & Share Inspiring Light
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
          {gvDict?.studioSubtitle ||
            'Generate beautiful, private, exportable visual cards to inspire yourself or loved ones.'}
        </p>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Template & Content Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Template Selector */}
          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {gvDict?.selectTemplate || 'Choose Card Aesthetic Template'}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map((t) => {
                const isSelected = activeTemplate === t.id;
                const label = gvDict?.templates?.[t.id] || t.defaultName;

                return (
                  <button
                    key={t.id}
                    type="button"
                    data-testid={`goodvibes-template-${t.id}`}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`w-full p-2.5 rounded-2xl border text-start flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${t.accentDot}`} />
                      <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        {label}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Card Content Type
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['quote', 'moment', 'achievement', 'gratitude', 'quiz_summary'] as GoodVibesContentType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    data-testid={`goodvibes-content-type-${type}`}
                    onClick={() => {
                      setContentType(type);
                      setCustomText('');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-start transition-all ${
                      contentType === type
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {gvDict?.contentTypes?.[type] || type}
                  </button>
                )
              )}
            </div>

            {/* Custom Edit Textarea */}
            <div className="pt-2">
              <label htmlFor="custom-vibe-text" className="text-[11px] font-semibold text-slate-400 block mb-1">
                Customize Card Words (Optional)
              </label>
              <textarea
                id="custom-vibe-text"
                data-testid="goodvibes-custom-text"
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Write custom words or reflections to engrave onto your card..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Watermark Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <label htmlFor="watermark-toggle" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                {gvDict?.watermarkLabel || 'Include BECOMING sanctuary mark'}
              </label>
              <input
                id="watermark-toggle"
                data-testid="watermark-toggle"
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Preview & Export Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Card Preview */}
          <div
            data-testid="goodvibes-card-preview"
            className={`p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-700 flex flex-col justify-between min-h-[380px] sm:min-h-[440px] ${currentConfig.cardBg} ${currentConfig.borderClass}`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/5">
              <span className={`text-[11px] font-bold uppercase tracking-widest ${currentConfig.subColor}`}>
                ✦ {cardContent.headline}
              </span>
              <span className="text-xs opacity-60">BECOMING</span>
            </div>

            {/* Main Body Quote / Moment */}
            <div className="my-auto py-6">
              <p
                className={`text-xl sm:text-2xl md:text-3xl font-serif font-medium leading-relaxed ${currentConfig.textColor}`}
              >
                {cardContent.body}
              </p>
              {cardContent.subText && (
                <p className={`mt-4 text-xs sm:text-sm font-medium ${currentConfig.subColor}`}>
                  {cardContent.subText}
                </p>
              )}
            </div>

            {/* Bottom Footer Watermark */}
            {includeWatermark && (
              <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] opacity-70">
                <span className={currentConfig.subColor}>becoming-journey.vercel.app</span>
                <span className={currentConfig.subColor}>Local Sanctuary • Zero Tracking</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              id="goodvibes-download-btn"
              data-testid="goodvibes-download-btn"
              type="button"
              onClick={handleDownload}
              disabled={isRendering}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{gvDict?.downloadPng || 'Save to Device (PNG)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="goodvibes-share-btn"
                onClick={handleShare}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{gvDict?.shareCard || 'Share Card'}</span>
              </button>

              <button
                type="button"
                data-testid="goodvibes-copy-btn"
                onClick={handleCopyText}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? gvDict?.copied || 'Copied!' : gvDict?.copyText || 'Copy Text'}</span>
              </button>
            </div>
          </div>

          {/* Privacy Disclaimer Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              {gvDict?.privacyDisclaimer ||
                'Privacy First: Generated purely on your device. Never uploaded to servers or social media automatically. You are in complete control of what you choose to share.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
