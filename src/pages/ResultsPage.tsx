import React from 'react';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle, RotateCcw, Home, Download, Printer } from 'lucide-react';
import { downloadCertificatePDF, printCertificatePDF, CertificateData } from '../utils/pdfGenerator';

const ResultsPage: React.FC = () => {
  const { state, dispatch } = useTest();
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  // Save user progress when results are displayed
  React.useEffect(() => {
    if (authState.currentUser && state.testCompleted) {
      dispatch({ 
        type: 'SAVE_USER_PROGRESS', 
        payload: { 
          userId: authState.currentUser.id, 
          examId: state.currentExamSet 
        } 
      });
    }
  }, [authState.currentUser, state.testCompleted, state.currentExamSet, dispatch]);
  const handleReturnHome = () => {
    dispatch({ type: 'RESET_TEST' });
    navigate('/');
  };

  const handleRetakeTest = () => {
    dispatch({ type: 'RESET_TEST' });
    navigate('/test');
  };

  const getCorrectAnswers = () => {
    const currentExamQuestions = state.questions.filter(q => q.examSet === state.currentExamSet);
    return currentExamQuestions.filter(q => state.answers[q.id] === q.correctAnswer).length;
  };

  const getIncorrectAnswers = () => {
    const currentExamQuestions = state.questions.filter(q => q.examSet === state.currentExamSet);
    return currentExamQuestions.filter(q => 
      state.answers[q.id] !== undefined && state.answers[q.id] !== q.correctAnswer
    ).length;
  };

  const getUnansweredQuestions = () => {
    const currentExamQuestions = state.questions.filter(q => q.examSet === state.currentExamSet);
    return currentExamQuestions.filter(q => state.answers[q.id] === undefined).length;
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

  const generateCertificateNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `BRIXEL-${date}-${random}`;
  };

  const handleDownloadPDF = () => {
    alert('Fonctionnalité de téléchargement PDF en cours de développement');
  };

  const handlePrintCertificate = () => {
    const certificateData: CertificateData = {
      userName: authState.currentUser?.username || 'UTILISATEUR',
      userEmail: authState.currentUser?.email || 'test@example.com',
      score: state.score,
      level: state.level,
      listeningScore: Math.round((listeningResults.percentage / 100) * (state.score / 3)),
      grammarScore: Math.round((grammarResults.percentage / 100) * (state.score / 3)),
      readingScore: Math.round((readingResults.percentage / 100) * (state.score / 3)),
      certificateNumber,
      date: currentDate
    };
    
    printCertificatePDF(certificateData);
  };

  const correctAnswers = getCorrectAnswers();
  const incorrectAnswers = getIncorrectAnswers();
  const unanswered = getUnansweredQuestions();
  const currentExamQuestions = state.questions.filter(q => q.examSet === state.currentExamSet);
  const totalQuestions = currentExamQuestions.length;

  const listeningResults = getSectionResults('listening');
  const grammarResults = getSectionResults('grammar');
  const readingResults = getSectionResults('reading');

  const certificateNumber = generateCertificateNumber();
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const globalPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Check if next exam is unlocked
  const nextExamId = state.currentExamSet + 1;
  const nextExam = state.examSets.find(exam => exam.id === nextExamId);
  const isNextExamUnlocked = nextExam?.isActive;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Résultats du Test TCF</h1>
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

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Results Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Medal Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre Niveau Global: {state.level}</h2>
            <p className="text-lg text-blue-600 font-semibold">{state.score} points sur 699</p>
            <p className="text-gray-600 mt-2">{getLevelDescription(state.level)}</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">{correctAnswers}</p>
              <p className="text-sm text-green-600">Bonnes réponses</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700">{incorrectAnswers}</p>
              <p className="text-sm text-red-600">Mauvaises réponses</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{unanswered}</p>
              <p className="text-sm text-yellow-600">Non répondues</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-blue-700">{globalPercentage}%</p>
              <p className="text-sm text-blue-600">Score global</p>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Certificat Brixel Academy</h3>
                <p className="text-sm text-gray-600">Téléchargez ou imprimez votre certificat de niveau TCF</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger PDF</span>
              </button>
              <button
                onClick={handlePrintCertificate}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900">Révision des Questions</h3>
            <p className="text-sm text-gray-600 mt-1">Consultez vos réponses pour chaque question de l'examen</p>
          </div>

          {/* Section Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'listening', label: 'Compréhension Orale', icon: '🎧' },
                { key: 'grammar', label: 'Structures de la Langue', icon: '✏️' },
                { key: 'reading', label: 'Compréhension Écrite', icon: '📖' },
              ].map((tab) => {
                const sectionQuestions = currentExamQuestions.filter(q => q.section === tab.key);
                const sectionCorrect = sectionQuestions.filter(q => state.answers[q.id] === q.correctAnswer).length;
                
                return (
                  <div key={tab.key} className="py-4 px-1 border-b-2 border-transparent">
                    <div className="flex items-center space-x-2">
                      <span>{tab.icon}</span>
                      <span className="font-medium text-gray-700">{tab.label}</span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {sectionCorrect}/{sectionQuestions.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Questions by Section */}
          <div className="p-6">
            {['listening', 'grammar', 'reading'].map((section) => {
              const sectionQuestions = currentExamQuestions.filter(q => q.section === section);
              const sectionName = section === 'listening' ? 'Compréhension Orale' : 
                                section === 'grammar' ? 'Structures de la Langue' : 
                                'Compréhension Écrite';
              
              return (
                <div key={section} className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <span>{section === 'listening' ? '🎧' : section === 'grammar' ? '✏️' : '📖'}</span>
                    <span>{sectionName}</span>
                  </h4>
                  
                  <div className="space-y-4">
                    {sectionQuestions.map((question, index) => {
                      const userAnswer = state.answers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;
                      const isAnswered = userAnswer !== undefined;
                      
                      return (
                        <div key={question.id} className={`border-2 rounded-lg p-6 ${
                          !isAnswered ? 'border-yellow-200 bg-yellow-50' :
                          isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-500">
                                Question {index + 1}
                              </span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                !isAnswered ? 'bg-yellow-100 text-yellow-800' :
                                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {!isAnswered ? 'Non répondu' : isCorrect ? 'Correct' : 'Incorrect'}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-900 mb-4 font-medium">{question.questionText}</p>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {question.options.map((option, optIndex) => {
                              const isUserAnswer = userAnswer === optIndex;
                              const isCorrectAnswer = question.correctAnswer === optIndex;
                              
                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg border ${
                                    isCorrectAnswer 
                                      ? 'border-green-300 bg-green-100 text-green-800' 
                                      : isUserAnswer && !isCorrectAnswer
                                        ? 'border-red-300 bg-red-100 text-red-800'
                                        : 'border-gray-200 bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="font-semibold">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <span>{option}</span>
                                    <div className="ml-auto flex items-center space-x-2">
                                      {isCorrectAnswer && (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      )}
                                      {isUserAnswer && !isCorrectAnswer && (
                                        <XCircle className="w-4 h-4 text-red-600" />
                                      )}
                                      {isUserAnswer && (
                                        <span className="text-xs font-medium">Votre réponse</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
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
        <div className="text-center mt-8 print:hidden">
          {/* Next Exam Unlocked Message */}
          {isNextExamUnlocked && nextExam && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <p className="font-medium">
                  Félicitations ! Vous avez débloqué l'examen suivant : {nextExam.name}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetakeTest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Refaire le Test
            </button>
            {isNextExamUnlocked && nextExam && (
              <button
                onClick={() => {
                  dispatch({ type: 'RESET_TEST' });
                  dispatch({ type: 'SELECT_EXAM_SET', payload: nextExamId });
                  navigate('/');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Examen Suivant
              </button>
            )}
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