import React from 'react';
import { useTest } from '../contexts/TestContext';

const ProgressBar: React.FC = () => {
  const { state } = useTest();

  const getSectionProgress = () => {
    const sectionQuestions = state.questions.filter(q => 
      q.section === state.currentSection && q.examSet === state.currentExamSet
    );
    if (sectionQuestions.length === 0) return 0;
    
    return ((state.currentQuestionIndex + 1) / sectionQuestions.length) * 100;
  };

  const getOverallProgress = () => {
    const totalQuestions = state.questions.filter(q => q.examSet === state.currentExamSet).length;
    if (totalQuestions === 0) return 0;

    const listeningQuestions = state.questions.filter(q => 
      q.section === 'listening' && q.examSet === state.currentExamSet
    ).length;
    const grammarQuestions = state.questions.filter(q => 
      q.section === 'grammar' && q.examSet === state.currentExamSet
    ).length;
    
    let completedQuestions = 0;

    switch (state.currentSection) {
      case 'listening':
        completedQuestions = state.currentQuestionIndex;
        break;
      case 'grammar':
        completedQuestions = listeningQuestions + state.currentQuestionIndex;
        break;
      case 'reading':
        completedQuestions = listeningQuestions + grammarQuestions + state.currentQuestionIndex;
        break;
    }

    return (completedQuestions / totalQuestions) * 100;
  };

  const getAnsweredInSection = () => {
    const sectionQuestions = state.questions.filter(q => 
      q.section === state.currentSection && q.examSet === state.currentExamSet
    );
    return sectionQuestions.filter(q => state.answers[q.id] !== undefined).length;
  };

  const sectionProgress = getSectionProgress();
  const overallProgress = getOverallProgress();
  const sectionQuestions = state.questions.filter(q => 
    q.section === state.currentSection && q.examSet === state.currentExamSet
  );
  const answeredCount = getAnsweredInSection();

  return (
    <div className="mt-4 space-y-3">
      {/* Section Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression de la section</span>
          <span>{Math.round(sectionProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${sectionProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Question {state.currentQuestionIndex + 1} sur {sectionQuestions.length}</span>
          <span>{answeredCount} répondues</span>
        </div>
      </div>

      {/* Overall Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression totale</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;