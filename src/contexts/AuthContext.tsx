import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const state: AuthState = {
    currentUser: user,
    isAuthenticated: !!user,
    isLoading: loading,
  };

  // Handle navigation after successful authentication
  React.useEffect(() => {
    if (user && !loading) {
      // User is authenticated, navigate to appropriate page
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

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