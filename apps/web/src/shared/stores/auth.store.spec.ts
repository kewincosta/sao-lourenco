import { beforeEach, describe, expect, it } from 'vitest';

import { resetDataSource } from '@/services/data-source';
import { mockUsers } from '@/services/mock-data';
import { useAuthStore } from './auth.store';

describe('auth.store', () => {
  beforeEach(() => {
    resetDataSource();
    useAuthStore.getState().logout();
  });

  it('login with a valid document sets user and isAuthenticated=true, and returns true', async () => {
    const seedUser = mockUsers[0];
    const result = await useAuthStore.getState().login(seedUser.document);

    expect(result).toBe(true);
    expect(useAuthStore.getState().user).toEqual(seedUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('login with an invalid document keeps the user logged out and returns false', async () => {
    const result = await useAuthStore.getState().login('000.000.000-00');

    expect(result).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('logout clears the state', async () => {
    const seedUser = mockUsers[0];
    await useAuthStore.getState().login(seedUser.document);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('a failed login attempt while already authenticated does not clear the existing session', async () => {
    const seedUser = mockUsers[0];
    await useAuthStore.getState().login(seedUser.document);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    const result = await useAuthStore.getState().login('999.999.999-99');

    expect(result).toBe(false);
    expect(useAuthStore.getState().user).toEqual(seedUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
