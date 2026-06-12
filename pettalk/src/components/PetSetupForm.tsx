import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import type { AnimalType, Gender } from '../types';
import { compressImage } from '../lib/storage';
import { Camera, Dog, Cat } from 'lucide-react';

export const PetSetupForm: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = usePetStore();

  const [animal, setAnimal] = useState<AnimalType>(profile?.animal || 'dog');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'male');
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
        console.error("Failed to compress image", err);
        alert("이미지 업로드에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ animal, gender, name, photoBase64 });
    navigate('/translate');
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-3xl w-full max-w-md mx-auto shadow-xl border border-white/40">
      <h2 className="text-2xl font-bold text-center text-text mb-6">반려동물 프로필</h2>
      
      <div className="flex flex-col items-center mb-8">
        <label className="relative cursor-pointer group block">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white/50 flex items-center justify-center border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300 relative z-10">
            {photoBase64 ? (
              <img src={photoBase64} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={40} className="text-text-light/40" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-md -z-10 group-hover:bg-accent/40 transition-colors"></div>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isLoading} />
          {isLoading && <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center z-20">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>}
        </label>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-light mb-3 ml-1">동물 종류</label>
        <div className="flex gap-4">
          <button type="button" onClick={() => setAnimal('dog')} className={`flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-300 ${animal === 'dog' ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105' : 'bg-white/60 text-text hover:bg-white'}`}>
            <Dog size={22} /> 강아지
          </button>
          <button type="button" onClick={() => setAnimal('cat')} className={`flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-300 ${animal === 'cat' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30 scale-105' : 'bg-white/60 text-text hover:bg-white'}`}>
            <Cat size={22} /> 고양이
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-light mb-3 ml-1">성별</label>
        <div className="flex gap-4">
          <button type="button" onClick={() => setGender('male')} className={`flex-1 py-3 rounded-2xl font-bold transition-all duration-300 ${gender === 'male' ? 'bg-blue-400 text-white shadow-lg shadow-blue-400/30' : 'bg-white/60 text-text hover:bg-white'}`}>수컷</button>
          <button type="button" onClick={() => setGender('female')} className={`flex-1 py-3 rounded-2xl font-bold transition-all duration-300 ${gender === 'female' ? 'bg-pink-400 text-white shadow-lg shadow-pink-400/30' : 'bg-white/60 text-text hover:bg-white'}`}>암컷</button>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-text-light mb-3 ml-1">이름 (선택)</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="예: 뽀삐, 야옹이"
          className="w-full px-5 py-4 rounded-2xl bg-white/60 border-none focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all shadow-inner font-medium"
        />
      </div>

      <button type="submit" className="w-full py-4 bg-text text-white rounded-2xl font-bold text-lg shadow-xl shadow-text/20 hover:bg-text-light hover:-translate-y-1 transition-all duration-300">
        번역기 시작하기
      </button>
    </form>
  );
};
