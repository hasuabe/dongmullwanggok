import React from 'react';
import { Link } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import { Mic, ArrowRight, Dog, Cat, Sparkles, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  const { profile } = usePetStore();

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #FFF6EB 0%, #FFE8D6 50%, #FFD7C4 100%)' }}
    >
      {/* Background decorations */}
      <div
        className="absolute top-[-15%] right-[-15%] w-80 h-80 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #FF8A80 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-72 h-72 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #81D4FA 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 left-[5%] w-32 h-32 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #FFD54F 0%, transparent 70%)' }}
      />

      <div className="text-center w-full max-w-sm relative z-10" style={{ animation: 'fade-in 0.6s ease-out' }}>
        {/* App Icon */}
        <div className="flex justify-center mb-8 gap-6">
          <div
            className="relative flex items-center justify-center w-20 h-20 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #FF8A80, #FF6B6B)',
              boxShadow: '0 8px 32px rgba(255,138,128,0.4)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <Dog size={40} className="text-white" />
          </div>
          <div
            className="relative flex items-center justify-center w-20 h-20 rounded-3xl mt-6"
            style={{
              background: 'linear-gradient(135deg, #81D4FA, #4FC3F7)',
              boxShadow: '0 8px 32px rgba(129,212,250,0.4)',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '1.5s',
            }}
          >
            <Cat size={40} className="text-white" />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles size={22} className="text-accent" style={{ color: '#FF8A80' }} />
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#FF8A80' }}>AI 동물 번역기</span>
          <Sparkles size={22} className="text-accent" style={{ color: '#FF8A80' }} />
        </div>

        <h1
          className="text-7xl font-black mb-2 tracking-tight"
          style={{ color: '#3E2723', textShadow: '0 2px 12px rgba(62,39,35,0.08)' }}
        >
          PetTalk
        </h1>
        <p
          className="text-lg font-medium mb-10 leading-relaxed"
          style={{ color: '#8D6E63' }}
        >
          반려동물의 마음 속 이야기를<br />
          <span className="font-bold" style={{ color: '#3E2723' }}>처음으로</span> 들어보세요
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: '🎤', text: '마이크 녹음' },
            { icon: '🧠', text: 'AI 감정 분석' },
            { icon: '💬', text: '한국어 번역' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="glass rounded-2xl py-3 px-1 flex flex-col items-center gap-1"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold" style={{ color: '#5D4037' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={profile ? '/translate' : '/setup'}
          className="btn-primary w-full text-xl py-5 rounded-2xl flex items-center justify-center gap-3 group"
          style={{ textDecoration: 'none' }}
          id="start-btn"
        >
          <Heart size={22} className="group-hover:scale-110 transition-transform" fill="currentColor" />
          {profile ? `${profile.name || '내 반려동물'}와 대화하기` : '내 반려동물 등록하기'}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        {profile && (
          <Link
            to="/setup"
            className="block text-center mt-4 text-sm font-medium underline"
            style={{ color: '#8D6E63' }}
          >
            프로필 변경
          </Link>
        )}

        {/* Microphone hint */}
        <div className="flex items-center justify-center gap-2 mt-8" style={{ color: '#BCAAA4' }}>
          <Mic size={14} />
          <span className="text-xs">마이크 권한이 필요합니다</span>
        </div>
      </div>
    </div>
  );
};
