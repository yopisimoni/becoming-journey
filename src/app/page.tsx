'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { WelcomeView } from '@/components/WelcomeView';
import { GuidedReflectionView } from '@/components/GuidedReflectionView';
import { FreeJournalView } from '@/components/FreeJournalView';
import { JustListenView } from '@/components/JustListenView';
import { JourneyMapView } from '@/components/JourneyMapView';
import { PersonalProgressView } from '@/components/PersonalProgressView';
import { SelfDiscoveryQuizView } from '@/components/SelfDiscoveryQuizView';
import { HorizonCalendarView } from '@/components/HorizonCalendarView';
import { DashboardView } from '@/components/DashboardView';
import { SecretVaultView } from '@/components/SecretVaultView';
import { HabitBalanceView } from '@/components/HabitBalanceView';
import { SettingsAndAboutView } from '@/components/SettingsAndAboutView';

export default function HomePage() {
  const { activeTab, activeMode, currentIntent } = useApp();

  // Tab-based Studios
  if (activeTab === 'map') {
    return <JourneyMapView />;
  }

  if (activeTab === 'progress') {
    return <PersonalProgressView />;
  }

  if (activeTab === 'breathe') {
    return <JustListenView />;
  }

  if (activeTab === 'quiz') {
    return <SelfDiscoveryQuizView />;
  }

  if (activeTab === 'dashboard') {
    return <DashboardView />;
  }

  if (activeTab === 'calendar') {
    return <HorizonCalendarView />;
  }

  if (activeTab === 'habits') {
    return <HabitBalanceView />;
  }

  if (activeTab === 'vault') {
    return <SecretVaultView />;
  }

  if (activeTab === 'settings') {
    return <SettingsAndAboutView />;
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
