import type { AudioFeatures, Emotion, AnimalType } from '../types';
import rulesData from '../data/classificationRules.json';

type Rule = {
  volumeRMS: [number, number];
  dominantFreq: [number, number];
  duration: [number, number];
  zeroCrossingRate: [number, number];
  weight: number;
};

export function classifyEmotion(features: AudioFeatures, animal: AnimalType): Emotion {
  const rules: Record<Emotion, Rule> = rulesData[animal] as Record<Emotion, Rule>;
  let bestMatch: Emotion = 'happy';
  let maxScore = -1;

  for (const [emotionStr, rule] of Object.entries(rules)) {
    const emotion = emotionStr as Emotion;
    let score = 0;

    // Check bounds and assign points
    if (features.volumeRMS >= rule.volumeRMS[0] && features.volumeRMS <= rule.volumeRMS[1]) score += 1;
    if (features.dominantFreq >= rule.dominantFreq[0] && features.dominantFreq <= rule.dominantFreq[1]) score += 1;
    if (features.duration >= rule.duration[0] && features.duration <= rule.duration[1]) score += 1;
    if (features.zeroCrossingRate >= rule.zeroCrossingRate[0] && features.zeroCrossingRate <= rule.zeroCrossingRate[1]) score += 1;

    // Add slight randomness to make it fun
    const randomFactor = Math.random() * 0.5;
    const totalScore = (score * rule.weight) + randomFactor;

    if (totalScore > maxScore) {
      maxScore = totalScore;
      bestMatch = emotion;
    }
  }

  // Fallback to random if no rules match well
  if (maxScore < 1.0) {
    const emotions: Emotion[] = ['happy', 'hungry', 'alert', 'lonely', 'pain', 'play'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  return bestMatch;
}
