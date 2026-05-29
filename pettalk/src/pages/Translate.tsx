import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import { PetAvatar } from '../components/PetAvatar';
import { MicRecorder } from '../components/MicRecorder';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { SpeechBubble } from '../components/SpeechBubble';
import { classifyEmotion } from '../lib/emotionClassifier';
import { getTranslation } from '../lib/translator';
import { speak } from '../lib/tts';
import type { AudioFeatures } from '../types';
import { History, Settings } from 'lucide-react';

export const Translate: React.FC = () => {
  const navigate = useNavigate();
  const { profile, addHistory } = usePetStore();
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (!profile) {
      navigate('/setup');
    }
  }, [profile, navigate]);

  const handleRecordingStart = (newStream: MediaStream) => {
    setStream(newStream);
    setIsRecording(true);
    setShowBubble(false);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
  };

  const handleAnalysisComplete = (features: AudioFeatures) => {
    if (!profile) return;

    const emotion = classifyEmotion(features, profile.animal);
    const text = getTranslation(profile.animal, emotion, profile.name);
    
    setTranslatedText(text);
    setShowBubble(true);

    // Speak and play sound
    speak(text, profile.gender);
    
    // Save to history
    addHistory({
      id: Date.now().toString(),
      timestamp: Date.now(),
      emotion,
      translatedText: text,
      animal: profile.animal
    });
  };

  if (!profile) return null;

  return (
    <div className="min-h-[100dvh] bg-primary-light flex flex-col items-center relative overflow-hidden">
      {/* Top Bar */}
      <div className="w-full p-4 flex justify-between items-center z-10">
        <Link to="/setup" className="p-2 bg-white/50 rounded-full hover:bg-white text-text-light transition-colors">
          <Settings size={24} />
        </Link>
        <Link to="/history" className="p-2 bg-white/50 rounded-full hover:bg-white text-text-light transition-colors">
          <History size={24} />
        </Link>
      </div>

      <div className="flex-1 w-full max-w-md flex flex-col items-center px-6 pt-4 pb-12 z-10">
        
        {/* Pet Display */}
        <div className="relative mt-8 mb-4 flex flex-col items-center">
          <PetAvatar 
            animal={profile.animal} 
            photoBase64={profile.photoBase64} 
            size="lg" 
          />
          <h2 className="text-2xl font-bold text-text mt-4">
            {profile.name || (profile.animal === 'dog' ? '강아지' : '고양이')}
          </h2>
          <span className="text-sm font-medium px-3 py-1 bg-white/60 rounded-full mt-2 text-text-light">
            {profile.gender === 'male' ? '수컷' : '암컷'}
          </span>
        </div>

        {/* Translation Result */}
        <div className="h-32 w-full">
          <SpeechBubble text={translatedText} isVisible={showBubble} />
        </div>

        <div className="mt-auto w-full">
          <WaveformVisualizer stream={stream} isRecording={isRecording} />
          <MicRecorder 
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-accent-blue/20 rounded-full blur-3xl"></div>
    </div>
  );
};
