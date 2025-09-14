import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTest } from '../contexts/TestContext';
import { Ionicons } from '@expo/vector-icons';
import QuestionComponent from '../components/QuestionComponent';
import TimerComponent from '../components/TimerComponent';
import ProgressBar from '../components/ProgressBar';
import NavigationComponent from '../components/NavigationComponent';

const TestScreen: React.FC = () => {
  const { state, dispatch } = useTest();
  const navigation = useNavigation();

  useEffect(() => {
    if (!state.testStarted) {
      navigation.navigate('Home' as never);
      return;
    }

    if (state.testCompleted) {
      dispatch({ type: 'CALCULATE_SCORE' });
      navigation.navigate('Results' as never);
      return;
    }

    // Only start timer if test is active and not completed
    if (state.testStarted && !state.testCompleted && state.timeRemaining > 0) {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.testStarted, state.testCompleted, dispatch, navigation]);

  const handleEmergencyStop = () => {
    Alert.alert(
      'ARRÊT D\'URGENCE',
      'Êtes-vous sûr de vouloir quitter le test maintenant ?\n\nToutes vos réponses seront perdues et ne seront pas sauvegardées.',
      [
        { text: 'Continuer le test', style: 'cancel' },
        { 
          text: 'Quitter', 
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESET_TEST' });
            navigation.navigate('Home' as never);
          }
        },
      ]
    );
  };

  const getSectionQuestions = () => {
    return state.questions.filter(q => 
      q.section === state.currentSection && q.examSet === state.currentExamSet
    );
  };

  const getSectionIcon = () => {
    switch (state.currentSection) {
      case 'listening':
        return 'headset';
      case 'grammar':
        return 'create';
      case 'reading':
        return 'document-text';
      default:
        return 'help';
    }
  };

  const getSectionTitle = () => {
    switch (state.currentSection) {
      case 'listening':
        return 'Compréhension Orale';
      case 'grammar':
        return 'Structures de la Langue';
      case 'reading':
        return 'Compréhension Écrite';
      default:
        return '';
    }
  };

  const getSectionTime = () => {
    switch (state.currentSection) {
      case 'listening':
        return '25 questions • 25 minutes';
      case 'grammar':
        return '20 questions • 20 minutes';
      case 'reading':
        return '25 questions • 45 minutes';
      default:
        return '';
    }
  };

  const sectionQuestions = getSectionQuestions();
  const currentQuestion = sectionQuestions[state.currentQuestionIndex];

  if (!currentQuestion) {
    // If no current question but test is started, try to navigate to results
    if (state.testStarted && !state.testCompleted) {
      dispatch({ type: 'COMPLETE_TEST' });
      return null;
    }
    
    // Show loading only if test hasn't started yet
    if (!state.testStarted) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Chargement du test...</Text>
        </View>
      );
    }
    
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.sectionInfo}>
            <Ionicons name={getSectionIcon() as any} size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleEmergencyStop}
              style={styles.emergencyButton}
            >
              <Ionicons name="warning" size={16} color="#ffffff" />
              <Text style={styles.emergencyButtonText}>Arrêt</Text>
            </TouchableOpacity>
            <View style={styles.timerContainer}>
              <Ionicons name="time" size={16} color="#6b7280" />
              <TimerComponent />
            </View>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>{getSectionTime()}</Text>
        <ProgressBar />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>
              Question {state.currentQuestionIndex + 1} sur {sectionQuestions.length}
            </Text>
          </View>
          <QuestionComponent question={currentQuestion} />
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <NavigationComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  navigation: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});

export default TestScreen;