'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { WelcomeView } from '@/components/WelcomeView';
import { GuidedReflectionView } from '@/components/GuidedReflectionView';
import { FreeJournalView } from '@/components/FreeJournalView';
import { JustListenView } from '@/components/JustListenView';
import { JourneyMapView } from '@/components/JourneyMapView';
import { PersonalProgressView } from '@/components/PersonalProgressView';

export default function HomePage() {
  const { activeTab, activeMode, currentIntent } = useApp();

  if (activeTab === 'map') {
    return <JourneyMapView />;
  }

  if (activeTab === 'progress') {
    return <PersonalProgressView />;
  }

  // Active tab is 'home'
  if (activeMode === 'journal') {
    return <FreeJournalView />;
  }

  if (activeMode === 'listen') {
    return <JustListenView />;
  }

  // Active mode is 'guided'
  if (!currentIntent) {
    return <WelcomeView />;
  }

  return <GuidedReflectionView />;
}
