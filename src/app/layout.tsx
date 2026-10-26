import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { SafetyModal } from '@/components/SafetyModal';
import { AtmosphereBackground } from '@/components/AtmosphereBackground';

export const metadata: Metadata = {
  title: 'BECOMING — The Sanctuary Upgrade',
  description:
    'A calm, deeply peaceful digital sanctuary for self-directed reflection and mindful micro-steps. Local-first, private, and zero cloud AI.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-500 text-stone-charcoal dark:text-ivory-100 selection:bg-violet-soft selection:text-violet-deep">
        <AppProvider>
          <AtmosphereBackground />
          <DisclaimerBanner />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
          <footer className="border-t border-ivory-300 dark:border-white/10 py-6 text-center text-xs text-stone-mist dark:text-stone-400 space-y-1 bg-ivory-50/60 dark:bg-stone-900/40 backdrop-blur-md">
            <p>BECOMING • The Sanctuary Upgrade (v0.2)</p>
            <p className="text-[11px]">
              Non-clinical • Local-First Sanctuary • Zero Tracking • All Data Resides on Your Device
            </p>
          </footer>
          <SafetyModal />
        </AppProvider>
      </body>
    </html>
  );
}
