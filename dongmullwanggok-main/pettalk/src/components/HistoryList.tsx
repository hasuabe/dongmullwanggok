import React from 'react';
import { usePetStore } from '../store/usePetStore';
import { Clock, Trash2, Dog, Cat } from 'lucide-react';
import type { Emotion } from '../types';

const EMOTION_META: Record<Emotion, { emoji: string; label: string; color: string }> = {
  happy:  { emoji: '😊', label: '행복',    color: '#FFD54F' },
  hungry: { emoji: '🍖', label: '배고픔',  color: '#FF8A65' },
  alert:  { emoji: '⚠️', label: '경계',    color: '#EF5350' },
  lonely: { emoji: '😢', label: '외로움',  color: '#90CAF9' },
  pain:   { emoji: '🤕', label: '통증',    color: '#CE93D8' },
  play:   { emoji: '🎾', label: '놀이',    color: '#A5D6A7' },
};

export const HistoryList: React.FC = () => {
  const { history, clearHistory } = usePetStore();

  if (history.length === 0) {
    return (
      <div className="glass rounded-3xl p-10 flex flex-col items-center gap-3 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
          style={{ background: 'rgba(255,138,128,0.15)' }}
        >
          <Clock size={32} style={{ color: '#BCAAA4' }} />
        </div>
        <p className="font-bold text-lg" style={{ color: '#8D6E63' }}>아직 대화 기록이 없어요</p>
        <p className="text-sm" style={{ color: '#BCAAA4' }}>반려동물과 대화를 시작해보세요! 🐾</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header controls */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-sm font-semibold" style={{ color: '#8D6E63' }}>
          {history.length}개의 대화
        </span>
        <button
          id="clear-history-btn"
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105"
          style={{ color: '#EF5350', background: 'rgba(239,83,80,0.1)' }}
        >
          <Trash2 size={14} />
          전체 삭제
        </button>
      </div>

      {/* History cards */}
      <div className="flex flex-col gap-3">
        {history.map((item, idx) => {
          const meta = EMOTION_META[item.emotion];
          return (
            <div
              key={item.id}
              className="glass rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform cursor-default"
              style={{ animation: `fade-in 0.4s ease-out ${idx * 0.05}s both` }}
            >
              {/* Colored emotion bar */}
              <div
                className="h-1 w-full"
                style={{ background: meta.color }}
              />
              <div className="p-4 flex flex-col gap-2.5">
                {/* Meta row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Animal icon */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: item.animal === 'dog' ? 'rgba(255,138,128,0.2)' : 'rgba(129,212,250,0.2)' }}
                    >
                      {item.animal === 'dog'
                        ? <Dog size={14} style={{ color: '#FF8A80' }} />
                        : <Cat size={14} style={{ color: '#81D4FA' }} />
                      }
                    </div>
                    {/* Emotion badge */}
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.emoji} {meta.label}
                    </span>
                  </div>
                  {/* Timestamp */}
                  <div className="flex items-center gap-1" style={{ color: '#BCAAA4' }}>
                    <Clock size={12} />
                    <span className="text-xs">
                      {new Date(item.timestamp).toLocaleString('ko-KR', {
                        month: 'numeric', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Translation text */}
                <p className="font-semibold text-base leading-snug" style={{ color: '#3E2723' }}>
                  "{item.translatedText}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
