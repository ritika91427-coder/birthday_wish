import React, { useState } from 'react';
import { Sparkles, Gift, ArrowDown } from 'lucide-react';
import { soundSynth } from '../utils/soundSynthesizer';
import { AfreenAvatar } from './AfreenAvatar';

interface EnvelopeIntroProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({ onOpen, isOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // 1. Play envelope audio effect
    soundSynth.playEnvelopeOpen();

    // 2. Start gentle background music box
    soundSynth.startBackgroundMusic();

    // 3. Complete opening sequence and notify parent
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-[#FBF8F5] via-[#F5EDFA] to-[#FFF1E8]">
      {/* Decorative ambient background orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#E9D5FF]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-[#FED7AA]/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-48 h-48 bg-[#FEF08A]/35 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Sparkles & Confetti hints */}
      <div className="absolute top-16 left-1/4 animate-bounce text-[#C084FC] opacity-70" style={{ animationDuration: '3s' }}>
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute bottom-24 right-1/4 animate-bounce text-[#F59E0B] opacity-60" style={{ animationDuration: '4s' }}>
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        {/* Subtle greeting header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#E9D5FF] text-[#6B21A8] text-xs font-semibold tracking-wider uppercase shadow-xs backdrop-blur-xs">
            <Gift className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Special Delivery for a Wonderful Friend</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26] tracking-tight leading-tight">
            Hey Afreen!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-sans max-w-md mx-auto leading-relaxed">
            Someone has prepared a little surprise for you.
          </p>
        </div>

        {/* 3D Interactive Envelope Container */}
        <div className="perspective-1000 flex justify-center py-4">
          <div
            onClick={handleOpenClick}
            className={`relative w-80 sm:w-96 h-56 rounded-2xl cursor-pointer transition-all duration-700 select-none group ${
              isOpening ? 'scale-105' : 'hover:scale-102 hover:-translate-y-1'
            }`}
          >
            {/* Envelope Shadow */}
            <div className="absolute -bottom-6 left-6 right-6 h-8 bg-[#3B2554]/15 rounded-full blur-xl group-hover:blur-2xl transition-all" />

            {/* Envelope Back Base */}
            <div className="absolute inset-0 bg-[#E8DCF3] rounded-2xl shadow-xl border border-white/60 overflow-hidden flex flex-col justify-end">
              {/* Pattern inside envelope lining: soft floral pastel geometry */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#9333EA_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* Letter Paper Sliding Out */}
            <div
              className={`absolute left-4 right-4 bg-white rounded-t-xl p-5 shadow-md border-t-2 border-l border-r border-[#E2D4F0] transition-all duration-1000 ease-out z-10 ${
                isOpening
                  ? '-translate-y-32 sm:-translate-y-36 opacity-100'
                  : 'translate-y-4 opacity-80 group-hover:translate-y-1'
              }`}
              style={{ height: '170px' }}
            >
              <div className="flex items-center gap-3 border-b border-[#F3E8FF] pb-2.5">
                <AfreenAvatar size="sm" showBadge={false} interactive={false} />
                <div className="text-left">
                  <div className="font-serif font-bold text-sm text-[#4C1D95]">A Little Something For Afreen 🎂</div>
                  <div className="text-[11px] text-gray-400">Handcrafted with appreciation</div>
                </div>
              </div>
              <div className="mt-3 text-left space-y-1 text-xs text-gray-600 font-sans">
                <p className="italic text-purple-900 font-medium">✨ Tap to begin your birthday celebration...</p>
                <div className="w-full h-1 bg-[#F5EDFA] rounded-full mt-2" />
                <div className="w-3/4 h-1 bg-[#F5EDFA] rounded-full" />
              </div>
            </div>

            {/* Envelope Front Left & Right Pockets */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Left fold */}
              <div
                className="absolute inset-0 bg-[#F4EDFC] border-b border-l border-white/80 rounded-bl-2xl"
                style={{
                  clipPath: 'polygon(0 0, 0 100%, 50% 55%)',
                }}
              />
              {/* Right fold */}
              <div
                className="absolute inset-0 bg-[#EFE5FB] border-b border-r border-white/80 rounded-br-2xl"
                style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 50% 55%)',
                }}
              />
              {/* Bottom fold */}
              <div
                className="absolute inset-0 bg-[#F9F4FE] border-b border-white rounded-b-2xl shadow-inner"
                style={{
                  clipPath: 'polygon(0 100%, 100% 100%, 50% 55%)',
                }}
              />
            </div>

            {/* Envelope Top Flap (Triangular flap with 3D open effect) */}
            <div
              className="absolute top-0 left-0 right-0 h-32 z-30 origin-top transition-transform duration-700 preserve-3d"
              style={{
                transform: isOpening ? 'rotateX(180deg)' : 'rotateX(0deg)',
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-b from-[#F1E5FB] to-[#E3D1F5] rounded-t-2xl border-t border-white/90 shadow-sm"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />

              {/* Wax Seal with "A" monogram for Afreen */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-3 transition-opacity duration-300 ${
                  isOpening ? 'opacity-0 scale-75' : 'opacity-100'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#9333EA] via-[#7E22CE] to-[#A855F7] text-white flex items-center justify-center font-serif text-lg font-bold shadow-lg border-2 border-[#FEF08A] ring-2 ring-purple-300/50">
                  <span className="drop-shadow-xs">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleOpenClick}
            disabled={isOpening}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#9333EA] via-[#7C3AED] to-[#A855F7] text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-75"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="tracking-wide">
              {isOpening ? 'OPENING YOUR SURPRISE...' : 'OPEN YOUR SURPRISE'}
            </span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>

          <p className="mt-3 text-xs text-gray-500 font-sans">
            (Includes gentle synthesized music & interactive surprises ✨)
          </p>
        </div>
      </div>
    </div>
  );
};
