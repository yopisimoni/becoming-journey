'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { BreathingTechniqueId, EchoStory } from '@/types';
import { soundEngine } from '@/lib/audio/soundEngine';
import { ECHOES_STORIES, NATURE_CANVAS_SCENES } from '@/lib/stories/echoesData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  Sparkles,
  CheckCircle2,
  Bell,
  BellOff,
  RotateCcw,
  Play,
  Pause,
  ArrowLeft,
  Smile,
  Shield,
  Hand,
  Eye,
  BookOpen,
  Image as ImageIcon,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react';

interface BreathingConfig {
  id: BreathingTechniqueId;
  name: string;
  tagline: string;
  pattern: { phase: 'inhale' | 'hold' | 'exhale' | 'rest'; duration: number }[];
}

export function JustListenView() {
  const { dict, currentIntent, setActiveMode, reducedMotion, isRtl, addEvolutionXp, playSingingBowl } = useApp();
  const intent = currentIntent || 'lost';
  const script = dict.scripts[intent];

  // Echoes Stories State
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<EchoStory>(ECHOES_STORIES[0]);

  // Contemplation Nature Canvas State
  const [isCanvasActive, setIsCanvasActive] = useState(false);
  const [canvasSceneIndex, setCanvasSceneIndex] = useState(0);

  // Techniques
  const techniques: BreathingConfig[] = [
    {
      id: '478',
      name: dict.breathing?.t478Name || '4-7-8 Deep Calm',
      tagline: dict.breathing?.t478Tagline || 'Inhale 4s • Hold 7s • Exhale 8s (Nervous System Reset)',
      pattern: [
        { phase: 'inhale', duration: 4 },
        { phase: 'hold', duration: 7 },
        { phase: 'exhale', duration: 8 },
      ],
    },
    {
      id: 'box',
      name: dict.breathing?.tBoxName || '4-4-4-4 Box Breathing',
      tagline: dict.breathing?.tBoxTagline || 'Inhale 4s • Hold 4s • Exhale 4s • Rest 4s (Mental Focus)',
      pattern: [
        { phase: 'inhale', duration: 4 },
        { phase: 'hold', duration: 4 },
        { phase: 'exhale', duration: 4 },
        { phase: 'rest', duration: 4 },
      ],
    },
    {
      id: 'coherent',
      name: dict.breathing?.tCoherentName || '5-5 Coherent Balance',
      tagline: dict.breathing?.tCoherentTagline || 'Inhale 5s • Exhale 5s (Heart-Brain Resonance)',
      pattern: [
        { phase: 'inhale', duration: 5 },
        { phase: 'exhale', duration: 5 },
      ],
    },
  ];

  const [techniqueId, setTechniqueId] = useState<BreathingTechniqueId>('478');
  const activeTechnique = techniques.find((t) => t.id === techniqueId) || techniques[0];

  const [patternIndex, setPatternIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(activeTechnique.pattern[0].duration);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [chimeEnabled, setChimeEnabled] = useState(true);

  // Somatic Checklist items
  const [unclenched, setUnclenched] = useState<Record<string, boolean>>({});

  const currentStep = activeTechnique.pattern[patternIndex] || activeTechnique.pattern[0];

  // Rotate nature scenes every 8 seconds when canvas is active
  useEffect(() => {
    if (!isCanvasActive) return;
    const interval = setInterval(() => {
      setCanvasSceneIndex((prev) => (prev + 1) % NATURE_CANVAS_SCENES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isCanvasActive]);

  // Reset pattern when switching technique
  const handleSelectTechnique = (id: BreathingTechniqueId) => {
    setTechniqueId(id);
    const tech = techniques.find((t) => t.id === id) || techniques[0];
    setPatternIndex(0);
    setSecondsRemaining(tech.pattern[0].duration);
  };

  // Timer loop
  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance phase
          setPatternIndex((idx) => {
            const nextIdx = (idx + 1) % activeTechnique.pattern.length;
            if (nextIdx === 0) {
              setCompletedCycles((c) => c + 1);
            }
            const nextPhase = activeTechnique.pattern[nextIdx];
            if (chimeEnabled) {
              soundEngine.playBreathBell(nextPhase.phase);
            }
            return nextIdx;
          });
          const nextDuration = activeTechnique.pattern[(patternIndex + 1) % activeTechnique.pattern.length].duration;
          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, patternIndex, activeTechnique, chimeEnabled, reducedMotion]);

  // Phase labels
  const getPhaseLabel = (phase: 'inhale' | 'hold' | 'exhale' | 'rest') => {
    switch (phase) {
      case 'inhale':
        return dict.breathing?.inhale || dict.listen.inBreath || 'Breathe In';
      case 'hold':
        return dict.breathing?.hold || dict.listen.holdBreath || 'Hold Gently';
      case 'exhale':
        return dict.breathing?.exhale || dict.listen.outBreath || 'Breathe Out';
      case 'rest':
        return dict.breathing?.rest || 'Rest & Settle';
    }
  };

  // Visualizer scale & opacity
  const getOrbState = () => {
    switch (currentStep.phase) {
      case 'inhale':
        return { scale: 1.25, opacity: 1, filterGlow: '0 0 45px rgba(99, 102, 241, 0.45)' };
      case 'hold':
        return { scale: 1.25, opacity: 0.95, filterGlow: '0 0 55px rgba(168, 85, 247, 0.45)' };
      case 'exhale':
        return { scale: 0.88, opacity: 0.75, filterGlow: '0 0 20px rgba(99, 102, 241, 0.2)' };
      case 'rest':
        return { scale: 0.88, opacity: 0.7, filterGlow: '0 0 15px rgba(148, 163, 184, 0.2)' };
    }
  };

  const orbState = getOrbState();
  const currentTotal = currentStep.duration;
  const progressRatio = Math.max(0, Math.min(1, (currentTotal - secondsRemaining + 1) / currentTotal));
  const strokeDashoffset = 283 * (1 - progressRatio);

  const somaticSteps = [
    { id: 'jaw', icon: Smile, label: dict.breathing?.unclenchJaw || '1. Unclench your jaw & relax tongue' },
    { id: 'shoulders', icon: Shield, label: dict.breathing?.dropShoulders || '2. Drop your shoulders away from ears' },
    { id: 'eyes', icon: Eye, label: dict.breathing?.softenEyes || '3. Soften your gaze or close your eyes' },
    { id: 'hands', icon: Hand, label: dict.breathing?.openHands || '4. Rest hands open and unclenched' },
  ];

  const toggleSomatic = (id: string) => {
    setUnclenched((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveMode('guided')}
          className="px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 shadow-xs transition-colors"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{dict.sanctuary.cardBack}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Nature Canvas Toggle */}
          <button
            type="button"
            onClick={() => setIsCanvasActive(!isCanvasActive)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              isCanvasActive
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isCanvasActive ? 'Close Canvas' : 'Nature Canvas'}</span>
          </button>

          {/* Echoes Stories Toggle */}
          <button
            type="button"
            onClick={() => setIsStoriesOpen(!isStoriesOpen)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              isStoriesOpen
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Echoes</span>
          </button>

          <button
            type="button"
            onClick={() => setChimeEnabled(!chimeEnabled)}
            aria-label="Toggle breath chime"
            className={`p-2 rounded-full border text-xs font-semibold transition-colors ${
              chimeEnabled
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            {chimeEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setCompletedCycles(0);
              setPatternIndex(0);
              setSecondsRemaining(activeTechnique.pattern[0].duration);
            }}
            aria-label="Reset breath cycles"
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-1 border border-indigo-200 dark:border-indigo-800 shadow-xs">
          <Wind className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
          {dict.breathing?.studioTitle || 'Interactive Breathing & Relaxation Studio'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          {dict.breathing?.studioSubtitle || 'A tranquil somatic sanctuary to regulate your nervous system and return to presence.'}
        </p>
      </div>

      {/* Contemplation Nature Canvas Box */}
      {isCanvasActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${NATURE_CANVAS_SCENES[canvasSceneIndex].gradient} border border-slate-700/60 shadow-2xl space-y-4 text-center transition-all duration-1000`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
              Contemplation Scene {canvasSceneIndex + 1}/{NATURE_CANVAS_SCENES.length}
            </span>
            <div className="flex items-center gap-1.5">
              {NATURE_CANVAS_SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCanvasSceneIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    canvasSceneIndex === idx ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Switch to ${s.name}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {NATURE_CANVAS_SCENES[canvasSceneIndex].name}
            </h3>
            <p className="text-xs text-slate-300 italic font-serif">
              {NATURE_CANVAS_SCENES[canvasSceneIndex].tagline}
            </p>
          </div>
        </motion.div>
      )}

      {/* Echoes of Shared Humanity Stories Drawer */}
      {isStoriesOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-4 h-4" />
                <span>Echoes of Shared Humanity • Wisdom Parables</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                Stories of Patience, Grace & Overcoming
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsStoriesOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Story Selector Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ECHOES_STORIES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStory(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedStory.id === s.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Active Story Card */}
          <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {selectedStory.theme} • {selectedStory.authorOrOrigin}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white">
                {selectedStory.title}
              </h3>
              <p className="text-xs text-slate-500 italic font-serif">
                {selectedStory.subtitle}
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
              {selectedStory.narrative.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Sanctuary Takeaway
              </span>
              <p className="text-xs font-serif italic text-indigo-950 dark:text-indigo-200 font-medium">
                &ldquo;{selectedStory.takeaway}&rdquo;
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  playSingingBowl();
                  addEvolutionXp(15, `Reflected on: ${selectedStory.title}`);
                  setIsStoriesOpen(false);
                }}
                className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
              >
                Reflect & Close (+15 XP)
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selectable Techniques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {techniques.map((tech) => {
          const isSelected = techniqueId === tech.id;
          return (
            <button
              key={tech.id}
              type="button"
              onClick={() => handleSelectTechnique(tech.id)}
              className={`p-3.5 rounded-2xl border text-start transition-all ${
                isSelected
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500 shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 dark:text-white">{tech.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {tech.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Central Hypnotic Breathing Visualizer */}
      <div className="py-6 flex flex-col items-center justify-center space-y-6">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Circular SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-slate-200/60 dark:text-slate-800/80"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Expanding Multi-Layer Petal Rings */}
          <motion.div
            animate={reducedMotion ? {} : { scale: orbState.scale, opacity: orbState.opacity }}
            transition={{ duration: currentStep.duration, ease: 'easeInOut' }}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/25 to-pink-500/20 dark:from-indigo-600/30 dark:via-purple-600/30 dark:to-pink-600/20 backdrop-blur-md border border-indigo-300/40 dark:border-indigo-500/30 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: orbState.filterGlow }}
          >
            {/* Center Core */}
            <div className="w-40 h-40 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center p-3 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {getPhaseLabel(currentStep.phase)}
              </span>
              <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {secondsRemaining}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {dict.breathing?.secondsLabel || 'seconds'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Play/Pause & Cycle Metrics */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? dict.breathing?.pause || 'Pause' : dict.breathing?.resume || 'Resume'}</span>
          </button>

          <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {dict.breathing?.cyclesCompleted || 'Cycles'}: <span className="font-bold text-indigo-600 dark:text-indigo-400">{completedCycles}</span>
          </div>
        </div>
      </div>

      {/* Somatic Relax Checklist */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {dict.breathing?.somaticTitle || 'Interactive Somatic Tension Release'}
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            {Object.values(unclenched).filter(Boolean).length}/4 {dict.breathing?.released || 'released'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {dict.breathing?.somaticSubtitle || 'Tap each card as you consciously release that physical point of tension.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {somaticSteps.map((step) => {
            const isDone = !!unclenched[step.id];
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => toggleSomatic(step.id)}
                className={`p-3.5 rounded-2xl border text-start flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-xl ${isDone ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">{step.label}</span>
                </div>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ms-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grounding Message */}
      <div className="p-6 rounded-3xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <blockquote className="text-base sm:text-lg font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
          &ldquo;{script.listenGrounding}&rdquo;
        </blockquote>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {dict.listen.calmMessage}
        </p>
      </div>
    </div>
  );
}
