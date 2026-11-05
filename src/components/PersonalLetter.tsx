import React, { useState } from 'react';
import { Mail, Edit3, Check, Copy, CheckCheck } from 'lucide-react';
import { DEFAULT_LETTER } from '../config/birthdayData';
import { soundSynth } from '../utils/soundSynthesizer';
import { AfreenAvatar } from './AfreenAvatar';

export const PersonalLetter: React.FC = () => {
  const [letterText, setLetterText] = useState<string>(() => {
    return localStorage.getItem('afreen_birthday_letter') || DEFAULT_LETTER;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    localStorage.setItem('afreen_birthday_letter', letterText);
    setIsEditing(false);
    soundSynth.playSparkle();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    soundSynth.playSparkle();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="letter-section" className="relative min-h-screen py-20 px-4 max-w-4xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-semibold tracking-wider uppercase border border-[#A7F3D0]">
          <Mail className="w-3.5 h-3.5 text-[#059669]" />
          <span>Personal Handwritten Letter</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2A1E38]">
          A Letter For Your New Chapter
        </h2>

        <p className="text-sm sm:text-base text-gray-600 font-sans max-w-md mx-auto">
          From one friend to another — some heartfelt words written with appreciation and utmost respect.
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs border border-gray-200 transition cursor-pointer"
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5 text-purple-600" />}
            <span>{isEditing ? 'Done Editing' : 'Customize Letter'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs border border-gray-200 transition cursor-pointer"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
          </button>
        </div>
      </div>

      {/* LUXURY STATIONERY LETTER */}
      <div className="relative mx-auto max-w-2xl">
        {/* Soft Shadow & Desk Mat */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#E9D5FF]/30 to-[#FED7AA]/30 rounded-3xl blur-xl -z-10" />

        {/* Letter Paper Container */}
        <div className="relative bg-[#FFFDF8] rounded-2xl p-8 sm:p-14 shadow-2xl border border-[#F3E8FF] overflow-hidden">
          {/* Subtle lined paper watermarking */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #E9D5FF 31px, #E9D5FF 32px)',
            }}
          />

          {/* Top Paper Header: Wax Seal & Date stamp */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#F5EDFA] pb-6 mb-6">
            <div className="flex items-center gap-3">
              <AfreenAvatar size="sm" showBadge={false} interactive={false} />
              <div>
                <p className="font-serif font-bold text-sm text-[#4C1D95]">Afreen's Birthday</p>
                <p className="text-[11px] text-gray-400">Written with warmth & admiration</p>
              </div>
            </div>

            {/* Elegant Purple Wax Seal */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7E22CE] to-[#A855F7] text-white flex items-center justify-center font-serif text-lg font-bold shadow-md border-2 border-[#FEF08A] ring-2 ring-purple-200">
              <span className="drop-shadow-xs">A</span>
            </div>
          </div>

          {/* Letter Body */}
          <div className="relative z-10">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  rows={12}
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  className="w-full p-4 rounded-xl border border-purple-200 focus:outline-hidden focus:border-purple-500 font-handwriting text-2xl leading-relaxed text-[#2D2A26] bg-[#FFFDF8]"
                />
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  Save Letter
                </button>
              </div>
            ) : (
              <div className="font-handwriting text-2xl sm:text-3xl text-[#242120] leading-relaxed whitespace-pre-line tracking-wide">
                {letterText}
              </div>
            )}
          </div>

          {/* Paper Footer with gentle ribbon */}
          <div className="relative z-10 mt-10 pt-6 border-t border-[#F5EDFA] flex items-center justify-between text-xs text-gray-400">
            <span className="font-serif italic">A genuine friendship surprise</span>
            <span>🎂 Happy Birthday Afreen</span>
          </div>
        </div>
      </div>
    </section>
  );
};
