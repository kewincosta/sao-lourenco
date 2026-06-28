import { create } from 'zustand';

import { User } from '@/shared/types';
import { login as authServiceLogin } from '@/services/auth.service';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (document: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (document: string) => {
    const foundUser = await authServiceLogin(document);
    if (foundUser) {
      set({ user: foundUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
