import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'client';
  createdAt: string;
  isActive: boolean;
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
  users: [],
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

  // Load current user from Supabase session
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role as 'admin' | 'client',
            createdAt: userData.created_at,
            isActive: userData.is_active,
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@tcf.local`,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userData) {
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role as 'admin' | 'client',
            createdAt: userData.created_at,
            isActive: userData.is_active,
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: 'temp123456', // Temporary password
      });

      if (error) throw error;

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: userData.email,
            username: userData.username,
            role: userData.role,
            is_active: userData.isActive,
          });

        if (insertError) throw insertError;

        const newUser: User = {
          ...userData,
          id: data.user.id,
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_USER', payload: newUser });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
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