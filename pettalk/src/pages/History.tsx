import React from 'react';
import { Link } from 'react-router-dom';
import { HistoryList } from '../components/HistoryList';
import { ArrowLeft } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-primary-light p-6">
      <div className="max-w-md mx-auto">
        <Link to="/translate" className="inline-flex items-center gap-2 text-text-light hover:text-text font-medium mb-6 bg-white/50 px-4 py-2 rounded-full transition-colors">
          <ArrowLeft size={20} /> 돌아가기
        </Link>
        <h2 className="text-3xl font-bold text-text mb-8">대화 기록</h2>
        <HistoryList />
      </div>
    </div>
  );
};
