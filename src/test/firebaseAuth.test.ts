import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isFirebaseConfigured,
  mapFirebaseAuthError,
  mapFirebaseUserToProfile,
  firebaseSignUp,
  firebaseSignIn,
  firebaseSendPasswordReset,
  firebaseDeleteAccount,
} from '@/lib/auth/firebaseAuth';
import type { User as FirebaseUser } from 'firebase/auth';

describe('Firebase Auth Bridge (BECOMING v0.8)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('detects when Firebase is not configured', () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    expect(isFirebaseConfigured()).toBe(false);
  });

  it('detects when Firebase is fully configured', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';
    expect(isFirebaseConfigured()).toBe(true);
  });

  it('maps known Firebase error codes to human friendly messages', () => {
    expect(mapFirebaseAuthError('auth/user-not-found')).toBe('Invalid email or password. Please verify your details.');
    expect(mapFirebaseAuthError('auth/wrong-password')).toBe('Invalid email or password. Please verify your details.');
    expect(mapFirebaseAuthError('auth/email-already-in-use')).toBe('An account already exists with this email address.');
    expect(mapFirebaseAuthError('auth/weak-password')).toBe('Password should be at least 6 characters long.');
    expect(mapFirebaseAuthError('auth/invalid-email')).toBe('The email address format is not valid.');
    expect(mapFirebaseAuthError('auth/requires-recent-login')).toBe('Please re-authenticate with your password before deleting your account.');
    expect(mapFirebaseAuthError('unknown/random-code')).toBe('Authentication could not be completed. Please try again.');
  });

  it('maps Firebase user objects to Sanctuary UserProfile', () => {
    const mockUser = {
      uid: 'fb-user-123',
      email: 'sanctuary@example.com',
      displayName: 'Peace Seeker',
      emailVerified: true,
    } as FirebaseUser;

    const profile = mapFirebaseUserToProfile(mockUser);
    expect(profile.id).toBe('fb-user-123');
    expect(profile.email).toBe('sanctuary@example.com');
    expect(profile.name).toBe('Peace Seeker');
    expect(profile.isGuest).toBe(false);
    expect(profile.emailVerified).toBe(true);
    expect(profile.authProvider).toBe('firebase');
  });

  it('returns graceful error when attempting auth functions without configuration', async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const signUpRes = await firebaseSignUp('test@example.com', 'password123', 'Tester', 'lotus');
    expect(signUpRes.user).toBeUndefined();
    expect(signUpRes.error).toContain('not configured');

    const signInRes = await firebaseSignIn('test@example.com', 'password123');
    expect(signInRes.user).toBeUndefined();
    expect(signInRes.error).toContain('not configured');

    const resetRes = await firebaseSendPasswordReset('test@example.com');
    expect(resetRes.success).toBe(false);
    expect(resetRes.error).toContain('not configured');

    const deleteRes = await firebaseDeleteAccount('password123');
    expect(deleteRes.success).toBe(false);
    expect(deleteRes.error).toBeDefined();
  });
});
