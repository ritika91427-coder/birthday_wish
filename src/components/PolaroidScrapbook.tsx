import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Image as ImageIcon, RotateCw, Trash2, Edit3, X, Check } from 'lucide-react';
import { MemoryPhoto } from '../types';
import { DEFAULT_PHOTOS } from '../config/birthdayData';
import { soundSynth } from '../utils/soundSynthesizer';

export const PolaroidScrapbook: React.FC = () => {
  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    const saved = localStorage.getItem('afreen_birthday_photos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_PHOTOS;
  });

  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<MemoryPhoto | null>(null);

  // New photo form state
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    localStorage.setItem('afreen_birthday_photos', JSON.stringify(photos));
  }, [photos]);

  const toggleFlip = (id: string) => {
    soundSynth.playCardFlip();
    setFlippedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!photoUrl.trim() || !caption.trim()) return;

    if (editingPhoto) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editingPhoto.id
            ? { ...p, url: photoUrl, caption, tag: tag || 'Memory' }
            : p
        )
      );
    } else {
      const newPhoto: MemoryPhoto = {
        id: `photo-${Date.now()}`,
        url: photoUrl,
        caption,
        tag: tag || 'Cozy memory',
        rotation: (Math.random() * 6 - 3),
      };
      setPhotos((prev) => [...prev, newPhoto]);
    }

    soundSynth.playSparkle();
    closeModal();
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const openEditModal = (photo: MemoryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPhoto(photo);
    setPhotoUrl(photo.url);
    setCaption(photo.caption);
    setTag(photo.tag || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPhoto(null);
    setPhotoUrl('');
    setCaption('');
    setTag('');
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all scrapbook photos to default templates?')) {
      setPhotos(DEFAULT_PHOTOS);
      localStorage.removeItem('afreen_birthday_photos');
      soundSynth.playSparkle();
    }
  };

  return (
    <section id="scrapbook-section" className="relative min-h-screen py-20 px-4 max-w-6xl mx-auto select-none">
      {/* Header */}
      <div className="text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold tracking-wider uppercase">
          <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Interactive Polaroid Scrapbook</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2A1E38]">
          Moments & Memories
        </h2>

        <p className="text-sm sm:text-base text-gray-600 font-sans max-w-xl mx-auto leading-relaxed">
          Tap any Polaroid to flip it and read the memory note behind it. You can also customize or upload your own favorite photos!
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setEditingPhoto(null);
              setPhotoUrl('');
              setCaption('');
              setTag('');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add / Replace Photo</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            Reset defaults
          </button>
        </div>
      </div>

      {/* POLAROID GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 perspective-1000">
        {photos.map((photo) => {
          const isFlipped = !!flippedIds[photo.id];
          const rot = photo.rotation || 0;

          return (
            <div
              key={photo.id}
              onClick={() => toggleFlip(photo.id)}
              className="relative cursor-pointer group"
              style={{
                transform: `rotate(${rot}deg)`,
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Tape on top of polaroid for authentic scrapbook realism */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#FEF08A]/75 backdrop-blur-2xs rounded-xs shadow-2xs rotate-[-2deg] z-20 pointer-events-none border-t border-white/40" />

              {/* 3D Flip Card Container */}
              <div
                className="relative w-full h-96 transition-transform duration-700 preserve-3d"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* FRONT SIDE (Polaroid Photograph) */}
                <div className="absolute inset-0 backface-hidden bg-white p-4 pb-6 rounded-2xl shadow-lg border border-[#E9D5FF]/60 flex flex-col justify-between group-hover:shadow-2xl transition-shadow">
                  {/* Photo area */}
                  <div className="relative w-full h-68 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {photo.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
                        {photo.tag}
                      </span>
                    )}

                    {/* Quick edit & delete triggers */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => openEditModal(photo, e)}
                        className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:text-purple-700 shadow-sm transition"
                        title="Edit photo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePhoto(photo.id, e)}
                        className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:text-rose-600 shadow-sm transition"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Polaroid handwritten-style front caption */}
                  <div className="pt-3 px-1 flex items-center justify-between text-gray-700">
                    <span className="font-handwriting text-xl text-[#3C2A54] truncate">
                      {photo.caption}
                    </span>
                    <span className="text-[11px] text-purple-600 font-sans flex items-center gap-1 opacity-60 group-hover:opacity-100">
                      <RotateCw className="w-3 h-3" />
                      Flip
                    </span>
                  </div>
                </div>

                {/* BACK SIDE (Handwritten Note & Friendship Message) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FFFDF9] p-6 rounded-2xl shadow-lg border border-[#F3E8FF] flex flex-col justify-between">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between border-b border-[#F3E8FF] pb-2">
                      <span className="text-xs font-serif font-bold text-[#6B21A8] uppercase tracking-wider">
                        Scrapbook Note
                      </span>
                      <span className="text-xs text-gray-400">✨ Afreen</span>
                    </div>

                    <p className="font-handwriting text-2xl text-[#2D2A26] leading-relaxed pt-2">
                      "{photo.caption}"
                    </p>

                    <p className="text-xs text-gray-500 font-sans leading-relaxed">
                      A quiet reminder of the wonderful person you are and the warm energy you share with everyone around you.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F5F3FF]">
                    <span className="text-[11px] text-gray-400 italic">Tap to flip back</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PHOTO EDIT / ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editingPhoto ? 'Edit Scrapbook Photo' : 'Add New Scrapbook Photo'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Image Preview / File upload */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Upload Image or Enter URL
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer mb-2"
                />
                <input
                  type="text"
                  placeholder="Or paste an image URL here..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-purple-500 text-xs"
                />
              </div>

              {photoUrl && (
                <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-100 border">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => alert('Unable to load preview with this URL.')}
                  />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Handwritten Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Good times, great friendship."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-purple-500 text-xs"
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Category Tag (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smiles & Sunshine"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-purple-500 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhoto}
                disabled={!photoUrl || !caption}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save to Scrapbook</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
