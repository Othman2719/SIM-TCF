import React from 'react';
import { useTest } from '../contexts/TestContext';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

const NavigationComponent: React.FC = () => {
  const { state, dispatch } = useTest();

  const getCurrentSectionQuestions = () => {
    return state.questions.filter(q => 
      q.section === state.currentSection && q.examSet === state.currentExamSet
    );
  };

  const handleNext = () => {
    const sectionQuestions = getCurrentSectionQuestions();
    const isLastQuestionInSection = state.currentQuestionIndex >= sectionQuestions.length - 1;

    if (isLastQuestionInSection) {
      // Move to next section or finish test
      switch (state.currentSection) {
        case 'listening':
          dispatch({ type: 'SET_SECTION', payload: 'grammar' });
          break;
        case 'grammar':
          dispatch({ type: 'SET_SECTION', payload: 'reading' });
          break;
        case 'reading':
          dispatch({ type: 'COMPLETE_TEST' });
          break;
      }
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      dispatch({ type: 'PREV_QUESTION' });
    } else {
      // Move to previous section
      switch (state.currentSection) {
        case 'grammar':
          dispatch({ type: 'SET_SECTION', payload: 'listening' });
          // Set to last question of listening section
          const listeningQuestions = state.questions.filter(q => 
            q.section === 'listening' && q.examSet === state.currentExamSet
          );
          dispatch({ type: 'SET_QUESTION_INDEX', payload: listeningQuestions.length - 1 });
          break;
        case 'reading':
          dispatch({ type: 'SET_SECTION', payload: 'grammar' });
          // Set to last question of grammar section
          const grammarQuestions = state.questions.filter(q => 
            q.section === 'grammar' && q.examSet === state.currentExamSet
          );
          dispatch({ type: 'SET_QUESTION_INDEX', payload: grammarQuestions.length - 1 });
          break;
      }
    }
  };

  const handleFinishTest = () => {
    if (confirm('Êtes-vous sûr de vouloir terminer le test maintenant?')) {
      dispatch({ type: 'COMPLETE_TEST' });
    }
  };

  const sectionQuestions = getCurrentSectionQuestions();
  const isFirstQuestion = state.currentQuestionIndex === 0 && state.currentSection === 'listening';
  const isLastQuestion = state.currentSection === 'reading' && 
                         state.currentQuestionIndex >= sectionQuestions.length - 1;
  
  const currentQuestion = sectionQuestions[state.currentQuestionIndex];
  const isCurrentAnswered = currentQuestion && state.answers[currentQuestion.id] !== undefined;

  // Check if we can go back (not allowed if audio was played in listening section)
  const canGoBack = () => {
    if (state.currentSection === 'listening') {
      const currentQ = sectionQuestions[state.currentQuestionIndex];
      return !currentQ?.audioUrl || !state.audioPlayed[currentQ.id];
    }
    return true;
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={handlePrevious}
        disabled={isFirstQuestion || !canGoBack()}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isFirstQuestion || !canGoBack()
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Précédent</span>
      </button>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Question {state.currentQuestionIndex + 1} sur {sectionQuestions.length}
        </span>
        
        {isCurrentAnswered && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm">Répondu</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinishTest}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Terminer le Test</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavigationComponent;