import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import type { AnimalType, Gender, AgeCategory } from '../types';
import { compressImage } from '../lib/storage';
import { Camera, Dog, Cat, Sparkles } from 'lucide-react';

export const PetSetupForm: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = usePetStore();

  const [animal, setAnimal] = useState<AnimalType>(profile?.animal || 'dog');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'male');
  const [age, setAge] = useState<AgeCategory | undefined>(profile?.age);
  const [name, setName] = useState(profile?.name || '');
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(profile?.photoBase64);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsLoading(true);
        const base64 = await compressImage(e.target.files[0]);
        setPhotoBase64(base64);
      } catch (err) {
        console.error('Failed to compress image', err);
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ animal, gender, age, name, photoBase64 });
    navigate('/translate');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-3xl w-full max-w-md mx-auto"
      style={{ padding: '2rem', boxShadow: '0 8px 40px rgba(62,39,35,0.10)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} style={{ color: '#FF8A80' }} />
        <h2 className="text-2xl font-black" style={{ color: '#3E2723' }}>반려동물 프로필</h2>
      </div>

      {/* Photo Upload */}
      <div className="flex flex-col items-center mb-8">
        <label className="relative cursor-pointer group block" id="photo-upload-label">
          <div
            className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300 relative z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
          >
            {photoBase64 ? (
              <img src={photoBase64} alt="반려동물 사진 미리보기" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera size={32} style={{ color: '#BCAAA4' }} />
                <span className="text-xs font-semibold" style={{ color: '#BCAAA4' }}>사진 추가</span>
              </div>
            )}
          </div>
          <div
            className="absolute inset-0 rounded-full -z-10 group-hover:scale-110 transition-transform"
            style={{
              background: animal === 'dog'
                ? 'radial-gradient(circle, rgba(255,138,128,0.4), transparent 70%)'
                : 'radial-gradient(circle, rgba(129,212,250,0.4), transparent 70%)',
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={isLoading}
            id="photo-file-input"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center z-20">
              <div
                className="w-7 h-7 border-3 border-t-transparent rounded-full"
                style={{ borderColor: '#FF8A80', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}
              />
            </div>
          )}
        </label>
        <p className="text-xs font-medium mt-3" style={{ color: '#BCAAA4' }}>클릭하여 사진 업로드 (선택)</p>
      </div>

      {/* Animal type */}
      <div className="mb-5">
        <label className="block text-sm font-bold mb-3" style={{ color: '#5D4037' }}>동물 종류</label>
        <div className="grid grid-cols-2 gap-3">
          {(['dog', 'cat'] as const).map((type) => {
            const isSelected = animal === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setAnimal(type)}
                id={`animal-${type}`}
                className="py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-base transition-all duration-250"
                style={{
                  background: isSelected
                    ? (type === 'dog' ? 'linear-gradient(135deg, #FF8A80, #FF6B6B)' : 'linear-gradient(135deg, #81D4FA, #4FC3F7)')
                    : 'rgba(255,255,255,0.6)',
                  color: isSelected ? 'white' : '#5D4037',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSelected
                    ? (type === 'dog' ? '0 6px 20px rgba(255,138,128,0.35)' : '0 6px 20px rgba(129,212,250,0.35)')
                    : 'none',
                  border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.8)',
                }}
              >
                {type === 'dog' ? <Dog size={22} /> : <Cat size={22} />}
                {type === 'dog' ? '강아지' : '고양이'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender */}
      <div className="mb-5">
        <label className="block text-sm font-bold mb-3" style={{ color: '#5D4037' }}>성별</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'male' as const, label: '♂ 수컷', color: '#64B5F6', shadow: 'rgba(100,181,246,0.35)' },
            { value: 'female' as const, label: '♀ 암컷', color: '#F48FB1', shadow: 'rgba(244,143,177,0.35)' },
          ].map(({ value, label, color, shadow }) => {
            const isSelected = gender === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setGender(value)}
                id={`gender-${value}`}
                className="py-3.5 rounded-2xl font-bold text-base transition-all duration-250"
                style={{
                  background: isSelected ? color : 'rgba(255,255,255,0.6)',
                  color: isSelected ? 'white' : '#5D4037',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSelected ? `0 6px 20px ${shadow}` : 'none',
                  border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.8)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Age */}
      <div className="mb-5">
        <label className="block text-sm font-bold mb-3" style={{ color: '#5D4037' }}>
          나이대 <span style={{ color: '#BCAAA4', fontWeight: 400 }}>(선택)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'baby' as const, label: '새끼 (퍼피/키튼)' },
            { value: 'adult' as const, label: '성체 (어른)' },
            { value: 'senior' as const, label: '노령 (시니어)' },
          ].map(({ value, label }) => {
            const isSelected = age === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAge(value)}
                id={`age-${value}`}
                className="py-3 px-2 rounded-2xl font-bold text-[0.8rem] transition-all duration-250 leading-tight"
                style={{
                  background: isSelected ? '#A1887F' : 'rgba(255,255,255,0.6)',
                  color: isSelected ? 'white' : '#5D4037',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 15px rgba(161,136,127,0.35)' : 'none',
                  border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.8)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name input */}
      <div className="mb-7">
        <label className="block text-sm font-bold mb-3" style={{ color: '#5D4037' }}>
          이름 <span style={{ color: '#BCAAA4', fontWeight: 400 }}>(선택)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 뽀삐, 야옹이, 초코"
          maxLength={20}
          id="pet-name-input"
          className="w-full px-5 py-4 rounded-2xl font-medium outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1.5px solid rgba(255,255,255,0.9)',
            color: '#3E2723',
          }}
          onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,138,128,0.25)'; e.currentTarget.style.borderColor = '#FF8A80'; }}
          onBlur={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)'; }}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="start-translate-btn"
        className="btn-primary w-full py-4 text-lg rounded-2xl"
      >
        🐾 번역기 시작하기
      </button>
    </form>
  );
};
