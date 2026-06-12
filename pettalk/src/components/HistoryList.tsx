import React from 'react';
import { usePetStore } from '../store/usePetStore';
import { Clock, Trash2 } from 'lucide-react';

export const HistoryList: React.FC = () => {
  const { history, clearHistory } = usePetStore();

  if (history.length === 0) {
    return (
      <div className="text-center text-text-light/70 py-10 glass rounded-2xl">
        <p>아직 번역 기록이 없어요.</p>
        <p className="text-sm mt-2">반려동물과 대화를 시작해보세요!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-lg font-bold text-text flex items-center gap-2">
          <Clock size={20} className="text-accent" /> 최근 대화
        </h3>
        <button 
          onClick={clearHistory}
          className="text-sm text-text-light hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={16} /> 전체 삭제
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {history.map((item) => (
          <div key={item.id} className="glass p-4 rounded-xl flex flex-col gap-2 animate-fade-in hover:scale-[1.01] transition-transform cursor-default">
            <div className="flex justify-between items-center text-xs text-text-light">
              <span className={`px-2 py-1 rounded-full font-bold text-white ${item.animal === 'dog' ? 'bg-accent/80' : 'bg-accent-blue/80'}`}>
                {item.emotion.toUpperCase()}
              </span>
              <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <p className="font-semibold text-text text-base mt-1">"{item.translatedText}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};
