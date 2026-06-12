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
import type { AudioFeatures, Emotion } from '../types';
import { History, Settings } from 'lucide-react';

const EMOTION_META: Record<Emotion, { emoji: string; label: string; color: string }> = {
  happy:  { emoji: '😊', label: '행복',    color: '#FFD54F' },
  hungry: { emoji: '🍖', label: '배고픔',  color: '#FF8A65' },
  alert:  { emoji: '⚠️', label: '경계',    color: '#EF5350' },
  lonely: { emoji: '😢', label: '외로움',  color: '#90CAF9' },
  pain:   { emoji: '🤕', label: '통증',    color: '#CE93D8' },
  play:   { emoji: '🎾', label: '놀이',    color: '#A5D6A7' },
};

export const Translate: React.FC = () => {
  const navigate = useNavigate();
  const { profile, addHistory } = usePetStore();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
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
    setCurrentEmotion(null);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (features: AudioFeatures) => {
    setIsAnalyzing(false);
    if (!profile) return;

    const emotion = classifyEmotion(features, profile.animal);
    const text = getTranslation(profile.animal, emotion, profile.name);

    setCurrentEmotion(emotion);
    setTranslatedText(text);
    setShowBubble(true);

    // Speak TTS
    speak(text, profile.gender);

    // Play sound effect
    try {
      const soundFile = profile.animal === 'dog'
        ? (features.duration > 2 ? '/sounds/bark_long.mp3' : '/sounds/bark_short.mp3')
        : (features.duration > 2 ? '/sounds/meow_long.mp3' : '/sounds/meow_short.mp3');
      const audio = new Audio(soundFile);
      audio.volume = 0.4;
      audio.play().catch(() => { /* Ignore if sound file missing */ });
    } catch (_) { /* Ignore */ }

    // Save to history
    addHistory({
      id: Date.now().toString(),
      timestamp: Date.now(),
      emotion,
      translatedText: text,
      animal: profile.animal,
    });
  };

  if (!profile) return null;

  const emotionMeta = currentEmotion ? EMOTION_META[currentEmotion] : null;

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center relative overflow-hidden"
      style={{
        background: emotionMeta
          ? `linear-gradient(160deg, #FFF6EB 0%, ${emotionMeta.color}22 60%, ${emotionMeta.color}44 100%)`
          : 'linear-gradient(160deg, #FFF6EB 0%, #FFE8D6 60%, #FFD7C4 100%)',
        transition: 'background 1s ease',
      }}
    >
      {/* Background decorations */}
      <div
        className="absolute top-[-15%] right-[-15%] w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${emotionMeta?.color ?? '#FF8A80'} 0%, transparent 70%)`, transition: 'background 1s ease' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-15%] w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #81D4FA 0%, transparent 70%)' }}
      />

      {/* Top Bar */}
      <div className="w-full max-w-md px-4 pt-4 flex justify-between items-center z-10">
        <Link
          to="/setup"
          className="p-2.5 glass rounded-full hover:bg-white transition-all hover:scale-105"
          style={{ color: '#5D4037' }}
          id="settings-btn"
        >
          <Settings size={22} />
        </Link>

        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: '#3E2723' }}>
            {profile.name || (profile.animal === 'dog' ? '강아지' : '고양이')}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
            style={{ backgroundColor: profile.gender === 'male' ? '#64B5F6' : '#F48FB1' }}
          >
            {profile.gender === 'male' ? '수컷' : '암컷'}
          </span>
          {profile.age && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
              style={{ backgroundColor: '#A1887F' }}
            >
              {profile.age === 'baby' ? '새끼' : profile.age === 'adult' ? '성체' : '노령'}
            </span>
          )}
        </div>

        <Link
          to="/history"
          className="p-2.5 glass rounded-full hover:bg-white transition-all hover:scale-105"
          style={{ color: '#5D4037' }}
          id="history-btn"
        >
          <History size={22} />
        </Link>
      </div>

      <div className="flex-1 w-full max-w-md flex flex-col items-center px-5 pt-6 pb-10 z-10">

        {/* Pet Avatar Area */}
        <div className="relative flex flex-col items-center mb-6">
          {/* Emotion badge */}
          {emotionMeta && (
            <div
              className="absolute -top-3 -right-3 flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-lg z-20"
              style={{ backgroundColor: emotionMeta.color, animation: 'pop 0.35s cubic-bezier(0.175,0.885,0.32,1.275)' }}
            >
              {emotionMeta.emoji} {emotionMeta.label}
            </div>
          )}
          <div className="relative">
            {/* Glow ring when recording */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full opacity-50" style={{ background: '#FF8A80', animation: 'pulse-ring 1.5s ease-out infinite', transform: 'scale(1.1)' }} />
                <div className="absolute inset-0 rounded-full opacity-30" style={{ background: '#FF8A80', animation: 'pulse-ring 1.5s ease-out infinite 0.5s', transform: 'scale(1.1)' }} />
              </>
            )}
            <PetAvatar
              animal={profile.animal}
              photoBase64={profile.photoBase64}
              size="lg"
            />
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="w-full min-h-28 flex items-center justify-center mb-4">
          {isAnalyzing ? (
            <div className="glass rounded-2xl px-6 py-4 flex items-center gap-3 w-full" style={{ animation: 'fade-in 0.3s ease-out' }}>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: '#FF8A80', animation: `bounce-slow 0.8s ease-in-out ${i * 0.15}s infinite` }}
                  />
                ))}
              </div>
              <span className="font-medium" style={{ color: '#5D4037' }}>번역 중...</span>
            </div>
          ) : (
            <SpeechBubble text={translatedText} isVisible={showBubble} />
          )}
        </div>

        {/* Waveform + Mic */}
        <div className="w-full mt-auto">
          <WaveformVisualizer stream={stream} isRecording={isRecording} />
          <MicRecorder
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>

        {/* Usage hint */}
        {!showBubble && !isRecording && !isAnalyzing && (
          <p
            className="text-center text-sm font-medium mt-5"
            style={{ color: '#BCAAA4', animation: 'fade-in 0.5s ease-out 0.5s both' }}
          >
            🎤 버튼을 누르고 반려동물 소리를 들려주세요!
          </p>
        )}
      </div>
    </div>
  );
};
