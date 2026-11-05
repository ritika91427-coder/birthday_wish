import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';
import { AfreenAvatar } from './AfreenAvatar';
import { soundSynth } from '../utils/soundSynthesizer';

interface FinalSurpriseProps {
  onReplay: () => void;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({ onReplay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasTriggeredFinalConfetti, setHasTriggeredFinalConfetti] = useState(false);

  useEffect(() => {
    // Fireworks canvas animation engine
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: FireworkParticle[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#C084FC', '#F472B6', '#FBBF24', '#38BDF8', '#4ADE80', '#FB923C'];

    const createExplosion = (x: number, y: number) => {
      const count = 45;
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.4 ? baseColor : colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1.5,
          decay: Math.random() * 0.015 + 0.008,
        });
      }
    };

    let tick = 0;
    const loop = () => {
      ctx.fillStyle = 'rgba(15, 10, 26, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tick++;
      if (tick % 38 === 0) {
        createExplosion(
          Math.random() * (canvas.width * 0.8) + canvas.width * 0.1,
          Math.random() * (canvas.height * 0.5) + canvas.height * 0.1
        );
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const triggerGrandFinale = () => {
    soundSynth.playWishGrantedFanfare();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FDE047', '#D8B4FE', '#F472B6', '#38BDF8'],
    });
    setHasTriggeredFinalConfetti(true);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    soundSynth.playSparkle();
    confetti({
      particleCount: 25,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
    });
  };

  return (
    <section id="final-section" className="relative min-h-screen py-24 px-4 bg-[#0F0A1A] text-white flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Dynamic Fireworks Canvas Background */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-80"
        title="Click anywhere for fireworks sparks!"
      />

      {/* Atmospheric Starry Night Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#9333EA]/20 via-[#EC4899]/15 to-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Content Over Canvas */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 px-4">
        {/* Glowing Afreen Avatar with Glasses */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#C084FC] via-[#FDE047] to-[#F472B6] shadow-[0_0_30px_rgba(192,132,252,0.6)]">
            <AfreenAvatar size="lg" interactive={true} />
          </div>
        </div>

        {/* Glowing Birthday Message */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/50 border border-purple-400/40 text-purple-200 text-xs font-semibold tracking-widest uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>The Grand Finale</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FDE047] via-[#F472B6] to-[#C084FC] drop-shadow-[0_0_25px_rgba(253,224,71,0.5)]">
            HAPPY BIRTHDAY, AFREEN!
          </h2>

          <div className="space-y-2 pt-2">
            <p className="font-serif italic text-xl sm:text-2xl text-purple-200/90 font-medium">
              Stay happy. Keep smiling. Keep shining.
            </p>
            <p className="text-base sm:text-lg text-gray-300 font-sans tracking-wide">
              Wishing you an amazing year ahead!
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={triggerGrandFinale}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white font-semibold text-sm shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Celebrate Again! 🎆</span>
          </button>

          <button
            onClick={onReplay}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-purple-300" />
            <span>REPLAY THE MAGIC</span>
          </button>
        </div>

        <p className="text-xs text-purple-300/60 pt-4">
          Click anywhere in the dark sky above to burst fireworks sparkles ✨
        </p>
      </div>
    </section>
  );
};
