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
} from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, dict, signIn, signUp } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<AvatarId>('lotus');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setErrorMsg(null);
    setAuthModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'signup') {
      const res = signUp(name, email, password, avatar);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to sign up.');
        return;
      }
      handleClose();
    } else {
      const res = signIn(email, password);
      if (!res.success) {
        setErrorMsg(res.error || dict.auth.invalidCredentials);
        return;
      }
      handleClose();
    }
  };

  const avatarOptions: { id: AvatarId; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'lotus', label: dict.auth.lotusAvatar, icon: <Sparkles className="w-4 h-4" />, color: 'bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300 border-violet-300 dark:border-violet-700' },
    { id: 'mountain', label: dict.auth.mountainAvatar, icon: <Mountain className="w-4 h-4" />, color: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700' },
    { id: 'wave', label: dict.auth.waveAvatar, icon: <Waves className="w-4 h-4" />, color: 'bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-300 border-teal-300 dark:border-teal-700' },
    { id: 'leaf', label: dict.auth.leafAvatar, icon: <Feather className="w-4 h-4" />, color: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' },
    { id: 'star', label: dict.auth.starAvatar, icon: <Compass className="w-4 h-4" />, color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700' },
  ];

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
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            <button
              id="auth-tab-signin"
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {dict.auth.signIn}
            </button>
            <button
              id="auth-tab-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {dict.auth.signUp}
            </button>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={dict.disclaimer.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === 'signup' ? dict.auth.createAccount : dict.auth.signIn}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {mode === 'signup' ? dict.auth.signUpPrompt : dict.auth.signInPrompt}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {dict.auth.nameLabel}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya"
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {dict.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {dict.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
              <input
                id="auth-password-input"
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {dict.auth.avatarLabel}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.id}
                    id={`avatar-choice-${opt.id}`}
                    type="button"
                    onClick={() => setAvatar(opt.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      avatar === opt.id
                        ? `${opt.color} ring-2 ring-indigo-500 shadow-sm scale-105`
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {opt.icon}
                    <span className="text-[10px] font-medium leading-tight truncate w-full text-center">
                      {opt.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{dict.auth.privacyNote}</span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              id="auth-submit-button"
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{mode === 'signup' ? dict.auth.createAccount : dict.auth.signIn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
