import React, { useState } from 'react';
import {
  HeartHandshake,
  Sun,
  Sparkles,
  Gem,
  Compass,
  Globe,
  RotateCw,
  Award,
  CheckCircle,
  Plus,
} from 'lucide-react';
import { DEFAULT_APPRECIATION_CARDS } from '../config/birthdayData';
import { AppreciationCard } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';

export const AppreciationCards: React.FC = () => {
  const [cards, setCards] = useState<AppreciationCard[]>(() => {
    const saved = localStorage.getItem('afreen_appreciation_cards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_APPRECIATION_CARDS;
  });

  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const toggleCard = (id: string) => {
    soundSynth.playCardFlip();
    const willBeRevealed = !revealedIds[id];
    setRevealedIds((prev) => ({
      ...prev,
      [id]: willBeRevealed,
    }));
    if (willBeRevealed) {
      setTimeout(() => soundSynth.playSparkle(), 200);
    }
  };

  const revealAll = () => {
    soundSynth.playSparkle();
    const all: Record<string, boolean> = {};
    cards.forEach((c) => (all[c.id] = true));
    setRevealedIds(all);
  };

  const handleAddCard = () => {
    if (!newTitle.trim() || !newMessage.trim()) return;
    const newCard: AppreciationCard = {
      id: `card-${Date.now()}`,
      title: newTitle.trim(),
      message: newMessage.trim(),
      iconName: 'Sparkles',
      accentColor: '#DDD6FE',
    };
    const updated = [...cards, newCard];
    setCards(updated);
    localStorage.setItem('afreen_appreciation_cards', JSON.stringify(updated));
    setRevealedIds((prev) => ({ ...prev, [newCard.id]: true }));
    soundSynth.playSparkle();
    setNewTitle('');
    setNewMessage('');
    setShowAddModal(false);
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

  const revealedCount = Object.values(revealedIds).filter(Boolean).length;

  return (
    <section id="cards-section" className="relative min-h-screen py-20 px-4 max-w-6xl mx-auto select-none">
      {/* Heading */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF5FF] text-[#7E22CE] text-xs font-semibold tracking-wider uppercase border border-[#E9D5FF]">
          <Award className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>Interactive Deck of Cards</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2A1E38]">
          Reasons Why Afreen Is Special
        </h2>

        <p className="text-sm sm:text-base text-gray-600 font-sans max-w-lg mx-auto">
          A collection of genuine reminders about what makes you a remarkable person and an irreplaceable friend. Tap each card to reveal!
        </p>

        {/* Progress Tracker */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-xs border border-purple-100 text-xs font-medium text-purple-900">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>
              {revealedCount} of {cards.length} messages discovered
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={revealAll}
              className="px-3.5 py-1.5 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6B21A8] text-xs font-semibold transition cursor-pointer"
            >
              Flip All Cards ✨
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-medium transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-purple-600" />
              <span>Add Custom Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 perspective-1000">
        {cards.map((card, idx) => {
          const isRevealed = !!revealedIds[card.id];

          return (
            <div
              key={card.id}
              onClick={() => toggleCard(card.id)}
              className="relative h-72 cursor-pointer group"
            >
              {/* 3D Flipping Card Container */}
              <div
                className="relative w-full h-full transition-transform duration-700 preserve-3d"
                style={{
                  transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* FRONT SIDE (Mystery Card Deck Style) */}
                <div className="absolute inset-0 backface-hidden rounded-3xl p-6 bg-gradient-to-br from-white via-[#FCF9FE] to-[#F5EEFB] border-2 border-[#E9D5FF]/80 shadow-md flex flex-col justify-between group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                  {/* Decorative card number and corner pattern */}
                  <div className="flex items-center justify-between text-xs text-purple-400 font-serif font-bold">
                    <span>CARD #{String(idx + 1).padStart(2, '0')}</span>
                    <Sparkles className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition" />
                  </div>

                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${card.accentColor}30` }}
                    >
                      {renderIcon(card.iconName, 'w-8 h-8 text-[#6B21A8]')}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#2A1E38]">
                      {card.title}
                    </h3>

                    <p className="text-xs text-gray-500 font-sans">
                      Tap card to reveal reason ✨
                    </p>
                  </div>

                  <div className="flex items-center justify-center pt-2 border-t border-purple-50">
                    <span className="text-[11px] font-medium text-purple-600 flex items-center gap-1 group-hover:underline">
                      <RotateCw className="w-3 h-3" />
                      Flip Card
                    </span>
                  </div>
                </div>

                {/* BACK SIDE (Revealed Appreciation Message) */}
                <div
                  className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-7 shadow-xl flex flex-col justify-between text-center border-2 border-white/80"
                  style={{
                    background: `linear-gradient(135deg, #FAF5FF 0%, ${card.accentColor}40 100%)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-purple-900/60 font-sans">
                      Afreen's Superpower
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>

                  <div className="my-auto space-y-3">
                    <div className="w-10 h-10 mx-auto rounded-full bg-white/80 flex items-center justify-center shadow-xs">
                      {renderIcon(card.iconName, 'w-5 h-5 text-purple-700')}
                    </div>

                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#2D1B4E] leading-snug">
                      "{card.message}"
                    </p>

                    <p className="text-xs text-purple-800/80 font-sans">
                      Grateful for your presence in our lives!
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-purple-200/50 text-[11px] text-purple-600">
                    <span className="italic">Appreciation Card</span>
                    <span className="flex items-center gap-1 font-medium">
                      <RotateCw className="w-3 h-3" />
                      Tap to flip
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-purple-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Add New Appreciation Card
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Card Title</label>
                <input
                  type="text"
                  placeholder="e.g. Invaluable Perspective"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Friendly Appreciation Message
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. You always give the most thoughtful advice..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                disabled={!newTitle || !newMessage}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
