import React from 'react';
import { Link } from 'react-router-dom';
import { HistoryList } from '../components/HistoryList';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  return (
    <div
      className="min-h-[100dvh] p-5 pb-10"
      style={{ background: 'linear-gradient(160deg, #FFF6EB 0%, #FFE8D6 60%, #FFD7C4 100%)' }}
    >
      {/* Background decoration */}
      <div
        className="fixed top-[-10%] right-[-10%] w-64 h-64 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF8A80 0%, transparent 70%)' }}
      />
      <div
        className="fixed bottom-[-5%] left-[-5%] w-56 h-56 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #81D4FA 0%, transparent 70%)' }}
      />

      <div className="max-w-md mx-auto relative z-10">
        <Link
          to="/translate"
          className="inline-flex items-center gap-2 font-semibold mb-6 px-4 py-2 rounded-full glass hover:bg-white transition-colors"
          style={{ color: '#5D4037', textDecoration: 'none' }}
          id="back-to-translate"
        >
          <ArrowLeft size={18} />
          번역기로
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #FF8A80, #FF6B6B)' }}
          >
            <MessageCircle size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#3E2723' }}>대화 기록</h1>
            <p className="text-xs font-medium" style={{ color: '#8D6E63' }}>최근 번역 내역</p>
          </div>
        </div>

        <HistoryList />
      </div>
    </div>
  );
};
