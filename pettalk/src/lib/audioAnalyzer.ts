import type { AudioFeatures } from '../types';

export async function analyzeAudio(blob: Blob): Promise<AudioFeatures> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new window.AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  
  const channelData = audioBuffer.getChannelData(0);
  const duration = audioBuffer.duration;
  
  // 1. Calculate RMS (Volume)
  let sumSquares = 0;
  let zeroCrossings = 0;
  
  for (let i = 0; i < channelData.length; i++) {
    sumSquares += channelData[i] * channelData[i];
    
    // Calculate Zero Crossing Rate
    if (i > 0) {
      if ((channelData[i] >= 0 && channelData[i - 1] < 0) || 
          (channelData[i] < 0 && channelData[i - 1] >= 0)) {
        zeroCrossings++;
      }
    }
  }
  
  const volumeRMS = Math.sqrt(sumSquares / channelData.length);
  const zeroCrossingRate = zeroCrossings / duration;
  
  // 2. Simple dominant frequency estimation based on zero crossings 
  // (In a real app we would use FFT, but this is a lightweight approximation)
  const dominantFreq = zeroCrossings / (2 * duration);

  // Normalize slightly for our rules
  return {
    volumeRMS: Math.min(volumeRMS * 10, 1.0), // Scale up a bit and cap at 1.0
    dominantFreq,
    duration,
    zeroCrossingRate: zeroCrossingRate / 1000 // Scale down for easier rule matching
  };
}
