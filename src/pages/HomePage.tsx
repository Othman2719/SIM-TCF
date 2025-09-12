import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Headphones, PenTool, FileText, Target, ChevronRight, Lock, AlertCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useTest();
  const { state: authState, logout } = useAuth();
  const [selectedExam, setSelectedExam] = React.useState<number>(1);
  const [showStartModal, setShowStartModal] = React.useState(false);

  const handleStartTest = (examSetId?: number) => {
    setShowStartModal(true);
  };

  const confirmStartTest = () => {
    const examId = selectedExam;
    dispatch({ type: 'SELECT_EXAM_SET', payload: examId });
    dispatch({ type: 'START_TEST', payload: examId });
    setShowStartModal(false);
    navigate('/test');
  };

  const cancelStartTest = () => {
    setShowStartModal(false);
  };

  const getExamQuestionCount = (examSetId: number) => {
    const examQuestions = state.questions.filter(q => q.examSet === examSetId);
    const listening = examQuestions.filter(q => q.section === 'listening').length;
    const grammar = examQuestions.filter(q => q.section === 'grammar').length;
    const reading = examQuestions.filter(q => q.section === 'reading').length;
    return { listening, grammar, reading, total: examQuestions.length };
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Simulateur TCF</h1>
                <p className="text-sm text-blue-600">Test de Connaissance du Français</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Bonjour, <span className="font-medium">{authState.currentUser?.username}</span>
              </div>
              {authState.currentUser?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Administration
                </button>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Préparez-vous au TCF
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Entraînez-vous avec notre simulateur officiel du Test de Connaissance du Français. 
            Évaluez votre niveau selon le Cadre Européen Commun de Référence.
          </p>
        </div>
        {/* Test Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Compréhension Orale</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">25 questions • 25 minutes</p>
            <p className="text-gray-700">Écoutez les enregistrements audio et répondez aux questions. Chaque audio ne peut être écouté qu'une seule fois.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Structures de la Langue</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">20 questions • 20 minutes</p>
            <p className="text-gray-700">Testez votre maîtrise de la grammaire française : conjugaisons, accords, pronoms et structures.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Compréhension Écrite</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">25 questions • 45 minutes</p>
            <p className="text-gray-700">Lisez différents types de textes et démontrez votre compréhension écrite du français.</p>
          </div>
        </div>

        {/* Test Details */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-blue-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Détails de l'Examen</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Durée Totale</h4>
              </div>
              <p className="text-gray-700 mb-6">90 minutes avec minuteur automatique</p>

              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Système de Notation</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">A1 - Découverte:</span>
                  <span className="font-medium">100-199 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">A2 - Survie:</span>
                  <span className="font-medium">200-299 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">B1 - Seuil:</span>
                  <span className="font-medium">300-399 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">B2 - Avancé:</span>
                  <span className="font-medium">400-499 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">C1 - Autonome:</span>
                  <span className="font-medium">500-599 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">C2 - Maîtrise:</span>
                  <span className="font-medium">600-699 points</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Instructions Importantes</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Les enregistrements audio ne peuvent être écoutés qu'une seule fois</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Vous pouvez naviguer entre les questions sauf pour l'audio déjà joué</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Vos réponses sont automatiquement sauvegardées</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Le test se termine automatiquement après 90 minutes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Utilisez un casque ou des écouteurs pour l'épreuve orale</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exam Selection */}
        <div className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choisir un Examen</h3>
          <div className="space-y-4 max-w-4xl mx-auto">
            {state.examSets.map((examSet, index) => {
              const questionCounts = getExamQuestionCount(examSet.id);
              const isLocked = !examSet.isActive;
              const isSelected = selectedExam === examSet.id;
              
              return (
                <div 
                  key={examSet.id} 
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    isSelected && !isLocked
                      ? 'border-blue-500 bg-blue-50' 
                      : isLocked 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => !isLocked && setSelectedExam(examSet.id)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Radio Button */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected && !isLocked
                          ? 'border-blue-500 bg-blue-500'
                          : isLocked
                            ? 'border-gray-300 bg-gray-100'
                            : 'border-gray-300'
                      }`}>
                        {isSelected && !isLocked && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className={`text-lg font-semibold ${
                            isLocked ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                            {index === 0 ? 'TCF - Examen Principal' : examSet.name}
                          </h4>
                          <span className={`text-sm ${
                            isLocked ? 'text-gray-400' : 'text-blue-600'
                          }`}>
                            {questionCounts.total} questions
                          </span>
                          {isLocked && (
                            <div className="flex items-center space-x-1 text-orange-500">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm font-medium">Verrouillé</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        isLocked ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {index === 0 
                          ? 'Examen principal du Test de Connaissance du Français avec questions de tous niveaux'
                          : examSet.description
                        }
                      </p>
                      
                      {isLocked && (
                        <p className="text-sm text-orange-600 font-medium">
                          Terminez l'examen précédent pour débloquer celui-ci
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Start Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => handleStartTest()}
              disabled={!state.examSets.find(e => e.id === selectedExam)?.isActive}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mx-auto ${
                state.examSets.find(e => e.id === selectedExam)?.isActive
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Commencer l'Examen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Start */}
      </main>

      {/* Start Test Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-6">ATTENTION !</h3>

              {/* Content */}
              <div className="space-y-4 mb-8 text-gray-700">
                <p className="leading-relaxed">
                  Vous êtes sur le point de lancer le simulateur TCF. Vous avez 90 
                  minutes pour réaliser le test, vous ne pourrez pas faire de pause.
                </p>
                <p className="leading-relaxed">
                  Utilisez des écouteurs ou un casque audio pour une meilleure 
                  expérience.
                </p>
                <p className="font-semibold text-gray-900 mt-6">
                  Êtes-vous prêt ?
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={confirmStartTest}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Commencer le test</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelStartTest}
                  className="w-full bg-white hover:bg-gray-50 text-gray-600 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors"
                >
                  Revenir à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;