import type { Emotion, AnimalType } from '../types';
import translationsData from '../data/translations.json';

export function getTranslation(animal: AnimalType, emotion: Emotion, petName?: string): string {
  const pool: string[] = (translationsData as any)[animal][emotion];
  
  if (!pool || pool.length === 0) {
    return "무슨 말인지 잘 모르겠다냥!";
  }

  const randomIdx = Math.floor(Math.random() * pool.length);
  const selectedText = pool[randomIdx];

  if (petName) {
    return selectedText.replace(/{name}/g, petName);
  } else {
    // If no name is provided, replace {name} with a generic term
    return selectedText.replace(/{name}는/g, "나는").replace(/{name}가/g, "내가").replace(/{name}/g, "이 아이");
  }
}
