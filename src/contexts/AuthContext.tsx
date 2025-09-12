import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'client';
  is_active: boolean;
  subscription_type: 'free' | 'premium' | 'enterprise';
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: { username: string; full_name: string; role?: 'admin' | 'client' }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Found session, fetching user profile...');
          await fetchUserProfile(session.user.id);
        } else if (mounted) {
          console.log('No session found');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Navigate after authentication
  useEffect(() => {
    if (state.currentUser && !state.isLoading) {
      console.log('User authenticated, navigating...', state.currentUser.role);
      if (state.currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [state.currentUser, state.isLoading, navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        console.error('Profile fetch error:', error);
        // If user doesn't exist in users table, create it
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, creating...');
          await createUserProfile(userId);
          return;
        }
        dispatch({ type: 'SET_ERROR', payload: 'Erreur de chargement du profil' });
        return;
      }

      if (data) {
        console.log('User profile loaded:', data);
        dispatch({ type: 'SET_USER', payload: data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Profil utilisateur non trouvé' });
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      // Get user email from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        dispatch({ type: 'SET_ERROR', payload: 'Utilisateur non trouvé' });
        return;
      }

      const userData = {
        id: userId,
        email: user.email || '',
        username: user.email?.split('@')[0] || 'user',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: 'client' as const,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erreur de création du profil' });
        return;
      }

      console.log('User profile created:', data);
      dispatch({ type: 'SET_USER', payload: data });
    } catch (error: any) {
      console.error('Create profile error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur de création du profil' });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('Attempting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error.message) });
        return { success: false, error: getErrorMessage(error.message) };
      }

      if (data.user) {
        console.log('Sign in successful, user:', data.user.id);
        // Don't set loading to false here - let the auth state change handle it
        return { success: true };
      }

      dispatch({ type: 'SET_ERROR', payload: 'Erreur de connexion inconnue' });
      return { success: false, error: 'Erreur de connexion inconnue' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = getErrorMessage(error.message);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, userData: {
    username: string;
    full_name: string;
    role?: 'admin' | 'client';
  }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.username)
        .single();

      if (existingUser) {
        const error = 'Ce nom d\'utilisateur existe déjà';
        dispatch({ type: 'SET_ERROR', payload: error });
        return { success: false, error };
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        const error = getErrorMessage(authError.message);
        dispatch({ type: 'SET_ERROR', payload: error });
        return { success: false, error };
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            username: userData.username,
            full_name: userData.full_name,
            role: userData.role || 'client',
          });

        if (profileError) {
          const error = 'Erreur lors de la création du profil';
          dispatch({ type: 'SET_ERROR', payload: error });
          return { success: false, error };
        }
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, data: authData };
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.message);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!state.currentUser) {
        return { success: false, error: 'Aucun utilisateur connecté' };
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', state.currentUser.id);

      if (error) {
        return { success: false, error: error.message };
      }

      dispatch({ type: 'SET_USER', payload: { ...state.currentUser, ...updates } });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('Invalid login credentials')) {
      return 'Email ou mot de passe incorrect';
    }
    if (error.includes('Email not confirmed')) {
      return 'Email non confirmé';
    }
    if (error.includes('Too many requests')) {
      return 'Trop de tentatives, veuillez réessayer plus tard';
    }
    return error;
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