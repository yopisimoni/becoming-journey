/**
 * BECOMING Scientific Self-Discovery Frameworks
 * 5 Globally Recognized Psychological & Temperament Systems
 * Translated into warm, non-clinical, empowering, 100% local self-inquiry.
 */

import {
  FrameworkId,
  ScientificFrameworkMeta,
  GenericQuizQuestion,
  GenericQuizResult,
} from '@/types';

export const SCIENTIFIC_FRAMEWORKS: ScientificFrameworkMeta[] = [
  {
    id: 'big5',
    name: 'Big 5 Personality (OCEAN Rhythm)',
    tagline: 'Openness • Conscientiousness • Extraversion • Agreeableness • Emotional Sensitivity',
    scientificOrigin: 'Costa & McCrae Five-Factor Model',
    description:
      'The gold standard of modern empirical personality psychology. Discovers how your unique rhythm navigates novelty, organization, social energy, compassion, and emotional sensitivity without judgment.',
    questionCount: 10,
    timeEstimate: '3-4 mins',
  },
  {
    id: 'locus_of_control',
    name: 'Locus of Control (The Agency Mirror)',
    tagline: 'Internal Sovereignty vs. External Drift',
    scientificOrigin: 'Julian Rotter Social Learning Theory',
    description:
      'Examines where you believe the steering wheel of your life rests. Illuminates your personal agency and self-responsibility so you realize you shape your direction regardless of circumstance.',
    questionCount: 8,
    timeEstimate: '2-3 mins',
  },
  {
    id: 'empathizing_systemizing',
    name: 'Empathizing–Systemizing (Cognitive Lens)',
    tagline: 'Emotional Attunement vs. Pattern Recognition',
    scientificOrigin: 'Simon Baron-Cohen Cognitive Profiles',
    description:
      'Explores the balance between your natural drive to empathize with human emotion and your drive to analyze, construct, and predict logical systems and structures.',
    questionCount: 10,
    timeEstimate: '3 mins',
  },
  {
    id: 'mbti16',
    name: '16-Type Work & Relationship Compass',
    tagline: 'Cognitive Energies • Professional Strengths • Relational Harmony',
    scientificOrigin: 'Jungian Typology & Myers-Briggs Paradigm',
    description:
      'Maps how you draw energy (E/I), perceive reality (S/N), make value decisions (T/F), and orient your daily lifestyle (J/P), highlighting your greatest career gifts and romantic relationship dynamics.',
    questionCount: 12,
    timeEstimate: '4 mins',
  },
  {
    id: 'true_colours',
    name: 'True Colours Temperament (Communication Blueprint)',
    tagline: 'Analytical Green • Empathetic Blue • Grounded Gold • Spontaneous Orange',
    scientificOrigin: 'Don Lowry Temperament Model',
    description:
      'Translates complex personality dynamics into four vibrant behavioral styles, teaching you and your loved ones how to communicate with ease, mutual honor, and minimal friction.',
    questionCount: 8,
    timeEstimate: '2-3 mins',
  },
];

// =========================================================================
// 1. BIG 5 PERSONALITY (OCEAN) QUESTION BANK & SCORING
// =========================================================================
export const BIG5_QUESTIONS: GenericQuizQuestion[] = [
  {
    id: 'b5_1',
    prompt: 'When encountering unexpected, abstract concepts or avant-garde art:',
    options: [
      { id: 'b5_1_a', label: 'I am captivated and love exploring speculative, philosophical questions', scoreKey: 'openness', scoreValue: 4 },
      { id: 'b5_1_b', label: 'I enjoy it if it connects to human stories and emotions', scoreKey: 'openness', scoreValue: 3 },
      { id: 'b5_1_c', label: 'I prefer concrete facts, proven practical ideas, and immediate utility', scoreKey: 'openness', scoreValue: 1 },
      { id: 'b5_1_d', label: 'I appreciate the craft, but rarely seek out avant-garde ideas', scoreKey: 'openness', scoreValue: 2 },
    ],
  },
  {
    id: 'b5_2',
    prompt: 'How do you approach a messy room or an unorganized desk before starting work?',
    options: [
      { id: 'b5_2_a', label: 'I cannot focus until everything is tidy, organized, and settled in place', scoreKey: 'conscientiousness', scoreValue: 4 },
      { id: 'b5_2_b', label: 'I clear a small working corner and tidy up later when I have time', scoreKey: 'conscientiousness', scoreValue: 2 },
      { id: 'b5_2_c', label: 'I follow a steady routine of organizing things as I move through my day', scoreKey: 'conscientiousness', scoreValue: 3 },
      { id: 'b5_2_d', label: 'Creative clutter rarely bothers me; I dive straight into what matters', scoreKey: 'conscientiousness', scoreValue: 1 },
    ],
  },
  {
    id: 'b5_3',
    prompt: 'After spending an entire weekend alone in quiet reflection:',
    options: [
      { id: 'b5_3_a', label: 'I feel deeply restored, grounded, and peaceful in my solitude', scoreKey: 'extraversion', scoreValue: 1 },
      { id: 'b5_3_b', label: 'I enjoyed the calm, but I am ready to see close friends', scoreKey: 'extraversion', scoreValue: 2 },
      { id: 'b5_3_c', label: 'I start feeling restless and craving vibrant social engagement', scoreKey: 'extraversion', scoreValue: 4 },
      { id: 'b5_3_d', label: 'I feel balanced as long as I got some reading or creativity done', scoreKey: 'extraversion', scoreValue: 2 },
    ],
  },
  {
    id: 'b5_4',
    prompt: 'When a colleague or friend makes an honest mistake that disrupts your schedule:',
    options: [
      { id: 'b5_4_a', label: 'My immediate reflex is empathy; I reassure them and help solve it', scoreKey: 'agreeableness', scoreValue: 4 },
      { id: 'b5_4_b', label: 'I stay calm, address the practical fix, and don’t take it personally', scoreKey: 'agreeableness', scoreValue: 3 },
      { id: 'b5_4_c', label: 'I feel an initial flash of irritation, but let it go quickly', scoreKey: 'agreeableness', scoreValue: 2 },
      { id: 'b5_4_d', label: 'I hold them accountable directly so standards are respected', scoreKey: 'agreeableness', scoreValue: 1 },
    ],
  },
  {
    id: 'b5_5',
    prompt: 'When sudden, uncertain changes threaten your plans:',
    options: [
      { id: 'b5_5_a', label: 'My nervous system feels an intense alert, and I need space to breathe', scoreKey: 'sensitivity', scoreValue: 4 },
      { id: 'b5_5_b', label: 'I feel brief tension, then my mind begins planning adjustments', scoreKey: 'sensitivity', scoreValue: 3 },
      { id: 'b5_5_c', label: 'I stay remarkably unbothered, trusting everything will sort itself out', scoreKey: 'sensitivity', scoreValue: 1 },
      { id: 'b5_5_d', label: 'I slow my heart rate and look at facts rather than worst-case scenarios', scoreKey: 'sensitivity', scoreValue: 2 },
    ],
  },
  {
    id: 'b5_6',
    prompt: 'When daydreaming about your ideal future journey:',
    options: [
      { id: 'b5_6_a', label: 'I imagine wandering through historic streets, nature, and rich cultures', scoreKey: 'openness', scoreValue: 4 },
      { id: 'b5_6_b', label: 'I envision mastering deep craft and achieving quiet personal goals', scoreKey: 'conscientiousness', scoreValue: 3 },
      { id: 'b5_6_c', label: 'I picture lively gatherings, storytelling, and shared laughter', scoreKey: 'extraversion', scoreValue: 4 },
      { id: 'b5_6_d', label: 'I seek a peaceful retreat where nobody demands anything of me', scoreKey: 'sensitivity', scoreValue: 2 },
    ],
  },
  {
    id: 'b5_7',
    prompt: 'When you make a promise or set an unobserved personal goal:',
    options: [
      { id: 'b5_7_a', label: 'My word to myself is sacred; I follow through even when tired', scoreKey: 'conscientiousness', scoreValue: 4 },
      { id: 'b5_7_b', label: 'I usually keep it, but adjust gracefully if circumstances change', scoreKey: 'conscientiousness', scoreValue: 3 },
      { id: 'b5_7_c', label: 'I struggle with follow-through if excitement fades, unless held accountable', scoreKey: 'conscientiousness', scoreValue: 1 },
      { id: 'b5_7_d', label: 'I prefer flexible commitments over rigid milestones', scoreKey: 'conscientiousness', scoreValue: 2 },
    ],
  },
  {
    id: 'b5_8',
    prompt: 'In a room full of strangers at a social or work gathering:',
    options: [
      { id: 'b5_8_a', label: 'I naturally gravitate to one person for a quiet, meaningful conversation', scoreKey: 'agreeableness', scoreValue: 3 },
      { id: 'b5_8_b', label: 'I feel completely energized, mingling and meeting diverse people', scoreKey: 'extraversion', scoreValue: 4 },
      { id: 'b5_8_c', label: 'I observe from the periphery until I find a comfortable opening', scoreKey: 'extraversion', scoreValue: 1 },
      { id: 'b5_8_d', label: 'I focus on listening and ensuring nobody feels left out', scoreKey: 'agreeableness', scoreValue: 4 },
    ],
  },
  {
    id: 'b5_9',
    prompt: 'When someone strongly disagrees with a core value of yours:',
    options: [
      { id: 'b5_9_a', label: 'I listen with genuine curiosity to uncover why they see it that way', scoreKey: 'openness', scoreValue: 4 },
      { id: 'b5_9_b', label: 'I hold my ground with quiet boundaries, avoiding toxic debates', scoreKey: 'conscientiousness', scoreValue: 3 },
      { id: 'b5_9_c', label: 'I try to find common emotional ground to protect the harmony', scoreKey: 'agreeableness', scoreValue: 4 },
      { id: 'b5_9_d', label: 'I feel deeply shaken internally and may withdraw to recover', scoreKey: 'sensitivity', scoreValue: 4 },
    ],
  },
  {
    id: 'b5_10',
    prompt: 'Reflecting on your inner emotional weather pattern:',
    options: [
      { id: 'b5_10_a', label: 'A deep emotional antenna that feels beauty and pain with high intensity', scoreKey: 'sensitivity', scoreValue: 4 },
      { id: 'b5_10_b', label: 'A steady, tranquil lake that rarely gets stirred by passing storms', scoreKey: 'sensitivity', scoreValue: 1 },
      { id: 'b5_10_c', label: 'A dynamic sky that moves quickly between sunshine and showers', scoreKey: 'sensitivity', scoreValue: 3 },
      { id: 'b5_10_d', label: 'A purposeful mountain focused on upward progress and discipline', scoreKey: 'conscientiousness', scoreValue: 4 },
    ],
  },
];

export function scoreBig5(answers: Record<string, number>): GenericQuizResult {
  // Aggregate scores (normalized to 0-100)
  const categories: Record<string, number> = {
    openness: 70,
    conscientiousness: 65,
    extraversion: 50,
    agreeableness: 80,
    sensitivity: 60,
  };

  Object.entries(answers).forEach(([qId, val]) => {
    const q = BIG5_QUESTIONS.find((item) => item.id === qId);
    if (q) {
      const opt = q.options.find((o) => o.scoreValue === val);
      if (opt && categories[opt.scoreKey] !== undefined) {
        categories[opt.scoreKey] = Math.min(98, Math.max(20, categories[opt.scoreKey] + (val - 2.5) * 8));
      }
    }
  });

  // Determine top trait
  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const primaryTrait = sorted[0][0];

  let primaryResult = 'The Empathetic Harmonizer';
  let subtitle = 'High Agreeableness & Mindful Sensitivity';
  let summary =
    'Your personality signature is anchored in deep relational attunement, thoughtful cooperation, and high aesthetic openness. You create warm psychological safety wherever you walk.';

  if (primaryTrait === 'openness') {
    primaryResult = 'The Imaginative Explorer';
    subtitle = 'Expansive Openness & Intellectual Wonder';
    summary =
      'You are drawn to big ideas, philosophical depths, and authentic creative expression. You see patterns and beauty that others rush right past.';
  } else if (primaryTrait === 'conscientiousness') {
    primaryResult = 'The Grounded Craftsman';
    subtitle = 'Reliable Conscientiousness & Quiet Mastery';
    summary =
      'You find immense serenity in steady follow-through, elegant organization, and fulfilling commitments to yourself and those who count on you.';
  } else if (primaryTrait === 'extraversion') {
    primaryResult = 'The Radiant Catalyst';
    subtitle = 'Warm Extraversion & Vibrant Connection';
    summary =
      'You naturally inspire energy, connection, and lively presence. You draw people into shared experiences with optimism and vitality.';
  } else if (primaryTrait === 'sensitivity') {
    primaryResult = 'The Deep Sensor';
    subtitle = 'Profound Emotional Antenna & Somatic Intuition';
    summary =
      'Your nervous system is exquisitely tuned to subtle nuances, moods, and undercurrents. What others call sensitivity is your greatest intuitive gift when protected by gentle boundaries.';
  }

  return {
    frameworkId: 'big5',
    frameworkName: 'Big 5 Personality (OCEAN Rhythm)',
    completedAt: new Date().toISOString(),
    primaryResult,
    subtitle,
    summary,
    scores: categories,
    strengths: [
      'Authentic emotional attunement and compassionate presence',
      'Quiet stamina when a goal aligns with core internal values',
      'Aesthetic sensitivity to beauty, language, and art',
    ],
    growthEdges: [
      'Remember to protect your energy from draining people before exhaustion sets in',
      'Release perfectionist paralysis by celebrating small 1% micro-steps',
    ],
    empoweringMantra:
      '“I honor the full depth of who I am. My sensitivity is my compass; my steady responsibility is my anchor.”',
  };
}

// =========================================================================
// 2. LOCUS OF CONTROL (THE AGENCY MIRROR)
// =========================================================================
export const LOCUS_QUESTIONS: GenericQuizQuestion[] = [
  {
    id: 'loc_1',
    prompt: 'When a major project or life transition does not turn out the way you hoped:',
    options: [
      { id: 'loc_1_a', label: 'I look in the mirror, analyze my own choices, and adapt my strategy', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_1_b', label: 'I see it as a mix of external bad timing and things I could have done better', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_1_c', label: 'I feel like circumstance and luck were stacked against me', scoreKey: 'external', scoreValue: 1 },
      { id: 'loc_1_d', label: 'I accept that whatever is meant to happen will happen regardless', scoreKey: 'external', scoreValue: 2 },
    ],
  },
  {
    id: 'loc_2',
    prompt: 'What role do you believe luck plays in building a peaceful, purposeful life?',
    options: [
      { id: 'loc_2_a', label: 'Luck provides raw cards, but how I play my hand every day determines everything', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_2_b', label: 'Luck matters, but relentless small habits create fortunate coincidences', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_2_c', label: 'Most people who succeed were simply fortunate or in the right place', scoreKey: 'external', scoreValue: 1 },
      { id: 'loc_2_d', label: 'Life is predominantly governed by forces far outside personal control', scoreKey: 'external', scoreValue: 1 },
    ],
  },
  {
    id: 'loc_3',
    prompt: 'When you feel stagnant or trapped in a frustrating daily routine:',
    options: [
      { id: 'loc_3_a', label: 'I recognize that only I can change my rhythm, and I start immediately', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_3_b', label: 'I take a few days to reflect, then plant one small boundary or habit', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_3_c', label: 'I wait for the external pressure or circumstances to ease up', scoreKey: 'external', scoreValue: 1 },
      { id: 'loc_3_d', label: 'I feel resentful toward obligations that other people placed on me', scoreKey: 'external', scoreValue: 2 },
    ],
  },
  {
    id: 'loc_4',
    prompt: 'How do you view physical health, sleep, and emotional peace?',
    options: [
      { id: 'loc_4_a', label: 'Direct consequences of my daily choices, boundaries, and nutrition', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_4_b', label: 'Largely influenced by my habits, though genetics play a baseline role', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_4_c', label: 'Mainly a matter of external stress and demands beyond my say', scoreKey: 'external', scoreValue: 2 },
      { id: 'loc_4_d', label: 'Unpredictable states that come and go like weather', scoreKey: 'external', scoreValue: 1 },
    ],
  },
  {
    id: 'loc_5',
    prompt: 'When someone treats you with disrespect or crosses your boundaries:',
    options: [
      { id: 'loc_5_a', label: 'I calmly enforce my boundary; I teach people how they may treat me', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_5_b', label: 'I pull back my energy and protect my peace without bitter drama', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_5_c', label: 'I feel helpless and hope they realize on their own how they hurt me', scoreKey: 'external', scoreValue: 1 },
      { id: 'loc_5_d', label: 'I blame their flawed personality and complain to others', scoreKey: 'external', scoreValue: 2 },
    ],
  },
  {
    id: 'loc_6',
    prompt: 'When deciding whether to learn a difficult new skill or change careers:',
    options: [
      { id: 'loc_6_a', label: 'If I invest steady daily discipline, I know I will master it', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_6_b', label: 'I trust my capacity to adapt and overcome stumbling blocks', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_6_c', label: 'I hesitate because the market or competition seems insurmountable', scoreKey: 'external', scoreValue: 1 },
      { id: 'loc_6_d', label: 'I feel only people with special natural talent can succeed', scoreKey: 'external', scoreValue: 2 },
    ],
  },
  {
    id: 'loc_7',
    prompt: 'When you feel angry or disappointed by current world news or politics:',
    options: [
      { id: 'loc_7_a', label: 'I focus my energy on what I directly control: my home, craft, and kindness', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_7_b', label: 'I take a digital break and pour my hands into serving someone nearby', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_7_c', label: 'I fall into doomscrolling and feel paralyzed by global decay', scoreKey: 'external', scoreValue: 1 },
      { id: 'loc_7_d', label: 'I feel that individual choices no longer matter in the grand scheme', scoreKey: 'external', scoreValue: 1 },
    ],
  },
  {
    id: 'loc_8',
    prompt: 'Looking at where you stand in life right this moment:',
    options: [
      { id: 'loc_8_a', label: 'I am the sovereign author of my next chapter; my future starts today', scoreKey: 'internal', scoreValue: 4 },
      { id: 'loc_8_b', label: 'I have made missteps, but every lesson is mine to turn into wisdom', scoreKey: 'internal', scoreValue: 3 },
      { id: 'loc_8_c', label: 'I was dealt a tough hand that has held me back from who I wanted to be', scoreKey: 'external', scoreValue: 1 },
      { id: 'loc_8_d', label: 'I am waiting for a lucky break to finally unlock my potential', scoreKey: 'external', scoreValue: 2 },
    ],
  },
];

export function scoreLocus(answers: Record<string, number>): GenericQuizResult {
  let internalSum = 0;
  let count = 0;

  Object.values(answers).forEach((val) => {
    internalSum += val;
    count += 1;
  });

  const avg = count > 0 ? internalSum / count : 3.0;
  const internalPercent = Math.min(96, Math.max(25, Math.round((avg / 4) * 100)));
  const externalPercent = 100 - internalPercent;

  let primaryResult = 'The Sovereign Author (High Internal Agency)';
  let subtitle = 'You hold the wheel of your life with calm responsibility';
  let summary =
    'You recognize that while you cannot control what life throws at you, your response, boundaries, and habits are 100% within your hands. You don’t waste energy blaming others or waiting for rescue.';

  if (internalPercent < 55) {
    primaryResult = 'Awakening Agency (Transitioning from Drift to Sovereignty)';
    subtitle = 'Discovering that you are not powerless over your days';
    summary =
      'You have experienced seasons where external events felt overwhelming. This mirror is your reminder: you are not helpless. Even a single 1% daily boundary will restore your sovereignty.';
  } else if (internalPercent < 75) {
    primaryResult = 'The Balanced Realist (Grounded Agency)';
    subtitle = 'Clear awareness of personal power paired with acceptance of reality';
    summary =
      'You understand the interplay between external circumstances and personal responsibility. You accept what you cannot change while investing steady energy where you can make a real difference.';
  }

  return {
    frameworkId: 'locus_of_control',
    frameworkName: 'Locus of Control (The Agency Mirror)',
    completedAt: new Date().toISOString(),
    primaryResult,
    subtitle,
    summary,
    scores: {
      internal_agency: internalPercent,
      external_drift: externalPercent,
      'Internal Agency (Personal Sovereignty)': internalPercent,
      'External Drift (Circumstance Attribution)': externalPercent,
    },
    strengths: [
      'Refusal to waste life in bitter victimhood or passive waiting',
      'High capacity to treat failure as constructive feedback',
      'Quiet resilience when unexpected storms arrive',
    ],
    growthEdges: [
      'Grant yourself gentle grace when external forces truly were beyond your control',
      'Avoid bearing the weight of other adults’ irresponsible choices',
    ],
    empoweringMantra:
      '“I am not defined by what happened to me. I am defined by the small, responsible choices I make today.”',
  };
}

// =========================================================================
// 3. EMPATHIZING–SYSTEMIZING (COGNITIVE LENS)
// =========================================================================
export const EQ_SQ_QUESTIONS: GenericQuizQuestion[] = [
  {
    id: 'eq_sq_1',
    prompt: 'When someone walks into a room visibly troubled but says "I am fine":',
    options: [
      { id: 'es1_a', label: 'I instantly sense their tension in my gut and soften my presence', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es1_b', label: 'I notice the subtle micro-expressions and tone shift analytically', scoreKey: 'sq', scoreValue: 3 },
      { id: 'es1_c', label: 'I take their word at face value unless they explain what is wrong', scoreKey: 'sq', scoreValue: 1 },
      { id: 'es1_d', label: 'I offer a warm cup of water and create a gentle opening if they wish to talk', scoreKey: 'eq', scoreValue: 4 },
    ],
  },
  {
    id: 'eq_sq_2',
    prompt: 'When buying a new appliance, tool, or software system:',
    options: [
      { id: 'es2_a', label: 'I thoroughly study the diagrams, specifications, and architecture', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es2_b', label: 'I look at reviews to see how real people feel using it every day', scoreKey: 'eq', scoreValue: 3 },
      { id: 'es2_c', label: 'I fiddle with it intuitively until it works, ignoring the manual', scoreKey: 'eq', scoreValue: 2 },
      { id: 'es2_d', label: 'I enjoy reverse-engineering the underlying logic and system flow', scoreKey: 'sq', scoreValue: 4 },
    ],
  },
  {
    id: 'eq_sq_3',
    prompt: 'Watching a moving documentary about a family overcoming hardship:',
    options: [
      { id: 'es3_a', label: 'I feel their tears and relief as if I were standing in their shoes', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es3_b', label: 'I analyze the socio-economic systems and historical factors that caused it', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es3_c', label: 'I appreciate both the human courage and the broader systemic context', scoreKey: 'eq', scoreValue: 3 },
      { id: 'es3_d', label: 'I find myself wondering how the cinematography and soundtrack were constructed', scoreKey: 'sq', scoreValue: 3 },
    ],
  },
  {
    id: 'eq_sq_4',
    prompt: 'When looking at a collection of books, files, or pantry jars:',
    options: [
      { id: 'es4_a', label: 'I feel deeply satisfied when categorized by clean, logical taxonomies', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es4_b', label: 'I organize them by how they make me feel or stories they recall', scoreKey: 'eq', scoreValue: 3 },
      { id: 'es4_c', label: 'Order matters less to me than accessibility and welcoming warmth', scoreKey: 'eq', scoreValue: 2 },
      { id: 'es4_d', label: 'I enjoy designing multi-tiered categorization schemes that scale', scoreKey: 'sq', scoreValue: 4 },
    ],
  },
  {
    id: 'eq_sq_5',
    prompt: 'During an emotional group disagreement:',
    options: [
      { id: 'es5_a', label: 'I focus on de-escalating hurt feelings and helping everyone feel heard', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es5_b', label: 'I seek the logical root of the disagreement and map out clean compromises', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es5_c', label: 'I identify hidden motives and unexpressed emotional vulnerabilities', scoreKey: 'eq', scoreValue: 3 },
      { id: 'es5_d', label: 'I write down the factual premises to separate emotional noise from reality', scoreKey: 'sq', scoreValue: 3 },
    ],
  },
  {
    id: 'eq_sq_6',
    prompt: 'When learning about natural ecosystems or mechanics:',
    options: [
      { id: 'es6_a', label: 'I love tracing feedback loops, causal chains, and input/output laws', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es6_b', label: 'I marvel at the beauty, living spirit, and sacred interdependence', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es6_c', label: 'I enjoy creating visual flowcharts and models of the components', scoreKey: 'sq', scoreValue: 3 },
      { id: 'es6_d', label: 'I imagine how animals and plants experience the changing seasons', scoreKey: 'eq', scoreValue: 3 },
    ],
  },
  {
    id: 'eq_sq_7',
    prompt: 'When someone tells you a rambling, illogical personal story:',
    options: [
      { id: 'es7_a', label: 'I listen with open heart to the emotional meaning underneath the words', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es7_b', label: 'My brain silently spots chronological contradictions and logical gaps', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es7_c', label: 'I gently ask clarifying questions to help them organize their thoughts', scoreKey: 'sq', scoreValue: 3 },
      { id: 'es7_d', label: 'I validate their feelings regardless of whether the story makes sense', scoreKey: 'eq', scoreValue: 4 },
    ],
  },
  {
    id: 'eq_sq_8',
    prompt: 'In your daily work or hobby, which gives you the purest sense of flow?',
    options: [
      { id: 'es8_a', label: 'Solving a complex, intricate puzzle, coding, or optimizing a system', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es8_b', label: 'Mentoring, uplifting, or creatively touching another human being', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es8_c', label: 'Designing an elegant architecture that helps people work peacefully', scoreKey: 'sq', scoreValue: 3 },
      { id: 'es8_d', label: 'Writing poetry, music, or stories that resonate with the human heart', scoreKey: 'eq', scoreValue: 3 },
    ],
  },
  {
    id: 'eq_sq_9',
    prompt: 'When traveling to a new city:',
    options: [
      { id: 'es9_a', label: 'I love memorizing transit maps, train networks, and street grids', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es9_b', label: 'I love observing local faces, markets, cafe culture, and human rhythms', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es9_c', label: 'I build an optimized itinerary with route efficiencies', scoreKey: 'sq', scoreValue: 3 },
      { id: 'es9_d', label: 'I follow serendipitous encounters and chat with local artisans', scoreKey: 'eq', scoreValue: 3 },
    ],
  },
  {
    id: 'eq_sq_10',
    prompt: 'If you could choose between two superpowers:',
    options: [
      { id: 'es10_a', label: 'To instantly heal emotional wounds and bring peace to troubled hearts', scoreKey: 'eq', scoreValue: 4 },
      { id: 'es10_b', label: 'To instantly understand the complete mechanism and code of any system', scoreKey: 'sq', scoreValue: 4 },
      { id: 'es10_c', label: 'A balance: to build systems that tenderly protect human well-being', scoreKey: 'eq', scoreValue: 3 },
      { id: 'es10_d', label: 'A balance: to analyze human behavior with compassionate mathematical clarity', scoreKey: 'sq', scoreValue: 3 },
    ],
  },
];

export function scoreEqSq(answers: Record<string, number>): GenericQuizResult {
  let eqScore = 60;
  let sqScore = 60;

  Object.entries(answers).forEach(([qId, val]) => {
    const q = EQ_SQ_QUESTIONS.find((item) => item.id === qId);
    if (q) {
      const opt = q.options.find((o) => o.scoreValue === val);
      if (opt?.scoreKey === 'eq') {
        eqScore += (val - 2.5) * 7;
      } else if (opt?.scoreKey === 'sq') {
        sqScore += (val - 2.5) * 7;
      }
    }
  });

  const normalizedEq = Math.min(98, Math.max(20, Math.round(eqScore)));
  const normalizedSq = Math.min(98, Math.max(20, Math.round(sqScore)));

  let primaryResult = 'The Harmonic Integrator (Type B — Balanced Lens)';
  let subtitle = 'Equal resonance with human emotion and structural clarity';
  let summary =
    'You possess the rare gift of holding both emotional empathy and analytical system design in peaceful equilibrium. You can feel what someone is going through while simultaneously seeing the practical architecture to help them.';

  if (normalizedEq - normalizedSq >= 18) {
    primaryResult = 'The Empathetic Sensor (Type E — Deep Emotional Attunement)';
    subtitle = 'Gifted in human resonance, psychological safety, and unspoken truth';
    summary =
      'Your cognitive antenna instinctively tunes into emotional frequencies, body language, and the living human heart. You perceive shifts in feelings before people even articulate them.';
  } else if (normalizedSq - normalizedEq >= 18) {
    primaryResult = 'The System Architect (Type S — Analytical Pattern Clarity)';
    subtitle = 'Gifted in logical structures, troubleshooting, and elegant order';
    summary =
      'Your mind is a natural analytical synthesizer that loves deconstructing rules, finding systemic leverage points, and bringing calm order to chaotic information.';
  }

  return {
    frameworkId: 'empathizing_systemizing',
    frameworkName: 'Empathizing–Systemizing (Cognitive Lens)',
    completedAt: new Date().toISOString(),
    primaryResult,
    subtitle,
    summary,
    scores: {
      empathizing: normalizedEq,
      systemizing: normalizedSq,
      'Empathizing Quotient (Emotional Resonance)': normalizedEq,
      'Systemizing Quotient (Pattern & Structural Clarity)': normalizedSq,
    },
    strengths: [
      'Ability to navigate both human relationships and complex technical realities',
      'High analytical perceptiveness without jumping to shallow conclusions',
      'Natural diplomacy when mediating between feelings and facts',
    ],
    growthEdges: [
      'Do not try to "fix" every emotional struggle with a logical system; sometimes presence is enough',
      'Protect your quiet solitude so your analytical mind doesn’t burn out',
    ],
    empoweringMantra:
      '“I honor both my open heart and my sharp mind. Love gives my systems meaning; order gives my compassion endurance.”',
  };
}

// =========================================================================
// 4. PERSONALITY TYPE INDICATOR (16-TYPE WORK & RELATIONSHIP COMPASS)
// =========================================================================
export const MBTI_QUESTIONS: GenericQuizQuestion[] = [
  {
    id: 'mb_1',
    prompt: 'Energy Source: After a long week, how do you recharge your deepest battery?',
    options: [
      { id: 'mb1_i', label: 'In quiet sanctuary, solitary reading, or peaceful unhurried hobbies', scoreKey: 'I', scoreValue: 1 },
      { id: 'mb1_e', label: 'Surrounded by lively friends, sharing stories, and active social buzz', scoreKey: 'E', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_2',
    prompt: 'Energy Expression: In group settings or creative discussions:',
    options: [
      { id: 'mb2_i', label: 'I process thoughts internally before choosing to speak with care', scoreKey: 'I', scoreValue: 1 },
      { id: 'mb2_e', label: 'I think out loud, bouncing ideas around in real time', scoreKey: 'E', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_3',
    prompt: 'Energy Cadence: When unexpected guests or unplanned social events arise:',
    options: [
      { id: 'mb3_i', label: 'I feel an internal tax on my battery and prefer advance warning', scoreKey: 'I', scoreValue: 1 },
      { id: 'mb3_e', label: 'I feel a spontaneous burst of excitement and welcome the novelty', scoreKey: 'E', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_4',
    prompt: 'Information Perception: When taking in information about the world:',
    options: [
      { id: 'mb4_s', label: 'I trust concrete reality, real-world facts, and tangible practical details', scoreKey: 'S', scoreValue: 1 },
      { id: 'mb4_n', label: 'I read between the lines, seeking patterns, future potentials, and symbols', scoreKey: 'N', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_5',
    prompt: 'Information Focus: Which type of conversation holds your attention longer?',
    options: [
      { id: 'mb5_s', label: 'Useful, grounded discussions about craft, current events, and how things work', scoreKey: 'S', scoreValue: 1 },
      { id: 'mb5_n', label: 'Philosophical theories, human destiny, and imaginative "what if" dreams', scoreKey: 'N', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_6',
    prompt: 'Information Memory: How do you remember past experiences?',
    options: [
      { id: 'mb6_s', label: 'Vivid sensory memories: sights, sounds, specific words, and exact steps', scoreKey: 'S', scoreValue: 1 },
      { id: 'mb6_n', label: 'The overarching atmosphere, emotional impression, and deeper meaning', scoreKey: 'N', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_7',
    prompt: 'Decision Making: When faced with a difficult choice involving others:',
    options: [
      { id: 'mb7_t', label: 'I step back to weigh objective logic, fairness, principles, and consequences', scoreKey: 'T', scoreValue: 1 },
      { id: 'mb7_f', label: 'I put myself in their shoes, prioritizing empathy, values, and harmony', scoreKey: 'F', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_8',
    prompt: 'Decision Feedback: If someone asks for your honest critique of their work:',
    options: [
      { id: 'mb8_t', label: 'I offer direct, constructive critique because truth is the kindest help', scoreKey: 'T', scoreValue: 1 },
      { id: 'mb8_f', label: 'I cushion my thoughts with encouragement to protect their confidence', scoreKey: 'F', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_9',
    prompt: 'Decision Pride: What gives you greater quiet pride at the end of the day?',
    options: [
      { id: 'mb9_t', label: 'Having solved a hard problem with elegant, unbiased clarity', scoreKey: 'T', scoreValue: 1 },
      { id: 'mb9_f', label: 'Having made someone feel genuinely valued, safe, and loved', scoreKey: 'F', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_10',
    prompt: 'Lifestyle Structure: How do you like your upcoming week to look?',
    options: [
      { id: 'mb10_j', label: 'Planned out with clear milestones and comfortable predictability', scoreKey: 'J', scoreValue: 1 },
      { id: 'mb10_p', label: 'Open, fluid, and flexible so I can follow inspiration as it strikes', scoreKey: 'P', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_11',
    prompt: 'Lifestyle Deadlines: When facing an important upcoming deadline:',
    options: [
      { id: 'mb11_j', label: 'I finish well ahead of time to eliminate last-minute stress', scoreKey: 'J', scoreValue: 1 },
      { id: 'mb11_p', label: 'A burst of last-minute pressure often gives me my sharpest creative focus', scoreKey: 'P', scoreValue: 2 },
    ],
  },
  {
    id: 'mb_12',
    prompt: 'Lifestyle Closure: How do you feel about open-ended questions without immediate answers?',
    options: [
      { id: 'mb12_j', label: 'I prefer reaching a firm decision and closure so we can move forward', scoreKey: 'J', scoreValue: 1 },
      { id: 'mb12_p', label: 'I enjoy keeping options open as long as possible to discover new paths', scoreKey: 'P', scoreValue: 2 },
    ],
  },
];

export function scoreMbti(answers: Record<string, number>): GenericQuizResult {
  const tallies = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  Object.entries(answers).forEach(([qId, val]) => {
    const q = MBTI_QUESTIONS.find((item) => item.id === qId);
    if (q) {
      const opt = q.options.find((o) => o.scoreValue === val);
      if (opt && (tallies as Record<string, number>)[opt.scoreKey] !== undefined) {
        (tallies as Record<string, number>)[opt.scoreKey] += 1;
      }
    }
  });

  const letter1 = tallies.E > tallies.I ? 'E' : 'I';
  const letter2 = tallies.S > tallies.N ? 'S' : 'N';
  const letter3 = tallies.T > tallies.F ? 'T' : 'F';
  const letter4 = tallies.J > tallies.P ? 'J' : 'P';

  const type = `${letter1}${letter2}${letter3}${letter4}`;

  const typeProfiles: Record<
    string,
    { title: string; subtitle: string; work: string; relationship: string; mantra: string }
  > = {
    INFJ: {
      title: 'The Insightful Counselor (INFJ)',
      subtitle: 'Quiet Visionary • Compassionate Depth • Principled Guardian',
      work: 'Deep independent strategic foresight, counseling, writing, mission-aligned leadership.',
      relationship: 'Values profound soulful intimacy, emotional authenticity, and unconditional loyalty.',
      mantra: '“I do not need to save the whole world today. Loving those in my presence is enough.”',
    },
    INTJ: {
      title: 'The Master Strategist (INTJ)',
      subtitle: 'Clear Architect • Relentless Mastery • Sovereign Independence',
      work: 'System architecture, long-horizon strategy, complex engineering, high-stakes analysis.',
      relationship: 'Values intellectual depth, quiet integrity, mutual independence, and honest growth.',
      mantra: '“I build with quiet patience. The future belongs to those who prepare with steady discipline.”',
    },
    INFP: {
      title: 'The Gentle Healer (INFP)',
      subtitle: 'Poetic Soul • Unshakable Values • Tender Empathy',
      work: 'Creative writing, artistic expression, humanitarian advocacy, values-driven craft.',
      relationship: 'Treasures gentle tenderness, safe vulnerability, and acceptance of all flaws.',
      mantra: '“I am human, not an angel. My authentic presence is a gift to this noisy world.”',
    },
    INTP: {
      title: 'The Philosophical Innovator (INTP)',
      subtitle: 'Curious Logician • Unbiased Truth • Pattern Decrypter',
      work: 'Research, algorithms, conceptual design, unconstrained philosophical inquiry.',
      relationship: 'Values freedom from emotional drama, engaging banter, and space for contemplation.',
      mantra: '“I honor the pursuit of truth while keeping my heart open to human mystery.”',
    },
    ENFJ: {
      title: 'The Inspiring Mentor (ENFJ)',
      subtitle: 'Catalytic Presence • Generous Heart • Transformative Community',
      work: 'Leadership development, communication, community building, cultural elevation.',
      relationship: 'Nurtures partners with devotion, celebrating their triumphs and holding their burdens.',
      mantra: '“I fill my own cup first so my generosity comes from peace, not self-abandonment.”',
    },
    ENTJ: {
      title: 'The Sovereign Commander (ENTJ)',
      subtitle: 'Decisive Architect • Bold Purpose • High-Leverage Impact',
      work: 'Executive building, systemic reorganization, launching ambitious ventures.',
      relationship: 'Values courageous ambition, direct accountability, and shared kingdom-building.',
      mantra: '“True strength is calm. I lead through inspiring clarity rather than force.”',
    },
    ENFP: {
      title: 'The Radiant Visionary (ENFP)',
      subtitle: 'Creative Spark • Boundary-Free Wonder • Enthusiastic Pioneer',
      work: 'Storytelling, campaign design, ideation, cross-pollinating disciplines.',
      relationship: 'Brings infectious joy, deep curiosity about the partner’s soul, and playfulness.',
      mantra: '“I ground my brilliant sparks with daily responsible habits so my dreams take root.”',
    },
    ENTP: {
      title: 'The Visionary Challenger (ENTP)',
      subtitle: 'Quick Wit • Dialectical Explorer • Unorthodox Thinker',
      work: 'Product incubation, debate, strategic pivot consulting, paradigm innovation.',
      relationship: 'Thrives on intellectual sparring, unpretentious humor, and shared adventure.',
      mantra: '“I channel my restless curiosity into deep mastery of one worthy mountain at a time.”',
    },
    ISFJ: {
      title: 'The Devoted Protector (ISFJ)',
      subtitle: 'Quiet Anchor • Steadfast Care • Thoughtful Dependability',
      work: 'Healthcare, administration, stewardship of sacred spaces, operations with heart.',
      relationship: 'Expresses love through acts of devotion, thoughtful memory, and unwavering loyalty.',
      mantra: '“My kindness is noble, and my boundaries are strong. I am good, but never used.”',
    },
    ISTJ: {
      title: 'The Grounded Pillar (ISTJ)',
      subtitle: 'Rock of Integrity • Dependable Realist • Flawless Duty',
      work: 'Accounting, structural engineering, logistical mastery, legal/compliance excellence.',
      relationship: 'Provides unwavering stability, practical support, and honoring every vow made.',
      mantra: '“Steadiness is my quiet superpower. In a world of chaos, I stand as a rock of truth.”',
    },
    ISFP: {
      title: 'The Harmonious Artisan (ISFP)',
      subtitle: 'Sensitive Creator • Gentle Presence • Living in Harmony',
      work: 'Visual arts, botanical craft, somatic therapy, design rooted in sensory nuance.',
      relationship: 'Loves with quiet tenderness, gentle respect, and shared appreciation of beauty.',
      mantra: '“I move at my own unhurried tempo, trusting that beauty unfolds in quiet patience.”',
    },
    ISTP: {
      title: 'The Master Technician (ISTP)',
      subtitle: 'Pragmatic Virtuoso • Cool Composure • Kinetic Problem Solver',
      work: 'Mechanical craftsmanship, emergency response, precision tool operation, prototyping.',
      relationship: 'Calm under fire, respects freedom, shows affection through fixing and doing.',
      mantra: '“I stay calm, assess reality as it is, and solve problems with quiet efficiency.”',
    },
    ESFJ: {
      title: 'The Warm Provider (ESFJ)',
      subtitle: 'Hospitality Anchor • Generous Empathy • Loyal Steward',
      work: 'Event curation, community coordination, human resources, compassionate service.',
      relationship: 'Creates an inviting home, anticipates emotional needs, and celebrates milestones.',
      mantra: '“I celebrate my warm heart while learning to say loving, firm "no"s when needed.”',
    },
    ESTJ: {
      title: 'The Dependable Organizer (ESTJ)',
      subtitle: 'Principled Director • Clear Structure • Practical Results',
      work: 'Project operations, legal leadership, civic stewardship, supply chain execution.',
      relationship: 'Reliable provider, values family traditions, direct clarity, and mutual loyalty.',
      mantra: '“I combine clear order with gentle patience for those walking at different speeds.”',
    },
    ESFP: {
      title: 'The Joyful Performer (ESFP)',
      subtitle: 'Spontaneous Spark • Generous Warmth • Celebrating Life',
      work: 'Hospitality, experiential performance, coaching, youth mentorship, culinary art.',
      relationship: 'Infuses warmth, affection, laughter, and sensory celebrations into daily life.',
      mantra: '“I bring light to every room, and anchor my joy in daily self-discipline.”',
    },
    ESTP: {
      title: 'The Bold Realist (ESTP)',
      subtitle: 'Kinetic Dynamo • Fearless Agility • Pragmatic Opportunist',
      work: 'Negotiation, athletics, frontline emergency response, venture sales.',
      relationship: 'Thrives on shared adventures, direct transparency, and bold living.',
      mantra: '“I focus my fierce energy on what truly endures, building a legacy of honor.”',
    },
  };

  const profile = typeProfiles[type] || typeProfiles['INFJ'];

  return {
    frameworkId: 'mbti16',
    frameworkName: '16-Type Work & Relationship Compass',
    completedAt: new Date().toISOString(),
    primaryResult: profile.title,
    subtitle: profile.subtitle,
    summary: `${profile.work} In personal relationships: ${profile.relationship}`,
    scores: {
      [`${letter1 === 'E' ? 'Extraversion (E)' : 'Introversion (I)'}`]: 75,
      [`${letter2 === 'S' ? 'Sensing / Practical (S)' : 'Intuition / Vision (N)'}`]: 70,
      [`${letter3 === 'T' ? 'Thinking / Logic (T)' : 'Feeling / Values (F)'}`]: 75,
      [`${letter4 === 'J' ? 'Judging / Structure (J)' : 'Perceiving / Fluid (P)'}`]: 68,
    },
    strengths: [
      `Professional Gift: ${profile.work}`,
      `Relational Gift: ${profile.relationship}`,
    ],
    growthEdges: [
      'Recognize when your dominant style blinds you to the gifts of opposite types',
      'Give yourself permission to slow down and breathe without guilt',
    ],
    empoweringMantra: profile.mantra,
  };
}

// =========================================================================
// 5. TRUE COLOURS TEMPERAMENT (COMMUNICATION BLUEPRINT)
// =========================================================================
export const TRUE_COLOURS_QUESTIONS: GenericQuizQuestion[] = [
  {
    id: 'tc_1',
    prompt: 'At your core, what drives your greatest sense of pride?',
    options: [
      { id: 'tc1_green', label: 'My intellect, competency, and capacity to solve difficult problems', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc1_blue', label: 'My authenticity, deep compassion, and ability to help others feel loved', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc1_gold', label: 'My dependability, loyalty, responsibility, and keeping commitments', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc1_orange', label: 'My courage, adaptability, freedom, and ability to act under pressure', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
  {
    id: 'tc_2',
    prompt: 'What frustrates you most when interacting with others?',
    options: [
      { id: 'tc2_green', label: 'Illogical thinking, superficial chatter, and blind adherence to rules', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc2_blue', label: 'Coldness, cruelty, insincerity, and conflict that tears people apart', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc2_gold', label: 'Irresponsibility, chronic lateness, disorganization, and broken promises', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc2_orange', label: 'Boring bureaucracy, rigid micromanagement, and lack of freedom', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
  {
    id: 'tc_3',
    prompt: 'In conversation, how do you prefer people speak with you?',
    options: [
      { id: 'tc3_green', label: 'Be concise, logical, and respect my intellectual autonomy', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc3_blue', label: 'Be warm, genuine, listen deeply, and care about how we feel', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc3_gold', label: 'Be punctual, structured, clear on expectations, and dependable', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc3_orange', label: 'Keep it lively, direct, fun, and give me room to move', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
  {
    id: 'tc_4',
    prompt: 'When planning a weekend or vacation:',
    options: [
      { id: 'tc4_green', label: 'I want quiet time to dive into fascinations, books, and ideas', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc4_blue', label: 'I want intimate, heart-to-heart connections in a beautiful setting', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc4_gold', label: 'I want reservations confirmed, a clean plan, and serene predictability', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc4_orange', label: 'I want zero rigid plans—just pack a bag and follow adventure', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
  {
    id: 'tc_5',
    prompt: 'How do you contribute most effectively to a team or family?',
    options: [
      { id: 'tc5_green', label: 'Designing innovative solutions and visioning long-term architecture', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc5_blue', label: 'Building unity, resolving emotional tension, and inspiring harmony', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc5_gold', label: 'Keeping the schedule, managing details, and maintaining stability', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc5_orange', label: 'Injecting energy, negotiating crises, and taking decisive action', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
  {
    id: 'tc_6',
    prompt: 'What kind of work environment brings out your best performance?',
    options: [
      { id: 'tc6_green', label: 'Independent, intellectual challenge with freedom to rethink systems', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc6_blue', label: 'Collaborative, values-driven environment with supportive peers', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc6_gold', label: 'Organized, clear hierarchy with defined roles and dependable standards', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc6_orange', label: 'Fast-paced, flexible, dynamic space with tangible hands-on projects', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
  {
    id: 'tc_7',
    prompt: 'Under high stress or exhaustion, what is your typical reflex?',
    options: [
      { id: 'tc7_green', label: 'I withdraw into my mind, become emotionally detached and critical', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc7_blue', label: 'I feel deeply hurt, cry, or take on the weight of everyone’s pain', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc7_gold', label: 'I worry excessively, become rigid, and try to control small details', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc7_orange', label: 'I become rebellious, restless, or check out with impulsive distractions', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
  {
    id: 'tc_8',
    prompt: 'What is the most loving compliment someone could pay you?',
    options: [
      { id: 'tc8_green', label: '“Your mind is brilliant and your insight opened up a whole new world.”', scoreKey: 'green', scoreValue: 1 },
      { id: 'tc8_blue', label: '“You make me feel truly seen, accepted, and safe just as I am.”', scoreKey: 'blue', scoreValue: 2 },
      { id: 'tc8_gold', label: '“You are the rock of our life; your loyalty and care never waver.”', scoreKey: 'gold', scoreValue: 3 },
      { id: 'tc8_orange', label: '“Life is so much more exciting, authentic, and brave with you around.”', scoreKey: 'orange', scoreValue: 4 },
    ],
  },
];

export function scoreTrueColours(answers: Record<string, number>): GenericQuizResult {
  const tallies: Record<string, number> = { green: 0, blue: 0, gold: 0, orange: 0 };

  Object.entries(answers).forEach(([qId, val]) => {
    const q = TRUE_COLOURS_QUESTIONS.find((item) => item.id === qId);
    if (q) {
      const opt = q.options.find((o) => o.scoreValue === val);
      if (opt && tallies[opt.scoreKey] !== undefined) {
        tallies[opt.scoreKey] += 1;
      }
    }
  });

  const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];

  const profiles: Record<
    string,
    { title: string; subtitle: string; summary: string; strengths: string[]; edges: string[]; mantra: string }
  > = {
    blue: {
      title: 'Empathetic Blue (The Heart of Connection)',
      subtitle: 'Warm • Authentic • Values-Centered • Peacemaker',
      summary:
        'You are guided by genuine human connection, harmony, and profound empathy. You bring tenderness and psychological safety into every room you enter.',
      strengths: [
        'Natural ability to make others feel truly seen, heard, and cherished',
        'Deep intuition for emotional atmosphere and unspoken needs',
        'Inspires reconciliation and sincere human cooperation',
      ],
      edges: [
        'Boundary Shield: Remember that being kind does not mean letting others exploit you',
        'Release the urge to fix everyone’s emotional weather at the expense of your own peace',
      ],
      mantra: '“I am worthy of the same boundless love and gentle care that I pour out to others.”',
    },
    green: {
      title: 'Analytical Green (The Mind of Innovation)',
      subtitle: 'Logical • Independent • Conceptual • Master Builder',
      summary:
        'You seek competence, knowledge, and elegant systemic truth. You look at chaos and naturally envision the underlying principles and solutions.',
      strengths: [
        'Rigorous analytical objectivity and visionary conceptual thinking',
        'Relentless curiosity and high standard of personal craftsmanship',
        'Calm problem-solving under confusing circumstances',
      ],
      edges: [
        'Patience: Remember that others feel before they think; honor their emotional cadence',
        'Allow yourself to experience emotions without needing to rationalize them away',
      ],
      mantra: '“I balance my sharp intellect with a patient, open heart.”',
    },
    gold: {
      title: 'Grounded Gold (The Anchor of Duty & Care)',
      subtitle: 'Dependable • Loyal • Organized • Steadfast Guardian',
      summary:
        'You are the bedrock of community and family. You value punctuality, integrity, traditions, and keeping promises. What you say you will do, you deliver.',
      strengths: [
        'Flawless reliability and meticulous stewardship of responsibilities',
        'Creates calm order and protective stability in chaotic environments',
        'Deep loyalty to loved ones and foundational values',
      ],
      edges: [
        'Release over-controlling small details when plans change unexpectedly',
        'Give yourself permission to rest without feeling guilty or irresponsible',
      ],
      mantra: '“I have done enough today. I can put down my duties and rest in peace.”',
    },
    orange: {
      title: 'Spontaneous Orange (The Spark of Action & Freedom)',
      subtitle: 'Courageous • Adaptable • Playful • Dynamic Catalyst',
      summary:
        'You thrive on action, tangible results, freedom, and humor. While others hesitate in fear, you dive in, adapt on the fly, and breathe vitality into the world.',
      strengths: [
        'Fearless adaptability and composure during acute crisis',
        'Brings infectious humor, optimism, and zest to life',
        'Kinetic problem-solver who learns by doing rather than theorizing',
      ],
      edges: [
        'Patience with long-term, slow-moving administrative responsibilities',
        'Focus Anchor: Stop jumping frantically from thing to thing—finish one mountain first',
      ],
      mantra: '“I anchor my wild creative spirit in steady daily focus. Freedom is built on self-discipline.”',
    },
  };

  const current = profiles[primary] || profiles['blue'];
  const total = Object.values(tallies).reduce((acc, v) => acc + v, 0) || 1;

  return {
    frameworkId: 'true_colours',
    frameworkName: 'True Colours Temperament (Communication Blueprint)',
    completedAt: new Date().toISOString(),
    primaryResult: current.title,
    subtitle: current.subtitle,
    summary: current.summary,
    scores: {
      'Empathetic Blue': Math.round((tallies.blue / total) * 100),
      'Analytical Green': Math.round((tallies.green / total) * 100),
      'Grounded Gold': Math.round((tallies.gold / total) * 100),
      'Spontaneous Orange': Math.round((tallies.orange / total) * 100),
    },
    strengths: current.strengths,
    growthEdges: current.edges,
    empoweringMantra: current.mantra,
  };
}
