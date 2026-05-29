import React from 'react';
import { PetSetupForm } from '../components/PetSetupForm';

export const Setup: React.FC = () => {
  return (
    <div className="min-h-[100dvh] p-6 bg-gradient-to-b from-primary-light to-primary-dark/30 flex flex-col items-center justify-center">
      <PetSetupForm />
    </div>
  );
};
