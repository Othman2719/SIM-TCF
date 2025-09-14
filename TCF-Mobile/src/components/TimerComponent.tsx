import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTest } from '../contexts/TestContext';

const TimerComponent: React.FC = () => {
  const { state } = useTest();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (state.timeRemaining <= 300) return '#dc2626'; // 5 minutes - red
    if (state.timeRemaining <= 600) return '#f59e0b'; // 10 minutes - yellow
    return '#6b7280'; // normal - gray
  };

  return (
    <Text style={[styles.timer, { color: getTimerColor() }]}>
      {formatTime(state.timeRemaining)}
    </Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
    marginLeft: 4,
  },
});

export default TimerComponent;