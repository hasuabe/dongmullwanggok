import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { analyzeAudio } from '../lib/audioAnalyzer';
import type { AudioFeatures } from '../types';

interface Props {
  onRecordingStart: (stream: MediaStream) => void;
  onRecordingStop: () => void;
  onAnalysisComplete: (features: AudioFeatures) => void;
}

export const MicRecorder: React.FC<Props> = ({ onRecordingStart, onRecordingStop, onAnalysisComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          const features = await analyzeAudio(blob);
          onAnalysisComplete(features);
        } catch (error) {
          console.error('Failed to analyze audio:', error);
          // Fallback — use random features for fun
          onAnalysisComplete({
            volumeRMS: Math.random() * 0.8 + 0.1,
            dominantFreq: Math.random() * 2000 + 200,
            duration: 3,
            zeroCrossingRate: Math.random() * 0.5,
          });
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      onRecordingStart(stream);

      // Countdown timer — auto-stop at 5s
      let remaining = 5;
      setCountdown(remaining);
      countRef.current = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          if (countRef.current) clearInterval(countRef.current);
        }
      }, 1000);

      timerRef.current = setTimeout(() => {
        stopRecording();
      }, 5000);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);
    setCountdown(null);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 gap-3">
      {/* Countdown */}
      {isRecording && countdown !== null && (
        <div
          className="text-5xl font-black tabular-nums"
          style={{ color: countdown <= 2 ? '#EF5350' : '#FF8A80', animation: 'pop 0.3s ease-out' }}
        >
          {countdown}
        </div>
      )}

      {/* Mic Button */}
      <button
        id="mic-btn"
        onClick={isRecording ? stopRecording : startRecording}
        className="relative flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: '5.5rem',
          height: '5.5rem',
          background: isRecording
            ? 'linear-gradient(135deg, #EF5350, #E53935)'
            : 'linear-gradient(135deg, #FF8A80, #FF6B6B)',
          boxShadow: isRecording
            ? '0 0 0 6px rgba(239,83,80,0.2), 0 10px 30px rgba(239,83,80,0.4)'
            : '0 10px 30px rgba(255,138,128,0.5)',
          transform: isRecording ? 'scale(1.05)' : 'scale(1)',
        }}
        aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
      >
        {/* Pulsing ring when recording */}
        {isRecording && (
          <>
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(239,83,80,0.4)', animation: 'pulse-ring 1.2s ease-out infinite' }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(239,83,80,0.25)', animation: 'pulse-ring 1.2s ease-out 0.4s infinite' }}
            />
          </>
        )}
        {isRecording ? (
          <Square size={32} className="text-white z-10 relative" fill="white" />
        ) : (
          <Mic size={40} className="text-white z-10 relative" />
        )}
      </button>

      <p className="font-semibold text-base" style={{ color: '#8D6E63' }}>
        {isRecording ? '듣고 있어요! (누르면 중지)' : '버튼을 눌러 대화하기'}
      </p>
    </div>
  );
};
