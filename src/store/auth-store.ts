import { create } from 'zustand';
import { User } from '@/types';
import { createClient } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  loadSession: async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const user: User = {
        id: session.user.id,
        name: profile?.name || session.user.email?.split('@')[0] || '',
        email: session.user.email || '',
        avatarUrl: profile?.avatar_url,
        createdAt: new Date(profile?.created_at || session.user.created_at),
      };
      set({ user, isAuthenticated: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false });
      throw new Error(error.message);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: User = {
      id: data.user.id,
      name: profile?.name || email.split('@')[0],
      email,
      avatarUrl: profile?.avatar_url,
      createdAt: new Date(profile?.created_at || data.user.created_at),
    };

    set({ user, isAuthenticated: true, isLoading: false });
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      set({ isLoading: false });
      throw new Error(error.message);
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        name,
        email,
        createdAt: new Date(),
      };
      set({ user, isAuthenticated: true, isLoading: false });
    }
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
