import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { mockQuestions } from '../data/mockQuestions';
import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Question {
  id: string;
  section: 'listening' | 'grammar' | 'reading';
  examSet: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  audioUrl?: string;
  imageUrl?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamSet {
  id: number;
  name: string;
  description: string;
  totalQuestions: number;
  isActive: boolean;
  isPremium?: boolean;
  difficultyLevel?: string;
  timeLimitMinutes?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestState {
  currentSection: 'home' | 'listening' | 'grammar' | 'reading' | 'results';
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeRemaining: number;
  testStarted: boolean;
  testCompleted: boolean;
  questions: Question[];
  currentExamSet: number;
  audioPlayed: Record<string, boolean>;
  score: number;
  level: string;
  examSets: ExamSet[];
  selectedExamSet: number | null;
  completedExams: number[];
  userProgress: Record<string, {
    completedExams: number[];
    lastCompletedAt: string;
  }>;
}

type TestAction =
  | { type: 'START_TEST'; payload?: number }
  | { type: 'SET_SECTION'; payload: TestState['currentSection'] }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_ANSWER'; payload: { questionId: string; answer: number } }
  | { type: 'TICK_TIMER' }
  | { type: 'COMPLETE_TEST' }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'MARK_AUDIO_PLAYED'; payload: string }
  | { type: 'CALCULATE_SCORE' }
  | { type: 'RESET_TEST' }
  | { type: 'SET_EXAM_SETS'; payload: ExamSet[] }
  | { type: 'SELECT_EXAM_SET'; payload: number }
  | { type: 'UNLOCK_NEXT_EXAM'; payload: number }
  | { type: 'SAVE_USER_PROGRESS'; payload: { userId: string; examId: number } }
  | { type: 'LOAD_USER_PROGRESS'; payload: string };

const initialState: TestState = {
  currentSection: 'home',
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 90 * 60, // 90 minutes in seconds
  testStarted: false,
  testCompleted: false,
  questions: mockQuestions,
  currentExamSet: 1,
  audioPlayed: {},
  score: 0,
  level: 'A1',
  examSets: [
    { id: 1, name: 'TCF - Examen Principal', description: 'Examen principal du Test de Connaissance du Français avec questions de tous niveaux', totalQuestions: 70, isActive: true },
    { id: 2, name: 'TCF - Examen 2', description: 'Deuxième examen du Test de Connaissance du Français', totalQuestions: 10, isActive: false },
    { id: 3, name: 'TCF - Examen 3', description: 'Troisième examen du Test de Connaissance du Français', totalQuestions: 10, isActive: false },
    { id: 4, name: 'TCF - Examen 4', description: 'Quatrième examen du Test de Connaissance du Français', totalQuestions: 5, isActive: false },
  ],
  selectedExamSet: null,
  completedExams: [],
  userProgress: {},
};

// Load data from localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Save data to localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};
function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'START_TEST':
      const examSetId = action.payload || state.selectedExamSet || 1;
      return {
        ...state,
        testStarted: true,
        currentSection: 'listening',
        currentQuestionIndex: 0,
        currentExamSet: examSetId,
      };

    case 'SET_SECTION':
      const newSectionQuestions = state.questions.filter(q => 
        q.section === action.payload && q.examSet === state.currentExamSet
      );
      return {
        ...state,
        currentSection: action.payload,
        currentQuestionIndex: action.payload === 'listening' ? 0 : 
                            action.payload === 'grammar' ? 0 : 
                            action.payload === 'reading' ? 0 : state.currentQuestionIndex,
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };

    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      };

    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };

    case 'TICK_TIMER':
      const newTime = Math.max(0, state.timeRemaining - 1);
      if (newTime === 0) {
        return { 
          ...state, 
          timeRemaining: newTime, 
          testCompleted: true,
          currentSection: 'results'
        };
      }
      return { ...state, timeRemaining: newTime };

    case 'COMPLETE_TEST':
      // Unlock next exam when current exam is completed
      const nextExamId = state.currentExamSet + 1;
      const updatedExamSets = state.examSets.map(exam => 
        exam.id === nextExamId ? { ...exam, isActive: true } : exam
      );
      
      // Add current exam to completed list
      const newCompletedExams = [...state.completedExams];
      if (!newCompletedExams.includes(state.currentExamSet)) {
        newCompletedExams.push(state.currentExamSet);
      }
      
      // Save to localStorage
      saveToStorage('tcf_completed_exams', newCompletedExams);
      saveToStorage('tcf_exam_sets', updatedExamSets);
      
      return {
        ...state,
        testCompleted: true,
        currentSection: 'results',
        completedExams: newCompletedExams,
        examSets: updatedExamSets,
      };

    case 'SET_QUESTIONS':
      saveToStorage('tcf_questions', action.payload);
      return {
        ...state,
        questions: action.payload,
      };

    case 'MARK_AUDIO_PLAYED':
      return {
        ...state,
        audioPlayed: {
          ...state.audioPlayed,
          [action.payload]: true,
        },
      };

    case 'CALCULATE_SCORE':
      const currentExamQuestions = state.questions.filter(q => q.examSet === state.currentExamSet);
      const correctAnswers = currentExamQuestions.filter(
        (q) => state.answers[q.id] === q.correctAnswer
      ).length;
      const totalQuestions = currentExamQuestions.length;
      const scorePercentage = (correctAnswers / totalQuestions) * 100;
      const finalScore = Math.round((scorePercentage / 100) * 699);
      
      let level = 'A1';
      if (finalScore >= 600) level = 'C2';
      else if (finalScore >= 500) level = 'C1';
      else if (finalScore >= 400) level = 'B2';
      else if (finalScore >= 300) level = 'B1';
      else if (finalScore >= 200) level = 'A2';

      return {
        ...state,
        score: finalScore,
        level,
      };

    case 'RESET_TEST':
      return {
        ...initialState,
        questions: loadFromStorage('tcf_questions', mockQuestions),
        examSets: loadFromStorage('tcf_exam_sets', initialState.examSets),
        completedExams: loadFromStorage('tcf_completed_exams', []),
        userProgress: loadFromStorage('tcf_user_progress', {}),
        selectedExamSet: null,
      };

    case 'SET_EXAM_SETS':
      saveToStorage('tcf_exam_sets', action.payload);
      return {
        ...state,
        examSets: action.payload,
      };

    case 'SELECT_EXAM_SET':
      return {
        ...state,
        selectedExamSet: action.payload,
        currentExamSet: action.payload,
      };

    case 'UNLOCK_NEXT_EXAM':
      const unlockedExamSets = state.examSets.map(exam => 
        exam.id === action.payload ? { ...exam, isActive: true } : exam
      );
      saveToStorage('tcf_exam_sets', unlockedExamSets);
      return {
        ...state,
        examSets: unlockedExamSets,
      };

    case 'SAVE_USER_PROGRESS':
      const { userId, examId } = action.payload;
      const updatedProgress = {
        ...state.userProgress,
        [userId]: {
          completedExams: [...(state.userProgress[userId]?.completedExams || []), examId],
          lastCompletedAt: new Date().toISOString(),
        }
      };
      saveToStorage('tcf_user_progress', updatedProgress);
      return {
        ...state,
        userProgress: updatedProgress,
      };

    case 'LOAD_USER_PROGRESS':
      const userProgressData = state.userProgress[action.payload];
      if (userProgressData) {
        const userCompletedExams = userProgressData.completedExams;
        const examSetsWithProgress = state.examSets.map(exam => {
          // Unlock exams based on user progress
          if (exam.id === 1) return { ...exam, isActive: true }; // First exam always unlocked
          if (userCompletedExams.includes(exam.id - 1)) return { ...exam, isActive: true };
          return exam;
        });
        
        return {
          ...state,
          completedExams: userCompletedExams,
          examSets: examSetsWithProgress,
        };
      }
      return state;

    default:
      return state;
  }
}

const TestContext = createContext<{
  state: TestState;
  dispatch: React.Dispatch<TestAction>;
  loadExamSets: () => Promise<void>;
  loadQuestions: () => Promise<void>;
  createExamSet: (examSet: Omit<ExamSet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  createQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExamSet: (id: number, updates: Partial<ExamSet>) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteExamSet: (id: number) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
} | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(testReducer, {
    ...initialState,
    questions: loadFromStorage('tcf_questions', mockQuestions),
    examSets: loadFromStorage('tcf_exam_sets', initialState.examSets),
    completedExams: loadFromStorage('tcf_completed_exams', []),
    userProgress: loadFromStorage('tcf_user_progress', {}),
  });

  // Real-time subscriptions
  React.useEffect(() => {
    // Subscribe to exam sets changes
    const examSetsSubscription = supabase
      .channel('exam_sets_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'exam_sets' },
        (payload) => {
          console.log('Exam sets change received:', payload);
          loadExamSets();
        }
      )
      .subscribe();

    // Subscribe to questions changes
    const questionsSubscription = supabase
      .channel('questions_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        (payload) => {
          console.log('Questions change received:', payload);
          loadQuestions();
        }
      )
      .subscribe();

    return () => {
      examSetsSubscription.unsubscribe();
      questionsSubscription.unsubscribe();
    };
  }, []);

  // Load exam sets from Supabase
  const loadExamSets = async () => {
    // Check if Supabase is properly configured before making requests
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured. Using local exam sets data.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('exam_sets')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedExamSets: ExamSet[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          totalQuestions: 0, // Will be calculated
          isActive: item.is_active,
          isPremium: item.is_premium,
          difficultyLevel: item.difficulty_level,
          timeLimitMinutes: item.time_limit_minutes,
          createdBy: item.created_by,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        dispatch({ type: 'SET_EXAM_SETS', payload: formattedExamSets });
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('⚠️ Cannot connect to Supabase. Using local exam sets data.');
      } else {
        console.error('Error loading exam sets:', error);
      }
    }
  };

  // Load questions from Supabase
  const loadQuestions = async () => {
    // Check if Supabase is properly configured before making requests
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured. Using local questions data.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          exam_sets!inner(is_active)
        `)
        .eq('exam_sets.is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedQuestions: Question[] = data.map(item => ({
          id: item.id,
          section: item.section as 'listening' | 'grammar' | 'reading',
          examSet: item.exam_set_id,
          questionText: item.question_text,
          options: item.options,
          correctAnswer: item.correct_answer,
          level: item.level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
          audioUrl: item.audio_url,
          imageUrl: item.image_url,
          createdBy: item.created_by,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        dispatch({ type: 'SET_QUESTIONS', payload: formattedQuestions });
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('⚠️ Cannot connect to Supabase. Using local questions data.');
      } else {
        console.error('Error loading questions:', error);
      }
    }
  };

  // Create new exam set
  const createExamSet = async (examSetData: Omit<ExamSet, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isSupabaseConfigured()) {
      throw new Error('🚨 DATABASE REQUIRED\n\nTo create exams that all users can access, you need to:\n\n1. Set up Supabase database\n2. Configure your .env file\n3. Restart the server\n\nSee console for setup instructions.');
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('exam_sets')
        .insert([{
          name: examSetData.name,
          description: examSetData.description,
          is_active: examSetData.isActive,
          is_premium: examSetData.isPremium || false,
          difficulty_level: examSetData.difficultyLevel || 'mixed',
          time_limit_minutes: examSetData.timeLimitMinutes || 90,
          created_by: userData.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Real-time will automatically update all clients
      console.log('Exam set created:', data);
      console.log('🔄 All users will see this exam immediately');
    } catch (error) {
      console.error('Error creating exam set:', error);
      throw error;
    }
  };

  // Create new question
  const createQuestion = async (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isSupabaseConfigured()) {
      throw new Error('🚨 DATABASE REQUIRED\n\nTo create questions that all users can access, you need to:\n\n1. Set up Supabase database\n2. Configure your .env file\n3. Restart the server\n\nSee console for setup instructions.');
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('questions')
        .insert([{
          exam_set_id: questionData.examSet,
          section: questionData.section,
          question_text: questionData.questionText,
          options: questionData.options,
          correct_answer: questionData.correctAnswer,
          level: questionData.level,
          audio_url: questionData.audioUrl,
          image_url: questionData.imageUrl,
          created_by: userData.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Question created in database:', data);
      console.log('🔄 All users will see this question immediately');
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  };

  // Update exam set
  const updateExamSet = async (id: number, updates: Partial<ExamSet>) => {
    if (!isSupabaseConfigured()) {
      throw new Error('🚨 DATABASE REQUIRED\n\nTo update exams for all users, you need to:\n\n1. Set up Supabase database\n2. Configure your .env file\n3. Restart the server\n\nSee console for setup instructions.');
    }

    try {
      const { data, error } = await supabase
        .from('exam_sets')
        .update({
          name: updates.name,
          description: updates.description,
          is_active: updates.isActive,
          is_premium: updates.isPremium,
          difficulty_level: updates.difficultyLevel,
          time_limit_minutes: updates.timeLimitMinutes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Exam set updated in database:', data);
      console.log('🔄 All users will see the changes immediately');
    } catch (error) {
      console.error('Error updating exam set:', error);
      throw error;
    }
  };

  // Update question
  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    if (!isSupabaseConfigured()) {
      throw new Error('🚨 DATABASE REQUIRED\n\nTo update questions for all users, you need to:\n\n1. Set up Supabase database\n2. Configure your .env file\n3. Restart the server\n\nSee console for setup instructions.');
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .update({
          exam_set_id: updates.examSet,
          section: updates.section,
          question_text: updates.questionText,
          options: updates.options,
          correct_answer: updates.correctAnswer,
          level: updates.level,
          audio_url: updates.audioUrl,
          image_url: updates.imageUrl,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Question updated in database:', data);
      console.log('🔄 All users will see the changes immediately');
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  };

  // Delete exam set
  const deleteExamSet = async (id: number) => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured. Deleting exam set locally.');
      
      // Delete exam set locally
      const filteredExamSets = state.examSets.filter(examSet => examSet.id !== id);
      const filteredQuestions = state.questions.filter(question => question.examSet !== id);
      
      dispatch({ type: 'SET_EXAM_SETS', payload: filteredExamSets });
      dispatch({ type: 'SET_QUESTIONS', payload: filteredQuestions });
      console.log('Exam set deleted locally:', id);
      return;
    }

    try {
      const { error } = await supabase
        .from('exam_sets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('Exam set deleted:', id);
    } catch (error) {
      console.error('Error deleting exam set:', error);
      throw error;
    }
  };

  // Delete question
  const deleteQuestion = async (id: string) => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured. Deleting question locally.');
      
      // Delete question locally
      const filteredQuestions = state.questions.filter(question => question.id !== id);
      
      dispatch({ type: 'SET_QUESTIONS', payload: filteredQuestions });
      console.log('Question deleted locally:', id);
      return;
    }

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('Question deleted:', id);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  };

  // Load data on mount
  React.useEffect(() => {
    loadExamSets();
    loadQuestions();
  }, []);

  // Load user progress when user changes
  const { state: authState } = useAuth();
  React.useEffect(() => {
    if (authState.currentUser) {
      dispatch({ type: 'LOAD_USER_PROGRESS', payload: authState.currentUser.id });
    }
  }, [authState.currentUser]);

  return (
    <TestContext.Provider value={{ 
      state, 
      dispatch,
      loadExamSets,
      loadQuestions,
      createExamSet,
      createQuestion,
      updateExamSet,
      updateQuestion,
      deleteExamSet,
      deleteQuestion
    }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
}