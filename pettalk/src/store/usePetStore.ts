import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PetProfile, HistoryItem } from '../types';

interface PetStore {
  profile: PetProfile | null;
  history: HistoryItem[];
  setProfile: (profile: PetProfile) => void;
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      profile: null,
      history: [],
      setProfile: (profile) => set({ profile }),
      addHistory: (item) => set((state) => ({ 
        history: [item, ...state.history].slice(0, 10) 
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'pettalk-storage',
    }
  )
);
