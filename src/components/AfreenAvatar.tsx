import React, { useState } from 'react';
import { Sparkles, PartyPopper } from 'lucide-react';
import { soundSynth } from '../utils/soundSynthesizer';

interface AfreenAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  interactive?: boolean;
  className?: string;
}

export const AfreenAvatar: React.FC<AfreenAvatarProps> = ({
  size = 'md',
  showBadge = true,
  interactive = true,
  className = '',
}) => {
  const [hasPartyHat, setHasPartyHat] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  const dimensionClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  }[size];

  const handleAvatarClick = () => {
    if (!interactive) return;
    setIsWinking(true);
    setHasPartyHat((prev) => !prev);
    soundSynth.playSparkle();
    setTimeout(() => setIsWinking(false), 1000);
  };

  return (
    <div className={`relative inline-block select-none group ${className}`}>
      {/* Soft warm glowing anime halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F472B6] via-[#FDE047] to-[#A855F7] blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 scale-105" />

      {/* Main Avatar SVG Container */}
      <div
        onClick={handleAvatarClick}
        className={`${dimensionClasses} relative rounded-full p-1 bg-gradient-to-b from-[#FFF5F7] via-[#FFFBEB] to-[#F3E8FF] shadow-xl border-2 border-white/90 cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95`}
        title={interactive ? 'Click to toggle party hat & cute anime wink! ✨' : undefined}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Anime Skin Gradient */}
            <linearGradient id="animeSkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF2E8" />
              <stop offset="100%" stopColor="#FCE2D2" />
            </linearGradient>

            {/* Anime Silky Hair Gradient: Deep cocoa to warm chestnut */}
            <linearGradient id="animeHair" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3A2219" />
              <stop offset="50%" stopColor="#4A2E23" />
              <stop offset="100%" stopColor="#2C1810" />
            </linearGradient>

            {/* Hair Highlight Sheen (Anime Ring Light) */}
            <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8A5A48" stopOpacity="0" />
              <stop offset="50%" stopColor="#E2A692" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#8A5A48" stopOpacity="0" />
            </linearGradient>

            {/* Anime Big Eye Gradient (Rich warm amber-hazel with starry depth) */}
            <linearGradient id="animeEyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A160F" />
              <stop offset="45%" stopColor="#78350F" />
              <stop offset="85%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>

            {/* Chic Rose Gold Anime Glasses */}
            <linearGradient id="animeGlasses" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>

            {/* Cute Pastel Sweater Gradient */}
            <linearGradient id="cuteSweater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Background Inside Frame */}
          <circle cx="100" cy="100" r="96" fill="#FDF8F5" />
          <circle cx="100" cy="100" r="92" fill="#FFF0F5" opacity="0.6" />

          {/* Background Sparkles & Pastel Polka Dots */}
          <circle cx="36" cy="50" r="2.5" fill="#FDE047" opacity="0.8" />
          <circle cx="165" cy="45" r="3" fill="#F472B6" opacity="0.8" />
          <circle cx="172" cy="130" r="2.5" fill="#C084FC" opacity="0.7" />
          <circle cx="28" cy="120" r="2" fill="#FDE047" opacity="0.8" />

          {/* BACK HAIR (Flowing Anime Twin Locks behind shoulders) */}
          <path
            d="M42 90 C25 125 30 170 52 195 C62 198 138 198 148 195 C170 170 175 125 158 90 C155 45 45 45 42 90 Z"
            fill="url(#animeHair)"
          />
          {/* Hair tips taper */}
          <path d="M35 140 Q30 165 48 185 Q40 160 38 140 Z" fill="#2C1810" />
          <path d="M165 140 Q170 165 152 185 Q160 160 162 140 Z" fill="#2C1810" />

          {/* CUTE ANIME OUTFIT (Pastel lavender cozy sweater with white collared shirt & bow) */}
          <path
            d="M48 200 C48 165 68 152 100 152 C132 152 152 165 152 200 Z"
            fill="url(#cuteSweater)"
          />
          {/* White Shirt Collar */}
          <path d="M85 152 L100 166 L78 162 Z" fill="#FFFFFF" />
          <path d="M115 152 L100 166 L122 162 Z" fill="#FFFFFF" />

          {/* Cute Little Pastel Pink Bow Tie */}
          <ellipse cx="94" cy="166" rx="5" ry="3.5" fill="#FB7185" transform="rotate(-15 94 166)" />
          <ellipse cx="106" cy="166" rx="5" ry="3.5" fill="#FB7185" transform="rotate(15 106 166)" />
          <circle cx="100" cy="166" r="3" fill="#F43F5E" />

          {/* Slender Anime Neck */}
          <path d="M90 134 L90 154 L110 154 L110 134 Z" fill="#FCE2D2" />
          {/* Soft neck shadow under chin */}
          <path d="M90 134 Q100 140 110 134 L110 140 Q100 146 90 140 Z" fill="#EDB69F" opacity="0.4" />

          {/* ANIME FACE (Gentle, soft tapered chin with cute cheek curve) */}
          <path
            d="M66 90 C66 122 80 145 100 145 C120 145 134 122 134 90 C134 60 120 52 100 52 C80 52 66 60 66 90 Z"
            fill="url(#animeSkin)"
          />

          {/* ANIME BLUSH (Cute pink ovals with adorable anime hatch lines ///) */}
          <ellipse cx="76" cy="112" rx="9" ry="5" fill="#FDA4AF" opacity="0.65" />
          <ellipse cx="124" cy="112" rx="9" ry="5" fill="#FDA4AF" opacity="0.65" />
          {/* Left hatch lines */}
          <line x1="72" y1="110" x2="74" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="76" y1="110" x2="78" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="80" y1="110" x2="82" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          {/* Right hatch lines */}
          <line x1="120" y1="110" x2="122" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="124" y1="110" x2="126" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="128" y1="110" x2="130" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

          {/* TINY CUTE ANIME NOSE */}
          <path d="M100 106 Q101 108 99 109" stroke="#E19D83" strokeWidth="1.8" strokeLinecap="round" />

          {/* CUTE ANIME MOUTH (Sweet happy smile with subtle rosy fill) */}
          <path
            d="M93 121 Q100 128 107 121"
            stroke="#9F1239"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="#FECDD3"
          />

          {/* BIG EXPRESSIVE ANIME EYES BEHIND GLASSES */}
          {isWinking ? (
            <>
              {/* Left Eye: Happy anime wink arc (^_~) */}
              <path
                d="M72 97 Q81 88 90 97"
                stroke="#2C1810"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M74 97 Q81 92 88 97"
                stroke="#FB7185"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Eye: Big glittering anime open eye */}
              <ellipse cx="118" cy="97" rx="8" ry="11" fill="url(#animeEyeGrad)" />
              {/* Pupil */}
              <ellipse cx="118" cy="98" rx="4.5" ry="6.5" fill="#180B07" />
              {/* Big primary glint reflection */}
              <ellipse cx="115" cy="93" rx="3.5" ry="4.5" fill="#FFFFFF" />
              {/* Smaller secondary twinkle reflection */}
              <circle cx="121" cy="102" r="2" fill="#FFFFFF" />
              <circle cx="116" cy="104" r="1.2" fill="#FDE047" />
              {/* Anime upper eyelid and long lashes */}
              <path
                d="M108 92 Q118 84 128 92"
                stroke="#2C1810"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M126 89 L129 86" stroke="#2C1810" strokeWidth="2.2" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye: Big glittering anime open eye */}
              <ellipse cx="82" cy="97" rx="8" ry="11" fill="url(#animeEyeGrad)" />
              {/* Pupil */}
              <ellipse cx="82" cy="98" rx="4.5" ry="6.5" fill="#180B07" />
              {/* Big primary glint reflection */}
              <ellipse cx="79" cy="93" rx="3.5" ry="4.5" fill="#FFFFFF" />
              {/* Smaller secondary twinkle reflection */}
              <circle cx="85" cy="102" r="2" fill="#FFFFFF" />
              <circle cx="80" cy="104" r="1.2" fill="#FDE047" />
              {/* Eyelid & lashes */}
              <path
                d="M72 92 Q82 84 92 92"
                stroke="#2C1810"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M74 89 L71 86" stroke="#2C1810" strokeWidth="2.2" strokeLinecap="round" />

              {/* Right Eye: Big glittering anime open eye */}
              <ellipse cx="118" cy="97" rx="8" ry="11" fill="url(#animeEyeGrad)" />
              {/* Pupil */}
              <ellipse cx="118" cy="98" rx="4.5" ry="6.5" fill="#180B07" />
              {/* Big primary glint reflection */}
              <ellipse cx="115" cy="93" rx="3.5" ry="4.5" fill="#FFFFFF" />
              {/* Smaller secondary twinkle reflection */}
              <circle cx="121" cy="102" r="2" fill="#FFFFFF" />
              <circle cx="116" cy="104" r="1.2" fill="#FDE047" />
              {/* Eyelid & lashes */}
              <path
                d="M108 92 Q118 84 128 92"
                stroke="#2C1810"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M126 89 L129 86" stroke="#2C1810" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}

          {/* Soft anime eyebrows */}
          <path d="M74 82 Q82 78 89 83" stroke="#4A2E23" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M111 83 Q118 78 126 82" stroke="#4A2E23" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* STYLISH ANIME GLASSES (Cute round-oversized anime frames with glint) */}
          {/* Bridge */}
          <path d="M94 96 Q100 93 106 96" stroke="url(#animeGlasses)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Left Frame */}
          <circle cx="82" cy="97" r="15" stroke="url(#animeGlasses)" strokeWidth="2.5" fill="white" fillOpacity="0.08" />
          {/* Left Lens Diagonal Anime Glint */}
          <path d="M74 88 L80 88" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <path d="M72 92 L76 92" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />

          {/* Right Frame */}
          <circle cx="118" cy="97" r="15" stroke="url(#animeGlasses)" strokeWidth="2.5" fill="white" fillOpacity="0.08" />
          {/* Right Lens Diagonal Anime Glint */}
          <path d="M110 88 L116 88" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <path d="M108 92 L112 92" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />

          {/* Glasses Frame Temples */}
          <path d="M67 96 L61 93" stroke="url(#animeGlasses)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M133 96 L139 93" stroke="url(#animeGlasses)" strokeWidth="2.2" strokeLinecap="round" />

          {/* ANIME FRONT BANGS & SIDE HAIR (Layered textured strands framing face) */}
          {/* Hair Sheen Halo */}
          <ellipse cx="100" cy="62" rx="34" ry="7" fill="url(#hairHighlight)" />

          {/* Left Side Lock */}
          <path
            d="M65 65 C62 82 58 108 67 122 C69 116 70 98 72 82 Z"
            fill="url(#animeHair)"
          />
          {/* Right Side Lock */}
          <path
            d="M135 65 C138 82 142 108 133 122 C131 116 130 98 128 82 Z"
            fill="url(#animeHair)"
          />

          {/* Front anime bangs with tapered tips */}
          <path
            d="M62 62 C70 42 130 42 138 62 C134 78 128 85 124 76 C118 88 112 88 108 75 C102 88 94 88 90 74 C86 85 80 84 76 72 C70 82 66 76 62 62 Z"
            fill="url(#animeHair)"
          />

          {/* Cute Anime Ahoge / Single Bouncy Sprout Strand on Top */}
          <path
            d="M100 48 Q106 32 116 34 Q106 38 102 48 Z"
            fill="#4A2E23"
          />

          {/* Cute Anime Yellow Star Hairclip */}
          <g transform="translate(126, 62) scale(0.9)">
            <path
              d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"
              fill="#FDE047"
              stroke="#F59E0B"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
          </g>

          {/* FESTIVE ANIME PARTY HAT (Toggled on click) */}
          {hasPartyHat && (
            <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
              <path
                d="M100 8 L82 48 L118 48 Z"
                fill="#F43F5E"
                stroke="#FEF08A"
                strokeWidth="2"
              />
              <path d="M86 38 L114 38" stroke="#FEF08A" strokeWidth="2.5" strokeDasharray="3,3" />
              <path d="M91 25 L109 25" stroke="#FEF08A" strokeWidth="2.5" strokeDasharray="3,3" />
              <circle cx="100" cy="7" r="6" fill="#FDE047" stroke="#F59E0B" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>

      {/* Floating Badge */}
      {showBadge && (
        <div
          onClick={handleAvatarClick}
          className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#F472B6] to-[#FDE047] text-[#4C0519] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
        >
          {hasPartyHat ? (
            <>
              <PartyPopper className="w-3.5 h-3.5 text-[#B91C1C]" />
              <span>Party Mode!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#9D174D]" />
              <span>Afreen-chan ✨</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
