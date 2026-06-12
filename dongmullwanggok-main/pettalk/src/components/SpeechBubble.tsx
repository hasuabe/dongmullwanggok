import React from 'react';

interface Props {
  text: string;
  isVisible: boolean;
}

export const SpeechBubble: React.FC<Props> = ({ text, isVisible }) => {
  if (!isVisible || !text) return null;

  return (
    <div
      className="relative w-full"
      style={{ animation: 'pop 0.35s cubic-bezier(0.175,0.885,0.32,1.275)' }}
    >
      {/* Tail pointing down (toward avatar below) */}
      <div
        className="relative glass rounded-2xl shadow-xl border"
        style={{
          borderColor: 'rgba(255,255,255,0.6)',
          padding: '1.25rem 1.5rem',
          background: 'rgba(255,255,255,0.85)',
        }}
      >
        <p
          className="text-lg font-bold text-center leading-relaxed"
          style={{ color: '#3E2723' }}
        >
          "{text}"
        </p>
      </div>
      {/* Tail */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: '-10px',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '12px solid rgba(255,255,255,0.85)',
          filter: 'drop-shadow(0 2px 4px rgba(62,39,35,0.08))',
        }}
      />
    </div>
  );
};
