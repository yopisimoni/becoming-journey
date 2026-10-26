'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { VaultSecret } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  Flame,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  Plus,
  ShieldAlert,
  Send,
  Wind,
} from 'lucide-react';

export function SecretVaultView() {
  const { dict, vaultSecrets, addVaultSecret, deleteVaultSecret, playSingingBowl } = useApp();

  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [hasConfiguredPin, setHasConfiguredPin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('becoming_vault_pin_v1');
  });

  // Dissolve & Let Go state
  const [heavyThought, setHeavyThought] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [dissolvedSuccess, setDissolvedSuccess] = useState(false);

  // New Secret form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('worry');
  const [isAdding, setIsAdding] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('becoming_vault_pin_v1');

    if (!storedPin) {
      // First time configuration
      if (pin.length === 4) {
        localStorage.setItem('becoming_vault_pin_v1', pin);
        setHasConfiguredPin(true);
        setIsUnlocked(true);
        setPinError(false);
        playSingingBowl();
      } else {
        setPinError(true);
      }
    } else {
      if (pin === storedPin) {
        setIsUnlocked(true);
        setPinError(false);
        playSingingBowl();
      } else {
        setPinError(true);
      }
    }
  };

  const handleCreateSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addVaultSecret({
      title: newTitle.trim(),
      sealedContent: newContent.trim(),
      category: newCategory,
    });

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
    playSingingBowl();
  };

  const handleDissolveThought = () => {
    if (!heavyThought.trim()) return;
    setIsDissolving(true);
    playSingingBowl();

    setTimeout(() => {
      setHeavyThought('');
      setIsDissolving(false);
      setDissolvedSuccess(true);
      setTimeout(() => setDissolvedSuccess(false), 3500);
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
          {dict.vault?.title || 'The Mind Vault & Dissolution Sanctuary'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          {dict.vault?.subtitle || 'Seal away private burdens behind a 4-digit PIN, or permanently dissolve thoughts into thin air.'}
        </p>
      </div>

      {/* SECTION 1: Dissolve & Let Go Ritual */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <Wind className="w-4 h-4" />
            <span>Dissolve & Let Go (Never Saved)</span>
          </div>
          <span className="text-[10px] text-slate-400">Ephemeral Release</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Type any heavy thought, worry, or regret. When you tap <strong>Dissolve</strong>, it will vanish permanently in an animated release. It is never stored on disk.
        </p>

        <div className="relative">
          <AnimatePresence>
            {isDissolving ? (
              <motion.div
                initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                animate={{ opacity: 0, scale: 0.9, filter: 'blur(16px)' }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                className="w-full h-28 p-4 rounded-2xl bg-white/10 text-white font-serif italic text-sm overflow-hidden flex items-center justify-center text-center"
              >
                &ldquo;{heavyThought}&rdquo;
              </motion.div>
            ) : (
              <textarea
                value={heavyThought}
                onChange={(e) => setHeavyThought(e.target.value)}
                placeholder="What heavy burden or worry would you like to release right now?..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% ephemeral • Instant memory purge</span>
          </div>

          <button
            type="button"
            onClick={handleDissolveThought}
            disabled={!heavyThought.trim() || isDissolving}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDissolving ? 'Dissolving...' : 'Dissolve & Release'}</span>
          </button>
        </div>

        {dissolvedSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 font-medium text-center animate-fadeIn">
            ✨ Your thought has been dissolved into space. Breathe, and let the mind be clear.
          </div>
        )}
      </div>

      {/* SECTION 2: PIN-Protected Secret Lockbox */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-600" /> : <Lock className="w-5 h-5 text-indigo-600" />}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {dict.vault?.lockboxTitle || 'Sealed Secret Lockbox'}
            </h2>
          </div>

          {isUnlocked && (
            <button
              type="button"
              onClick={() => setIsUnlocked(false)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              Lock Vault
            </button>
          )}
        </div>

        {!isUnlocked ? (
          /* PIN Input Screen */
          <form onSubmit={handlePinSubmit} className="max-w-sm mx-auto text-center space-y-4 py-4">
            <div className="space-y-1">
              <KeyRound className="w-8 h-8 text-indigo-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {hasConfiguredPin ? 'Enter Your 4-Digit Vault PIN' : 'Create a 4-Digit Vault PIN'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {hasConfiguredPin
                  ? 'Your secrets are locked locally inside this browser.'
                  : 'Choose a 4-digit code to protect your personal vault.'}
              </p>
            </div>

            <div className="flex justify-center">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-32 text-center tracking-[0.5em] text-2xl font-mono px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-semibold">
                {hasConfiguredPin ? 'Incorrect PIN. Try again.' : 'Please enter a 4-digit PIN.'}
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
            >
              {hasConfiguredPin ? 'Unlock Secret Vault' : 'Set PIN & Open Vault'}
            </button>
          </form>
        ) : (
          /* Unlocked Vault View */
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {vaultSecrets.length} sealed secrets recorded
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(!isAdding)}
                className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Seal Away a Thought</span>
              </button>
            </div>

            {/* Add Secret Form */}
            {isAdding && (
              <form onSubmit={handleCreateSecret} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Secret title / alias (e.g. The conversation on Friday)"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-900 dark:text-white"
                />

                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write everything you cannot say anywhere else..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Seal In Vault
                  </button>
                </div>
              </form>
            )}

            {/* Secrets List */}
            {vaultSecrets.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
                Your vault is currently empty. Seal thoughts away so your mind can stop carrying them.
              </div>
            ) : (
              <div className="space-y-3">
                {vaultSecrets.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {sec.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(sec.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteVaultSecret(sec.id)}
                          aria-label="Delete sealed secret"
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {sec.sealedContent}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
