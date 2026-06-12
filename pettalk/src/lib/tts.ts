import type { Gender } from '../types';

export function speak(text: string, gender: Gender) {
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Find Korean voices
  const koreanVoices = voices.filter(v => v.lang.startsWith('ko'));
  
  if (koreanVoices.length > 0) {
    // Basic heuristic: some voices might have 'Male' or 'Female' in the name.
    // If not, we just pick the first one. Mobile browsers often only have one.
    let matchedVoice = koreanVoices[0];
    
    for (const voice of koreanVoices) {
      const lowerName = voice.name.toLowerCase();
      if (gender === 'male' && (lowerName.includes('male') || lowerName.includes('남'))) {
        matchedVoice = voice;
        break;
      }
      if (gender === 'female' && (lowerName.includes('female') || lowerName.includes('여'))) {
        matchedVoice = voice;
        break;
      }
    }
    
    utter.voice = matchedVoice;
  }

  // Adjust pitch slightly based on gender to differentiate if only one voice is available
  if (gender === 'male') {
    utter.pitch = 0.8;
  } else {
    utter.pitch = 1.2;
  }
  
  utter.rate = 1.0;

  window.speechSynthesis.speak(utter);
}
