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
    
    downloadCertificatePDF(certificateData);
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

        {/* Certificate Section */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Certificate Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Certificat Brixel Academy</h3>
                  <p className="text-sm text-gray-600">Téléchargez ou imprimez votre certificat de niveau TCF délivré par Brixel Academy</p>
                </div>
              </div>
              <div className="flex space-x-3 print:hidden">
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

          {/* Certificate Content */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-4xl mx-auto">
              {/* Header with French Republic and TCF */}
              <div className="flex justify-between items-start mb-8">
                <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
                  <div className="text-xs font-bold">RÉPUBLIQUE</div>
                  <div className="text-xs font-bold">FRANÇAISE</div>
                  <div className="text-xs mt-2">Liberté</div>
                  <div className="text-xs">Égalité</div>
                  <div className="text-xs">Fraternité</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-sm">FRANCE</div>
                  <div className="text-blue-600 font-bold text-sm">ÉDUCATION</div>
                  <div className="text-gray-600 text-xs">INTERNATIONAL</div>
                </div>
                <div className="text-red-500 font-bold text-4xl">TCF</div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-purple-600 mb-4">Attestation TCF</h2>
              </div>

              {/* Personal Information */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium w-40">Nom:</span>
                  <span className="text-gray-900 font-bold text-lg">{authState.currentUser?.username?.toUpperCase() || 'UTILISATEUR'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium w-40">Prénom:</span>
                  <span className="text-gray-900 font-bold text-lg">{authState.currentUser?.email?.split('@')[0] || 'Test'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium w-40">N° de certificat:</span>
                  <span className="text-gray-900 font-bold text-lg">{certificateNumber}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium w-40">Date:</span>
                  <span className="text-gray-900 font-bold text-lg">{currentDate}</span>
                </div>
              </div>

              {/* Results Table */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-purple-600 mb-4">Résultats des épreuves</h3>
                
                {/* Table Header */}
                <div className="bg-purple-600 text-white rounded-t-lg">
                  <div className="grid grid-cols-3 gap-4 p-4 font-bold">
                    <div>Épreuve</div>
                    <div className="text-center">Score</div>
                    <div className="text-center">Niveau</div>
                  </div>
                </div>
                
                {/* Table Body */}
                <div className="border-2 border-purple-600 border-t-0 rounded-b-lg">
                  <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200">
                    <div className="text-gray-700">Compréhension orale</div>
                    <div className="text-center text-gray-700">{Math.round((listeningResults.percentage / 100) * (state.score / 3))} pts</div>
                    <div className="text-center text-gray-700">{state.level}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200">
                    <div className="text-gray-700">Maîtrise des structures de la langue</div>
                    <div className="text-center text-gray-700">{Math.round((grammarResults.percentage / 100) * (state.score / 3))} pts</div>
                    <div className="text-center text-gray-700">{state.level}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200">
                    <div className="text-gray-700">Compréhension écrite</div>
                    <div className="text-center text-gray-700">{Math.round((readingResults.percentage / 100) * (state.score / 3))} pts</div>
                    <div className="text-center text-gray-700">{state.level}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 font-bold">
                    <div className="text-purple-600">Score Global</div>
                    <div className="text-center text-purple-600">{state.score} / 699 pts</div>
                    <div className="text-center text-purple-600">{state.level}</div>
                  </div>
                </div>
              </div>

              {/* Footer with Brixel Academy */}
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">BRIXEL</div>
                <div className="text-2xl font-bold text-purple-600 mb-4">ACADEMY</div>
                <div className="text-sm text-gray-600 mb-2">Ce certificat est délivré par</div>
                <div className="text-lg font-bold text-gray-700">Brixel Academy</div>
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-500 print:hidden">
            Ce certificat provisoire est délivré par Brixel Academy pour attester de votre niveau TCF
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 print:hidden">
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