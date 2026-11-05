import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Disc3 } from 'lucide-react';
import { soundSynth } from '../utils/soundSynthesizer';

export const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [currentTrack, setCurrentTrack] = useState<'birthday' | 'lullaby'>('birthday');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    // Keep local component state in sync with synth singleton
    const interval = setInterval(() => {
      setIsPlaying(soundSynth.getIsBgmPlaying());
      setIsMuted(soundSynth.getIsMuted());
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    const nextState = soundSynth.toggleBackgroundMusic();
    setIsPlaying(nextState);
    if (nextState) {
      soundSynth.playSparkle();
    }
  };

  const handleToggleMute = () => {
    const nextMute = soundSynth.toggleMute();
    setIsMuted(nextMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundSynth.setVolume(newVol);
  };

  const handleTrackSwitch = (track: 'birthday' | 'lullaby') => {
    setCurrentTrack(track);
    soundSynth.setTrack(track);
    soundSynth.playSparkle();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      <div className="relative">
        {/* Expanded Controls Panel */}
        {isExpanded && (
          <div className="absolute bottom-14 right-0 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#E9D5FF] p-4 text-xs space-y-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-[#F3E8FF] pb-2">
              <span className="font-serif font-bold text-sm text-[#4C1D95] flex items-center gap-1.5">
                <Music className="w-4 h-4 text-[#8B5CF6]" />
                Music & Audio
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 px-1 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Track Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Soundtrack
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleTrackSwitch('birthday')}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    currentTrack === 'birthday'
                      ? 'bg-[#E9D5FF] text-[#581C87] font-semibold border border-[#D8B4FE]'
                      : 'bg-[#F9F7F5] text-gray-600 hover:bg-[#F3E8FF]'
                  }`}
                >
                  <Disc3 className={`w-3.5 h-3.5 ${isPlaying && currentTrack === 'birthday' ? 'animate-spin' : ''}`} />
                  <span>Birthday Box</span>
                </button>
                <button
                  onClick={() => handleTrackSwitch('lullaby')}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    currentTrack === 'lullaby'
                      ? 'bg-[#E9D5FF] text-[#581C87] font-semibold border border-[#D8B4FE]'
                      : 'bg-[#F9F7F5] text-gray-600 hover:bg-[#F3E8FF]'
                  }`}
                >
                  <Disc3 className={`w-3.5 h-3.5 ${isPlaying && currentTrack === 'lullaby' ? 'animate-spin' : ''}`} />
                  <span>Cozy Lullaby</span>
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-gray-500">
                <span>Volume</span>
                <span>{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className="p-1 rounded text-gray-500 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-[#8B5CF6] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Sound FX test sparkle */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500 border-t border-[#F3E8FF]">
              <span>Synthesized with Web Audio</span>
              <button
                onClick={() => soundSynth.playSparkle()}
                className="text-[#7C3AED] hover:underline font-medium cursor-pointer"
              >
                Sparkle ✨
              </button>
            </div>
          </div>
        )}

        {/* Floating Pill Button */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[#E9D5FF] p-1.5 text-gray-700 hover:shadow-xl transition-all">
          <button
            onClick={handleTogglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isPlaying
                ? 'bg-[#8B5CF6] text-white shadow-md hover:bg-[#7C3AED]'
                : 'bg-[#F3E8FF] text-[#6D28D9] hover:bg-[#E9D5FF]'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 hover:text-[#581C87] flex items-center gap-1.5 cursor-pointer"
          >
            <Music className={`w-3.5 h-3.5 text-[#8B5CF6] ${isPlaying ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">
              {isPlaying ? (currentTrack === 'birthday' ? 'Birthday Song 🎵' : 'Cozy Chimes 🎵') : 'Music Off'}
            </span>
          </button>

          <button
            onClick={handleToggleMute}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-[#581C87] hover:bg-[#F3E8FF] transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
