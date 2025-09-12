import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: 'super_admin' | 'admin' | 'client';
  createdAt: string;
  isActive: boolean;
  subscriptionType?: 'free' | 'premium' | 'enterprise';
  subscriptionExpiresAt?: string | null;
}

export interface AuthState {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'TOGGLE_USER_STATUS'; payload: string };

const initialState: AuthState = {
  currentUser: null,
  users: [
    {
      id: 'admin-othman-bouagada',
      username: 'Othman Bouagada',
      email: 'bouagada@brixelacademy.com',
      fullName: 'Othman Bouagada',
      role: 'super_admin',
      isActive: true,
      subscriptionType: 'enterprise',
      createdAt: new Date().toISOString(),
    }
  ],
  isAuthenticated: false,
  isLoading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };

    case 'TOGGLE_USER_STATUS':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload
            ? { ...user, isActive: !user.isActive }
            : user
        ),
      };

    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
    loadUsers();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadCurrentUser(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const loadCurrentUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const user: User = {
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.full_name,
          role: data.role,
          isActive: data.is_active,
          subscriptionType: data.subscription_type,
          subscriptionExpiresAt: data.subscription_expires_at,
          createdAt: data.created_at,
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadUsers = async () => {
    try {
      // Check if Supabase is properly configured before making requests
      if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured. Skipping user data load.');
        console.warn('The app will work in demo mode until Supabase is properly set up.');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const users: User[] = data.map(item => ({
          id: item.id,
          username: item.username,
          email: item.email,
          fullName: item.full_name,
          role: item.role,
          isActive: item.is_active,
          subscriptionType: item.subscription_type,
          subscriptionExpiresAt: item.subscription_expires_at,
          createdAt: item.created_at,
        }));
        dispatch({ type: 'SET_USERS', payload: users });
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🚨 SUPABASE CONNECTION FAILED 🚨');
        console.error('Cannot connect to Supabase. Please check:');
        console.error('1. Your internet connection');
        console.error('2. Your .env file has correct Supabase credentials');
        console.error('3. Your Supabase project is active');
        console.error('');
        console.error('The app will continue in demo mode.');
      } else {
        console.error('Error loading users:', error);
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    if (!isSupabaseConfigured()) {
      // Demo mode - allow login with any credentials
      console.warn('⚠️ Supabase not configured. Running in demo mode.');
      
      // Check if this is the admin user
      if (email === 'bouagada@brixelacademy.com' && password === 'Mostaganem@27') {
        const adminUser: User = {
          id: 'admin-othman-bouagada',
          username: 'Othman Bouagada',
          email: 'bouagada@brixelacademy.com',
          fullName: 'Othman Bouagada',
          role: 'super_admin',
          isActive: true,
          subscriptionType: 'enterprise',
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: adminUser });
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      }
      
      // Create a demo user for other credentials
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        username: email.split('@')[0] || 'demo',
        email: email,
        role: email.includes('admin') ? 'admin' : 'client',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: demoUser });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadCurrentUser(data.user.id);
        return true;
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🚨 LOGIN FAILED - SUPABASE CONNECTION ERROR 🚨');
        console.error('Cannot connect to Supabase for authentication.');
      } else {
        console.error('Login error:', error);
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    
    return false;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const createUser = async (userData: { email: string; password: string; username: string; role?: 'admin' | 'client' }) => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured. Creating demo user locally.');
      
      // Create demo user locally
      const newUser: User = {
        id: 'demo-user-' + Date.now(),
        username: userData.username,
        email: userData.email,
        role: userData.role || 'client',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_USER', payload: newUser });
      return true;
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: userData.email,
            username: userData.username,
            role: userData.role || 'client',
            is_active: true,
          }]);

        if (profileError) throw profileError;

        await loadUsers();
        return true;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, createUser }}>
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