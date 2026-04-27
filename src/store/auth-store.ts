import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    // TODO: integrar com backend real (API/Firebase/Supabase)
    await new Promise(resolve => setTimeout(resolve, 800));
    const user: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      createdAt: new Date(),
    };
    set({ user, isAuthenticated: true, isLoading: false });
    if (typeof window !== 'undefined') {
      localStorage.setItem('carrosselpro_user', JSON.stringify(user));
    }
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    // TODO: integrar com backend real
    await new Promise(resolve => setTimeout(resolve, 800));
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date(),
    };
    set({ user, isAuthenticated: true, isLoading: false });
    if (typeof window !== 'undefined') {
      localStorage.setItem('carrosselpro_user', JSON.stringify(user));
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('carrosselpro_user');
    }
  },
}));
