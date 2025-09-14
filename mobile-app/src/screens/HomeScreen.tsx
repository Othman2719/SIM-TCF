import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTest } from '../contexts/TestContext';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state: authState, logout } = useAuth();
  const { state: testState, dispatch } = useTest();
  const [selectedExam, setSelectedExam] = useState<number>(1);
  const [showStartModal, setShowStartModal] = useState(false);

  const handleStartTest = () => {
    setShowStartModal(true);
  };

  const confirmStartTest = () => {
    dispatch({ type: 'SELECT_EXAM_SET', payload: selectedExam });
    dispatch({ type: 'START_TEST', payload: selectedExam });
    setShowStartModal(false);
    navigation.navigate('Test');
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getExamQuestionCount = (examSetId: number) => {
    const examQuestions = testState.questions.filter(q => q.examSet === examSetId);
    return examQuestions.length;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {authState.currentUser?.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Bonjour,</Text>
              <Text style={styles.userName}>{authState.currentUser?.username}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Préparez-vous au TCF</Text>
          <Text style={styles.subtitle}>
            Entraînez-vous avec notre simulateur officiel du Test de Connaissance du Français
          </Text>
        </View>

        {/* Test Info Cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <View style={[styles.cardIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="headset" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.cardTitle}>Compréhension Orale</Text>
            <Text style={styles.cardSubtitle}>25 questions • 25 minutes</Text>
            <Text style={styles.cardDescription}>
              Écoutez les enregistrements audio et répondez aux questions
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.cardIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="create" size={24} color="#16a34a" />
            </View>
            <Text style={styles.cardTitle}>Structures de la Langue</Text>
            <Text style={styles.cardSubtitle}>20 questions • 20 minutes</Text>
            <Text style={styles.cardDescription}>
              Testez votre maîtrise de la grammaire française
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.cardIcon, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="document-text" size={24} color="#be185d" />
            </View>
            <Text style={styles.cardTitle}>Compréhension Écrite</Text>
            <Text style={styles.cardSubtitle}>25 questions • 45 minutes</Text>
            <Text style={styles.cardDescription}>
              Lisez différents types de textes et démontrez votre compréhension
            </Text>
          </View>
        </View>

        {/* Exam Selection */}
        <View style={styles.examSection}>
          <Text style={styles.sectionTitle}>Choisir un Examen</Text>
          {testState.examSets.map((examSet, index) => {
            const questionCount = getExamQuestionCount(examSet.id);
            const isSelected = selectedExam === examSet.id;
            const isLocked = !examSet.isActive;
            
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
                      {isSelected && !isLocked && <View style={styles.radioButtonSelected} />}
                    </View>
                    <View style={styles.examInfo}>
                      <Text style={[styles.examTitle, isLocked && styles.examTitleLocked]}>
                        {index === 0 ? 'TCF - Examen Principal' : examSet.name}
                      </Text>
                      <Text style={[styles.examQuestionCount, isLocked && styles.examQuestionCountLocked]}>
                        {questionCount} questions
                      </Text>
                    </View>
                    {isLocked && (
                      <Ionicons name="lock-closed" size={20} color="#f59e0b" />
                    )}
                  </View>
                  <Text style={[styles.examDescription, isLocked && styles.examDescriptionLocked]}>
                    {index === 0 
                      ? 'Examen principal du Test de Connaissance du Français'
                      : examSet.description
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            !testState.examSets.find(e => e.id === selectedExam)?.isActive && styles.startButtonDisabled
          ]}
          onPress={handleStartTest}
          disabled={!testState.examSets.find(e => e.id === selectedExam)?.isActive}
        >
          <Text style={styles.startButtonText}>Commencer l'Examen</Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>

      {/* Start Test Modal */}
      <Modal
        visible={showStartModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="alert-circle" size={48} color="#3b82f6" />
            </View>
            <Text style={styles.modalTitle}>ATTENTION !</Text>
            <Text style={styles.modalText}>
              Vous êtes sur le point de lancer le simulateur TCF. Vous avez 90 
              minutes pour réaliser le test, vous ne pourrez pas faire de pause.
            </Text>
            <Text style={styles.modalText}>
              Utilisez des écouteurs ou un casque audio pour une meilleure expérience.
            </Text>
            <Text style={styles.modalQuestion}>Êtes-vous prêt ?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={confirmStartTest}>
                <Text style={styles.modalButtonPrimaryText}>Commencer le test</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonSecondary} 
                onPress={() => setShowStartModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Revenir à l'accueil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCards: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  examSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  examCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  examCardSelected: {
    borderColor: '#3b82f6',
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
    alignItems: 'center',
    marginBottom: 8,
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
  },
  radioButtonSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  examInfo: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  examTitleLocked: {
    color: '#9ca3af',
  },
  examQuestionCount: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 2,
  },
  examQuestionCountLocked: {
    color: '#9ca3af',
  },
  examDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  examDescriptionLocked: {
    color: '#9ca3af',
  },
  startButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  startButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  startButtonText: {
    color: 'white',
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  modalQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
  },
  modalButtonPrimary: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonSecondary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalButtonSecondaryText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;