import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
const wrapper = ({children}:{children:React.ReactNode}) => <AppProvider>{children}</AppProvider>;

describe('account deletion and activity wipe privacy', () => {
  beforeEach(()=>{localStorage.clear();sessionStorage.clear();});
  it('deletes per-account content and activity keys from both stores',async()=>{
    const {result}=renderHook(()=>useApp(),{wrapper});
    await act(async()=>{expect((await result.current.signUp('Local Test','privacy@example.invalid','test-pass-012345')).success).toBe(true);});
    const id=result.current.user?.id;
    expect(id).toBeTruthy();
    for(const store of [localStorage,sessionStorage]){
      store.setItem(`becoming_${id}_journal_v1`,'private note');
      store.setItem(`becoming_activity_journey_v1_${id}`,'private activity');
    }
    await act(async()=>{expect((await result.current.deleteAccount('incorrect')).success).toBe(false);});
    expect(result.current.user?.id).toBe(id);
    await act(async()=>{expect((await result.current.deleteAccount('test-pass-012345')).success).toBe(true);});
    for(const store of [localStorage,sessionStorage]){
      expect(store.getItem(`becoming_${id}_journal_v1`)).toBeNull();
      expect(store.getItem(`becoming_activity_journey_v1_${id}`)).toBeNull();
    }
  });
  it('wipe includes guest activity history',()=>{
    const {result}=renderHook(()=>useApp(),{wrapper});
    sessionStorage.setItem('becoming_activity_journey_v1','private guest activity');
    act(()=>result.current.wipeAllData());
    expect(sessionStorage.getItem('becoming_activity_journey_v1')).toBeNull();
  });
});
