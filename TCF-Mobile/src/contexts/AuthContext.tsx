import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
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
  users: [
    {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@tcf.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    {
      id: 'client-1',
      username: 'client',
      email: 'client@tcf.com',
      password: 'client123',
      role: 'client',
      createdAt: new Date().toISOString(),
      isActive: true,
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

  // Load users from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUsers = await AsyncStorage.getItem('tcf_users');
        if (savedUsers) {
          dispatch({ type: 'SET_USERS', payload: JSON.parse(savedUsers) });
        }

        const savedCurrentUser = await AsyncStorage.getItem('tcf_current_user');
        if (savedCurrentUser) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(savedCurrentUser) });
        }
      } catch (error) {
        console.error('Failed to load data from AsyncStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save users to AsyncStorage whenever users change
  useEffect(() => {
    const saveUsers = async () => {
      try {
        await AsyncStorage.setItem('tcf_users', JSON.stringify(state.users));
      } catch (error) {
        console.error('Failed to save users to AsyncStorage:', error);
      }
    };

    saveUsers();
  }, [state.users]);

  // Save current user to AsyncStorage
  useEffect(() => {
    const saveCurrentUser = async () => {
      try {
        if (state.currentUser) {
          await AsyncStorage.setItem('tcf_current_user', JSON.stringify(state.currentUser));
        } else {
          await AsyncStorage.removeItem('tcf_current_user');
        }
      } catch (error) {
        console.error('Failed to save current user to AsyncStorage:', error);
      }
    };

    saveCurrentUser();
  }, [state.currentUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = state.users.find(
      u => (u.username === username || u.email === username) && 
           u.password === password && 
           u.isActive
    );

    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('tcf_current_user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
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