import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Volume2, VolumeX, Music, HeartHandshake, Sun, Gem, Compass, Globe, CheckCircle2 } from 'lucide-react';
import { AfreenAvatar } from './AfreenAvatar';
import { soundSynth } from '../utils/soundSynthesizer';
import { DEFAULT_APPRECIATION_CARDS } from '../config/birthdayData';

interface CelebrationViewProps {
  onReplay: () => void;
}

interface CrackerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  sparkle?: boolean;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({ onReplay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [revealedCardIds, setRevealedCardIds] = useState<Record<string, boolean>>({});

  // 1. Trigger initial huge crackers & confetti celebration upon entering!
  useEffect(() => {
    // Sound: Fanfare + Firecrackers
    soundSynth.playWishGrantedFanfare();
    setTimeout(() => soundSynth.playFirecracker(), 300);
    setTimeout(() => soundSynth.playFirecracker(), 700);

    // Giant confetti celebration
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FDE047', '#D8B4FE', '#F472B6', '#38BDF8', '#4ADE80', '#FB923C'];

    const interval: number = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 25,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: colors,
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // 2. Realistic Canvas Fireworks & Crackers Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: CrackerParticle[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = [
      '#FDE047', // bright gold
      '#F472B6', // rose pink
      '#A855F7', // vivid purple
      '#38BDF8', // cyan
      '#FB923C', // warm orange
      '#4ADE80', // bright emerald
      '#FFFFFF', // white glitter
    ];

    const spawnCracker = (x: number, y: number, burstCount = 35) => {
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.4 ? baseColor : colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1.2,
          decay: Math.random() * 0.018 + 0.01,
          sparkle: Math.random() > 0.5,
        });
      }
    };

    // Auto burst crackers across the screen
    let tick = 0;
    const render = () => {
      ctx.fillStyle = 'rgba(18, 11, 33, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tick++;
      // Auto-burst crackers every ~45 frames
      if (tick % 45 === 0) {
        const rx = Math.random() * (canvas.width * 0.85) + canvas.width * 0.08;
        const ry = Math.random() * (canvas.height * 0.55) + 60;
        spawnCracker(rx, ry, 30);
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
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Attach click listener on canvas
    const handleCanvasClick = (e: MouseEvent) => {
      spawnCracker(e.clientX, e.clientY, 45);
      soundSynth.playFirecracker();
      confetti({
        particleCount: 20,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  // Audio Controls
  const toggleMusic = () => {
    const next = soundSynth.toggleBackgroundMusic();
    setIsPlayingMusic(next);
  };

  const toggleMute = () => {
    const next = soundSynth.toggleMute();
    setIsMuted(next);
  };

  // Card Flip
  const handleCardClick = (id: string) => {
    soundSynth.playCardFlip();
    setRevealedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    soundSynth.playSparkle();
  };

  // Manual Cracker Burst
  const triggerManualCrackers = () => {
    soundSynth.playFirecracker();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FDE047', '#F472B6', '#A855F7', '#38BDF8'],
    });
  };

  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Sun':
        return <Sun className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Gem':
        return <Gem className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'HeartHandshake':
      default:
        return <HeartHandshake className={className} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#110A20] text-white overflow-x-hidden select-none pb-16">
      {/* Background Interactive Firecrackers Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-auto cursor-pointer z-0 opacity-80"
        title="Tap anywhere to burst crackers!"
      />

      {/* Top Floating Music Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <AfreenAvatar size="sm" showBadge={false} interactive={false} />
          <span className="font-serif font-bold text-sm sm:text-base text-yellow-200">
            A Little Something for Afreen 🎂
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isPlayingMusic
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
            title="Toggle Happy Birthday Music"
          >
            <Music className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">
              {isPlayingMusic ? 'Happy Birthday Song 🎵' : 'Play Music'}
            </span>
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onReplay}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-gray-300 flex items-center gap-1 cursor-pointer"
            title="Close and Replay Envelope"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-10 text-center space-y-10">
        {/* AVATAR & CELEBRATION HEADER */}
        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="p-1.5 rounded-full bg-gradient-to-tr from-[#FDE047] via-[#F472B6] to-[#A855F7] shadow-[0_0_35px_rgba(253,224,71,0.6)]">
              <AfreenAvatar size="lg" interactive={true} />
            </div>
          </div>

          {/* Huge Birthday Message */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-purple-400/50 text-yellow-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-lg animate-pulse">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>TODAY IS YOUR SPECIAL DAY</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FDE047] via-[#F472B6] to-[#C084FC] drop-shadow-[0_0_30px_rgba(253,224,71,0.6)] leading-tight">
              HAPPY BIRTHDAY, AFREEN! 🎂🎉
            </h1>

            <p className="font-serif italic text-xl sm:text-2xl text-purple-200 font-medium max-w-xl mx-auto">
              Stay happy. Keep smiling. Keep shining.
            </p>
            <p className="text-sm sm:text-base text-gray-300 font-sans max-w-lg mx-auto">
              Wishing you an extraordinary year filled with success, laughter, good health, and wonderful moments ahead!
            </p>
          </div>

          {/* Interactive Cracker Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={triggerManualCrackers}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#EF4444] to-[#EC4899] text-white font-bold text-sm shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
              <span>Burst Crackers & Confetti! 🎆</span>
            </button>
          </div>

          <p className="text-xs text-purple-300/70">
            Tip: Tap or click anywhere on the dark screen to burst colorful firecrackers! ✨
          </p>
        </div>

        {/* WARM PERSONAL NOTE FROM FRIEND */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-left max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-serif text-sm font-bold text-yellow-300 flex items-center gap-1.5">
              <span>✉️</span> A Note For You
            </span>
            <span className="text-xs text-purple-200">From your friend</span>
          </div>

          <div className="font-handwriting text-2xl sm:text-3xl text-yellow-50 leading-relaxed space-y-3">
            <p>Dear Afreen,</p>
            <p>
              Happy Birthday! I hope this new chapter of your life brings you happiness, success, good health and countless reasons to smile.
            </p>
            <p>
              Keep being the amazing person you are. May you achieve everything you've been working towards, discover new opportunities and create memories worth remembering.
            </p>
            <p>
              Never lose your individuality, kindness and confidence. Have an absolutely wonderful birthday!
            </p>
            <p className="pt-2 text-right text-yellow-300">Your friend ❤️</p>
          </div>
        </div>

        {/* APPRECIATION CARDS SECTION */}
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Little Reminders</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Reasons Why You're Truly Appreciated
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80">
              Tap any card to reveal a friendly reason!
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 perspective-1000">
            {DEFAULT_APPRECIATION_CARDS.map((card, index) => {
              const isRevealed = !!revealedCardIds[card.id];

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="relative h-48 cursor-pointer group"
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700 preserve-3d"
                    style={{
                      transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front: Mystery Card */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl p-5 bg-gradient-to-br from-[#2D1B4E] to-[#1E1235] border border-purple-400/40 shadow-lg flex flex-col justify-between hover:border-yellow-300 transition-all group-hover:scale-102">
                      <div className="flex items-center justify-between text-[11px] text-purple-300 font-serif font-bold">
                        <span>CARD #{index + 1}</span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      </div>

                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-yellow-300 border border-purple-400/30">
                          {renderIcon(card.iconName, 'w-6 h-6')}
                        </div>
                        <h3 className="font-serif text-lg font-bold text-yellow-100">
                          {card.title}
                        </h3>
                      </div>

                      <div className="text-[11px] text-purple-300 font-sans text-center">
                        Tap to reveal message ✨
                      </div>
                    </div>

                    {/* Back: Revealed Message */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-5 bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#C026D3] text-white border-2 border-yellow-300 shadow-xl flex flex-col justify-between text-center">
                      <div className="flex items-center justify-between text-[10px] text-yellow-200 uppercase tracking-widest font-semibold">
                        <span>Friendship Note</span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                      </div>

                      <div className="my-auto space-y-2">
                        <p className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
                          "{card.message}"
                        </p>
                      </div>

                      <div className="text-[10px] text-purple-200 italic">
                        Tap to flip back
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM FOOTER & REPLAY */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/70">
          <span>Handcrafted with genuine appreciation for Afreen 🎂</span>

          <button
            onClick={onReplay}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Close & Replay Surprise</span>
          </button>
        </div>
      </main>
    </div>
  );
};
