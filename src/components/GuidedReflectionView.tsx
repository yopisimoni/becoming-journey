'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EntryIntent, GuidedStage } from '@/types';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Edit3,
  Trash2,
  BookmarkCheck,
} from 'lucide-react';

export function GuidedReflectionView() {
  const {
    dict,
    currentIntent,
    setCurrentIntent,
    saveCard,
    setActiveTab,
    isRtl,
  } = useApp();

  const intent: EntryIntent = currentIntent || 'lost';
  const script = dict.scripts[intent];

  const [currentStage, setCurrentStage] = useState<GuidedStage>('express');
  const [selectedSupportId, setSelectedSupportId] = useState<string>(
    script.supportSelectors[0]?.id || ''
  );
  const [userText, setUserText] = useState('');
  const [isFallbackAcknowledged, setIsFallbackAcknowledged] = useState(false);

  // Editable draft insight
  const [isEditingInsight, setIsEditingInsight] = useState(false);
  const [insightText, setInsightText] = useState(script.draftInsight);
  const [isInsightConfirmed, setIsInsightConfirmed] = useState(false);
  const [isInsightDiscarded, setIsInsightDiscarded] = useState(false);

  // Micro-step choice
  const [microStepChoice, setMicroStepChoice] = useState<'accepted' | 'skipped' | null>(
    null
  );
  const [customStepText, setCustomStepText] = useState(script.optionalMicroStep);

  const stagesList: GuidedStage[] = ['express', 'explore', 'confirm', 'choose', 'reflect'];
  const stageIndex = stagesList.indexOf(currentStage);

  const handleNextStage = () => {
    if (stageIndex < stagesList.length - 1) {
      setCurrentStage(stagesList[stageIndex + 1]);
    }
  };

  const handlePrevStage = () => {
    if (stageIndex > 0) {
      setCurrentStage(stagesList[stageIndex - 1]);
    }
  };

  const handleConfirmInsight = () => {
    setIsInsightConfirmed(true);
    setIsInsightDiscarded(false);
  };

  const handleDiscardInsight = () => {
    setIsInsightConfirmed(false);
    setIsInsightDiscarded(true);
  };

  const handleCommitToMap = () => {
    if (isInsightConfirmed) {
      saveCard({
        intent,
        draftInsight: script.draftInsight,
        confirmedInsight: insightText.trim() || script.draftInsight,
        microStep:
          microStepChoice === 'accepted' ? customStepText.trim() : undefined,
        isConfirmed: true,
        status: 'confirmed',
        notes: userText.trim() ? `User reflection: ${userText.trim().substring(0, 140)}...` : undefined,
      });
    }
    handleNextStage();
  };

  const handleReset = () => {
    setCurrentStage('express');
    setUserText('');
    setInsightText(script.draftInsight);
    setIsInsightConfirmed(false);
    setIsInsightDiscarded(false);
    setMicroStepChoice(null);
    setIsFallbackAcknowledged(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Intent Badge & Intent Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ivory-300">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-violet-muted" />
          <span className="text-xs uppercase font-semibold text-stone-mist tracking-wider">
            {dict.welcome.intents[intent].title}
          </span>
          <span className="text-xs text-stone-mist">({script.tone})</span>
        </div>
        <button
          onClick={() => setCurrentIntent(null)}
          className="text-xs text-violet-deep hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {dict.welcome.question}
        </button>
      </div>

      {/* Stage Progress Bar (5 stages) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-stone-mist">
          {stagesList.map((stg, idx) => {
            const isActive = stg === currentStage;
            const isCompleted = idx < stageIndex;
            return (
              <span
                key={stg}
                className={`flex items-center gap-1 ${
                  isActive
                    ? 'text-violet-deep font-semibold'
                    : isCompleted
                    ? 'text-mint-deep'
                    : 'text-stone-mist/60'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive
                      ? 'bg-violet-deep text-ivory-50'
                      : isCompleted
                      ? 'bg-mint-soft text-mint-deep border border-mint-muted/40'
                      : 'bg-ivory-200 text-stone-mist'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                </span>
                <span className="hidden sm:inline">{dict.stages[stg].label}</span>
              </span>
            );
          })}
        </div>
        <div className="h-1.5 w-full bg-ivory-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-deep transition-all duration-300"
            style={{ width: `${((stageIndex + 1) / stagesList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* STAGE 1: EXPRESS */}
      {currentStage === 'express' && (
        <section aria-labelledby="stage-express-title" className="space-y-6">
          <div className="space-y-1">
            <h2 id="stage-express-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal">
              {dict.guided.expressStepTitle}
            </h2>
            <p className="text-sm text-stone-mist">
              {dict.guided.expressStepSubtitle}
            </p>
          </div>

          {/* Support Selector */}
          <div className="p-4 rounded-2xl bg-ivory-100 border border-stone-border space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-mist">
              {script.supportTitle}
            </h3>
            <div className="flex flex-wrap gap-2">
              {script.supportSelectors.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSupportId(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
                    selectedSupportId === item.id
                      ? 'bg-violet-deep text-ivory-50 border-violet-deep'
                      : 'bg-ivory-50 text-stone-charcoal border-stone-border hover:bg-ivory-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Open Prompt & Textarea */}
          <div className="space-y-3">
            <label htmlFor="user-express-input" className="block text-sm sm:text-base font-medium text-stone-charcoal">
              {script.openPrompt}
            </label>
            <textarea
              id="user-express-input"
              rows={5}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder={script.openPlaceholder}
              className="w-full p-4 rounded-2xl bg-ivory-50 border border-stone-border text-stone-charcoal placeholder-stone-mist/60 text-sm focus:outline-none focus:ring-2 focus:ring-violet-muted resize-y"
            />
            <div className="flex justify-between items-center text-xs text-stone-mist">
              <span>{userText.length} {dict.guided.charCount}</span>
              <span className="italic">100% private to this browser</span>
            </div>
          </div>

          {/* Fallback Notice (Transparency about scripted engine) */}
          <div className="p-4 rounded-xl bg-ivory-200/80 border border-ivory-300 text-xs text-stone-mist space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-stone-charcoal">
              <Info className="w-4 h-4 text-violet-muted shrink-0" />
              <span>{dict.fallback.heading}</span>
            </div>
            <p>{dict.fallback.notice}</p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextStage}
              className="px-6 py-2.5 rounded-xl bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 focus:outline-none focus:ring-2 focus:ring-violet-muted shadow-sm"
            >
              <span>{dict.guided.nextStepBtn}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 2: EXPLORE (Mirroring) */}
      {currentStage === 'explore' && (
        <section aria-labelledby="stage-explore-title" className="space-y-6">
          <div className="space-y-1">
            <h2 id="stage-explore-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal">
              {dict.guided.exploreStepTitle}
            </h2>
            <p className="text-sm text-stone-mist">
              {dict.guided.exploreStepSubtitle}
            </p>
          </div>

          {/* Your Expressed Reflection Summary */}
          {userText.trim() && (
            <div className="p-4 rounded-xl bg-ivory-100 border border-stone-border text-xs text-stone-mist space-y-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-charcoal">
                What you shared:
              </span>
              <p className="italic text-stone-charcoal">&ldquo;{userText}&rdquo;</p>
            </div>
          )}

          {/* Exploration Mirror */}
          <div className="p-6 rounded-2xl bg-violet-soft/50 border border-violet-muted/30 space-y-3">
            <div className="flex items-center gap-2 text-violet-deep text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-violet-muted" />
              <span>Tentative Mirror</span>
            </div>
            <p className="text-base sm:text-lg text-stone-charcoal leading-relaxed font-serif italic">
              &ldquo;{script.explorationMirror}&rdquo;
            </p>
          </div>

          {/* Deterministic Fallback reminder */}
          <div className="p-4 rounded-xl bg-ivory-100 border border-stone-border text-xs text-stone-mist space-y-2">
            <p>{dict.fallback.suggestion}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStage('express')}
                className="text-violet-deep font-medium hover:underline"
              >
                {dict.fallback.rephrase}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrevStage}
              className="px-4 py-2 border border-stone-border rounded-xl text-sm font-medium text-stone-charcoal hover:bg-ivory-200 flex items-center gap-1.5"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{dict.guided.prevStepBtn}</span>
            </button>
            <button
              onClick={handleNextStage}
              className="px-6 py-2.5 rounded-xl bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 focus:outline-none focus:ring-2 focus:ring-violet-muted shadow-sm"
            >
              <span>{dict.guided.nextStepBtn}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 3: CONFIRM INSIGHT */}
      {currentStage === 'confirm' && (
        <section aria-labelledby="stage-confirm-title" className="space-y-6">
          <div className="space-y-1">
            <h2 id="stage-confirm-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal">
              {dict.guided.confirmStepTitle}
            </h2>
            <p className="text-sm text-stone-mist">
              {dict.guided.confirmStepSubtitle}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-peach-soft/50 border border-peach-muted/30 text-xs text-stone-charcoal flex items-start gap-2">
            <Info className="w-4 h-4 text-peach-deep shrink-0 mt-0.5" />
            <span>{dict.guided.confirmNotice}</span>
          </div>

          {/* Draft Insight Card */}
          <div className="p-6 rounded-2xl bg-ivory-100 border border-stone-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist">
                {dict.guided.draftLabel}
              </span>
              <button
                onClick={() => setIsEditingInsight(!isEditingInsight)}
                className="text-xs text-violet-deep hover:underline flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{dict.guided.editInsightBtn}</span>
              </button>
            </div>

            {isEditingInsight ? (
              <textarea
                rows={3}
                value={insightText}
                onChange={(e) => setInsightText(e.target.value)}
                className="w-full p-3 rounded-xl bg-ivory-50 border border-violet-muted/50 text-stone-charcoal text-base focus:outline-none focus:ring-2 focus:ring-violet-muted"
              />
            ) : (
              <blockquote className="text-lg sm:text-xl font-medium text-stone-charcoal leading-relaxed border-s-4 border-violet-muted ps-4 py-1">
                &ldquo;{insightText}&rdquo;
              </blockquote>
            )}

            {/* Confirmation Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleConfirmInsight}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isInsightConfirmed
                    ? 'bg-mint-muted text-ivory-50 border border-mint-muted'
                    : 'bg-ivory-50 text-stone-charcoal border border-stone-border hover:bg-mint-soft'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{dict.guided.confirmInsightBtn}</span>
              </button>

              <button
                onClick={handleDiscardInsight}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isInsightDiscarded
                    ? 'bg-peach-muted text-ivory-50 border border-peach-muted'
                    : 'bg-ivory-50 text-stone-mist border border-stone-border hover:bg-peach-soft'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>{dict.guided.discardInsightBtn}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrevStage}
              className="px-4 py-2 border border-stone-border rounded-xl text-sm font-medium text-stone-charcoal hover:bg-ivory-200 flex items-center gap-1.5"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{dict.guided.prevStepBtn}</span>
            </button>
            <button
              onClick={handleNextStage}
              className="px-6 py-2.5 rounded-xl bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 focus:outline-none focus:ring-2 focus:ring-violet-muted shadow-sm"
            >
              <span>{dict.guided.nextStepBtn}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 4: CHOOSE MICRO-STEP */}
      {currentStage === 'choose' && (
        <section aria-labelledby="stage-choose-title" className="space-y-6">
          <div className="space-y-1">
            <h2 id="stage-choose-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal">
              {dict.guided.chooseStepTitle}
            </h2>
            <p className="text-sm text-stone-mist">
              {dict.guided.chooseStepSubtitle}
            </p>
          </div>

          {/* Micro-Step Proposal Card */}
          <div className="p-6 rounded-2xl bg-ivory-100 border border-stone-border space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist">
              {dict.guided.stepDraftLabel}
            </span>

            <textarea
              rows={2}
              value={customStepText}
              onChange={(e) => setCustomStepText(e.target.value)}
              className="w-full p-3 rounded-xl bg-ivory-50 border border-stone-border text-stone-charcoal text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-muted"
            />

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setMicroStepChoice('accepted')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  microStepChoice === 'accepted'
                    ? 'bg-mint-muted text-ivory-50 border border-mint-muted'
                    : 'bg-ivory-50 text-stone-charcoal border border-stone-border hover:bg-mint-soft'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{dict.guided.stepAcceptedBtn}</span>
              </button>
              <button
                onClick={() => setMicroStepChoice('skipped')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  microStepChoice === 'skipped'
                    ? 'bg-stone-charcoal text-ivory-50'
                    : 'bg-ivory-50 text-stone-mist border border-stone-border hover:bg-ivory-200'
                }`}
              >
                <span>{dict.guided.stepSkippedBtn}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrevStage}
              className="px-4 py-2 border border-stone-border rounded-xl text-sm font-medium text-stone-charcoal hover:bg-ivory-200 flex items-center gap-1.5"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{dict.guided.prevStepBtn}</span>
            </button>
            <button
              onClick={handleCommitToMap}
              className="px-6 py-2.5 rounded-xl bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 focus:outline-none focus:ring-2 focus:ring-violet-muted shadow-sm"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{dict.guided.saveToMapBtn}</span>
            </button>
          </div>
        </section>
      )}

      {/* STAGE 5: REFLECT (SAVED CONFIRMATION) */}
      {currentStage === 'reflect' && (
        <section aria-labelledby="stage-reflect-title" className="text-center py-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-mint-soft border border-mint-muted/40 mx-auto flex items-center justify-center text-mint-deep">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 id="stage-reflect-title" className="text-2xl font-semibold text-stone-charcoal">
              {dict.guided.reflectStepTitle}
            </h2>
            <p className="text-sm text-stone-mist max-w-md mx-auto">
              {isInsightConfirmed
                ? dict.guided.savedNotice
                : 'Reflection finished without saving unconfirmed draft.'}
            </p>
          </div>

          {isInsightConfirmed && (
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-ivory-100 border border-stone-border text-start space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-mist">
                {dict.welcome.intents[intent].title} • Confirmed
              </span>
              <p className="font-serif italic text-stone-charcoal text-base">
                &ldquo;{insightText}&rdquo;
              </p>
              {microStepChoice === 'accepted' && (
                <div className="text-xs text-mint-deep font-medium pt-2 border-t border-ivory-300">
                  Step: {customStepText}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('map')}
              className="px-5 py-2.5 rounded-xl bg-violet-deep text-ivory-50 text-sm font-medium hover:bg-violet-deep/90 focus:outline-none focus:ring-2 focus:ring-violet-muted"
            >
              {dict.nav.journeyMap}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-stone-border bg-ivory-100 text-stone-charcoal text-sm font-medium hover:bg-ivory-200"
            >
              {dict.guided.startOverBtn}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
