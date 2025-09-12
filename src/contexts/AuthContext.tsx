import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth, AuthUser } from '../hooks/useSupabaseAuth';

export type User = AuthUser;

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<{
  state: AuthState;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: { username: string; full_name: string; role?: 'admin' | 'client' }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, signIn, signUp, signOut, updateProfile } = useSupabaseAuth();

  const state: AuthState = {
    currentUser: user,
    isAuthenticated: !!user,
    isLoading: loading,
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signUp, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}