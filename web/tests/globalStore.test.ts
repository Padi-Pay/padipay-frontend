import { describe, it, expect, beforeEach } from 'vitest';
import { useGlobalStore } from '../src/store/globalStore';

describe('globalStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useGlobalStore.setState({
      token: null,
      isAuthenticated: false,
      profile: null,
      sessionExpired: false,
      isHydrated: true,
    });
  });

  it('handles login and logout correctly', () => {
    useGlobalStore.getState().login('mock-token');
    
    expect(useGlobalStore.getState().token).toBe('mock-token');
    expect(useGlobalStore.getState().isAuthenticated).toBe(true);

    useGlobalStore.getState().logout();
    
    expect(useGlobalStore.getState().token).toBeNull();
    expect(useGlobalStore.getState().isAuthenticated).toBe(false);
  });

  it('persists required state via partialize', () => {
    useGlobalStore.getState().login('persisted-token');
    useGlobalStore.getState().setProfile({ id: '1', email: 'test@test.com', name: 'Test User' });

    const storedData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    
    expect(storedData.state).toBeDefined();
    expect(storedData.state.token).toBe('persisted-token');
    expect(storedData.state.isAuthenticated).toBe(true);
    expect(storedData.state.profile).toEqual({ id: '1', email: 'test@test.com', name: 'Test User' });
  });
});
