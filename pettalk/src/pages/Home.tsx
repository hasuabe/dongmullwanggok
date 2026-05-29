import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary-light via-[#FFF0E0] to-[#FFE0C2]">
      <div className="text-center animate-fade-in w-full max-w-md">
        <div className="flex justify-center gap-4 mb-8">
          <Heart size={56} className="text-accent animate-bounce-slow drop-shadow-md" />
          <Sparkles size={56} className="text-accent-blue animate-bounce-slow drop-shadow-md" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <h1 className="text-6xl font-extrabold text-text mb-6 tracking-tight drop-shadow-sm">
          PetTalk
        </h1>
        
        <p className="text-xl text-text-light/90 mb-12 font-medium leading-relaxed glass p-6 rounded-3xl mx-4">
          우리가 몰랐던<br/>
          <span className="text-text font-bold">반려동물의 진짜 마음</span>을<br/>
          들려드립니다.
        </p>
        
        <Link 
          to="/setup" 
          className="inline-flex items-center justify-center w-[80%] bg-text text-white font-bold text-xl py-5 rounded-2xl shadow-xl shadow-text/20 hover:-translate-y-1 hover:shadow-2xl hover:bg-text-light transition-all duration-300"
        >
          내 반려동물 등록하기
        </Link>
      </div>
    </div>
  );
};
