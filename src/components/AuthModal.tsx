'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AvatarId } from '@/types';
import {
  X,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Sparkles,
  Compass,
  Mountain,
  Waves,
  Feather,
  Check,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import {
  isFirebaseConfigured,
  firebaseSendPasswordReset,
} from '@/lib/auth/firebaseAuth';

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, dict, signIn, signUp } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<AvatarId>('lotus');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(false);
    setAuthModalOpen(false);
  };

  const handleContinueAsGuest = () => {
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signUp(name, email, password, avatar);
        if (!res.success) {
          setErrorMsg(res.error || 'Failed to sign up.');
          return;
        }
        handleClose();
      } else if (mode === 'signin') {
        const res = await signIn(email, password);
        if (!res.success) {
          setErrorMsg(res.error || dict.auth.invalidCredentials);
          return;
        }
        handleClose();
      } else if (mode === 'reset') {
        if (!email.trim()) {
          setErrorMsg('Please enter your email address.');
          return;
        }
        const res = await firebaseSendPasswordReset(email.trim());
        if (res.success) {
          setSuccessMsg(dict.auth.resetSentMessage || 'A password reset link was sent if the account exists.');
        } else {
          setErrorMsg(res.error || 'Password reset failed.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const avatarOptions: { id: AvatarId; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'lotus', label: dict.auth.lotusAvatar, icon: <Sparkles className="w-4 h-4" />, color: 'bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300 border-violet-300 dark:border-violet-700' },
    { id: 'mountain', label: dict.auth.mountainAvatar, icon: <Mountain className="w-4 h-4" />, color: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700' },
    { id: 'wave', label: dict.auth.waveAvatar, icon: <Waves className="w-4 h-4" />, color: 'bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-300 border-teal-300 dark:border-teal-700' },
    { id: 'leaf', label: dict.auth.leafAvatar, icon: <Feather className="w-4 h-4" />, color: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' },
    { id: 'star', label: dict.auth.starAvatar, icon: <Compass className="w-4 h-4" />, color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700' },
  ];

  const hasFirebase = isFirebaseConfigured();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-slate-900 dark:text-white transition-all">
        {/* Header Tabs */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold">
            <button
              id="auth-tab-signin"
              data-testid="auth-tab-signin"
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {dict.auth.signIn}
            </button>
            <button
              id="auth-tab-signup"
              data-testid="auth-tab-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {dict.auth.signUp}
            </button>
            <button
              id="auth-tab-reset"
              data-testid="auth-tab-reset"
              type="button"
              onClick={() => {
                setMode('reset');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                mode === 'reset'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Reset
            </button>
          </div>

          <button
            id="auth-modal-close-btn"
            data-testid="auth-modal-close-btn"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <h2 id="auth-modal-title" className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {mode === 'signup'
                ? dict.auth.createAccount
                : mode === 'reset'
                ? dict.auth.forgotPassword || 'Reset Password'
                : dict.auth.welcomeBack}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'signup'
                ? dict.auth.signUpPrompt
                : mode === 'reset'
                ? 'Enter your registered email to receive a secure recovery link.'
                : dict.auth.signInPrompt}
            </p>
          </div>

          {/* Cloud vs Local Identity Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 text-[11px] text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                {hasFirebase ? 'Firebase Identity Enabled' : 'Local Offline Identity Mode'}
              </span>
            </div>
            <span className="font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 border border-indigo-200/50">
              100% Private
            </span>
          </div>

          {errorMsg && (
            <div
              data-testid="auth-error-msg"
              className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium animate-fadeIn"
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              data-testid="auth-success-msg"
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium animate-fadeIn"
            >
              {successMsg}
            </div>
          )}

          {/* Form Fields */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {dict.auth.nameLabel}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
                <input
                  id="auth-name-input"
                  data-testid="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya or Pilgrim"
                  className="w-full ps-10 pe-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {dict.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
              <input
                id="auth-email-input"
                data-testid="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilgrim@becoming.local"
                className="w-full ps-10 pe-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {dict.auth.passwordLabel}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {dict.auth.forgotPassword || 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
                <input
                  id="auth-password-input"
                  data-testid="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-10 pe-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Avatar Selector (Signup only) */}
          {mode === 'signup' && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {dict.auth.avatarLabel}
              </span>
              <div className="flex gap-2">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatar(opt.id)}
                    className={`flex-1 py-2 px-1 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      avatar === opt.id
                        ? `${opt.color} ring-2 ring-indigo-500/30 scale-105 shadow-xs`
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="text-[10px] font-medium truncate max-w-full">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 space-y-2">
            <button
              id="auth-submit-button"
              data-testid="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>
                  {mode === 'signup'
                    ? dict.auth.createAccount
                    : mode === 'reset'
                    ? dict.auth.sendResetLink || 'Send Reset Link'
                    : dict.auth.signIn}
                </span>
              )}
            </button>

            {/* Continue as Guest Button */}
            <button
              id="auth-guest-btn"
              data-testid="auth-guest-btn"
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>{dict.auth.continueAsGuest || 'Continue as Guest'}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                (100% Local Device Isolation)
              </span>
            </button>
          </div>

          {/* Privacy Footnote */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-1">
            <p className="text-[11px] text-slate-400 leading-snug">
              {dict.auth.firebaseNotice ||
                'Optional cloud identity. Signing in never automatically uploads or exposes your private journals, Mind Vault, or local reflections.'}
            </p>
            <p className="text-[10px] text-slate-400/80 leading-normal">
              Private reflections remain stored solely on this device and do not sync across devices.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
