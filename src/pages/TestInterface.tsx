import React, { useEffect } from 'react';
import { useTest } from '../contexts/TestContext';
import { useNavigate } from 'react-router-dom';
import TimerComponent from '../components/TimerComponent';
import QuestionComponent from '../components/QuestionComponent';
import NavigationComponent from '../components/NavigationComponent';
import ProgressBar from '../components/ProgressBar';
import { mockQuestions } from '../data/mockQuestions';
import { Clock, Volume2, PenTool, FileText } from 'lucide-react';

const TestInterface: React.FC = () => {
  const { state, dispatch } = useTest();
  const navigate = useNavigate();

  useEffect(() => {
    // Load mock questions
    dispatch({ type: 'SET_QUESTIONS', payload: mockQuestions });
  }, [dispatch]);

  useEffect(() => {
    if (!state.testStarted) {
      navigate('/');
      return;
    }

    if (state.testCompleted) {
      dispatch({ type: 'CALCULATE_SCORE' });
      navigate('/results');
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.testStarted, state.testCompleted, dispatch, navigate]);

  const getSectionQuestions = () => {
    return state.questions.filter(q => 
      q.section === state.currentSection && q.examSet === state.currentExamSet
    );
  };

  const getSectionIcon = () => {
    switch (state.currentSection) {
      case 'listening':
        return <Volume2 className="w-5 h-5" />;
      case 'grammar':
        return <PenTool className="w-5 h-5" />;
      case 'reading':
        return <FileText className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch (state.currentSection) {
      case 'listening':
        return 'Compréhension Orale';
      case 'grammar':
        return 'Structures de la Langue';
      case 'reading':
        return 'Compréhension Écrite';
      default:
        return '';
    }
  };

  const getSectionTime = () => {
    switch (state.currentSection) {
      case 'listening':
        return '25 questions • 25 minutes';
      case 'grammar':
        return '20 questions • 20 minutes';
      case 'reading':
        return '25 questions • 45 minutes';
      default:
        return '';
    }
  };

  const sectionQuestions = getSectionQuestions();
  const currentQuestion = sectionQuestions[state.currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement du test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-600">
                {getSectionIcon()}
                <h1 className="text-lg font-semibold">{getSectionTitle()}</h1>
              </div>
              <span className="text-sm text-gray-500">{getSectionTime()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <TimerComponent />
              </div>
            </div>
          </div>
          <ProgressBar />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Question {state.currentQuestionIndex + 1} sur {sectionQuestions.length}
              </h2>
            </div>

            <QuestionComponent question={currentQuestion} />
          </div>

          <div className="border-t border-gray-200 px-8 py-4">
            <NavigationComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestInterface;