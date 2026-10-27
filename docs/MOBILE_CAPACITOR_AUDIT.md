# BECOMING — Mobile Capacitor Architecture & Experience Audit (v0.8)

## 1. Executive Summary & Objective

**BECOMING** is architected as a zero-cost, static, client-first personal sanctuary built with Next.js App Router, TypeScript, and Tailwind CSS. As part of the **v0.8** milestone, this document provides an engineering, UX, privacy, and lifecycle audit for packaging BECOMING into native iOS and Android mobile binaries using **Capacitor 6** without violating our foundational invariants:

1. **Zero External AI Calls**
2. **Zero Remote Databases / Telemetry**
3. **Zero Remote CDNs / External Fonts**
4. **Local Data Isolation & Sovereignty**
5. **Confirm-Before-Save Guarantee**
6. **5-Locale Parity with RTL Support**
7. **Accessibility & Reduced Motion Compliance**

---

## 2. Next.js Static Export Compatibility

### Architecture Validation
BECOMING uses Next.js static HTML export (`output: 'export'` configured in `next.config.js`). All application pages, components, sound synthesizers, and assets compile to deterministic static files in the `/out` directory.

### Asset Loading & Routing in Capacitor WebView
- **Origin & Protocols:**
  - Android: `https://localhost` or `http://localhost` served via Android WebView AssetLoader.
  - iOS: `capacitor://localhost` served via WKURLSchemeHandler.
- **Path Resolution:**
  - In `next.config.js`, `images: { unoptimized: true }` and `trailingSlash: true` prevent 404s when navigating sub-routes within native WebViews.
  - All relative links and local font/SVG assets resolve without external network access.
- **Zero Server-Side Runtimes:** No Node.js runtime, Vercel Serverless Functions, or edge middleware are required.

---

## 3. Safe Area Insets & Viewport Boundaries

### Notch, Island & Navigation Bar Handling
Mobile viewports feature display cutouts (iPhone Dynamic Island / Notch, Android camera punch-holes) and bottom gesture bars (iOS Home Indicator, Android 3-button or pill navigation).

### CSS Logical Inset Integration
In `src/app/globals.css` and layout containers:
```css
/* Safe area padding variables */
:root {
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
  --sar: env(safe-area-inset-right, 0px);
}

body {
  padding-top: var(--sat);
  padding-bottom: var(--sab);
  padding-left: var(--sal);
  padding-right: var(--sar);
}
```

### Floating Dock & Top Header Protection
- **Top Header (`Navbar.tsx`):** Protected with `pt-[max(0.75rem,env(safe-area-inset-top))]` to prevent content overlapping the device status bar.
- **Floating Bottom Dock (`FloatingDock.tsx`):** Positioned with `bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.5rem))]` so docked buttons are never clipped by the iOS home indicator or Android navigation bar.
- **Modal Dialogs (`AuthModal.tsx`, `OnboardingWelcomeModal.tsx`):** Use `max-h-[85vh]` with internal scrolling and safe bottom margins to prevent action buttons from being hidden below the keyboard.

---

## 4. Touch Target Sizing & Haptic Feedback

### Accessibility & Human Interface Compliance
- **Minimum Target Dimension:** Every interactive element (buttons, tabs, inputs, icon toggles, mood chips) meets or exceeds the **44 × 44 pt** touch target boundary required by Apple Human Interface Guidelines and WCAG 2.2 Success Criterion 2.5.8 (Target Size - Minimum).
- **Whitespace & Tap Separation:** Minimum 8px spacing between adjacent touch elements to avoid accidental taps.
- **Form Inputs:** Input font size is set to `text-base` (16px) on mobile viewports to prevent iOS Safari / WKWebView from triggering an automatic viewport zoom.

### Native Haptics Integration (Capacitor Haptics)
- Intention commitment: `Haptics.impact({ style: ImpactStyle.Light })`
- Somatic unclench / breath cycle transitions: `Haptics.notification({ type: NotificationType.Success })`
- Mind Vault PIN entry: subtle selection feedback on keypad tap.

---

## 5. Web Audio Lifecycle & Native Backgrounding

### Audio Engine (`soundEngine.ts`) Considerations
BECOMING generates procedural ambient soundscapes (Pink Noise, Singing Bowl, Rain, Stream, Tibetan Bells) via the browser **Web Audio API** (`AudioContext`).

### Mobile WebView Constraints & Solutions:
1. **User Gesture Requirement (Autoplay Policy):**
   - iOS WKWebView suspends `AudioContext` until an explicit user interaction (tap/touch) occurs.
   - *Mitigation:* `soundEngine.ts` maintains an idle state until the user clicks the Sound Pill or selects a track, invoking `audioContext.resume()` within the direct click event handler.
2. **App Backgrounding & Suspension:**
   - When the user switches apps or locks the phone, the OS suspends the WebView JavaScript execution thread.
   - *Mitigation:* Listen to Capacitor `appStateChange` events (`@capacitor/app`). When `isActive: false`, smoothly fade out oscillators and suspend the `AudioContext`; when `isActive: true`, resume if previously playing.
3. **Audio Session Category (iOS):**
   - By default, iOS WebViews pause audio when the device is muted via the hardware silence switch.
   - *Recommendation:* Configure AVAudioSession category to `playback` via native Capacitor plugin if continuous background ambient sound is desired, or keep `ambient` to respect the silent switch.

---

## 6. Offline Storage & WebView Lifecycle Persistence

### Storage Engines Evaluated:
| Storage Type | Android WebView Durability | iOS WKWebView Durability | BECOMING Usage |
|---|---|---|---|
| `localStorage` | Durable across restarts; purged if user clears app data. | High durability; low risk of eviction unless device storage is critically low. | Instant preference cache, session flags, ritual keys (`becoming_morning_ritual_v1`, etc.). |
| `IndexedDB` | High durability; persists in app sandbox. | Persists across app launches; isolated per app bundle. | Large text entries, reflection history, offline sync queues. |
| `React State` | Ephemeral; destroyed on process death. | Ephemeral; destroyed on process death. | Active breath cycle, temporary unconfirmed draft reflections. |

### Process Death Recovery:
- On Android, the OS can kill background WebViews under memory pressure.
- *Mitigation:* Key states are saved incrementally to `localStorage` on every change (`useEffect` hooks with debouncing). The app restores the last active state gracefully upon relaunch.
- **Sovereign Backup:** The JSON export/import mechanism (`SanctuaryBackupPayload` schema `0.8.0`) provides full user-driven off-device protection.

---

## 7. Android Hardware Back Button Handling

### Navigation Stack Architecture:
In a native Android environment, pressing the hardware back button or swipe-to-go-back gesture should navigate back in app history rather than exiting the app.

### Capacitor App Plugin Integration:
```typescript
import { App } from '@capacitor/app';

App.addListener('backButton', ({ canGoBack }) => {
  // 1. If any modal (Auth, Onboarding, Vault) is open, close it
  // 2. If inside a studio (Morning, Evening, Quiz, Breathe), return to 'dashboard' or 'home'
  // 3. If on home/dashboard root, minimize app instead of abruptly quitting
});
```

---

## 8. Complete Step-by-Step Capacitor 6 Setup Guide

### Prerequisites
- Node.js 18+ & npm
- Android Studio Ladybug+ (for Android builds)
- Xcode 15+ (macOS only, for iOS builds)

### Step 1: Install Capacitor Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/app @capacitor/haptics @capacitor/status-bar @capacitor/keyboard
```

### Step 2: Initialize Capacitor Configuration
```bash
npx cap init "BECOMING" "com.becoming.journey" --web-dir "out"
```

### Step 3: Configure `capacitor.config.ts`
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.becoming.journey',
  appName: 'BECOMING',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a',
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
    },
  },
};

export default config;
```

### Step 4: Add Native Platforms
```bash
npm run build # Exports static HTML to /out
npx cap add ios
npx cap add android
```

### Step 5: Sync Assets & Open in Native IDEs
```bash
# Sync web build to native platform folders
npx cap sync

# Open in Xcode for iOS simulation & signing
npx cap open ios

# Open in Android Studio for APK/AAB generation
npx cap open android
```

---

## 9. Privacy & Security Checklist for App Store / Play Store Review

- **App Tracking Transparency (iOS):** NOT REQUIRED. BECOMING contains zero IDFA access, zero third-party analytics SDKs, and zero advertising trackers.
- **Google Play Data Safety Section:**
  - *Data Collected:* None by default (Guest mode).
  - *Optional Data:* Email address only when user opts into Cloud Auth.
  - *Data Sharing:* None. Zero third-party sharing.
  - *Data Deletion:* In-app Account Deletion and full Wipe Local Data buttons provide direct self-service erasure.
- **Offline First:** 100% functionality remains active without an internet connection.
- **Medical Disclaimer:** Explicit non-clinical boundary notices are surfaced in Onboarding, Settings, and Terms of Use.
