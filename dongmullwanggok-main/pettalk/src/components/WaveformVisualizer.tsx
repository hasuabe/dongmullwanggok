import React, { useRef, useEffect } from 'react';

interface Props {
  stream: MediaStream | null;
  isRecording: boolean;
}

export const WaveformVisualizer: React.FC<Props> = ({ stream, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (stream && isRecording) {
      const audioCtx = new window.AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw idle line first
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(255,138,128,0.3)');
        gradient.addColorStop(0.25, '#FF8A80');
        gradient.addColorStop(0.5, '#81D4FA');
        gradient.addColorStop(0.75, '#FF8A80');
        gradient.addColorStop(1, 'rgba(255,138,128,0.3)');

        ctx.strokeStyle = gradient;
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            // Smooth curve using quadratic bezier
            const prevX = x - sliceWidth;
            const prevV = dataArray[i - 1] / 128.0;
            const prevY = (prevV * canvas.height) / 2;
            ctx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
          }
          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Glow effect
        ctx.save();
        ctx.filter = 'blur(3px)';
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();

        animationRef.current = requestAnimationFrame(draw);
      };

      draw();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw a flat idle line
          ctx.strokeStyle = 'rgba(188,170,164,0.4)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stream, isRecording]);

  return (
    <div
      className="w-full h-20 glass rounded-2xl overflow-hidden relative"
      style={{ border: '1.5px solid rgba(255,255,255,0.6)' }}
    >
      {!isRecording && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: '#D7CCC8', fontSize: '0.8rem', fontWeight: 600 }}
        >
          🎙 마이크 버튼을 눌러 녹음 시작
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};
