import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Cake, Image as ImageIcon, HeartHandshake, Pin, Mail, Star, ChevronDown } from 'lucide-react';
import { AfreenAvatar } from './AfreenAvatar';
import { soundSynth } from '../utils/soundSynthesizer';

interface HeroCinematicProps {
  onScrollTo: (sectionId: string) => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({ onScrollTo }) => {
  useEffect(() => {
    // Initial welcoming confetti burst
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#E9D5FF', '#FDE047', '#FDBA74', '#BAE6FD', '#F472B6'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const triggerConfettiExplosion = () => {
    soundSynth.playConfettiPop();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A855F7', '#EC4899', '#EAB308', '#06B6D4', '#F97316'],
    });
  };

  return (
    <section id="hero-section" className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#F3E8FF]/60 via-[#FFFBEB]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-12 hidden md:block animate-float">
        <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl shadow-sm border border-[#E9D5FF]/60 flex items-center gap-2 text-xs text-purple-800 font-medium">
          <Star className="w-4 h-4 text-amber-400 fill-amber-300" />
          <span>A Year of Wonderful Moments</span>
        </div>
      </div>

      <div className="absolute bottom-24 right-12 hidden md:block animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl shadow-sm border border-[#FED7AA]/60 flex items-center gap-2 text-xs text-amber-800 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Keep Shining & Smiling</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-8 z-10">
        {/* Special Character Illustrated Avatar of Afreen */}
        <div className="flex flex-col items-center justify-center gap-2">
          <AfreenAvatar size="lg" interactive={true} />
          <span className="text-xs text-purple-700/80 font-medium">
            (Tap avatar to toggle party hat & sparkles!)
          </span>
        </div>

        {/* Cinematic Headline */}
        <div className="space-y-4">
          <p className="font-serif italic text-lg sm:text-2xl text-[#6B21A8]/90 tracking-wide font-normal">
            Today isn't just another day.
          </p>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#2A1E38] leading-tight">
            It's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] via-[#D97706] to-[#DB2777]">Afreen's</span> day!
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-600 font-sans leading-relaxed">
            Celebrating your kindness, your unmistakable energy, your genuine smile, and everything that makes you such an extraordinary friend. Here’s a little interactive world crafted just for you.
          </p>
        </div>

        {/* Interactive Confetti trigger button */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={triggerConfettiExplosion}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#7C3AED] text-sm font-semibold shadow-sm border border-[#E9D5FF] hover:bg-[#FAF5FF] hover:border-[#D8B4FE] transition cursor-pointer hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pop Birthday Confetti 🎉</span>
          </button>

          <button
            onClick={() => onScrollTo('cake-section')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-sm font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition cursor-pointer hover:scale-105 active:scale-95"
          >
            <Cake className="w-4 h-4 text-yellow-200" />
            <span>Make Your Wish 🎂</span>
          </button>
        </div>

        {/* Quick Jump Navigation Badges */}
        <div className="pt-6 border-t border-purple-100/80">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
            Explore Your Birthday Chapters
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs">
            <button
              onClick={() => onScrollTo('cake-section')}
              className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-purple-700 border border-gray-200/80 hover:border-purple-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Cake className="w-3.5 h-3.5 text-pink-500" />
              <span>3D Cake</span>
            </button>
            <button
              onClick={() => onScrollTo('scrapbook-section')}
              className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-purple-700 border border-gray-200/80 hover:border-purple-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Scrapbook</span>
            </button>
            <button
              onClick={() => onScrollTo('cards-section')}
              className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-purple-700 border border-gray-200/80 hover:border-purple-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-purple-500" />
              <span>Appreciation Deck</span>
            </button>
            <button
              onClick={() => onScrollTo('corkboard-section')}
              className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-purple-700 border border-gray-200/80 hover:border-purple-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Pin className="w-3.5 h-3.5 text-amber-500" />
              <span>Friendship Corkboard</span>
            </button>
            <button
              onClick={() => onScrollTo('letter-section')}
              className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-purple-700 border border-gray-200/80 hover:border-purple-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              <span>Birthday Letter</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => onScrollTo('cake-section')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-600 transition cursor-pointer"
          >
            <span className="text-[11px] font-medium tracking-wider uppercase">Scroll to Cake</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
