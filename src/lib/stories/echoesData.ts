/**
 * BECOMING Echoes of Shared Humanity & Nature Canvas
 * Moving stories of patience, responsibility, overcoming bad habits and heartbreak.
 * Curated peaceful SVG/CSS nature canvases for contemplation mode.
 */

import { EchoStory } from '@/types';

export const ECHOES_STORIES: EchoStory[] = [
  {
    id: 'bamboo',
    title: 'The Underground Bamboo',
    subtitle: 'On Invisible Growth and the Discipline of Patience',
    theme: 'Patience & Persistence',
    authorOrOrigin: 'Traditional Eastern Parable',
    narrative: [
      'For four long years, the Chinese bamboo farmer waters the seed and nurtures the soil every morning. The ground remains completely flat and bare. Neighbors laugh and whisper that he is wasting his time on dead earth.',
      'Yet deep beneath the surface, thousands of invisible roots are tunneling deep into the bedrock, weaving a massive subterranean network capable of anchoring enormous weight.',
      'In the fifth year, a tiny green shoot breaches the dark soil. Within six weeks, the bamboo skyrockets ninety feet into the morning sun.',
      'Did the bamboo grow ninety feet in six weeks? No. It grew ninety feet through five patient years of unobserved, uncelebrated underground faithfulness.',
    ],
    takeaway:
      'When your life feels stuck or unrewarded, do not despair. You are building roots in the dark. Keep watering the earth today.',
  },
  {
    id: 'the_potter',
    title: 'The Cracked Clay Vessel',
    subtitle: 'On Flaws, Worthiness, and Radical Self-Acceptance',
    theme: 'Not an Angel, Still Worthy',
    authorOrOrigin: 'Ancient Wisdom Folktale',
    narrative: [
      'An elder water-bearer carried two large clay pots on a wooden pole across his shoulders. One pot was perfectly shaped and delivered a full measure of fresh water from the stream. The other pot had a hairline crack along its side, arriving at the house only half-full.',
      'For years, the cracked pot felt deep, burning shame. One evening, it wept and spoke to the elder: “I am miserable because of my flaw. Half the water leaks along the dirt path and makes your labor twice as hard.”',
      'The elder smiled with infinite kindness: “Did you not notice the brilliant wild blossoms blooming along your side of the path, but not on the other? Every morning, your gentle dripping watered the thirsty seeds. Because of who you are, we brought beauty to the village table.”',
    ],
    takeaway:
      'You are human, not an angel. Your imperfections do not disqualify you from life; they make you tender, relatable, and capable of watering seeds in dry places.',
  },
  {
    id: 'quitting_smoke',
    title: 'The Blacksmith and the Ember',
    subtitle: 'On Overcoming Addictions and Breaking Bad Habits',
    theme: 'Habit Liberation',
    authorOrOrigin: 'The Parable of the Forge',
    narrative: [
      'A young blacksmith was captive to an old smoking habit that made his breath short and robbed his strength before the anvil. Whenever life grew heavy or stressful, his hands instinctively reached for smoke to numb the ache.',
      'One winter dawn, weary of being controlled by a tiny stick of ash, he laid down the pouch on the cold iron anvil and said aloud: “I am a free human being. I refuse to give my lungs, my coins, and my sovereignty to a burning lie.”',
      'When the violent cravings surged like wildfire in his throat, he did not run away. He stepped out into the freezing courtyard, took three immense breaths of clean mountain air, and drank cold spring water.',
      'He whispered to his body: “Feel the craving. Let it burn. It cannot kill you. Each wave you ride makes you the sovereign master of this house.” Within thirty days, the fog lifted, his stamina returned, and his chest expanded with pure life.',
    ],
    takeaway:
      'An impulse is only a 90-second neurochemical wave. Breathe through it. You are far stronger than any cigarette, scroll, or craving.',
  },
  {
    id: 'the_wall',
    title: 'The Fortress and the Open Gate',
    subtitle: 'On Healthy Boundaries: Good, But Never Used',
    theme: 'The Boundary Shield',
    authorOrOrigin: 'A Modern Sanctuary Parable',
    narrative: [
      'A gentle woman dedicated her life to helping everyone in her town. She loaned money she needed for rent, said yes to demands that drained her sleep, and listened for hours to people who only dumped bitterness on her porch.',
      'Slowly, her health withered. She grew resentful, exhausted, and hollow inside. In tears, she retreated into the hills and asked a wise mentor: “Why do I feel so broken when all I ever tried to do was be a good person?”',
      'The mentor looked at her tenderly: “Being good does not mean being a doormat for careless feet. A sacred garden needs a strong cedar fence. When you permit others to exploit you, you enable their selfishness and destroy your own peace.”',
      'She returned to town with a quiet new strength. She continued to give love, but when demands crossed her health, she spoke with calm clarity: “I love you, but I cannot do that.” Those who truly loved her stayed; those who only used her vanished.',
    ],
    takeaway:
      'Kindness without boundaries is self-destruction. You can be the kindest person in the room while holding walls of diamond around your peace.',
  },
  {
    id: 'two_wolves',
    title: 'The Grandfather at Twilight',
    subtitle: 'On Returning Your Energy to Your Own Path',
    theme: 'Release Judgment',
    authorOrOrigin: 'Traditional Cherokee Wisdom',
    narrative: [
      'An elder sat by the evening fire with his grandson, watching the red embers rise into the twilight sky.',
      '“A fight is going on inside every human heart,” the grandfather said. “It is a terrible fight between two wolves. One is anger, jealousy, arrogance, judgment of others, and bitter resentment.”',
      '“The other wolf is peace, empathy, generosity, humility, gratitude, and clean responsibility for one’s own life.”',
      'The grandson looked up into the darkness and asked, “Grandfather, which wolf wins?”',
      'The elder smiled gently: “The one you feed.”',
    ],
    takeaway:
      'Everyone is fighting hidden battles you know nothing about. Stop wasting your short life judging or comparing yourself to others. Return your precious energy home.',
  },
];

export interface NatureCanvasScene {
  id: string;
  name: string;
  tagline: string;
  gradient: string;
  accentColor: string;
  elements: 'mist' | 'mountains' | 'ocean' | 'forest' | 'starlight';
}

export const NATURE_CANVAS_SCENES: NatureCanvasScene[] = [
  {
    id: 'aurora',
    name: 'Twilight Sanctuary Aurora',
    tagline: 'Quiet violet horizon meeting cold alpine air',
    gradient: 'from-slate-950 via-indigo-950 to-purple-950',
    accentColor: '#818CF8',
    elements: 'starlight',
  },
  {
    id: 'dawn_mountain',
    name: 'Mountain Sunrise',
    tagline: 'Golden morning light kissing ancient granite ridges',
    gradient: 'from-amber-950/70 via-slate-900 to-indigo-950',
    accentColor: '#F59E0B',
    elements: 'mountains',
  },
  {
    id: 'forest_mist',
    name: 'Emerald Redwood Mist',
    tagline: 'Deep quiet cedars breathing gentle ocean fog',
    gradient: 'from-slate-950 via-emerald-950 to-teal-950',
    accentColor: '#10B981',
    elements: 'forest',
  },
  {
    id: 'ocean_tide',
    name: 'Pacific Blue Swells',
    tagline: 'Rhythmic, unhurried waves washing away all burdens',
    gradient: 'from-slate-950 via-sky-950 to-blue-950',
    accentColor: '#38BDF8',
    elements: 'ocean',
  },
  {
    id: 'solitary_lake',
    name: 'Still Mirror Lake',
    tagline: 'Glass water reflecting passing clouds with zero friction',
    gradient: 'from-slate-950 via-stone-900 to-slate-900',
    accentColor: '#94A3B8',
    elements: 'mist',
  },
];
