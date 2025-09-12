import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';
import { ExamService } from '../services/examService';
import { Plus, Edit2, Trash2, Upload, Home, Save, FolderPlus, Folder } from 'lucide-react';
import { Question } from '../contexts/TestContext';
import { Database } from '../lib/supabase';

type ExamSet = Database['public']['Tables']['exam_sets']['Row'];

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useTest();
  const { logout, state: authState } = useAuth();
  const [activeTab, setActiveTab] = useState<'listening' | 'grammar' | 'reading'>('listening');
  const [selectedExamSet, setSelectedExamSet] = useState<number>(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingExam, setEditingExam] = useState<ExamSet | null>(null);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    audioFile: null as File | null,
    imageFile: null as File | null,
  });
  const [examFormData, setExamFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const sectionQuestions = state.questions.filter(q => 
    q.section === activeTab && q.examSet === selectedExamSet
  );

  const handleAddQuestion = () => {
    if (!formData.questionText || formData.options.some(opt => !opt.trim())) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const addQuestion = async () => {
      try {
        const questionData = {
          exam_set_id: selectedExamSet,
          section: activeTab as 'listening' | 'grammar' | 'reading',
          question_text: formData.questionText,
          options: formData.options,
          correct_answer: formData.correctAnswer,
          level: 'A1' as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
          audio_url: formData.audioFile ? URL.createObjectURL(formData.audioFile) : null,
          image_url: formData.imageFile ? URL.createObjectURL(formData.imageFile) : null,
        };

        const newQuestion = await ExamService.createQuestion(questionData);
        
        // Update local state
        const formattedQuestion: Question = {
          id: newQuestion.id,
          section: newQuestion.section,
          examSet: newQuestion.exam_set_id,
          questionText: newQuestion.question_text,
          options: newQuestion.options,
          correctAnswer: newQuestion.correct_answer,
          level: newQuestion.level,
          audioUrl: newQuestion.audio_url || undefined,
          imageUrl: newQuestion.image_url || undefined,
          explanation: newQuestion.explanation || undefined,
        };

        dispatch({ type: 'SET_QUESTIONS', payload: [...state.questions, formattedQuestion] });
        resetForm();
        setShowAddForm(false);
        alert('Question ajoutée avec succès !');
      } catch (error) {
        console.error('Error adding question:', error);
        alert('Erreur lors de l\'ajout de la question');
      }
    };

    addQuestion();
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      audioFile: null,
      imageFile: null,
    });
    setShowAddForm(true);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    const updateQuestion = async () => {
      try {
        const updates = {
          question_text: formData.questionText,
          options: formData.options,
          correct_answer: formData.correctAnswer,
          audio_url: formData.audioFile ? URL.createObjectURL(formData.audioFile) : undefined,
          image_url: formData.imageFile ? URL.createObjectURL(formData.imageFile) : undefined,
        };

        await ExamService.updateQuestion(editingQuestion.id, updates);
        
        // Update local state
        const updatedQuestions = state.questions.map(q =>
          q.id === editingQuestion.id
            ? {
                ...q,
                questionText: formData.questionText,
                options: formData.options,
                correctAnswer: formData.correctAnswer,
                audioUrl: formData.audioFile ? URL.createObjectURL(formData.audioFile) : q.audioUrl,
                imageUrl: formData.imageFile ? URL.createObjectURL(formData.imageFile) : q.imageUrl,
              }
            : q
        );

        dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
        resetForm();
        setShowAddForm(false);
        setEditingQuestion(null);
        alert('Question mise à jour avec succès !');
      } catch (error) {
        console.error('Error updating question:', error);
        alert('Erreur lors de la mise à jour de la question');
      }
    };

    updateQuestion();
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      const deleteQuestion = async () => {
        try {
          await ExamService.deleteQuestion(questionId);
          const updatedQuestions = state.questions.filter(q => q.id !== questionId);
          dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
          alert('Question supprimée avec succès !');
        } catch (error) {
          console.error('Error deleting question:', error);
          alert('Erreur lors de la suppression de la question');
        }
      };
      deleteQuestion();
    }
  };

  const handleAddExamSet = () => {
    if (!examFormData.name.trim()) {
      alert('Veuillez saisir un nom pour l\'examen');
      return;
    }

    const addExamSet = async () => {
      try {
        const examSetData = {
          name: examFormData.name,
          description: examFormData.description,
          is_active: examFormData.isActive,
        };

        const newExamSet = await ExamService.createExamSet(examSetData);
        dispatch({ type: 'SET_EXAM_SETS', payload: [...state.examSets, newExamSet] });
        resetExamForm();
        setShowExamForm(false);
        alert('Nouvel examen créé avec succès !');
      } catch (error) {
        console.error('Error creating exam set:', error);
        alert('Erreur lors de la création de l\'examen');
      }
    };

    addExamSet();
  };

  const handleUpdateExamSet = () => {
    if (!editingExam) return;

    const updateExamSet = async () => {
      try {
        const updates = {
          name: examFormData.name,
          description: examFormData.description,
          is_active: examFormData.isActive,
        };

        await ExamService.updateExamSet(editingExam.id, updates);
        
        const updatedExamSets = state.examSets.map(exam =>
          exam.id === editingExam.id
            ? { ...exam, name: examFormData.name, description: examFormData.description, is_active: examFormData.isActive }
            : exam
        );

        dispatch({ type: 'SET_EXAM_SETS', payload: updatedExamSets });
        resetExamForm();
        setShowExamForm(false);
        setEditingExam(null);
        alert('Examen mis à jour avec succès !');
      } catch (error) {
        console.error('Error updating exam set:', error);
        alert('Erreur lors de la mise à jour de l\'examen');
      }
    };

    updateExamSet();
  };

  const handleEditExamSet = (examSet: ExamSet) => {
    setEditingExam(examSet);
    setExamFormData({
      name: examSet.name,
      description: examSet.description,
      isActive: examSet.is_active,
    });
    setShowExamForm(true);
  };

  const handleDeleteExamSet = (examSetId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen et toutes ses questions ?')) {
      const deleteExamSet = async () => {
        try {
          await ExamService.deleteExamSet(examSetId);
          const updatedExamSets = state.examSets.filter(e => e.id !== examSetId);
          const updatedQuestions = state.questions.filter(q => q.examSet !== examSetId);
          dispatch({ type: 'SET_EXAM_SETS', payload: updatedExamSets });
          dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
          if (selectedExamSet === examSetId) {
            setSelectedExamSet(1);
          }
          alert('Examen supprimé avec succès !');
        } catch (error) {
          console.error('Error deleting exam set:', error);
          alert('Erreur lors de la suppression de l\'examen');
        }
      };
      deleteExamSet();
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      audioFile: null,
      imageFile: null,
    });
  };

  const resetExamForm = () => {
    setExamFormData({
      name: '',
      description: '',
      isActive: true,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, imageFile: file });
    } else {
      alert('Veuillez sélectionner un fichier image valide');
    }
  };

  const getExamQuestionCount = (examSetId: number) => {
    return {
      total: state.questions.filter(q => q.examSet === examSetId).length,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Panel d'Administration TCF</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/users')}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span>Gestion Utilisateurs</span>
              </button>
              {authState.currentUser?.role === 'super_admin' && (
                <div className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                  SUPER ADMIN
                </div>
              )}
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Exam Sets Management */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Examens</h2>
              <button
                onClick={() => setShowExamForm(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Nouvel Examen</span>
              </button>
            </div>
          </div>

          {/* Exam Form */}
          {showExamForm && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                {editingExam ? 'Modifier l\'examen' : 'Créer un nouvel examen'}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'examen
                  </label>
                  <input
                    type="text"
                    value={examFormData.name}
                    onChange={(e) => setExamFormData({ ...examFormData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Examen 4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={examFormData.description}
                    onChange={(e) => setExamFormData({ ...examFormData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Description de l'examen..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={examFormData.isActive}
                    onChange={(e) => setExamFormData({ ...examFormData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Examen actif (visible aux utilisateurs)
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={editingExam ? handleUpdateExamSet : handleAddExamSet}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingExam ? 'Mettre à jour' : 'Créer'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExamForm(false);
                      setEditingExam(null);
                      resetExamForm();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exam Sets List */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {state.examSets.map((examSet) => {
                const questionCount = getExamQuestionCount(examSet.id);
                return (
                  <div
                    key={examSet.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedExamSet === examSet.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedExamSet(examSet.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Folder className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{examSet.name}</h3>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditExamSet(examSet);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExamSet(examSet.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{examSet.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{questionCount.total} questions</span>
                      <span className={`px-2 py-1 rounded-full ${
                        examSet.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {examSet.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'listening', label: 'Compréhension Orale', count: state.questions.filter(q => q.section === 'listening' && q.examSet === selectedExamSet).length },
                { key: 'grammar', label: 'Structures de la Langue', count: state.questions.filter(q => q.section === 'grammar' && q.examSet === selectedExamSet).length },
                { key: 'reading', label: 'Compréhension Écrite', count: state.questions.filter(q => q.section === 'reading' && q.examSet === selectedExamSet).length },
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
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({state.examSets.find(e => e.id === selectedExamSet)?.name})
                </span>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image (optionnel)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.imageFile && (
                        <p className="text-sm text-green-600 mt-1">
                          Image sélectionnée: {formData.imageFile.name}
                        </p>
                      )}
                    </div>

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
                        {question.imageUrl && (
                          <div className="mt-3">
                            <img 
                              src={question.imageUrl} 
                              alt="Question image" 
                              className="max-w-xs max-h-48 object-contain border border-gray-200 rounded"
                            />
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