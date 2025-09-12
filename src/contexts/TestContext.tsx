import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Question {
  id: string;
  section: 'listening' | 'grammar' | 'reading';
  examSet: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  audioUrl?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface ExamSet {
  id: number;
  name: string;
  description: string;
  totalQuestions: number;
  isActive: boolean;
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
  | { type: 'SELECT_EXAM_SET'; payload: number };

const initialState: TestState = {
  currentSection: 'home',
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 90 * 60, // 90 minutes in seconds
  testStarted: false,
  testCompleted: false,
  questions: [],
  currentExamSet: 1,
  audioPlayed: {},
  score: 0,
  level: 'A1',
  examSets: [
    { id: 1, name: 'Examen 1', description: 'Premier examen d\'entraînement', totalQuestions: 70, isActive: true },
    { id: 2, name: 'Examen 2', description: 'Deuxième examen d\'entraînement', totalQuestions: 70, isActive: true },
    { id: 3, name: 'Examen 3', description: 'Troisième examen d\'entraînement', totalQuestions: 70, isActive: true },
  ],
  selectedExamSet: null,
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
      return {
        ...state,
        currentSection: action.payload,
        currentQuestionIndex: 0,
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
        return { ...state, timeRemaining: newTime, testCompleted: true };
      }
      return { ...state, timeRemaining: newTime };

    case 'COMPLETE_TEST':
      return {
        ...state,
        testCompleted: true,
        currentSection: 'results',
      };

    case 'SET_QUESTIONS':
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
        questions: state.questions,
        examSets: state.examSets,
        selectedExamSet: null,
      };

    case 'SET_EXAM_SETS':
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

    default:
      return state;
  }
}

const TestContext = createContext<{
  state: TestState;
  dispatch: React.Dispatch<TestAction>;
} | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(testReducer, initialState);

  return (
    <TestContext.Provider value={{ state, dispatch }}>
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