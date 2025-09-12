import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import wordpressAPI from '../lib/wordpress';

// Types matching WordPress structure
export interface WPUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  meta: {
    role: 'super_admin' | 'admin' | 'client';
    is_active: boolean;
    subscription_type: 'free' | 'premium' | 'enterprise';
  };
}

export interface WPExamSet {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  meta: {
    description: string;
    is_active: boolean;
    is_premium: boolean;
    time_limit_minutes: number;
  };
}

export interface WPQuestion {
  id: number;
  title: { rendered: string };
  meta: {
    exam_set_id: number;
    section: 'listening' | 'grammar' | 'reading';
    question_text: string;
    options: string[];
    correct_answer: number;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    audio_url?: string;
    image_url?: string;
  };
}

export interface WordPressState {
  currentUser: WPUser | null;
  users: WPUser[];
  examSets: WPExamSet[];
  questions: WPQuestion[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type WordPressAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: WPUser }
  | { type: 'LOGOUT' }
  | { type: 'SET_USERS'; payload: WPUser[] }
  | { type: 'SET_EXAM_SETS'; payload: WPExamSet[] }
  | { type: 'SET_QUESTIONS'; payload: WPQuestion[] }
  | { type: 'ADD_EXAM_SET'; payload: WPExamSet }
  | { type: 'ADD_QUESTION'; payload: WPQuestion };

const initialState: WordPressState = {
  currentUser: null,
  users: [],
  examSets: [],
  questions: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function wordpressReducer(state: WordPressState, action: WordPressAction): WordPressState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
      };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'SET_EXAM_SETS':
      return { ...state, examSets: action.payload };
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    
    case 'ADD_EXAM_SET':
      return { ...state, examSets: [...state.examSets, action.payload] };
    
    case 'ADD_QUESTION':
      return { ...state, questions: [...state.questions, action.payload] };
    
    default:
      return state;
  }
}

const WordPressContext = createContext<{
  state: WordPressState;
  dispatch: React.Dispatch<WordPressAction>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadExamSets: () => Promise<void>;
  loadQuestions: (examSetId?: number) => Promise<void>;
  createExamSet: (examData: any) => Promise<void>;
  createQuestion: (questionData: any) => Promise<void>;
  saveTestResult: (resultData: any) => Promise<void>;
} | undefined>(undefined);

export function WordPressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wordpressReducer, initialState);

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await wordpressAPI.login(username, password);
      
      // Get user data from WordPress
      const users = await wordpressAPI.getUsers();
      const currentUser = users.find((user: any) => user.slug === username);
      
      if (currentUser) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
        
        // Store token for future requests
        localStorage.setItem('wp_token', response.token);
        
        return true;
      }
      
      throw new Error('User not found');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('wp_token');
    dispatch({ type: 'LOGOUT' });
  };

  const loadExamSets = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const examSets = await wordpressAPI.getExamSets();
      dispatch({ type: 'SET_EXAM_SETS', payload: examSets });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadQuestions = async (examSetId?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const questions = await wordpressAPI.getQuestions(examSetId);
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createExamSet = async (examData: any) => {
    try {
      const newExamSet = await wordpressAPI.createExamSet(examData);
      dispatch({ type: 'ADD_EXAM_SET', payload: newExamSet });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const createQuestion = async (questionData: any) => {
    try {
      const newQuestion = await wordpressAPI.createQuestion(questionData);
      dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const saveTestResult = async (resultData: any) => {
    try {
      await wordpressAPI.saveTestResult(resultData);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  return (
    <WordPressContext.Provider value={{
      state,
      dispatch,
      login,
      logout,
      loadExamSets,
      loadQuestions,
      createExamSet,
      createQuestion,
      saveTestResult,
    }}>
      {children}
    </WordPressContext.Provider>
  );
}

export function useWordPress() {
  const context = useContext(WordPressContext);
  if (context === undefined) {
    throw new Error('useWordPress must be used within a WordPressProvider');
  }
  return context;
}