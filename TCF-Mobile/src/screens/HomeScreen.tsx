import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useTest();
  const { state: authState, logout } = useAuth();
  const [selectedExam, setSelectedExam] = useState<number>(1);
  const [showStartModal, setShowStartModal] = useState(false);

  // Redirect admins to admin panel
  useEffect(() => {
    if (authState.currentUser?.role === 'admin') {
      navigation.navigate('Admin' as never);
    }
  }, [authState.currentUser, navigation]);

  const handleStartTest = () => {
    setShowStartModal(true);
  };

  const confirmStartTest = () => {
    const examId = selectedExam;
    dispatch({ type: 'SELECT_EXAM_SET', payload: examId });
    dispatch({ type: 'START_TEST', payload: examId });
    setShowStartModal(false);
    navigation.navigate('Test' as never);
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

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: logout, style: 'destructive' },
      ]
    );
  };

  if (authState.currentUser?.role === 'admin') {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>
              Bonjour, {authState.currentUser?.username}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Préparez-vous au TCF</Text>
        <Text style={styles.welcomeSubtitle}>
          Entraînez-vous avec notre simulateur officiel du Test de Connaissance du Français. 
          Évaluez votre niveau selon le Cadre Européen Commun de Référence.
        </Text>
      </View>

      {/* Test Info Cards */}
      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="headset" size={20} color="#2563eb" />
            </View>
            <Text style={styles.cardTitle}>Compréhension Orale</Text>
          </View>
          <Text style={styles.cardSubtitle}>25 questions • 25 minutes</Text>
          <Text style={styles.cardDescription}>
            Écoutez les enregistrements audio et répondez aux questions. 
            Chaque audio ne peut être écouté qu'une seule fois.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="create" size={20} color="#16a34a" />
            </View>
            <Text style={styles.cardTitle}>Structures de la Langue</Text>
          </View>
          <Text style={styles.cardSubtitle}>20 questions • 20 minutes</Text>
          <Text style={styles.cardDescription}>
            Testez votre maîtrise de la grammaire française : conjugaisons, accords, pronoms et structures.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="document-text" size={20} color="#9333ea" />
            </View>
            <Text style={styles.cardTitle}>Compréhension Écrite</Text>
          </View>
          <Text style={styles.cardSubtitle}>25 questions • 45 minutes</Text>
          <Text style={styles.cardDescription}>
            Lisez différents types de textes et démontrez votre compréhension écrite du français.
          </Text>
        </View>
      </View>

      {/* Test Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Détails de l'Examen</Text>
        
        <View style={styles.detailsContent}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={20} color="#2563eb" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Durée Totale</Text>
              <Text style={styles.detailValue}>90 minutes avec minuteur automatique</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="trophy" size={20} color="#16a34a" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Système de Notation</Text>
              <View style={styles.levelsList}>
                <Text style={styles.levelItem}>A1 - Découverte: 100-199 points</Text>
                <Text style={styles.levelItem}>A2 - Survie: 200-299 points</Text>
                <Text style={styles.levelItem}>B1 - Seuil: 300-399 points</Text>
                <Text style={styles.levelItem}>B2 - Avancé: 400-499 points</Text>
                <Text style={styles.levelItem}>C1 - Autonome: 500-599 points</Text>
                <Text style={styles.levelItem}>C2 - Maîtrise: 600-699 points</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Exam Selection */}
      <View style={styles.examSelection}>
        <Text style={styles.examSelectionTitle}>Choisir un Examen</Text>
        
        {state.examSets.map((examSet, index) => {
          const questionCounts = getExamQuestionCount(examSet.id);
          const isLocked = !examSet.isActive;
          const isSelected = selectedExam === examSet.id;
          
          return (
            <TouchableOpacity
              key={examSet.id}
              style={[
                styles.examCard,
                isSelected && !isLocked && styles.examCardSelected,
                isLocked && styles.examCardLocked,
              ]}
              onPress={() => !isLocked && setSelectedExam(examSet.id)}
              disabled={isLocked}
            >
              <View style={styles.examCardContent}>
                <View style={styles.examCardHeader}>
                  <View style={styles.radioButton}>
                    <View style={[
                      styles.radioButtonInner,
                      isSelected && !isLocked && styles.radioButtonSelected
                    ]} />
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={[
                      styles.examTitle,
                      isLocked && styles.examTitleLocked
                    ]}>
                      {index === 0 ? 'TCF - Examen Principal' : examSet.name}
                    </Text>
                    <Text style={[
                      styles.examQuestionCount,
                      isLocked && styles.examQuestionCountLocked
                    ]}>
                      {questionCounts.total} questions
                    </Text>
                    {isLocked && (
                      <View style={styles.lockedBadge}>
                        <Ionicons name="lock-closed" size={12} color="#f59e0b" />
                        <Text style={styles.lockedText}>Verrouillé</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={[
                  styles.examDescription,
                  isLocked && styles.examDescriptionLocked
                ]}>
                  {index === 0 
                    ? 'Examen principal du Test de Connaissance du Français avec questions de tous niveaux'
                    : examSet.description
                  }
                </Text>
                {isLocked && (
                  <Text style={styles.lockedMessage}>
                    Terminez l'examen précédent pour débloquer celui-ci
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity
          style={[
            styles.startButton,
            !state.examSets.find(e => e.id === selectedExam)?.isActive && styles.startButtonDisabled
          ]}
          onPress={handleStartTest}
          disabled={!state.examSets.find(e => e.id === selectedExam)?.isActive}
        >
          <Text style={styles.startButtonText}>Commencer l'Examen</Text>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Start Test Modal */}
      <Modal
        visible={showStartModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelStartTest}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="alert-circle" size={48} color="#2563eb" />
            </View>
            
            <Text style={styles.modalTitle}>ATTENTION !</Text>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                Vous êtes sur le point de lancer le simulateur TCF. Vous avez 90 
                minutes pour réaliser le test, vous ne pourrez pas faire de pause.
              </Text>
              <Text style={styles.modalText}>
                Utilisez des écouteurs ou un casque audio pour une meilleure 
                expérience.
              </Text>
              <Text style={styles.modalQuestion}>
                Êtes-vous prêt ?
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalStartButton}
                onPress={confirmStartTest}
              >
                <Text style={styles.modalStartButtonText}>Commencer le test</Text>
                <Ionicons name="chevron-forward" size={16} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={cancelStartTest}
              >
                <Text style={styles.modalCancelButtonText}>Revenir à l'accueil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  logoutButton: {
    padding: 8,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCards: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContent: {
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailText: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  levelsList: {
    marginTop: 8,
  },
  levelItem: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  examSelection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  examSelectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  examCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  examCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  examCardLocked: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  examCardContent: {
    flex: 1,
  },
  examCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: '#2563eb',
  },
  examInfo: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  examTitleLocked: {
    color: '#9ca3af',
  },
  examQuestionCount: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 4,
  },
  examQuestionCountLocked: {
    color: '#9ca3af',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  lockedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#f59e0b',
    marginLeft: 4,
  },
  examDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  examDescriptionLocked: {
    color: '#9ca3af',
  },
  lockedMessage: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  startButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
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
  startButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#dbeafe',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  modalBody: {
    marginBottom: 24,
  },
  modalText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 8,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalStartButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  modalCancelButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalCancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;