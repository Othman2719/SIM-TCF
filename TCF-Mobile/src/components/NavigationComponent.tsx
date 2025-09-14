import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useTest } from '../contexts/TestContext';
import { Ionicons } from '@expo/vector-icons';

const NavigationComponent: React.FC = () => {
  const { state, dispatch } = useTest();

  const getCurrentSectionQuestions = () => {
    return state.questions.filter(q => q.section === state.currentSection);
  };

  const handleNext = () => {
    const sectionQuestions = getCurrentSectionQuestions();
    const isLastQuestionInSection = state.currentQuestionIndex >= sectionQuestions.length - 1;

    if (isLastQuestionInSection) {
      // Move to next section or finish test
      switch (state.currentSection) {
        case 'listening':
          dispatch({ type: 'SET_SECTION', payload: 'grammar' });
          break;
        case 'grammar':
          dispatch({ type: 'SET_SECTION', payload: 'reading' });
          break;
        case 'reading':
          dispatch({ type: 'COMPLETE_TEST' });
          break;
      }
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      dispatch({ type: 'PREV_QUESTION' });
    } else {
      // Move to previous section
      switch (state.currentSection) {
        case 'grammar':
          dispatch({ type: 'SET_SECTION', payload: 'listening' });
          // Set to last question of listening section
          const listeningQuestions = state.questions.filter(q => q.section === 'listening');
          setTimeout(() => {
            for (let i = 0; i < listeningQuestions.length - 1; i++) {
              dispatch({ type: 'NEXT_QUESTION' });
            }
          }, 0);
          break;
        case 'reading':
          dispatch({ type: 'SET_SECTION', payload: 'grammar' });
          // Set to last question of grammar section
          const grammarQuestions = state.questions.filter(q => q.section === 'grammar');
          setTimeout(() => {
            for (let i = 0; i < grammarQuestions.length - 1; i++) {
              dispatch({ type: 'NEXT_QUESTION' });
            }
          }, 0);
          break;
      }
    }
  };

  const handleFinishTest = () => {
    Alert.alert(
      'Terminer le test',
      'Êtes-vous sûr de vouloir terminer le test maintenant?',
      [
        { text: 'Continuer', style: 'cancel' },
        { 
          text: 'Terminer', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'COMPLETE_TEST' })
        },
      ]
    );
  };

  const sectionQuestions = getCurrentSectionQuestions();
  const isFirstQuestion = state.currentQuestionIndex === 0 && state.currentSection === 'listening';
  const isLastQuestion = state.currentSection === 'reading' && 
                         state.currentQuestionIndex >= sectionQuestions.length - 1;
  
  const currentQuestion = sectionQuestions[state.currentQuestionIndex];
  const isCurrentAnswered = currentQuestion && state.answers[currentQuestion.id] !== undefined;

  // Check if we can go back (not allowed if audio was played in listening section)
  const canGoBack = () => {
    if (state.currentSection === 'listening') {
      const currentQ = sectionQuestions[state.currentQuestionIndex];
      return !currentQ?.audioUrl || !state.audioPlayed[currentQ.id];
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.previousButton,
          (isFirstQuestion || !canGoBack()) && styles.buttonDisabled
        ]}
        onPress={handlePrevious}
        disabled={isFirstQuestion || !canGoBack()}
      >
        <Ionicons name="chevron-back" size={16} color={
          isFirstQuestion || !canGoBack() ? "#9ca3af" : "#374151"
        } />
        <Text style={[
          styles.buttonText,
          (isFirstQuestion || !canGoBack()) && styles.buttonTextDisabled
        ]}>
          Précédent
        </Text>
      </TouchableOpacity>

      <View style={styles.centerInfo}>
        <Text style={styles.questionInfo}>
          Question {state.currentQuestionIndex + 1} sur {sectionQuestions.length}
        </Text>
        
        {isCurrentAnswered && (
          <View style={styles.answeredBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text style={styles.answeredText}>Répondu</Text>
          </View>
        )}
      </View>

      {!isLastQuestion ? (
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Suivant</Text>
          <Ionicons name="chevron-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.finishButton]}
          onPress={handleFinishTest}
        >
          <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
          <Text style={styles.finishButtonText}>Terminer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
  },
  previousButton: {
    backgroundColor: '#f3f4f6',
  },
  nextButton: {
    backgroundColor: '#2563eb',
    justifyContent: 'center',
  },
  finishButton: {
    backgroundColor: '#16a34a',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#f9fafb',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 4,
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginRight: 4,
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 4,
  },
  centerInfo: {
    alignItems: 'center',
    gap: 4,
  },
  questionInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  answeredText: {
    fontSize: 12,
    color: '#16a34a',
    marginLeft: 4,
  },
});

export default NavigationComponent;