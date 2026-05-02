import { create } from 'zustand';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'STORE_OWNER' | 'STORE_MANAGER';
  tenant_id?: number;
  email_verified_at?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  register: (name: string, email: string, password: string, passwordConfirmation: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (userId: number, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  register: async (name, email, password, passwordConfirmation, phone) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        phone,
      });
      set({ user: response.user });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(email, password);
      set({
        user: response.user,
        token: response.token,
      });
      localStorage.setItem('auth_token', response.token);
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (userId, otp) => {
    set({ isLoading: true, error: null });
    try {
      await api.verifyOtp(userId, otp);
      // User should be able to login after verification
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'OTP verification failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.logout();
      set({ user: null, token: null });
      localStorage.removeItem('auth_token');
    } finally {
      set({ isLoading: false });
    }
  },

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },

  setUser: (user) => set({ user }),
}));
