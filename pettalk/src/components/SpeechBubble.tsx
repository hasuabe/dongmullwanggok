import React from 'react';

interface Props {
  text: string;
  isVisible: boolean;
}

export const SpeechBubble: React.FC<Props> = ({ text, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="relative animate-pop glass rounded-2xl p-4 md:p-6 shadow-xl max-w-sm mx-auto mt-6 z-10 border border-accent-blue/30 bg-white/80">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-white/80 drop-shadow-sm"></div>
      <p className="text-lg md:text-xl font-bold text-text text-center">
        "{text}"
      </p>
    </div>
  );
};
