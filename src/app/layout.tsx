import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { FloatingDock } from '@/components/FloatingDock';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { SafetyModal } from '@/components/SafetyModal';
import { OnboardingWelcomeModal } from '@/components/OnboardingWelcomeModal';
import { AtmosphereBackground } from '@/components/AtmosphereBackground';

export const metadata: Metadata = {
  title: 'BECOMING — The Living Light Sanctuary',
  description:
    'A calm, deeply peaceful digital sanctuary for self-directed reflection and mindful micro-steps. Local-first, private, and zero cloud AI.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/becoming-living-light-icon.svg',
    apple: '/becoming-living-light-icon.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-1000 ease-in-out text-slate-900 dark:text-white selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200">
        <AppProvider>
          <AtmosphereBackground />
          <DisclaimerBanner />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4">{children}</main>
          <FloatingDock />
          <footer className="border-t border-slate-200/80 dark:border-white/10 py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-colors duration-1000 ease-in-out">
            <p className="font-medium text-slate-700 dark:text-slate-300">BECOMING • The Living Experience (v0.9)</p>
            <p className="text-[11px]">
              Non-clinical • Local-First Sanctuary • Zero Tracking • All Data Resides on Your Device
            </p>
          </footer>
          <SafetyModal />
          <OnboardingWelcomeModal />
        </AppProvider>
      </body>
    </html>
  );
}
