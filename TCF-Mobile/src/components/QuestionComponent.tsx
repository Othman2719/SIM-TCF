import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useTest } from '../contexts/TestContext';
import { Question } from '../contexts/TestContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

interface QuestionComponentProps {
  question: Question;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({ question }) => {
  const { state, dispatch } = useTest();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const handleAnswerSelect = (answerIndex: number) => {
    dispatch({
      type: 'SET_ANSWER',
      payload: { questionId: question.id, answer: answerIndex },
    });
  };

  const handleAudioPlay = async () => {
    if (state.audioPlayed[question.id]) {
      Alert.alert('Audio déjà écouté', 'Vous ne pouvez écouter l\'audio qu\'une seule fois.');
      return;
    }

    try {
      setIsPlaying(true);
      
      // For demo purposes, we'll simulate audio playback
      // In a real app, you would load the actual audio file
      setTimeout(() => {
        setIsPlaying(false);
        dispatch({ type: 'MARK_AUDIO_PLAYED', payload: question.id });
        Alert.alert('Audio terminé', 'L\'enregistrement audio est terminé.');
      }, 3000); // Simulate 3 seconds of audio
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      Alert.alert('Erreur', 'Impossible de lire l\'audio.');
    }
  };

  const selectedAnswer = state.answers[question.id];
  const isAudioPlayed = state.audioPlayed[question.id];

  return (
    <View style={styles.container}>
      {/* Audio Player for Listening Section */}
      {question.section === 'listening' && (
        <View style={styles.audioContainer}>
          <View style={styles.audioHeader}>
            <Ionicons name="headset" size={24} color="#2563eb" />
            <View style={styles.audioInfo}>
              <Text style={styles.audioTitle}>Enregistrement Audio</Text>
              <Text style={styles.audioSubtitle}>
                {isAudioPlayed 
                  ? "Audio déjà écouté - vous ne pouvez plus le réécouter" 
                  : "Appuyez sur 'Jouer' pour écouter l'enregistrement (une seule fois)"}
              </Text>
            </View>
          </View>
          
          {!isAudioPlayed ? (
            <TouchableOpacity
              style={[styles.playButton, isPlaying && styles.playButtonDisabled]}
              onPress={handleAudioPlay}
              disabled={isPlaying}
            >
              <Ionicons 
                name={isPlaying ? "hourglass" : "play"} 
                size={16} 
                color="#ffffff" 
              />
              <Text style={styles.playButtonText}>
                {isPlaying ? 'En cours...' : 'Jouer Audio'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.audioCompleted}>
              <Ionicons name="volume-mute" size={16} color="#6b7280" />
              <Text style={styles.audioCompletedText}>Audio terminé</Text>
            </View>
          )}
        </View>
      )}

      {/* Question Text */}
      <View style={styles.questionContainer}>
        {/* Question Image */}
        {question.imageUrl && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: question.imageUrl }} 
              style={styles.questionImage}
              resizeMode="contain"
            />
          </View>
        )}
        <Text style={styles.questionText}>{question.questionText}</Text>
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.optionButtonSelected
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.radioButton,
                selectedAnswer === index && styles.radioButtonSelected
              ]}>
                {selectedAnswer === index && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}.
                </Text>
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Answer Status */}
      {selectedAnswer !== undefined && (
        <View style={styles.answerStatus}>
          <View style={styles.answerStatusIcon} />
          <Text style={styles.answerStatusText}>
            Réponse sélectionnée: <Text style={styles.answerStatusLetter}>
              {String.fromCharCode(65 + selectedAnswer)}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  audioContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 20,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  audioInfo: {
    marginLeft: 12,
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  audioSubtitle: {
    fontSize: 14,
    color: '#3730a3',
    lineHeight: 20,
  },
  playButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  playButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  audioCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  audioCompletedText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  questionContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
  },
  imageContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  optionButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  radioButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    flex: 1,
  },
  optionTextSelected: {
    color: '#1e40af',
  },
  answerStatus: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerStatusIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    marginRight: 8,
  },
  answerStatusText: {
    fontSize: 14,
    color: '#15803d',
  },
  answerStatusLetter: {
    fontWeight: '600',
  },
});

export default QuestionComponent;