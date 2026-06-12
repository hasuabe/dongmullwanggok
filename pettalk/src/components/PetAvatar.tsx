import React from 'react';
import { Dog, Cat } from 'lucide-react';
import type { AnimalType } from '../types';

interface Props {
  animal: AnimalType;
  photoBase64?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PetAvatar: React.FC<Props> = ({ animal, photoBase64, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 border-2',
    md: 'w-24 h-24 border-4',
    lg: 'w-40 h-40 border-4'
  };

  const iconSizes = {
    sm: 24,
    md: 48,
    lg: 80
  };

  return (
    <div className={`relative rounded-full overflow-hidden flex items-center justify-center bg-white/60 backdrop-blur-sm border-white shadow-lg shrink-0 ${sizeClasses[size]} ${className}`}>
      {photoBase64 ? (
        <img src={photoBase64} alt="Pet" className="w-full h-full object-cover" />
      ) : (
        animal === 'dog' ? (
          <Dog size={iconSizes[size]} className="text-accent" />
        ) : (
          <Cat size={iconSizes[size]} className="text-accent-blue" />
        )
      )}
    </div>
  );
};
