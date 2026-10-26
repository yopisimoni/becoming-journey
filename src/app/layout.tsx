import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { SafetyModal } from '@/components/SafetyModal';

export const metadata: Metadata = {
  title: 'BECOMING — Guided Reflection Preview',
  description:
    'A calm, beautiful, non-judgmental digital space for self-directed reflection and mindful micro-steps. Local-first, private, and zero cloud AI.',
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
      <body className="bg-ivory-100 text-stone-charcoal min-h-screen flex flex-col font-sans selection:bg-violet-soft selection:text-violet-deep">
        <AppProvider>
          <DisclaimerBanner />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
          <footer className="border-t border-ivory-300 py-6 text-center text-xs text-stone-mist space-y-1 bg-ivory-50/80">
            <p>BECOMING • Local-First Personal Reflection Prototype (v0.1-Alpha)</p>
            <p className="text-[11px]">
              Non-clinical • Zero AI APIs • Zero Remote Database • All Data Resides Locally
            </p>
          </footer>
          <SafetyModal />
        </AppProvider>
      </body>
    </html>
  );
}
