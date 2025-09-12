import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';
import { BookOpen, Clock, Headphones, PenTool, FileText, Target, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useTest();

  const handleStartTest = (examSetId?: number) => {
    if (examSetId) {
      dispatch({ type: 'SELECT_EXAM_SET', payload: examSetId });
    }
    dispatch({ type: 'START_TEST', payload: examSetId });
    navigate('/test');
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
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Administration
            </button>
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

        {/* Exam Selection */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choisissez votre examen</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {state.examSets.filter(exam => exam.isActive).map((examSet) => {
              const questionCounts = getExamQuestionCount(examSet.id);
              return (
                <div key={examSet.id} className="bg-white rounded-xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{examSet.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{examSet.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Compréhension Orale:</span>
                      <span className="font-medium">{questionCounts.listening} questions</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Structures de la Langue:</span>
                      <span className="font-medium">{questionCounts.grammar} questions</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Compréhension Écrite:</span>
                      <span className="font-medium">{questionCounts.reading} questions</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-blue-600">{questionCounts.total} questions</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartTest(examSet.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Commencer {examSet.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
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

        {/* Quick Start */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Ou commencez rapidement avec l'examen par défaut
          </p>
          <button
            onClick={() => handleStartTest(1)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Démarrage Rapide - Examen 1
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;