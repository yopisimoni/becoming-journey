'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { EntryIntent, GuidedStage } from '@/types';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import {
  LostCompassMistArt,
  GoalMountainSunriseArt,
  StruggleWaterShelterArt,
  GrowBotanicalLeavesArt,
} from '@/components/illustrations/AtmosphereArt';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Edit3,
  Trash2,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';
import { generateDiscoveryReflection } from '@/lib/engine/aiAdapter';

export function GuidedReflectionView() {
  const {
    dict,
    currentIntent,
    setCurrentIntent,
    saveCard,
    setActiveTab,
    isRtl,
    reducedMotion,
    playSingingBowl,
    aiSettings,
  } = useApp();

  const intent: EntryIntent = currentIntent || 'lost';
  const script = dict.scripts[intent];
  const diagnostic = script.diagnostic;

  const [currentStage, setCurrentStage] = useState<GuidedStage>('express');
  const [selectedSupportId, setSelectedSupportId] = useState<string>(
    script.supportSelectors[0]?.id || ''
  );

  // Diagnostic selections
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<string>(
    diagnostic?.diagnosticOptions[0]?.id || ''
  );
  const [userText, setUserText] = useState('');
  const [isCustomTextOpen, setIsCustomTextOpen] = useState(false);

  // Deepening perspective selection
  const [selectedPerspectiveId, setSelectedPerspectiveId] = useState<string>(
    diagnostic?.deepeningOptions[0]?.id || ''
  );
  const [empatheticMirror, setEmpatheticMirror] = useState(script.explorationMirror);

  // Three Tailored Insights
  const [insightOptions, setInsightOptions] = useState<[string, string, string]>(
    diagnostic?.threeInsights || [script.draftInsight, script.draftInsight, script.draftInsight]
  );
  const [selectedInsightIndex, setSelectedInsightIndex] = useState<number>(0);
  const [isEditingInsight, setIsEditingInsight] = useState(false);
  const [insightText, setInsightText] = useState(script.draftInsight);
  const [isInsightConfirmed, setIsInsightConfirmed] = useState(false);
  const [isInsightDiscarded, setIsInsightDiscarded] = useState(false);

  // Three Micro-Steps
  const [stepOptions, setStepOptions] = useState<[string, string, string]>(
    diagnostic?.threeSteps || [script.optionalMicroStep, script.optionalMicroStep, script.optionalMicroStep]
  );
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [microStepChoice, setMicroStepChoice] = useState<'accepted' | 'skipped' | null>(null);
  const [customStepText, setCustomStepText] = useState(script.optionalMicroStep);

  const stagesList: GuidedStage[] = ['express', 'explore', 'confirm', 'choose', 'reflect'];
  const stageIndex = stagesList.indexOf(currentStage);

  // Optional AI async synthesis
  useEffect(() => {
    if (aiSettings?.enabled && currentStage === 'explore') {
      const selectedDiag = diagnostic?.diagnosticOptions.find((o) => o.id === selectedDiagnosticId);
      const selectedPersp = diagnostic?.deepeningOptions.find((p) => p.id === selectedPerspectiveId);

      generateDiscoveryReflection({
        intent: dict.welcome.intents[intent].title,
        rootFeeling: selectedDiag?.label || 'General reflection',
        userNotes: userText,
        perspective: selectedPersp?.label || 'Self-paced',
        fallbackDefaults: {
          empatheticMirror: script.explorationMirror,
          threeInsights: diagnostic?.threeInsights || [script.draftInsight, script.draftInsight, script.draftInsight],
          threeSteps: diagnostic?.threeSteps || [script.optionalMicroStep, script.optionalMicroStep, script.optionalMicroStep],
        },
        aiSettings,
      }).then((res) => {
        setEmpatheticMirror(res.empatheticMirror);
        setInsightOptions(res.threeInsights);
        setStepOptions(res.threeSteps);
        setInsightText(res.threeInsights[0]);
        setCustomStepText(res.threeSteps[0]);
      });
    }
  }, [currentStage, aiSettings, diagnostic, intent, selectedDiagnosticId, selectedPerspectiveId, userText, script, dict]);

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

  const handleSelectInsightCard = (index: number) => {
    setSelectedInsightIndex(index);
    setInsightText(insightOptions[index]);
  };

  const handleSelectStepCard = (index: number) => {
    setSelectedStepIndex(index);
    setCustomStepText(stepOptions[index]);
    setMicroStepChoice('accepted');
  };

  const handleConfirmInsight = () => {
    setIsInsightConfirmed(true);
    setIsInsightDiscarded(false);
    playSingingBowl();
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
        microStep: microStepChoice === 'accepted' ? customStepText.trim() : undefined,
        isConfirmed: true,
        status: 'confirmed',
        notes: userText.trim() ? `Reflection: ${userText.trim().substring(0, 140)}...` : undefined,
      });
      playSingingBowl();
    }
    handleNextStage();
  };

  const handleReset = () => {
    setCurrentStage('express');
    setUserText('');
    setInsightText(script.draftInsight);
    setCustomStepText(script.optionalMicroStep);
    setIsInsightConfirmed(false);
    setIsInsightDiscarded(false);
    setMicroStepChoice(null);
  };

  const springTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 120, damping: 20 };

  const renderIntentIcon = () => {
    switch (intent) {
      case 'lost':
        return <LostCompassMistArt size="sm" />;
      case 'goal':
        return <GoalMountainSunriseArt size="sm" />;
      case 'struggle':
        return <StruggleWaterShelterArt size="sm" />;
      case 'grow':
        return <GrowBotanicalLeavesArt size="sm" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Intent Header & Return Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ivory-300 dark:border-white/10">
        <div className="flex items-center gap-3">
          {renderIntentIcon()}
          <div>
            <span className="text-xs uppercase font-semibold text-stone-mist dark:text-stone-400 tracking-wider">
              {dict.welcome.intents[intent].title}
            </span>
            <span className="text-xs text-stone-mist dark:text-stone-400 ms-2">
              ({script.tone})
            </span>
          </div>
        </div>
        <button
          onClick={() => setCurrentIntent(null)}
          className="text-xs text-violet-deep dark:text-violet-soft hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{dict.welcome.question}</span>
        </button>
      </div>

      {/* 5-Step Glowing Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-stone-mist dark:text-stone-400">
          {stagesList.map((stg, idx) => {
            const isActive = stg === currentStage;
            const isCompleted = idx < stageIndex;
            return (
              <span
                key={stg}
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'text-violet-deep dark:text-violet-soft font-semibold'
                    : isCompleted
                    ? 'text-mint-deep dark:text-mint-soft'
                    : 'text-stone-mist/60 dark:text-stone-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                    isActive
                      ? 'bg-violet-deep text-ivory-50 ring-4 ring-violet-muted/20'
                      : isCompleted
                      ? 'bg-mint-soft dark:bg-mint-deep/30 text-mint-deep dark:text-mint-soft border border-mint-muted/40'
                      : 'bg-ivory-200 dark:bg-white/10 text-stone-mist'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </span>
                <span className="hidden sm:inline">{dict.stages[stg].label}</span>
              </span>
            );
          })}
        </div>
        <div className="h-1.5 w-full bg-ivory-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-deep dark:bg-violet-soft transition-all duration-300"
            style={{ width: `${((stageIndex + 1) / stagesList.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1: EXPRESS */}
        {currentStage === 'express' && (
          <motion.section
            key="stage-express"
            aria-labelledby="stage-express-title"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={springTransition}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 id="stage-express-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal dark:text-ivory-100">
                {dict.guided.expressStepTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400">
                {dict.guided.expressStepSubtitle}
              </p>
            </div>

            {/* Diagnostic Root Question & 4 Cards */}
            {diagnostic && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-charcoal dark:text-ivory-100">
                  {diagnostic.diagnosticQuestion}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {diagnostic.diagnosticOptions.map((opt) => {
                    const isSelected = selectedDiagnosticId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedDiagnosticId(opt.id);
                          if (!userText.trim()) {
                            setUserText(opt.label);
                          }
                        }}
                        className={`p-4 rounded-2xl text-start transition-all border ${
                          isSelected
                            ? 'bg-violet-soft/80 dark:bg-violet-deep/30 border-violet-muted shadow-xs ring-1 ring-violet-muted'
                            : 'bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border-stone-border dark:border-white/10 hover:bg-white/90'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs sm:text-sm text-stone-charcoal dark:text-ivory-100">
                            {opt.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-deep dark:text-violet-soft shrink-0" />}
                        </div>
                        <p className="text-[11px] text-stone-mist dark:text-stone-400 mt-1 leading-relaxed">
                          {opt.detail}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Support Selector */}
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-900/50 backdrop-blur-md border border-stone-border dark:border-white/10 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
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
                        : 'bg-ivory-50 dark:bg-white/5 text-stone-charcoal dark:text-ivory-100 border-stone-border dark:border-white/10 hover:bg-ivory-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Open Prompt & Textarea */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="user-express-input" className="block text-sm font-medium text-stone-charcoal dark:text-ivory-100">
                  {script.openPrompt}
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomTextOpen(!isCustomTextOpen)}
                  className="text-xs text-violet-deep dark:text-violet-soft hover:underline font-medium"
                >
                  {isCustomTextOpen ? 'Collapse' : dict.sanctuary.writeOwnWordsPrompt}
                </button>
              </div>

              <textarea
                id="user-express-input"
                rows={4}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder={script.openPlaceholder}
                className="w-full p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-border dark:border-white/10 text-stone-charcoal dark:text-ivory-100 placeholder-stone-mist/60 text-sm focus:outline-none focus:ring-2 focus:ring-violet-muted resize-y shadow-xs"
              />
              <div className="flex justify-between items-center text-xs text-stone-mist dark:text-stone-400">
                <span>{userText.length} {dict.guided.charCount}</span>
                <span className="italic">100% private to this browser</span>
              </div>
            </div>

            {/* Fallback Notice */}
            <div className="p-4 rounded-2xl bg-ivory-200/80 dark:bg-white/5 border border-ivory-300 dark:border-white/10 text-xs text-stone-mist dark:text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-charcoal dark:text-ivory-100">
                <Info className="w-4 h-4 text-violet-muted shrink-0" />
                <span>{dict.fallback.heading}</span>
              </div>
              <p>{dict.fallback.notice}</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 rounded-full bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <span>{dict.guided.nextStepBtn}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </motion.section>
        )}

        {/* STAGE 2: EXPLORE (Deepening & Mirroring) */}
        {currentStage === 'explore' && (
          <motion.section
            key="stage-explore"
            aria-labelledby="stage-explore-title"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={springTransition}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 id="stage-explore-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal dark:text-ivory-100">
                {dict.guided.exploreStepTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400">
                {dict.guided.exploreStepSubtitle}
              </p>
            </div>

            {/* What was shared */}
            {userText.trim() && (
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-stone-border dark:border-white/10 text-xs text-stone-mist dark:text-stone-300 space-y-1">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-charcoal dark:text-white">
                  What you shared:
                </span>
                <p className="italic text-stone-charcoal dark:text-ivory-100">&ldquo;{userText}&rdquo;</p>
              </div>
            )}

            {/* Tentative Mirror Banner */}
            <div className="p-6 rounded-3xl bg-violet-soft/60 dark:bg-violet-deep/20 border border-violet-muted/30 space-y-3 backdrop-blur-md">
              <div className="flex items-center gap-2 text-violet-deep dark:text-violet-soft text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-violet-muted" />
                <span>Tentative Mirror</span>
              </div>
              <p className="text-base sm:text-lg text-stone-charcoal dark:text-ivory-100 leading-relaxed font-serif italic">
                &ldquo;{empatheticMirror}&rdquo;
              </p>
            </div>

            {/* Deepening Perspective Question with 3 Options */}
            {diagnostic && (
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-semibold text-stone-charcoal dark:text-ivory-100">
                  {diagnostic.deepeningQuestion}
                </label>
                <div className="space-y-2">
                  {diagnostic.deepeningOptions.map((opt) => {
                    const isSelected = selectedPerspectiveId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedPerspectiveId(opt.id)}
                        className={`w-full p-3.5 rounded-2xl text-start transition-all border flex items-center justify-between text-xs sm:text-sm ${
                          isSelected
                            ? 'bg-violet-soft/80 dark:bg-violet-deep/30 border-violet-muted text-violet-deep dark:text-violet-soft font-semibold shadow-xs'
                            : 'bg-white/70 dark:bg-stone-900/50 border-stone-border dark:border-white/10 text-stone-charcoal dark:text-ivory-100 hover:bg-white/90'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-violet-deep dark:text-violet-soft shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handlePrevStage}
                className="px-4 py-2 border border-stone-border dark:border-white/10 rounded-full text-sm font-medium text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 flex items-center gap-1.5"
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{dict.guided.prevStepBtn}</span>
              </button>
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 rounded-full bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <span>{dict.guided.nextStepBtn}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </motion.section>
        )}

        {/* STAGE 3: CONFIRM INSIGHT (3 Tailored Options) */}
        {currentStage === 'confirm' && (
          <motion.section
            key="stage-confirm"
            aria-labelledby="stage-confirm-title"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={springTransition}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 id="stage-confirm-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal dark:text-ivory-100">
                {dict.guided.confirmStepTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400">
                {dict.guided.confirmStepSubtitle}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-peach-soft/60 dark:bg-peach-deep/20 border border-peach-muted/30 text-xs text-stone-charcoal dark:text-ivory-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-peach-deep shrink-0 mt-0.5" />
              <span>{dict.guided.confirmNotice}</span>
            </div>

            {/* 3 Tailored Insight Cards Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
                {dict.sanctuary.pickInsightHeading}
              </h3>
              <div className="space-y-3">
                {insightOptions.map((text, idx) => {
                  const isSelected = selectedInsightIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectInsightCard(idx)}
                      className={`w-full p-4 rounded-2xl text-start transition-all border ${
                        isSelected
                          ? 'bg-violet-soft/70 dark:bg-violet-deep/30 border-violet-muted shadow-sm ring-1 ring-violet-muted'
                          : 'bg-white/70 dark:bg-stone-900/50 border-stone-border dark:border-white/10 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <blockquote className="font-serif italic text-sm sm:text-base text-stone-charcoal dark:text-ivory-100 leading-relaxed">
                          &ldquo;{text}&rdquo;
                        </blockquote>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-violet-deep dark:text-violet-soft shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Selected Insight Detail / Edit Box */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-border dark:border-white/10 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
                  {dict.guided.editableLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingInsight(!isEditingInsight)}
                  className="text-xs text-violet-deep dark:text-violet-soft hover:underline flex items-center gap-1 font-medium"
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
                  className="w-full p-3 rounded-2xl bg-ivory-50 dark:bg-stone-800 border border-violet-muted text-stone-charcoal dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-violet-muted"
                />
              ) : (
                <blockquote className="text-lg sm:text-xl font-medium text-stone-charcoal dark:text-ivory-100 leading-relaxed border-s-4 border-violet-muted ps-4 py-1">
                  &ldquo;{insightText}&rdquo;
                </blockquote>
              )}

              {/* Confirmation Controls */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={handleConfirmInsight}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                    isInsightConfirmed
                      ? 'bg-mint-muted text-ivory-50 border border-mint-muted ring-2 ring-mint-muted/30'
                      : 'bg-white dark:bg-white/10 text-stone-charcoal dark:text-ivory-100 border border-stone-border dark:border-white/10 hover:bg-mint-soft'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{dict.guided.confirmInsightBtn}</span>
                </button>

                <button
                  onClick={handleDiscardInsight}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
                    isInsightDiscarded
                      ? 'bg-peach-muted text-ivory-50 border border-peach-muted'
                      : 'bg-white dark:bg-white/10 text-stone-mist border border-stone-border dark:border-white/10 hover:bg-peach-soft'
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
                className="px-4 py-2 border border-stone-border dark:border-white/10 rounded-full text-sm font-medium text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 flex items-center gap-1.5"
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{dict.guided.prevStepBtn}</span>
              </button>
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 rounded-full bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <span>{dict.guided.nextStepBtn}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </motion.section>
        )}

        {/* STAGE 4: CHOOSE MICRO-STEP (3 Gentle Options) */}
        {currentStage === 'choose' && (
          <motion.section
            key="stage-choose"
            aria-labelledby="stage-choose-title"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={springTransition}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 id="stage-choose-title" className="text-xl sm:text-2xl font-semibold text-stone-charcoal dark:text-ivory-100">
                {dict.guided.chooseStepTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400">
                {dict.guided.chooseStepSubtitle}
              </p>
            </div>

            {/* 3 Step Options Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
                {dict.sanctuary.pickStepHeading}
              </h3>
              <div className="space-y-2.5">
                {stepOptions.map((step, idx) => {
                  const isSelected = selectedStepIndex === idx && microStepChoice === 'accepted';
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectStepCard(idx)}
                      className={`w-full p-4 rounded-2xl text-start transition-all border flex items-center justify-between text-xs sm:text-sm ${
                        isSelected
                          ? 'bg-mint-soft/80 dark:bg-mint-deep/30 border-mint-muted text-mint-deep dark:text-mint-soft font-semibold shadow-xs ring-1 ring-mint-muted'
                          : 'bg-white/70 dark:bg-stone-900/50 border-stone-border dark:border-white/10 text-stone-charcoal dark:text-ivory-100 hover:bg-white/90'
                      }`}
                    >
                      <span>{step}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-mint-deep dark:text-mint-soft shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro-Step Custom Box */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-border dark:border-white/10 space-y-3 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
                {dict.guided.stepDraftLabel}
              </span>

              <textarea
                rows={2}
                value={customStepText}
                onChange={(e) => {
                  setCustomStepText(e.target.value);
                  setMicroStepChoice('accepted');
                }}
                className="w-full p-3 rounded-2xl bg-ivory-50 dark:bg-stone-800 border border-stone-border dark:border-white/10 text-stone-charcoal dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-muted"
                placeholder={dict.sanctuary.customStepPlaceholder}
              />

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setMicroStepChoice('accepted')}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    microStepChoice === 'accepted'
                      ? 'bg-mint-muted text-ivory-50 border border-mint-muted shadow-xs'
                      : 'bg-white dark:bg-white/10 text-stone-charcoal dark:text-ivory-100 border border-stone-border dark:border-white/10 hover:bg-mint-soft'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{dict.guided.stepAcceptedBtn}</span>
                </button>
                <button
                  onClick={() => setMicroStepChoice('skipped')}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    microStepChoice === 'skipped'
                      ? 'bg-stone-charcoal text-ivory-50'
                      : 'bg-white dark:bg-white/10 text-stone-mist border border-stone-border dark:border-white/10 hover:bg-ivory-200'
                  }`}
                >
                  <span>{dict.guided.stepSkippedBtn}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handlePrevStage}
                className="px-4 py-2 border border-stone-border dark:border-white/10 rounded-full text-sm font-medium text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200 flex items-center gap-1.5"
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{dict.guided.prevStepBtn}</span>
              </button>
              <button
                onClick={handleCommitToMap}
                className="px-6 py-2.5 rounded-full bg-violet-deep text-ivory-50 font-medium text-sm flex items-center gap-2 hover:bg-violet-deep/90 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{dict.guided.saveToMapBtn}</span>
              </button>
            </div>
          </motion.section>
        )}

        {/* STAGE 5: REFLECT (SAVED CONFIRMATION) */}
        {currentStage === 'reflect' && (
          <motion.section
            key="stage-reflect"
            aria-labelledby="stage-reflect-title"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            transition={springTransition}
            className="text-center py-8 space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-mint-soft dark:bg-mint-deep/30 border border-mint-muted/40 mx-auto flex items-center justify-center text-mint-deep dark:text-mint-soft shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 id="stage-reflect-title" className="text-2xl font-semibold text-stone-charcoal dark:text-ivory-100">
                {dict.guided.reflectStepTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-400 max-w-md mx-auto">
                {isInsightConfirmed
                  ? dict.guided.savedNotice
                  : 'Reflection finished without saving unconfirmed draft.'}
              </p>
            </div>

            {isInsightConfirmed && (
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-border dark:border-white/10 text-start space-y-3 shadow-md">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-mist dark:text-stone-400">
                  {dict.welcome.intents[intent].title} • Confirmed
                </span>
                <p className="font-serif italic text-stone-charcoal dark:text-ivory-100 text-base">
                  &ldquo;{insightText}&rdquo;
                </p>
                {microStepChoice === 'accepted' && (
                  <div className="text-xs text-mint-deep dark:text-mint-soft font-medium pt-2 border-t border-ivory-200 dark:border-white/10">
                    Step: {customStepText}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setActiveTab('map')}
                className="px-6 py-2.5 rounded-full bg-violet-deep text-ivory-50 text-sm font-medium hover:bg-violet-deep/90 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-muted"
              >
                {dict.nav.journeyMap}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full border border-stone-border dark:border-white/10 bg-ivory-100 dark:bg-white/5 text-stone-charcoal dark:text-ivory-100 text-sm font-medium hover:bg-ivory-200"
              >
                {dict.guided.startOverBtn}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
