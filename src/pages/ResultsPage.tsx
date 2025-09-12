import React from 'react';
import { useTest } from '../contexts/TestContext';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const { state, dispatch } = useTest();
  const navigate = useNavigate();

  const handleReturnHome = () => {
    dispatch({ type: 'RESET_TEST' });
    navigate('/');
  };

  const handleRetakeTest = () => {
    dispatch({ type: 'RESET_TEST' });
    navigate('/test');
  };

  const getCorrectAnswers = () => {
    return state.questions.filter(q => state.answers[q.id] === q.correctAnswer).length;
  };

  const getIncorrectAnswers = () => {
    return state.questions.filter(q => 
      state.answers[q.id] !== undefined && state.answers[q.id] !== q.correctAnswer
    ).length;
  };

  const getUnansweredQuestions = () => {
    return state.questions.filter(q => state.answers[q.id] === undefined).length;
  };

  const getSectionResults = (section: 'listening' | 'grammar' | 'reading') => {
    const sectionQuestions = state.questions.filter(q => 
      q.section === section && q.examSet === state.currentExamSet
    );
    const correct = sectionQuestions.filter(q => state.answers[q.id] === q.correctAnswer).length;
    return {
      total: sectionQuestions.length,
      correct,
      percentage: sectionQuestions.length > 0 ? (correct / sectionQuestions.length) * 100 : 0
    };
  };

  const getLevelDescription = (level: string) => {
    const descriptions: { [key: string]: string } = {
      'A1': 'Niveau découverte - Vous pouvez comprendre et utiliser des expressions familières et quotidiennes.',
      'A2': 'Niveau de survie - Vous pouvez communiquer lors de tâches simples et habituelles.',
      'B1': 'Niveau seuil - Vous pouvez faire face à la plupart des situations rencontrées en voyage.',
      'B2': 'Niveau avancé - Vous pouvez comprendre le contenu essentiel de sujets concrets ou abstraits.',
      'C1': 'Niveau autonome - Vous pouvez vous exprimer spontanément et couramment.',
      'C2': 'Niveau maîtrise - Vous pouvez comprendre sans effort pratiquement tout ce que vous lisez ou entendez.',
    };
    return descriptions[level] || '';
  };

  const correctAnswers = getCorrectAnswers();
  const incorrectAnswers = getIncorrectAnswers();
  const unanswered = getUnansweredQuestions();
  const currentExamQuestions = state.questions.filter(q => q.examSet === state.currentExamSet);
  const totalQuestions = currentExamQuestions.length;

  const listeningResults = getSectionResults('listening');
  const grammarResults = getSectionResults('grammar');
  const readingResults = getSectionResults('reading');

  const currentExamSet = state.examSets.find(e => e.id === state.currentExamSet);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Résultats du Test TCF</h1>
              <p className="text-sm text-gray-600">{currentExamSet?.name} - {currentExamSet?.description}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleRetakeTest}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refaire le test</span>
              </button>
              <button
                onClick={handleReturnHome}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Overall Score */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Votre Niveau: {state.level}</h2>
            <p className="text-xl text-blue-600 font-semibold mb-4">{state.score} points sur 699</p>
            <p className="text-gray-600 max-w-2xl mx-auto">{getLevelDescription(state.level)}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">{correctAnswers}</p>
              <p className="text-sm text-green-600">Bonnes réponses</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700">{incorrectAnswers}</p>
              <p className="text-sm text-red-600">Mauvaises réponses</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-center mb-2">
                <span className="w-6 h-6 bg-yellow-500 rounded-full"></span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{unanswered}</p>
              <p className="text-sm text-yellow-600">Non répondues</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <span className="w-6 h-6 bg-blue-500 rounded-full"></span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{Math.round((correctAnswers / totalQuestions) * 100)}%</p>
              <p className="text-sm text-blue-600">Score global</p>
            </div>
          </div>
        </div>

        {/* Section Results */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compréhension Orale</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Score</span>
                <span>{listeningResults.correct}/{listeningResults.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${listeningResults.percentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{Math.round(listeningResults.percentage)}%</p>
            <p className="text-sm text-gray-600">25 questions • 25 minutes</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Structures de la Langue</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Score</span>
                <span>{grammarResults.correct}/{grammarResults.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${grammarResults.percentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">{Math.round(grammarResults.percentage)}%</p>
            <p className="text-sm text-gray-600">20 questions • 20 minutes</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compréhension Écrite</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Score</span>
                <span>{readingResults.correct}/{readingResults.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${readingResults.percentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">{Math.round(readingResults.percentage)}%</p>
            <p className="text-sm text-gray-600">25 questions • 45 minutes</p>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Analyse Détaillée</h3>
          
          <div className="space-y-6">
            {currentExamQuestions.map((question, index) => {
              const userAnswer = state.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const isAnswered = userAnswer !== undefined;

              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        {question.level}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        {question.section === 'listening' ? 'Orale' : question.section === 'grammar' ? 'Grammaire' : 'Écrite'}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-1 ${isCorrect ? 'text-green-600' : isAnswered ? 'text-red-600' : 'text-yellow-600'}`}>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isAnswered ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                      )}
                      <span className="text-sm font-medium">
                        {isCorrect ? 'Correct' : isAnswered ? 'Incorrect' : 'Non répondu'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-3">{question.questionText}</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectAnswer = question.correctAnswer === optIndex;
                      
                      let bgColor = 'bg-gray-100';
                      let textColor = 'text-gray-700';
                      
                      if (isCorrectAnswer) {
                        bgColor = 'bg-green-100';
                        textColor = 'text-green-800';
                      } else if (isUserAnswer && !isCorrect) {
                        bgColor = 'bg-red-100';
                        textColor = 'text-red-800';
                      }
                      
                      return (
                        <div
                          key={optIndex}
                          className={`p-2 rounded ${bgColor} ${textColor}`}
                        >
                          <strong>{String.fromCharCode(65 + optIndex)}:</strong> {option}
                          {isCorrectAnswer && (
                            <span className="ml-2 text-xs font-medium">(Bonne réponse)</span>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <span className="ml-2 text-xs font-medium">(Votre réponse)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetakeTest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Refaire le Test
            </button>
            <button
              onClick={handleReturnHome}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Retour à l'Accueil
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;