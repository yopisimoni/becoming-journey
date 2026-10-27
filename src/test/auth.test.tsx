import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('Local-First Authentication & User Profile System', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('starts in guest mode by default with user null', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it('allows sign up with avatar, persists user profile locally', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      const res = await result.current.signUp(
        'Sophia Serene',
        'sophia@example.com',
        'peaceful123',
        'lotus'
      );
      expect(res.success).toBe(true);
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.name).toBe('Sophia Serene');
    expect(result.current.user?.email).toBe('sophia@example.com');
    expect(result.current.user?.avatar).toBe('lotus');
    expect(result.current.storageMode).toBe('local');
  });

  it('prevents duplicate email registration', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.signUp('User One', 'dup@example.com', 'pass1', 'leaf');
    });

    await act(async () => {
      const dupRes = await result.current.signUp('User Two', 'dup@example.com', 'pass2', 'star');
      expect(dupRes.success).toBe(false);
    });
  });

  it('signs out and reverts to guest mode', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.signUp('Wanderer', 'wander@example.com', 'quiet123', 'wave');
    });
    expect(result.current.user).not.toBeNull();

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
  });

  it('allows signing back in with registered credentials', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.signUp('Elena', 'elena@example.com', 'compass99', 'mountain');
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();

    await act(async () => {
      const wrongRes = await result.current.signIn('elena@example.com', 'wrongpassword');
      expect(wrongRes.success).toBe(false);
    });
    expect(result.current.user).toBeNull();

    await act(async () => {
      const correctRes = await result.current.signIn('elena@example.com', 'compass99');
      expect(correctRes.success).toBe(true);
    });

    expect(result.current.user?.name).toBe('Elena');
    expect(result.current.user?.avatar).toBe('mountain');
  });
});
