import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTest } from '../contexts/TestContext';

const ProgressBar: React.FC = () => {
  const { state } = useTest();

  const getSectionProgress = () => {
    const sectionQuestions = state.questions.filter(q => q.section === state.currentSection);
    if (sectionQuestions.length === 0) return 0;
    
    return ((state.currentQuestionIndex + 1) / sectionQuestions.length) * 100;
  };

  const getOverallProgress = () => {
    const totalQuestions = state.questions.length;
    if (totalQuestions === 0) return 0;

    const listeningQuestions = state.questions.filter(q => q.section === 'listening').length;
    const grammarQuestions = state.questions.filter(q => q.section === 'grammar').length;
    
    let completedQuestions = 0;

    switch (state.currentSection) {
      case 'listening':
        completedQuestions = state.currentQuestionIndex;
        break;
      case 'grammar':
        completedQuestions = listeningQuestions + state.currentQuestionIndex;
        break;
      case 'reading':
        completedQuestions = listeningQuestions + grammarQuestions + state.currentQuestionIndex;
        break;
    }

    return (completedQuestions / totalQuestions) * 100;
  };

  const getAnsweredInSection = () => {
    const sectionQuestions = state.questions.filter(q => q.section === state.currentSection);
    return sectionQuestions.filter(q => state.answers[q.id] !== undefined).length;
  };

  const sectionProgress = getSectionProgress();
  const overallProgress = getOverallProgress();
  const sectionQuestions = state.questions.filter(q => q.section === state.currentSection);
  const answeredCount = getAnsweredInSection();

  return (
    <View style={styles.container}>
      {/* Section Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progression de la section</Text>
          <Text style={styles.progressPercentage}>{Math.round(sectionProgress)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${sectionProgress}%` }]} />
        </View>
        <View style={styles.progressFooter}>
          <Text style={styles.progressFooterText}>
            Question {state.currentQuestionIndex + 1} sur {sectionQuestions.length}
          </Text>
          <Text style={styles.progressFooterText}>
            {answeredCount} répondues
          </Text>
        </View>
      </View>

      {/* Overall Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progression totale</Text>
          <Text style={styles.progressPercentage}>{Math.round(overallProgress)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarOverall, { width: `${overallProgress}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  progressSection: {
    gap: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressBarOverall: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressFooterText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProgressBar;