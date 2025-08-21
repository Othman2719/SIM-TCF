import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';
import { Plus, Edit2, Trash2, Upload, Home, Save } from 'lucide-react';
import { Question } from '../contexts/TestContext';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useTest();
  const [activeTab, setActiveTab] = useState<'listening' | 'grammar' | 'reading'>('listening');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    level: 'A1' as Question['level'],
    audioFile: null as File | null,
  });

  const sectionQuestions = state.questions.filter(q => q.section === activeTab);

  const handleAddQuestion = () => {
    if (!formData.questionText || formData.options.some(opt => !opt.trim())) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newQuestion: Question = {
      id: `${activeTab}_${Date.now()}`,
      section: activeTab,
      examSet: 1,
      questionText: formData.questionText,
      options: formData.options,
      correctAnswer: formData.correctAnswer,
      level: formData.level,
      audioUrl: formData.audioFile ? URL.createObjectURL(formData.audioFile) : undefined,
    };

    dispatch({ type: 'SET_QUESTIONS', payload: [...state.questions, newQuestion] });
    resetForm();
    setShowAddForm(false);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      level: question.level,
      audioFile: null,
    });
    setShowAddForm(true);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = state.questions.map(q =>
      q.id === editingQuestion.id
        ? {
            ...q,
            questionText: formData.questionText,
            options: formData.options,
            correctAnswer: formData.correctAnswer,
            level: formData.level,
            audioUrl: formData.audioFile ? URL.createObjectURL(formData.audioFile) : q.audioUrl,
          }
        : q
    );

    dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
    resetForm();
    setShowAddForm(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      const updatedQuestions = state.questions.filter(q => q.id !== questionId);
      dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      level: 'A1',
      audioFile: null,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setFormData({ ...formData, audioFile: file });
    } else {
      alert('Veuillez sélectionner un fichier audio valide');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Panel d'Administration TCF</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'listening', label: 'Compréhension Orale', count: state.questions.filter(q => q.section === 'listening').length },
                { key: 'grammar', label: 'Structures de la Langue', count: state.questions.filter(q => q.section === 'grammar').length },
                { key: 'reading', label: 'Compréhension Écrite', count: state.questions.filter(q => q.section === 'reading').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Questions - {activeTab === 'listening' ? 'Compréhension Orale' : activeTab === 'grammar' ? 'Structures de la Langue' : 'Compréhension Écrite'}
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une question</span>
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  {editingQuestion ? 'Modifier la question' : 'Ajouter une nouvelle question'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      value={formData.questionText}
                      onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Tapez votre question ici..."
                    />
                  </div>

                  {activeTab === 'listening' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fichier Audio
                      </label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {formData.options.map((option, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Option {String.fromCharCode(65 + index)}
                        </label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Réponse ${String.fromCharCode(65 + index)}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bonne réponse
                      </label>
                      <select
                        value={formData.correctAnswer}
                        onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {formData.options.map((_, index) => (
                          <option key={index} value={index}>
                            Option {String.fromCharCode(65 + index)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value as Question['level'] })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                      className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingQuestion ? 'Mettre à jour' : 'Sauvegarder'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingQuestion(null);
                        resetForm();
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {sectionQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune question trouvée pour cette section.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    Ajouter la première question
                  </button>
                </div>
              ) : (
                sectionQuestions.map((question, index) => (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {question.level}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-4">{question.questionText}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <strong>{String.fromCharCode(65 + optIndex)}:</strong> {option}
                            </div>
                          ))}
                        </div>
                        {question.audioUrl && (
                          <div className="mt-3">
                            <audio controls className="w-full max-w-xs">
                              <source src={question.audioUrl} type="audio/mpeg" />
                            </audio>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;