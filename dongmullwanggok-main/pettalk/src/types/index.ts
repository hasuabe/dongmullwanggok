export type AnimalType = 'dog' | 'cat';
export type Gender = 'male' | 'female';
export type Emotion = 'happy' | 'hungry' | 'alert' | 'lonely' | 'pain' | 'play';

export type AgeCategory = 'baby' | 'adult' | 'senior';

export interface PetProfile {
  animal: AnimalType;
  gender: Gender;
  name: string;
  age?: AgeCategory;
  photoBase64?: string;
}

export interface AudioFeatures {
  volumeRMS: number;
  dominantFreq: number;
  duration: number;
  zeroCrossingRate: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  emotion: Emotion;
  translatedText: string;
  animal: AnimalType;
}
