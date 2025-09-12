import React, { useState, useRef } from 'react';
import { useTest } from '../contexts/TestContext';
import { Question } from '../contexts/TestContext';
import { Volume2, VolumeX } from 'lucide-react';

interface QuestionComponentProps {
  question: Question;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({ question }) => {
  const { state, dispatch } = useTest();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAnswerSelect = (answerIndex: number) => {
    dispatch({
      type: 'SET_ANSWER',
      payload: { questionId: question.id, answer: answerIndex },
    });
  };

  const handleAudioPlay = () => {
    if (audioRef.current && !state.audioPlayed[question.id]) {
      setIsPlaying(true);
      audioRef.current.play();
      dispatch({ type: 'MARK_AUDIO_PLAYED', payload: question.id });
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const selectedAnswer = state.answers[question.id];
  const isAudioPlayed = state.audioPlayed[question.id];

  return (
    <div className="space-y-6">
      {/* Audio Player for Listening Section */}
      {question.section === 'listening' && question.audioUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">Enregistrement Audio</h4>
                <p className="text-sm text-blue-700">
                  {isAudioPlayed 
                    ? "Audio déjà écouté - vous ne pouvez plus le réécouter" 
                    : "Cliquez sur 'Jouer' pour écouter l'enregistrement (une seule fois)"}
                </p>
              </div>
            </div>
            {!isAudioPlayed ? (
              <button
                onClick={handleAudioPlay}
                disabled={isPlaying}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPlaying
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlaying ? 'En cours...' : 'Jouer Audio'}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <VolumeX className="w-4 h-4" />
                <span className="text-sm">Audio terminé</span>
              </div>
            )}
          </div>
          <audio
            ref={audioRef}
            onEnded={handleAudioEnd}
            className="hidden"
          >
            <source src={question.audioUrl} type="audio/mpeg" />
            Votre navigateur ne supporte pas l'élément audio.
          </audio>
        </div>
      )}

      {/* Question Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        {/* Question Image */}
        {question.imageUrl && (
          <div className="mb-4">
            <img 
              src={question.imageUrl} 
              alt="Question illustration" 
              className="max-w-full h-auto max-h-64 object-contain mx-auto border border-gray-200 rounded"
            />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.questionText}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all hover:shadow-md ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-gray-900">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Answer Status */}
      {selectedAnswer !== undefined && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-700">
              Réponse sélectionnée: <strong>{String.fromCharCode(65 + selectedAnswer)}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionComponent;