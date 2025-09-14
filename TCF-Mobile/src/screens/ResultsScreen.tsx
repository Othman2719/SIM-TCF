import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ResultsScreen: React.FC = () => {
  const { state, dispatch } = useTest();
  const { state: authState } = useAuth();
  const navigation = useNavigation();

  const handleReturnHome = () => {
    dispatch({ type: 'RESET_TEST' });
    navigation.navigate('Home' as never);
  };

  const handleRetakeTest = () => {
    dispatch({ type: 'RESET_TEST' });
    navigation.navigate('Test' as never);
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

  const handleDownloadCertificate = () => {
    Alert.alert(
      'Certificat',
      'Fonctionnalité de téléchargement de certificat en cours de développement pour mobile.',
      [{ text: 'OK' }]
    );
  };

  const correctAnswers = getCorrectAnswers();
  const incorrectAnswers = getIncorrectAnswers();
  const unanswered = getUnansweredQuestions();
  const currentExamQuestions = state.questions.filter(q => q.examSet === state.currentExamSet);
  const totalQuestions = currentExamQuestions.length;
  const globalPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Results Card */}
      <View style={styles.resultsCard}>
        <View style={styles.medalContainer}>
          <View style={styles.medalIcon}>
            <Ionicons name="trophy" size={32} color="#2563eb" />
          </View>
          <Text style={styles.levelTitle}>Votre Niveau Global: {state.level}</Text>
          <Text style={styles.scoreText}>{state.score} points sur 699</Text>
          <Text style={styles.levelDescription}>{getLevelDescription(state.level)}</Text>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
            <Text style={[styles.statNumber, { color: '#16a34a' }]}>{correctAnswers}</Text>
            <Text style={[styles.statLabel, { color: '#16a34a' }]}>Bonnes réponses</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
            <Ionicons name="close-circle" size={24} color="#dc2626" />
            <Text style={[styles.statNumber, { color: '#dc2626' }]}>{incorrectAnswers}</Text>
            <Text style={[styles.statLabel, { color: '#dc2626' }]}>Mauvaises réponses</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b' }]} />
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{unanswered}</Text>
            <Text style={[styles.statLabel, { color: '#f59e0b' }]}>Non répondues</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#2563eb' }]} />
            <Text style={[styles.statNumber, { color: '#2563eb' }]}>{globalPercentage}%</Text>
            <Text style={[styles.statLabel, { color: '#2563eb' }]}>Score global</Text>
          </View>
        </View>
      </View>

      {/* Certificate Card */}
      <View style={styles.certificateCard}>
        <View style={styles.certificateHeader}>
          <View style={styles.certificateIcon}>
            <Ionicons name="trophy" size={24} color="#16a34a" />
          </View>
          <View style={styles.certificateInfo}>
            <Text style={styles.certificateTitle}>Certificat Brixel Academy</Text>
            <Text style={styles.certificateSubtitle}>
              Téléchargez votre certificat de niveau TCF
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadCertificate}
        >
          <Ionicons name="download" size={16} color="#ffffff" />
          <Text style={styles.downloadButtonText}>Télécharger</Text>
        </TouchableOpacity>
      </View>

      {/* Question Review */}
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>Révision des Questions</Text>
        <Text style={styles.reviewSubtitle}>
          Consultez vos réponses pour chaque question de l'examen
        </Text>

        {/* Section Tabs */}
        <View style={styles.sectionTabs}>
          {[
            { key: 'listening', label: 'Compréhension Orale', icon: 'headset' },
            { key: 'grammar', label: 'Structures', icon: 'create' },
            { key: 'reading', label: 'Compréhension Écrite', icon: 'document-text' },
          ].map((tab) => {
            const sectionQuestions = currentExamQuestions.filter(q => q.section === tab.key);
            const sectionCorrect = sectionQuestions.filter(q => state.answers[q.id] === q.correctAnswer).length;
            
            return (
              <View key={tab.key} style={styles.sectionTab}>
                <Ionicons name={tab.icon as any} size={16} color="#2563eb" />
                <Text style={styles.sectionTabLabel}>{tab.label}</Text>
                <View style={styles.sectionTabBadge}>
                  <Text style={styles.sectionTabBadgeText}>
                    {sectionCorrect}/{sectionQuestions.length}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Questions by Section */}
        {['listening', 'grammar', 'reading'].map((section) => {
          const sectionQuestions = currentExamQuestions.filter(q => q.section === section);
          const sectionName = section === 'listening' ? 'Compréhension Orale' : 
                            section === 'grammar' ? 'Structures de la Langue' : 
                            'Compréhension Écrite';
          
          return (
            <View key={section} style={styles.sectionReview}>
              <View style={styles.sectionReviewHeader}>
                <Ionicons 
                  name={section === 'listening' ? 'headset' : section === 'grammar' ? 'create' : 'document-text'} 
                  size={20} 
                  color="#2563eb" 
                />
                <Text style={styles.sectionReviewTitle}>{sectionName}</Text>
              </View>
              
              {sectionQuestions.map((question, index) => {
                const userAnswer = state.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const isAnswered = userAnswer !== undefined;
                
                return (
                  <View key={question.id} style={[
                    styles.questionReview,
                    !isAnswered ? styles.questionReviewUnanswered :
                    isCorrect ? styles.questionReviewCorrect : styles.questionReviewIncorrect
                  ]}>
                    <View style={styles.questionReviewHeader}>
                      <Text style={styles.questionReviewNumber}>Question {index + 1}</Text>
                      <View style={[
                        styles.questionReviewBadge,
                        !isAnswered ? styles.badgeUnanswered :
                        isCorrect ? styles.badgeCorrect : styles.badgeIncorrect
                      ]}>
                        <Text style={[
                          styles.questionReviewBadgeText,
                          !isAnswered ? styles.badgeTextUnanswered :
                          isCorrect ? styles.badgeTextCorrect : styles.badgeTextIncorrect
                        ]}>
                          {!isAnswered ? 'Non répondu' : isCorrect ? 'Correct' : 'Incorrect'}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.questionReviewText}>{question.questionText}</Text>
                    
                    <View style={styles.optionsReview}>
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = userAnswer === optIndex;
                        const isCorrectAnswer = question.correctAnswer === optIndex;
                        
                        return (
                          <View
                            key={optIndex}
                            style={[
                              styles.optionReview,
                              isCorrectAnswer ? styles.optionCorrect :
                              isUserAnswer && !isCorrectAnswer ? styles.optionIncorrect :
                              styles.optionDefault
                            ]}
                          >
                            <Text style={styles.optionLetter}>
                              {String.fromCharCode(65 + optIndex)}.
                            </Text>
                            <Text style={styles.optionText}>{option}</Text>
                            <View style={styles.optionIcons}>
                              {isCorrectAnswer && (
                                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <Ionicons name="close-circle" size={16} color="#dc2626" />
                              )}
                              {isUserAnswer && (
                                <Text style={styles.userAnswerLabel}>Votre réponse</Text>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={handleRetakeTest}
        >
          <Text style={styles.retakeButtonText}>Refaire le Test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleReturnHome}
        >
          <Text style={styles.homeButtonText}>Retour à l'Accueil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  resultsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medalContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  medalIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#dbeafe',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  certificateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  certificateIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  certificateSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  downloadButton: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    padding: 20,
    paddingBottom: 8,
  },
  reviewSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTabs: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  sectionTabBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionTabBadgeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionReview: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionReviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  questionReview: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  questionReviewCorrect: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  questionReviewIncorrect: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  questionReviewUnanswered: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  questionReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionReviewNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  questionReviewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCorrect: {
    backgroundColor: '#dcfce7',
  },
  badgeIncorrect: {
    backgroundColor: '#fee2e2',
  },
  badgeUnanswered: {
    backgroundColor: '#fef3c7',
  },
  questionReviewBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeTextCorrect: {
    color: '#16a34a',
  },
  badgeTextIncorrect: {
    color: '#dc2626',
  },
  badgeTextUnanswered: {
    color: '#f59e0b',
  },
  questionReviewText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
  },
  optionsReview: {
    gap: 8,
  },
  optionReview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  optionCorrect: {
    borderColor: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  optionIncorrect: {
    borderColor: '#dc2626',
    backgroundColor: '#fee2e2',
  },
  optionDefault: {
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  optionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userAnswerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
  },
  actionButtons: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  retakeButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultsScreen;