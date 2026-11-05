import React, { useState, useEffect, useRef } from 'react';
import { Pin, Plus, Sparkles, X, Check, Edit2, Trash2 } from 'lucide-react';
import { StickyNote } from '../types';
import { DEFAULT_STICKY_NOTES } from '../config/birthdayData';
import { soundSynth } from '../utils/soundSynthesizer';

export const MemoryCorkboard: React.FC = () => {
  const [notes, setNotes] = useState<StickyNote[]>(() => {
    const saved = localStorage.getItem('afreen_corkboard_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_STICKY_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<StickyNote | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [noteColor, setNoteColor] = useState<StickyNote['color']>('yellow');

  const boardRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('afreen_corkboard_notes', JSON.stringify(notes));
  }, [notes]);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    soundSynth.playSparkle();
    draggingRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: note.x,
      origY: note.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !boardRef.current) return;
    const { id, startX, startY, origX, origY } = draggingRef.current;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newX = Math.max(10, Math.min(origX + deltaX, 750));
          const newY = Math.max(10, Math.min(origY + deltaY, 420));
          return { ...n, x: newX, y: newY };
        }
        return n;
      })
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      draggingRef.current = null;
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;

    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...n, text: noteText.trim(), author: noteAuthor.trim() || 'Friend', color: noteColor }
            : n
        )
      );
    } else {
      const newNote: StickyNote = {
        id: `note-${Date.now()}`,
        text: noteText.trim(),
        author: noteAuthor.trim() || 'A thoughtful friend',
        color: noteColor,
        x: 60 + Math.random() * 200,
        y: 60 + Math.random() * 150,
        rotation: Math.random() * 8 - 4,
      };
      setNotes((prev) => [...prev, newNote]);
    }

    soundSynth.playSparkle();
    closeModal();
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const openEditModal = (note: StickyNote, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNote(note);
    setNoteText(note.text);
    setNoteAuthor(note.author);
    setNoteColor(note.color);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingNote(null);
    setNoteText('');
    setNoteAuthor('');
    setNoteColor('yellow');
  };

  const noteColorMap = {
    yellow: 'bg-[#FEF08A] text-[#713F12] border-[#FDE047]',
    lavender: 'bg-[#E9D5FF] text-[#581C87] border-[#D8B4FE]',
    peach: 'bg-[#FED7AA] text-[#7C2D12] border-[#FDBA74]',
    mint: 'bg-[#BBF7D0] text-[#14532D] border-[#86EFAC]',
    cream: 'bg-[#FEF9C3] text-[#78350F] border-[#FEF08A]',
  };

  const pinColorMap = {
    yellow: 'bg-[#EF4444]',
    lavender: 'bg-[#8B5CF6]',
    peach: 'bg-[#F97316]',
    mint: 'bg-[#10B981]',
    cream: 'bg-[#3B82F6]',
  };

  return (
    <section id="corkboard-section" className="relative min-h-screen py-20 px-4 max-w-6xl mx-auto select-none">
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold tracking-wider uppercase border border-[#FDE68A]">
          <Pin className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Interactive Memory Corkboard</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2A1E38]">
          Warm Notes for Afreen
        </h2>

        <p className="text-sm sm:text-base text-gray-600 font-sans max-w-lg mx-auto">
          Every note contains a genuine wish, compliment, or cheer. Drag them around the board or tap to read and add your own notes!
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setEditingNote(null);
              setNoteText('');
              setNoteAuthor('');
              setNoteColor('yellow');
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin New Sticky Note</span>
          </button>
        </div>
      </div>

      {/* THE CORKBOARD FRAME */}
      <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-r from-[#854D0E] via-[#A16207] to-[#854D0E] shadow-2xl border-4 border-[#713F12]">
        {/* Inner cork texture canvas */}
        <div
          ref={boardRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-[620px] sm:h-[580px] rounded-2xl overflow-hidden shadow-inner border border-[#78350F]/50 touch-none"
          style={{
            backgroundColor: '#D7A768',
            backgroundImage: `
              radial-gradient(#C28847 15%, transparent 16%),
              radial-gradient(#B87A38 15%, transparent 16%),
              linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.06) 75%),
              linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.04) 75%)
            `,
            backgroundSize: '24px 24px, 18px 18px, 40px 40px, 40px 40px',
            backgroundPosition: '0 0, 9px 9px, 0 0, 20px 20px',
          }}
        >
          {/* Subtle wood shadow vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(80,40,10,0.45)]" />

          {/* Decorative Corner Hanging Ribbons / Birthday Banner */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/80 backdrop-blur-2xs text-[11px] font-serif font-bold text-[#78350F] shadow-xs flex items-center gap-1.5 pointer-events-none z-10 border border-[#FEF08A]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pinned with Appreciative Thoughts • Drag any note!</span>
          </div>

          {/* DRAGGABLE STICKY NOTES */}
          {notes.map((note) => {
            const isZoomed = activeNoteId === note.id;

            return (
              <div
                key={note.id}
                onPointerDown={(e) => handlePointerDown(note.id, e)}
                onClick={() => {
                  soundSynth.playSparkle();
                  setActiveNoteId(isZoomed ? null : note.id);
                }}
                className={`absolute w-52 sm:w-60 p-4 rounded-xl shadow-lg border cursor-grab active:cursor-grabbing select-none transition-transform duration-200 ${
                  noteColorMap[note.color]
                } ${isZoomed ? 'scale-110 z-40 ring-4 ring-amber-400/50' : 'z-20 hover:scale-105'}`}
                style={{
                  left: `${note.x}px`,
                  top: `${note.y}px`,
                  transform: `rotate(${isZoomed ? 0 : note.rotation}deg)`,
                }}
              >
                {/* 3D PUSHPIN ON TOP */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full shadow-md border border-white ${
                      pinColorMap[note.color]
                    }`}
                  />
                  <div className="w-1 h-2 bg-gray-400 -mt-0.5 rounded-full" />
                </div>

                {/* Note Content */}
                <div className="space-y-2 pt-1 text-left">
                  <p className="font-handwriting text-xl leading-snug break-words">
                    {note.text}
                  </p>

                  <div className="flex items-center justify-between border-t border-black/10 pt-2 text-[11px] font-sans opacity-80">
                    <span className="italic">— {note.author}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => openEditModal(note, e)}
                        className="p-1 rounded hover:bg-black/10 transition cursor-pointer"
                        title="Edit note"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1 rounded hover:bg-black/10 transition cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT NOTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editingNote ? 'Edit Sticky Note' : 'Pin a New Note'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Message / Wish
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a sweet birthday wish, memory, or reminder..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-amber-500 font-handwriting text-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Author Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Your friend"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Paper Pastel Color
                </label>
                <div className="flex gap-2">
                  {(['yellow', 'lavender', 'peach', 'mint', 'cream'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNoteColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        noteColor === c ? 'ring-2 ring-black border-white' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor:
                          c === 'yellow'
                            ? '#FEF08A'
                            : c === 'lavender'
                            ? '#E9D5FF'
                            : c === 'peach'
                            ? '#FED7AA'
                            : c === 'mint'
                            ? '#BBF7D0'
                            : '#FEF9C3',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Pin to Corkboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
