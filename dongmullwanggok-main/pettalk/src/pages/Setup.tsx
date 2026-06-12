import React from 'react';
import { Link } from 'react-router-dom';
import { PetSetupForm } from '../components/PetSetupForm';
import { ArrowLeft } from 'lucide-react';

export const Setup: React.FC = () => {
  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center p-4 pt-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFF6EB 0%, #FFE8D6 60%, #FFD7C4 100%)' }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #FF8A80 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-56 h-56 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #81D4FA 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold mb-6 px-4 py-2 rounded-full glass hover:bg-white transition-colors"
          style={{ color: '#5D4037', textDecoration: 'none' }}
          id="back-to-home"
        >
          <ArrowLeft size={18} />
          홈으로
        </Link>

        <PetSetupForm />
      </div>
    </div>
  );
};
