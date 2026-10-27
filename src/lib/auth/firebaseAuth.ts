import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { AvatarId, UserProfile } from '@/types';

// Environment-driven Firebase Configuration
export function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

/**
 * Validates whether real, non-placeholder Firebase configuration is present.
 */
export function isFirebaseConfigured(): boolean {
  const { apiKey, projectId, appId } = getFirebaseConfig();
  if (!apiKey || !projectId || !appId) return false;
  if (apiKey.includes('YOUR_') || apiKey === 'placeholder' || apiKey.length < 10) return false;
  return true;
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;

  try {
    if (!appInstance) {
      appInstance = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
    }
    if (!authInstance && appInstance) {
      authInstance = getAuth(appInstance);
    }
    return authInstance;
  } catch (err) {
    // Graceful silent fallback if initialization fails offline
    console.warn('[BECOMING Auth] Firebase initialization bypassed; operating in local mode.');
    return null;
  }
}

/**
 * Maps Firebase Auth errors to readable, privacy-safe error codes.
 */
export function mapFirebaseAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address format is not valid.';
    case 'auth/user-disabled':
      return 'This account has been temporarily disabled. Please contact support.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your details.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Please try again in a few minutes.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/requires-recent-login':
      return 'Please re-authenticate with your password before deleting your account.';
    default:
      return 'Authentication could not be completed. Please try again.';
  }
}

/**
 * Maps a FirebaseUser to BECOMING's local UserProfile format.
 */
export function mapFirebaseUserToProfile(user: FirebaseUser, fallbackAvatar: AvatarId = 'lotus'): UserProfile {
  let avatar: AvatarId = fallbackAvatar;
  if (user.photoURL && ['lotus', 'mountain', 'wave', 'leaf', 'star'].includes(user.photoURL)) {
    avatar = user.photoURL as AvatarId;
  }

  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Sanctuary Pilgrim',
    email: user.email || '',
    avatar,
    createdAt: user.metadata?.creationTime || new Date().toISOString(),
    isGuest: false,
    emailVerified: user.emailVerified,
    authProvider: 'firebase',
  };
}

/**
 * Sign up with Email and Password
 */
export async function firebaseSignUp(
  name: string,
  email: string,
  password: string,
  avatar: AvatarId = 'lotus'
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { success: false, error: 'Firebase is not configured. Use Guest mode.' };
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(cred.user, {
      displayName: name.trim(),
      photoURL: avatar,
    });

    // Attempt to send email verification silently
    try {
      await sendEmailVerification(cred.user);
    } catch {
      // Non-blocking if verification email fails
    }

    const profile = mapFirebaseUserToProfile(cred.user, avatar);
    return { success: true, user: profile };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    return { success: false, error: mapFirebaseAuthError(code) };
  }
}

/**
 * Sign in with Email and Password
 */
export async function firebaseSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { success: false, error: 'Firebase is not configured. Use Guest mode.' };
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = mapFirebaseUserToProfile(cred.user);
    return { success: true, user: profile };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    return { success: false, error: mapFirebaseAuthError(code) };
  }
}

/**
 * Send Password Reset Email
 */
export async function firebaseSendPasswordReset(
  email: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { success: false, error: 'Firebase is not configured.' };
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true, message: 'Password reset link sent to your email.' };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    return { success: false, error: mapFirebaseAuthError(code) };
  }
}

/**
 * Send Verification Email to current user
 */
export async function firebaseSendVerification(): Promise<{ success: boolean; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth || !auth.currentUser) {
    return { success: false, error: 'No user signed in.' };
  }

  try {
    await sendEmailVerification(auth.currentUser);
    return { success: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    return { success: false, error: mapFirebaseAuthError(code) };
  }
}

/**
 * Delete User Account with reauthentication
 */
export async function firebaseDeleteAccount(
  passwordConfirm: string
): Promise<{ success: boolean; error?: string }> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!auth || !user || !user.email) {
    return { success: false, error: 'No user signed in.' };
  }

  try {
    // Re-authenticate prior to sensitive account deletion
    const credential = EmailAuthProvider.credential(user.email, passwordConfirm);
    await reauthenticateWithCredential(user, credential);
    await deleteUser(user);
    return { success: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    return { success: false, error: mapFirebaseAuthError(code) };
  }
}

/**
 * Sign out user
 */
export async function firebaseSignOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  try {
    await signOut(auth);
  } catch {
    // Ignore sign-out errors
  }
}

/**
 * Subscribe to Auth State Changes
 */
export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUserToProfile(firebaseUser));
    } else {
      callback(null);
    }
  });
}
