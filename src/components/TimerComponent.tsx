import React from 'react';
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
    if (state.timeRemaining <= 300) return 'text-red-600'; // 5 minutes
    if (state.timeRemaining <= 600) return 'text-yellow-600'; // 10 minutes
    return 'text-gray-600';
  };

  return (
    <div className={`font-mono text-lg font-semibold ${getTimerColor()}`}>
      {formatTime(state.timeRemaining)}
    </div>
  );
};

export default TimerComponent;