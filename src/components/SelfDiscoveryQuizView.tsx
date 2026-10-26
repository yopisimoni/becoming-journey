'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  QuizLength,
  QuizQuestion,
  ArchetypeId,
  QuizResult,
  FrameworkId,
  GenericQuizQuestion,
  GenericQuizResult,
} from '@/types';
import {
  SCIENTIFIC_FRAMEWORKS,
  BIG5_QUESTIONS,
  scoreBig5,
  LOCUS_QUESTIONS,
  scoreLocus,
  EQ_SQ_QUESTIONS,
  scoreEqSq,
  MBTI_QUESTIONS,
  scoreMbti,
  TRUE_COLOURS_QUESTIONS,
  scoreTrueColours,
} from '@/lib/frameworks/scientificQuizzes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookmarkPlus,
  RefreshCw,
  Briefcase,
  Heart,
  Feather,
  Flame,
  BatteryCharging,
  BatteryWarning,
  Download,
  BookOpen,
  Layers,
  Award,
} from 'lucide-react';

// Comprehensive 40-Question Bank across Work, Life, and Soul
export const QUIZ_QUESTION_BANK: QuizQuestion[] = [
  // --- 1. WORK & PURPOSE (14 Questions) ---
  {
    id: 'w1',
    dimension: 'work',
    question: 'When starting a demanding new project, what gives you the greatest sense of calm confidence?',
    options: [
      { id: 'w1_a', label: 'Mapping out a clean system, structure, and silent milestones', archetypeScore: 'architect' },
      { id: 'w1_b', label: 'Seeing the transformative big-picture impact and long-term horizon', archetypeScore: 'visionary' },
      { id: 'w1_c', label: 'Connecting deeply with the human stories and creative essence', archetypeScore: 'creator' },
      { id: 'w1_d', label: 'Diving in with open curiosity, learning as unexpected challenges arise', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w2',
    dimension: 'work',
    question: 'How do you prefer to handle high-friction workplace deadlines?',
    options: [
      { id: 'w2_a', label: 'Ruthlessly prioritizing the critical path and eliminating noise', archetypeScore: 'architect' },
      { id: 'w2_b', label: 'Refocusing everyone on the core mission and inspiring collective calm', archetypeScore: 'visionary' },
      { id: 'w2_c', label: 'Carving out protected quiet time to pour deep care into the craft', archetypeScore: 'creator' },
      { id: 'w2_d', label: 'Staying fluid and adapting to whatever changes moment to moment', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w3',
    dimension: 'work',
    question: 'What kind of work environment makes you feel genuinely fulfilled at the end of the day?',
    options: [
      { id: 'w3_a', label: 'An orderly, thoughtful sanctuary with minimal chaotic interruptions', archetypeScore: 'architect' },
      { id: 'w3_b', label: 'A space of expansive freedom where bold strategic ideas can flourish', archetypeScore: 'visionary' },
      { id: 'w3_c', label: 'An environment rich in creative expression, beauty, and empathy', archetypeScore: 'creator' },
      { id: 'w3_d', label: 'A dynamic landscape where I am constantly learning something new', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w4',
    dimension: 'work',
    question: 'When taking leadership or initiative, your natural approach is:',
    options: [
      { id: 'w4_a', label: 'Leading by quiet example, reliable craftsmanship, and clarity', archetypeScore: 'architect' },
      { id: 'w4_b', label: 'Painting a vivid future that gives others courage and purpose', archetypeScore: 'visionary' },
      { id: 'w4_c', label: 'Listening deeply and uplifting individual strengths with warmth', archetypeScore: 'creator' },
      { id: 'w4_d', label: 'Encouraging experimentation, exploration, and questioning dogma', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w5',
    dimension: 'work',
    question: 'What is your primary boundary against work burnout?',
    options: [
      { id: 'w5_a', label: 'Strictly compartmentalizing hours and defending deep-focus blocks', archetypeScore: 'architect' },
      { id: 'w5_b', label: 'Stepping back to realign effort with what actually matters long-term', archetypeScore: 'visionary' },
      { id: 'w5_c', label: 'Honoring my emotional reservoir and saying no to toxic urgency', archetypeScore: 'creator' },
      { id: 'w5_d', label: 'Taking spontaneous breaks to reset my mind and seek fresh air', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w6',
    dimension: 'work',
    question: 'When receiving critical feedback on your work:',
    options: [
      { id: 'w6_a', label: 'I analyze the objective data to refine the underlying system', archetypeScore: 'architect' },
      { id: 'w6_b', label: 'I assess whether it shifts the overarching vision or trajectory', archetypeScore: 'visionary' },
      { id: 'w6_c', label: 'I reflect on the intent and care invested in the collaboration', archetypeScore: 'creator' },
      { id: 'w6_d', label: 'I treat it as raw fuel for personal reinvention and growth', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w7',
    dimension: 'work',
    question: 'What drain feels most exhausting in a career context?',
    options: [
      { id: 'w7_a', label: 'Constant context-switching and disorganization without purpose', archetypeScore: 'architect' },
      { id: 'w7_b', label: 'Petty bureaucracy that suffocates visionary potential', archetypeScore: 'visionary' },
      { id: 'w7_c', label: 'Cold, transactional environments devoid of heart and appreciation', archetypeScore: 'creator' },
      { id: 'w7_d', label: 'Monotonous repetition with zero room for personal growth', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w8',
    dimension: 'work',
    question: 'If you had unlimited resources for a year, your chosen project would be:',
    options: [
      { id: 'w8_a', label: 'Building an enduring, beautifully designed tool or reference system', archetypeScore: 'architect' },
      { id: 'w8_b', label: 'Launching an ambitious venture solving a systemic societal challenge', archetypeScore: 'visionary' },
      { id: 'w8_c', label: 'Authoring a profound work of art, writing, or human community', archetypeScore: 'creator' },
      { id: 'w8_d', label: 'Traveling the globe exploring forgotten cultures and timeless philosophies', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w9',
    dimension: 'work',
    question: 'In moments of professional uncertainty, your anchor is:',
    options: [
      { id: 'w9_a', label: 'My disciplined daily habits and proven technical competencies', archetypeScore: 'architect' },
      { id: 'w9_b', label: 'Unshakable conviction in the eventual arrival of the destination', archetypeScore: 'visionary' },
      { id: 'w9_c', label: 'The genuine relationships and kindness I cultivate with people', archetypeScore: 'creator' },
      { id: 'w9_d', label: 'Trust in my resilience to adapt to whatever road unfolds', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w10',
    dimension: 'work',
    question: 'How do you measure true professional success?',
    options: [
      { id: 'w10_a', label: 'Mastery, elegant craftsmanship, and peace of mind', archetypeScore: 'architect' },
      { id: 'w10_b', label: 'Leaving a transformative, lasting legacy for generations', archetypeScore: 'visionary' },
      { id: 'w10_c', label: 'Touching lives with authenticity and creating meaningful connection', archetypeScore: 'creator' },
      { id: 'w10_d', label: 'Living with complete intellectual and geographical sovereignty', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w11',
    dimension: 'work',
    question: 'When an unexpected crisis hits a team project:',
    options: [
      { id: 'w11_a', label: 'I methodically deconstruct the breakdown into solvable parts', archetypeScore: 'architect' },
      { id: 'w11_b', label: 'I remind everyone of our compass and identify the strategic pivot', archetypeScore: 'visionary' },
      { id: 'w11_c', label: 'I support colleagues emotionally so panic does not overwhelm us', archetypeScore: 'creator' },
      { id: 'w11_d', label: 'I embrace the chaos as an opening to test bold new ideas', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w12',
    dimension: 'work',
    question: 'Your relationship with ambition is best described as:',
    options: [
      { id: 'w12_a', label: 'Focused on precision, continuous refinement, and quality', archetypeScore: 'architect' },
      { id: 'w12_b', label: 'Expansive, transformative, and drawn toward grand horizons', archetypeScore: 'visionary' },
      { id: 'w12_c', label: 'Rooted in purpose, empathy, and meaningful human expression', archetypeScore: 'creator' },
      { id: 'w12_d', label: 'An evolving journey of curiosity rather than a rigid ladder', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w13',
    dimension: 'work',
    question: 'Which daily work habit do you cherish most?',
    options: [
      { id: 'w13_a', label: 'Organizing my task deck at morning sunrise before opening mail', archetypeScore: 'architect' },
      { id: 'w13_b', label: 'Quiet journaling on multi-year dreams and big questions', archetypeScore: 'visionary' },
      { id: 'w13_c', label: 'Free-form sketching, drafting, and intuitive creation', archetypeScore: 'creator' },
      { id: 'w13_d', label: 'Reading wide multidisciplinary books outside my current field', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'w14',
    dimension: 'work',
    question: 'When you achieve a major milestone, your first impulse is:',
    options: [
      { id: 'w14_a', label: 'Silently document what worked well and tidy the workspace', archetypeScore: 'architect' },
      { id: 'w14_b', label: 'Look ahead toward the next mountain peak on the horizon', archetypeScore: 'visionary' },
      { id: 'w14_c', label: 'Celebrate with the people who shared the human journey with me', archetypeScore: 'creator' },
      { id: 'w14_d', label: 'Reflect on how much I personally evolved along the way', archetypeScore: 'seeker' },
    ],
  },

  // --- 2. LIFE & RELATIONSHIPS (13 Questions) ---
  {
    id: 'l1',
    dimension: 'life',
    question: 'How does your social battery naturally recharge after intense social gatherings?',
    options: [
      { id: 'l1_a', label: 'In deep solitary stillness with a quiet book or organized sanctuary', archetypeScore: 'architect' },
      { id: 'l1_b', label: 'Talking late into the night with one visionary companion about life', archetypeScore: 'visionary' },
      { id: 'l1_c', label: 'Listening to soothing music or creating something gentle and cozy', archetypeScore: 'creator' },
      { id: 'l1_d', label: 'Taking a long solitary walk through nature or wandering somewhere new', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l2',
    dimension: 'life',
    question: 'When a close friend is going through difficult heartbreak or grief:',
    options: [
      { id: 'l2_a', label: 'I offer calm, steady, reliable practical help to lighten their load', archetypeScore: 'architect' },
      { id: 'l2_b', label: 'I help them see that this valley will eventually lead to renewal', archetypeScore: 'visionary' },
      { id: 'l2_c', label: 'I hold space silently, validating every tear without rush or judgment', archetypeScore: 'creator' },
      { id: 'l2_d', label: 'I invite them into gentle gentle motion, fresh perspectives, and time outdoors', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l3',
    dimension: 'life',
    question: 'When making major personal life decisions (moving, changing paths):',
    options: [
      { id: 'l3_a', label: 'I deliberate with careful logic, assessing stability and foundation', archetypeScore: 'architect' },
      { id: 'l3_b', label: 'I follow the path that most expands my ultimate calling and horizons', archetypeScore: 'visionary' },
      { id: 'l3_c', label: 'I check in with my deepest intuitive feelings and peace of heart', archetypeScore: 'creator' },
      { id: 'l3_d', label: 'I welcome the leap into the unknown with curiosity and adventure', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l4',
    dimension: 'life',
    question: 'What quality do you prize most in your closest lifelong friendships?',
    options: [
      { id: 'l4_a', label: 'Reliability, discretion, and quiet consistency over decades', archetypeScore: 'architect' },
      { id: 'l4_b', label: 'Mutual inspiration, high standards, and shared growth', archetypeScore: 'visionary' },
      { id: 'l4_c', label: 'Vulnerability, emotional safety, and profound empathy', archetypeScore: 'creator' },
      { id: 'l4_d', label: 'Freedom to be completely eccentric and authentic together', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l5',
    dimension: 'life',
    question: 'In conflicts or disagreements with someone you love:',
    options: [
      { id: 'l5_a', label: 'I step back to cool off and separate objective facts from noise', archetypeScore: 'architect' },
      { id: 'l5_b', label: 'I focus on what our shared bond stands for in the long run', archetypeScore: 'visionary' },
      { id: 'l5_c', label: 'I focus on addressing unspoken hurt feelings and repairing trust', archetypeScore: 'creator' },
      { id: 'l5_d', label: 'I try to understand their worldview and discover where we can grow', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l6',
    dimension: 'life',
    question: 'Your ideal weekend morning looks like:',
    options: [
      { id: 'l6_a', label: 'A spotless warm room, handcrafted coffee, and uninterrupted quiet', archetypeScore: 'architect' },
      { id: 'l6_b', label: 'Waking up energized, planning exciting journeys, and writing', archetypeScore: 'visionary' },
      { id: 'l6_c', label: 'Lingering in bed with soft daylight, gratitude, and music', archetypeScore: 'creator' },
      { id: 'l6_d', label: 'Stepping outside with zero itinerary and exploring wherever calls', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l7',
    dimension: 'life',
    question: 'How do you handle unexpected sudden disruptions to your daily routine?',
    options: [
      { id: 'l7_a', label: 'I quickly rearrange my checklist so balance is restored cleanly', archetypeScore: 'architect' },
      { id: 'l7_b', label: 'I immediately assess if this disruption is a disguised opportunity', archetypeScore: 'visionary' },
      { id: 'l7_c', label: 'I take a deep breath to calm my emotional response first', archetypeScore: 'creator' },
      { id: 'l7_d', label: 'I go with the flow easily—routine is only a suggestion anyway', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l8',
    dimension: 'life',
    question: 'What kind of conversations leave you feeling deeply alive?',
    options: [
      { id: 'l8_a', label: 'Substantive discussions on how the world works and deep craft', archetypeScore: 'architect' },
      { id: 'l8_b', label: 'Bold talks about what humanity will become in 50 years', archetypeScore: 'visionary' },
      { id: 'l8_c', label: 'Intimate sharing of true vulnerability, love, and life lessons', archetypeScore: 'creator' },
      { id: 'l8_d', label: 'Philosophical debates on consciousness, mystery, and existence', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l9',
    dimension: 'life',
    question: 'When feeling overwhelmed by life obligations, what is your reset ritual?',
    options: [
      { id: 'l9_a', label: 'Decluttering my physical space until everything is peaceful', archetypeScore: 'architect' },
      { id: 'l9_b', label: 'Re-evaluating my commitments and cutting 20% that lacks impact', archetypeScore: 'visionary' },
      { id: 'l9_c', label: 'Warm bath, soft lighting, and gentle self-compassion', archetypeScore: 'creator' },
      { id: 'l9_d', label: 'Going into the mountains or by the ocean to feel my smallness', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l10',
    dimension: 'life',
    question: 'How do you approach finances and material possessions?',
    options: [
      { id: 'l10_a', label: 'Prudent stewardship, minimalism, and long-term financial calm', archetypeScore: 'architect' },
      { id: 'l10_b', label: 'Viewing capital as a leverage tool to manifest transformative freedom', archetypeScore: 'visionary' },
      { id: 'l10_c', label: 'Investing in comfort, beauty, memories, and generosity with loved ones', archetypeScore: 'creator' },
      { id: 'l10_d', label: 'Prioritizing experiences and life mobility over collecting things', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l11',
    dimension: 'life',
    question: 'In romantic or partnership bonds, what matters most?',
    options: [
      { id: 'l11_a', label: 'Deep mutual respect, emotional stability, and loyal alignment', archetypeScore: 'architect' },
      { id: 'l11_b', label: 'Walking side by side as growth partners pushing each other to shine', archetypeScore: 'visionary' },
      { id: 'l11_c', label: 'Unconditional warmth, poetic tenderness, and shared laughter', archetypeScore: 'creator' },
      { id: 'l11_d', label: 'Shared curiosity, exploration, and giving each other wings', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l12',
    dimension: 'life',
    question: 'When celebrating personal milestones, what do you cherish most?',
    options: [
      { id: 'l12_a', label: 'A quiet, unpretentious dinner in a meaningful cozy location', archetypeScore: 'architect' },
      { id: 'l12_b', label: 'Sharing gratitude with everyone who made the impossible happen', archetypeScore: 'visionary' },
      { id: 'l12_c', label: 'Writing a personal letter or keepsake capturing this chapter of life', archetypeScore: 'creator' },
      { id: 'l12_d', label: 'Embarking on a pilgrimage, journey, or new challenge to mark the shift', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 'l13',
    dimension: 'life',
    question: 'What is your core rule for maintaining healthy interpersonal boundaries?',
    options: [
      { id: 'l13_a', label: 'Clear expectations stated calmly before resentment can fester', archetypeScore: 'architect' },
      { id: 'l13_b', label: 'Aligning only with people who honor mutual growth and integrity', archetypeScore: 'visionary' },
      { id: 'l13_c', label: 'Protecting my peace from emotional dumping without being cruel', archetypeScore: 'creator' },
      { id: 'l13_d', label: 'Remembering that saying no to others is saying yes to my path', archetypeScore: 'seeker' },
    ],
  },

  // --- 3. SOUL & INNER PEACE (13 Questions) ---
  {
    id: 's1',
    dimension: 'soul',
    question: 'When you sit in complete silence for 15 minutes, what typically surfaces?',
    options: [
      { id: 's1_a', label: 'A grateful organizing of thoughts into serene clarity', archetypeScore: 'architect' },
      { id: 's1_b', label: 'Intuitive glimpses of future decisions and purposeful horizons', archetypeScore: 'visionary' },
      { id: 's1_c', label: 'Deep emotional resonance, memories, and tender gratitude', archetypeScore: 'creator' },
      { id: 's1_d', label: 'A sense of timeless wonder and mystery about the universe', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's2',
    dimension: 'soul',
    question: 'What philosophy provides you with the greatest inner solace during heartbreak or loss?',
    options: [
      { id: 's2_a', label: 'Stoic equanimity: controlling what is mine and letting go of the rest', archetypeScore: 'architect' },
      { id: 's2_b', label: 'Trust that every dark night is preparing the soul for dawn', archetypeScore: 'visionary' },
      { id: 's2_c', label: 'Compassion: that pain softens the heart to love more deeply', archetypeScore: 'creator' },
      { id: 's2_d', label: 'The impermanence of all things: life is an unrepeatable river', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's3',
    dimension: 'soul',
    question: 'Where do you feel most intimately in communion with the sacred or divine?',
    options: [
      { id: 's3_a', label: 'In sacred architecture, balanced geometry, and quiet libraries', archetypeScore: 'architect' },
      { id: 's3_b', label: 'Standing on a mountain peak at dawn overlooking the clouds', archetypeScore: 'visionary' },
      { id: 's3_c', label: 'In deep poetic music, warm firelight, and looking into beloved eyes', archetypeScore: 'creator' },
      { id: 's3_d', label: 'Under a vast starry night sky away from all human noise', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's4',
    dimension: 'soul',
    question: 'What is your deepest unspoken fear when life slows down completely?',
    options: [
      { id: 's4_a', label: 'Losing control or discovering that my foundation was fragile', archetypeScore: 'architect' },
      { id: 's4_b', label: 'Wasting my potential and leaving my true mission unfulfilled', archetypeScore: 'visionary' },
      { id: 's4_c', label: 'Being truly unloved or unseen for who I am underneath', archetypeScore: 'creator' },
      { id: 's4_d', label: 'Realizing I stayed in the safe harbor and missed true life', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's5',
    dimension: 'soul',
    question: 'How do you cultivate genuine forgiveness toward those who wronged you?',
    options: [
      { id: 's5_a', label: 'Understanding their limitations and closing the energetic ledger', archetypeScore: 'architect' },
      { id: 's5_b', label: 'Recognizing that carrying resentment weighs down my own destiny', archetypeScore: 'visionary' },
      { id: 's5_c', label: 'Empathizing with their woundedness while protecting my own heart', archetypeScore: 'creator' },
      { id: 's5_d', label: 'Releasing the past to the wind—life is too brief to carry stones', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's6',
    dimension: 'soul',
    question: 'What does "spiritual maturity" look like to you?',
    options: [
      { id: 's6_a', label: 'Emotional self-regulation, integrity, and quiet reliability', archetypeScore: 'architect' },
      { id: 's6_b', label: 'Aligning one’s daily life with transcendent purpose and service', archetypeScore: 'visionary' },
      { id: 's6_c', label: 'Radical tenderness, humility, and unconditional kindness', archetypeScore: 'creator' },
      { id: 's6_d', label: 'Comfort with not knowing, non-attachment, and curiosity', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's7',
    dimension: 'soul',
    question: 'When you feel disconnected from yourself, what brings your soul back home?',
    options: [
      { id: 's7_a', label: 'Returning to my foundational daily practices and quiet order', archetypeScore: 'architect' },
      { id: 's7_b', label: 'Reconnecting with my core why and asking what truly matters', archetypeScore: 'visionary' },
      { id: 's7_c', label: 'Gentle crying, creative journaling, and receiving kindness', archetypeScore: 'creator' },
      { id: 's7_d', label: 'Walking barefoot on earth and breathing cold fresh air', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's8',
    dimension: 'soul',
    question: 'What legacy do you most desire to leave in the quiet memory of others?',
    options: [
      { id: 's8_a', label: 'That I was a rock of quiet integrity and dependable wisdom', archetypeScore: 'architect' },
      { id: 's8_b', label: 'That I gave people courage to dream and build beyond themselves', archetypeScore: 'visionary' },
      { id: 's8_c', label: 'That they always felt truly heard, safe, and loved in my presence', archetypeScore: 'creator' },
      { id: 's8_d', label: 'That I lived authentically, bravely, and with an uncurbed spirit', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's9',
    dimension: 'soul',
    question: 'How do you relate to the passage of time and aging?',
    options: [
      { id: 's9_a', label: 'I appreciate the deepening mastery and calm that comes with years', archetypeScore: 'architect' },
      { id: 's9_b', label: 'I feel a sacred urgency to bring my greatest gifts to harvest', archetypeScore: 'visionary' },
      { id: 's9_c', label: 'I treasure each season for its distinct emotional sweetness', archetypeScore: 'creator' },
      { id: 's9_d', label: 'Every year is another chapter in a miraculous mystery journey', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's10',
    dimension: 'soul',
    question: 'What brings you the deepest sense of peace before falling asleep?',
    options: [
      { id: 's10_a', label: 'Knowing my responsibilities were honored and tomorrow is planned', archetypeScore: 'architect' },
      { id: 's10_b', label: 'Knowing I stepped closer to my true purpose today', archetypeScore: 'visionary' },
      { id: 's10_c', label: 'Gratitude for the gentle kindnesses received and given today', archetypeScore: 'creator' },
      { id: 's10_d', label: 'Releasing all efforts and resting into the vast quiet night', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's11',
    dimension: 'soul',
    question: 'If you could whisper one truth to your younger self:',
    options: [
      { id: 's11_a', label: '“You don’t have to prove everything at once; trust steady patience.”', archetypeScore: 'architect' },
      { id: 's11_b', label: '“Your dreams are not foolish; hold your compass with boldness.”', archetypeScore: 'visionary' },
      { id: 's11_c', label: '“You are already worthy of love, exactly as you are.”', archetypeScore: 'creator' },
      { id: 's11_d', label: '“Do not fear the unknown; the wilderness is where you find yourself.”', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's12',
    dimension: 'soul',
    question: 'How do you view self-compassion during seasons of struggle?',
    options: [
      { id: 's12_a', label: 'A practical necessity to maintain long-term stamina and sanity', archetypeScore: 'architect' },
      { id: 's12_b', label: 'The essential soil from which all enduring strength grows', archetypeScore: 'visionary' },
      { id: 's12_c', label: 'The most sacred and tender relationship I will ever cultivate', archetypeScore: 'creator' },
      { id: 's12_d', label: 'Accepting myself as a messy, beautiful, evolving work in progress', archetypeScore: 'seeker' },
    ],
  },
  {
    id: 's13',
    dimension: 'soul',
    question: 'In the end, what is your compass heading in life?',
    options: [
      { id: 's13_a', label: 'Clarity, mastery, and a calm, orderly conscience', archetypeScore: 'architect' },
      { id: 's13_b', label: 'Transformation, courage, and answering the call of destiny', archetypeScore: 'visionary' },
      { id: 's13_c', label: 'Love, empathy, beauty, and deep human presence', archetypeScore: 'creator' },
      { id: 's13_d', label: 'Truth, freedom, wonder, and uncompromised authenticity', archetypeScore: 'seeker' },
    ],
  },
];

// Archetype Metadata & Portraits
export const ARCHETYPE_PORTRAITS: Record<
  ArchetypeId,
  {
    name: string;
    tagline: string;
    summary: string;
    icon: typeof Compass;
    color: string;
    bgBadge: string;
    fuels: string[];
    drains: string[];
  }
> = {
  architect: {
    name: 'The Quiet Architect',
    tagline: 'Intentional • Masterful • Grounded in Clarity & Order',
    summary:
      'You are a deliberate builder who finds profound peace in intentionality, elegant systems, and dependable craftsmanship. You do not shout; your quiet integrity and mastery speak for you. Your superpower is transforming chaos into calm, sustainable sanctuaries.',
    icon: Compass,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgBadge: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    fuels: [
      'Protected blocks of deep uninterrupted focus',
      'Minimalist, decluttered environments with serene order',
      'Disciplined daily rituals that honor your natural rhythm',
    ],
    drains: [
      'Unstructured noise and chaotic last-minute urgency',
      'Performative drama and shallow, rushed interactions',
      'Unpredictable environments that violate healthy boundaries',
    ],
  },
  visionary: {
    name: 'The Grounded Visionary',
    tagline: 'Strategic • Purpose-Driven • Courageous Long-Term Thinker',
    summary:
      'You are guided by an expansive inner compass that looks beyond the present horizon. You find meaning in transformative work and systemic change. While others panic in the valley, you hold the memory of the mountain peak and give courage to those around you.',
    icon: Flame,
    color: 'text-amber-600 dark:text-amber-400',
    bgBadge: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    fuels: [
      'Audacious projects that elevate human potential',
      'Conversations about the future with courageous peers',
      'Quiet contemplation connecting daily actions to transcendent purpose',
    ],
    drains: [
      'Numbing micro-management and petty bureaucracy',
      'Cynicism and resignation from people who have given up',
      'Being forced to work on tasks devoid of deeper meaning',
    ],
  },
  creator: {
    name: 'The Empathetic Creator',
    tagline: 'Intuitive • Heart-Led • Deeply Attuned to Beauty & Connection',
    summary:
      'You perceive the unspoken emotional currents of life and transform them into tenderness, art, and healing connection. You hold immense space for others and cherish the poetry of the unhurried moment. Your vulnerability is not a weakness; it is your greatest strength.',
    icon: Feather,
    color: 'text-rose-600 dark:text-rose-400',
    bgBadge: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    fuels: [
      'Authentic vulnerable conversations without pretense',
      'Artistic, musical, and contemplative creative expression',
      'Gentle spaces where empathy is valued as wisdom',
    ],
    drains: [
      'Cold, transactional environments devoid of appreciation',
      'Emotional dumping without reciprocity or care',
      'Suppressing your intuition to conform to rigid expectations',
    ],
  },
  seeker: {
    name: 'The Resilient Seeker',
    tagline: 'Curious • Adaptable • Guided by Truth & Freedom',
    summary:
      'You are a philosopher-wanderer who views life not as a destination to conquer, but as an ever-unfolding mystery to experience. You adapt gracefully to change, refuse to be caged by dogma, and carry an infectious wonder that reminds everyone that freedom is possible.',
    icon: Sparkles,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgBadge: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    fuels: [
      'Solitary time in raw nature (mountains, oceans, forests)',
      'The freedom to explore new philosophies, crafts, and horizons',
      'Authentic living aligned with personal sovereignty',
    ],
    drains: [
      'Monotonous routine and repetitive boxes without room to breathe',
      'Dogmatic rules that forbid questioning and exploration',
      'Living for other people’s approval rather than your own truth',
    ],
  },
};

export function SelfDiscoveryQuizView() {
  const { dict, saveCard, playSingingBowl, setActiveTab, isRtl, addEvolutionXp, activeFramework, setActiveFramework } = useApp();

  const [selectedFramework, setSelectedFramework] = useState<FrameworkId>(activeFramework || 'compass');
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [selectedLength, setSelectedLength] = useState<QuizLength>(20);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Compass answers
  const [answers, setAnswers] = useState<Record<string, ArchetypeId>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  // Scientific Framework answers
  const [scientificAnswers, setScientificAnswers] = useState<Record<string, number>>({});
  const [genericResult, setGenericResult] = useState<GenericQuizResult | null>(null);

  const [savedToJourneyMap, setSavedToJourneyMap] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Synchronize framework selection
  const handleSelectFramework = (fid: FrameworkId) => {
    setSelectedFramework(fid);
    setActiveFramework(fid);
    setStep('intro');
    setCurrentIndex(0);
    setAnswers({});
    setScientificAnswers({});
    setResult(null);
    setGenericResult(null);
    setSavedToJourneyMap(false);
  };

  // Filter question subset based on chosen length for Compass
  const activeQuestions = React.useMemo(() => {
    return QUIZ_QUESTION_BANK.slice(0, selectedLength);
  }, [selectedLength]);

  // Scientific question bank for current framework
  const activeScientificQuestions = React.useMemo(() => {
    switch (selectedFramework) {
      case 'big5':
        return BIG5_QUESTIONS;
      case 'locus_of_control':
        return LOCUS_QUESTIONS;
      case 'empathizing_systemizing':
        return EQ_SQ_QUESTIONS;
      case 'mbti16':
        return MBTI_QUESTIONS;
      case 'true_colours':
        return TRUE_COLOURS_QUESTIONS;
      default:
        return [];
    }
  }, [selectedFramework]);

  const currentQuestion = activeQuestions[currentIndex];
  const currentScientificQuestion = activeScientificQuestions[currentIndex];

  const handleStart = (len: QuizLength) => {
    setSelectedLength(len);
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setSavedToJourneyMap(false);
    setStep('quiz');
  };

  const handleStartScientific = () => {
    setCurrentIndex(0);
    setScientificAnswers({});
    setGenericResult(null);
    setSavedToJourneyMap(false);
    setStep('quiz');
  };

  const handleSelectAnswer = (archetype: ArchetypeId) => {
    const updated = { ...answers, [currentQuestion.id]: archetype };
    setAnswers(updated);

    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      calculateResult(updated);
    }
  };

  const handleSelectScientificAnswer = (scoreValue: number) => {
    if (!currentScientificQuestion) return;
    const updated = { ...scientificAnswers, [currentScientificQuestion.id]: scoreValue };
    setScientificAnswers(updated);

    if (currentIndex + 1 < activeScientificQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      calculateScientificResult(updated);
    }
  };

  const calculateScientificResult = (finalAnswers: Record<string, number>) => {
    let res: GenericQuizResult;
    switch (selectedFramework) {
      case 'big5':
        res = scoreBig5(finalAnswers);
        break;
      case 'locus_of_control':
        res = scoreLocus(finalAnswers);
        break;
      case 'empathizing_systemizing':
        res = scoreEqSq(finalAnswers);
        break;
      case 'mbti16':
        res = scoreMbti(finalAnswers);
        break;
      case 'true_colours':
        res = scoreTrueColours(finalAnswers);
        break;
      default:
        res = scoreBig5(finalAnswers);
    }

    setGenericResult(res);
    setStep('result');
    playSingingBowl();
    addEvolutionXp(30, `Completed ${res.frameworkName}`);
  };

  const calculateResult = (finalAnswers: Record<string, ArchetypeId>) => {
    const counts: Record<ArchetypeId, number> = {
      architect: 0,
      visionary: 0,
      creator: 0,
      seeker: 0,
    };

    Object.values(finalAnswers).forEach((arch) => {
      counts[arch] = (counts[arch] || 0) + 1;
    });

    const sorted = (Object.keys(counts) as ArchetypeId[]).sort((a, b) => counts[b] - counts[a]);
    const topArch = sorted[0];
    const portrait = ARCHETYPE_PORTRAITS[topArch];

    const total = Object.values(finalAnswers).length || 1;
    const workPercent = Math.min(98, Math.round(((counts.architect + counts.visionary) / total) * 100) || 75);
    const lifePercent = Math.min(98, Math.round(((counts.creator + counts.seeker) / total) * 100) || 82);
    const soulPercent = Math.min(98, Math.round(((counts[topArch] + counts[sorted[1]]) / total) * 100) || 88);
    const clarityPercent = Math.min(98, Math.round((counts[topArch] / total) * 100) + 20);

    const calculated: QuizResult = {
      id: `quiz_result_${Date.now()}`,
      completedAt: new Date().toISOString(),
      length: selectedLength,
      archetype: topArch,
      archetypeName: portrait.name,
      tagline: portrait.tagline,
      summary: portrait.summary,
      dimensionScores: {
        work: workPercent,
        life: lifePercent,
        soul: soulPercent,
        clarity: clarityPercent,
      },
      fuels: portrait.fuels,
      drains: portrait.drains,
    };

    setResult(calculated);
    setStep('result');
    playSingingBowl();
    addEvolutionXp(30, 'Completed Inner Compass Portrait');
  };

  const handleSaveToMap = () => {
    if (selectedFramework === 'compass' && result) {
      saveCard({
        intent: 'grow',
        draftInsight: `Inner Compass Portrait: ${result.archetypeName}`,
        confirmedInsight: `I am ${result.archetypeName} (${result.tagline}). My strength is ${result.summary.split('.')[0]}.`,
        microStep: `Honor what fuels me: ${result.fuels[0]}`,
        isConfirmed: true,
        status: 'confirmed',
      });
      setSavedToJourneyMap(true);
      playSingingBowl();
      addEvolutionXp(20, 'Saved Inner Compass to Journey Map');
    } else if (genericResult) {
      saveCard({
        intent: 'grow',
        draftInsight: `${genericResult.frameworkName}: ${genericResult.primaryResult}`,
        confirmedInsight: `${genericResult.primaryResult} — ${genericResult.subtitle}. ${genericResult.summary}`,
        microStep: `Embody this truth: ${genericResult.empoweringMantra}`,
        isConfirmed: true,
        status: 'confirmed',
      });
      setSavedToJourneyMap(true);
      playSingingBowl();
      addEvolutionXp(20, `Saved ${genericResult.frameworkName} to Journey Map`);
    }
  };

  const handleDownloadCard = () => {
    let content = '';
    const dateStr = new Date().toLocaleDateString();

    if (selectedFramework === 'compass' && result) {
      content = `=====================================================
BECOMING • INNER COMPASS DISCOVERY CARD
Archetype: ${result.archetypeName}
Tagline: ${result.tagline}
Date: ${dateStr}
=====================================================

ESSENCE & SUMMARY:
${result.summary}

FOUR PILLAR HARMONY SCORES:
- Work Rhythm & Craft: ${result.dimensionScores.work}%
- Life & Emotional Resonance: ${result.dimensionScores.life}%
- Soul & Meaning Alignment: ${result.dimensionScores.soul}%
- Inner Clarity & Stillness: ${result.dimensionScores.clarity}%

WHAT NATURALLY FUELS YOU:
${result.fuels.map((f) => `• ${f}`).join('\n')}

WHAT SILENTLY DRAINS YOU:
${result.drains.map((d) => `• ${d}`).join('\n')}

=====================================================
BECOMING • Local Sovereignty • Zero External Tracking
=====================================================`;
    } else if (genericResult) {
      content = `=====================================================
BECOMING • SCIENTIFIC SELF-DISCOVERY CARD
Framework: ${genericResult.frameworkName}
Signature: ${genericResult.primaryResult}
Subtitle: ${genericResult.subtitle}
Date: ${dateStr}
=====================================================

ESSENCE & SUMMARY:
${genericResult.summary}

TRAIT & DIMENSION SCORES:
${Object.entries(genericResult.scores)
  .map(([k, v]) => `- ${k.toUpperCase()}: ${v}%`)
  .join('\n')}

AUTHENTIC STRENGTHS:
${genericResult.strengths.map((s) => `• ${s}`).join('\n')}

GROWTH EDGES & BOUNDARIES:
${genericResult.growthEdges.map((g) => `• ${g}`).join('\n')}

EMPOWERING DAILY MANTRA:
${genericResult.empoweringMantra}

=====================================================
BECOMING • Local Sovereignty • Zero External Tracking
=====================================================`;
    }

    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Becoming_Inner_Compass_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    addEvolutionXp(15, 'Downloaded Inner Compass Keepsake Card');
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const activeMeta = SCIENTIFIC_FRAMEWORKS.find((f) => f.id === selectedFramework);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Framework Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => handleSelectFramework('compass')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedFramework === 'compass'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Inner Compass</span>
        </button>

        {SCIENTIFIC_FRAMEWORKS.map((meta) => (
          <button
            key={meta.id}
            type="button"
            onClick={() => handleSelectFramework(meta.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFramework === meta.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{meta.name.split('(')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Step 0: INTRO / LENGTH PICKER */}
      {step === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 text-center"
        >
          {selectedFramework === 'compass' ? (
            <>
              {/* Header */}
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-xs">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                  {dict.quiz?.title || 'The Inner Compass Discovery Studio'}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                  {dict.quiz?.subtitle ||
                    'A deeply peaceful self-reflection inquiry across Work & Purpose, Life & Relationships, and Soul & Inner Peace. Non-clinical, nonjudgmental, and 100% private to your device.'}
                </p>
              </div>

              {/* 3 Dimensions Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-start">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <Briefcase className="w-4 h-4" />
                    <span>1. Work & Purpose</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Focus rhythm, leadership boundaries, burnout prevention, and core creative ambition.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                    <Heart className="w-4 h-4" />
                    <span>2. Life & Relationships</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Social battery, communication during conflict, intimacy, decisions, and renewal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>3. Soul & Inner Peace</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Stillness, forgiveness, life philosophies, facing mortality, and uncurbed authenticity.
                  </p>
                </div>
              </div>

              {/* Select Length Cards */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {dict.quiz?.chooseLength || 'Choose Inquiry Depth'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  <button
                    type="button"
                    onClick={() => handleStart(10)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-start transition-all hover:scale-[1.01] shadow-md flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">10 Questions</div>
                      <div className="text-xs text-slate-500">Quick Mirror (~3 mins)</div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-indigo-500 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStart(20)}
                    className="p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 text-start transition-all hover:scale-[1.01] shadow-md flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-indigo-950 dark:text-indigo-200 text-sm">20 Questions (Recommended)</div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400">Deep Dive Balance (~6 mins)</div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-indigo-600 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStart(30)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-start transition-all hover:scale-[1.01] shadow-md flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">30 Questions</div>
                      <div className="text-xs text-slate-500">Three-Pillar Harmony (~9 mins)</div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-indigo-500 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStart(40)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-start transition-all hover:scale-[1.01] shadow-md flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">40 Questions</div>
                      <div className="text-xs text-slate-500">Complete 360° Odyssey (~12 mins)</div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-indigo-500 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Scientific Framework Intro Card */
            activeMeta && (
              <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center max-w-2xl mx-auto">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-xs">
                  <Award className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Exploratory Framework: {activeMeta.scientificOrigin}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                    {activeMeta.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                    {activeMeta.tagline}
                  </p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeMeta.description}
                </p>

                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{activeMeta.questionCount} Questions</span>
                  <span>•</span>
                  <span>Approx. {activeMeta.timeEstimate}</span>
                  <span>•</span>
                  <span>100% Local & Private</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartScientific}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                  >
                    Begin Self-Reflection
                  </button>
                </div>
              </div>
            )
          )}
        </motion.div>
      )}

      {/* Step 1: QUESTION DECK */}
      {step === 'quiz' && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                } else {
                  setStep('intro');
                }
              }}
              className="px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 shadow-xs transition-colors"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{dict.sanctuary.cardBack}</span>
            </button>

            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {currentIndex + 1} /{' '}
              {selectedFramework === 'compass'
                ? activeQuestions.length
                : activeScientificQuestions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentIndex + 1) /
                    (selectedFramework === 'compass'
                      ? activeQuestions.length
                      : activeScientificQuestions.length)) *
                  100
                }%`,
              }}
            />
          </div>

          {/* Question Card: COMPASS */}
          {selectedFramework === 'compass' && currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {currentQuestion.dimension === 'work'
                    ? 'Work & Purpose'
                    : currentQuestion.dimension === 'life'
                    ? 'Life & Relationships'
                    : 'Soul & Inner Peace'}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectAnswer(opt.archetypeScore)}
                    className="w-full text-start p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:border-indigo-300 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.008]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question Card: SCIENTIFIC FRAMEWORK */}
          {selectedFramework !== 'compass' && currentScientificQuestion && (
            <motion.div
              key={currentScientificQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {selectedFramework.toUpperCase().replace(/_/g, ' ')} • INQUIRY #{currentIndex + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white leading-snug">
                  {currentScientificQuestion.prompt}
                </h2>
              </div>

              <div className="space-y-2.5">
                {currentScientificQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectScientificAnswer(opt.scoreValue)}
                    className="w-full text-start p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:border-indigo-300 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.008]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: RESULT CARD — COMPASS */}
      {step === 'result' && selectedFramework === 'compass' && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{dict.quiz?.retake || 'Retake Quiz'}</span>
            </button>

            <span className="text-xs text-slate-500 font-medium">
              {result.length} questions completed
            </span>
          </div>

          {/* Archetype Hero Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="space-y-3 text-center">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Your Primary Inner Compass Archetype
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                {result.archetypeName}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {result.tagline}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal text-center max-w-2xl mx-auto">
              {result.summary}
            </p>

            {/* 4 Dimension Bars */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center">
                Four Pillar Harmony Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Work Rhythm & Craft</span>
                    <span>{result.dimensionScores.work}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${result.dimensionScores.work}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Life & Emotional Resonance</span>
                    <span>{result.dimensionScores.life}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${result.dimensionScores.life}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Soul & Meaning Alignment</span>
                    <span>{result.dimensionScores.soul}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${result.dimensionScores.soul}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Inner Clarity & Stillness</span>
                    <span>{result.dimensionScores.clarity}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${result.dimensionScores.clarity}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Fuels vs Drains */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <BatteryCharging className="w-4 h-4" />
                  <span>What Naturally Fuels You</span>
                </div>
                <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 list-disc ps-4">
                  {result.fuels.map((fuel, idx) => (
                    <li key={idx}>{fuel}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                  <BatteryWarning className="w-4 h-4" />
                  <span>What Silently Drains You</span>
                </div>
                <ul className="text-xs text-rose-900 dark:text-rose-200 space-y-1.5 list-disc ps-4">
                  {result.drains.map((drain, idx) => (
                    <li key={idx}>{drain}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions: Download Card & Save to Journey Map */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDownloadCard}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{downloadSuccess ? 'Downloaded Card ✓' : 'Download My Inner Compass Card'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToMap}
                disabled={savedToJourneyMap}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  savedToJourneyMap
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25'
                }`}
              >
                {savedToJourneyMap ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved to Journey Map</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save Portrait to Journey Map</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: RESULT CARD — SCIENTIFIC FRAMEWORK */}
      {step === 'result' && selectedFramework !== 'compass' && genericResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Self-Reflection</span>
            </button>

            <span className="text-xs text-slate-500 font-medium">
              {activeScientificQuestions.length} questions completed
            </span>
          </div>

          {/* Scientific Hero Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="space-y-3 text-center">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {genericResult.frameworkName}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                {genericResult.primaryResult}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {genericResult.subtitle}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal text-center max-w-2xl mx-auto">
              {genericResult.summary}
            </p>

            {/* Scores breakdown bars */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center">
                Trait & Dimension Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(genericResult.scores).map(([trait, score]) => (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">
                      <span>{trait.replace(/_/g, ' ')}</span>
                      <span>{score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Growth Edges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Authentic Strengths</span>
                </div>
                <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 list-disc ps-4">
                  {genericResult.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Flame className="w-4 h-4" />
                  <span>Growth Edges & Healthy Boundaries</span>
                </div>
                <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1.5 list-disc ps-4">
                  {genericResult.growthEdges.map((edge, idx) => (
                    <li key={idx}>{edge}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Empowering Mantra Quote */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                Daily Living Anchor
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-indigo-950 dark:text-indigo-200">
                {genericResult.empoweringMantra}
              </p>
            </div>

            {/* Actions: Download Card & Save to Journey Map */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDownloadCard}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{downloadSuccess ? 'Downloaded Card ✓' : 'Download My Inner Compass Card'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToMap}
                disabled={savedToJourneyMap}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  savedToJourneyMap
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25'
                }`}
              >
                {savedToJourneyMap ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved to Journey Map</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save Portrait to Journey Map</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
