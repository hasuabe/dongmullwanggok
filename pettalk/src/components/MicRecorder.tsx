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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          const features = await analyzeAudio(blob);
          onAnalysisComplete(features);
        } catch (error) {
          console.error("Failed to analyze audio:", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      onRecordingStart(stream);

      // Auto stop after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 5000);

    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative flex items-center justify-center w-24 h-24 rounded-full shadow-2xl transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-accent hover:bg-accent-blue hover:scale-105'
        }`}
      >
        {isRecording ? (
          <Square size={36} className="text-white" fill="currentColor" />
        ) : (
          <Mic size={48} className="text-white" />
        )}
      </button>
      <p className="mt-4 text-text font-medium text-lg">
        {isRecording ? '듣고 있어요... (최대 5초)' : '버튼을 눌러 대화하기'}
      </p>
    </div>
  );
};
