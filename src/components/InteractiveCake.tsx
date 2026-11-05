import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Wind, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { soundSynth } from '../utils/soundSynthesizer';

export const InteractiveCake: React.FC = () => {
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishGranted, setWishGranted] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [blowLevel, setBlowLevel] = useState<number>(0);
  const [cakeFlavor, setCakeFlavor] = useState<'lavender' | 'velvet' | 'matcha'>('lavender');

  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  const extinguishCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setWishGranted(true);

    // Stop mic if active
    stopMicrophone();

    // 1. Play candle blow whoosh sound
    soundSynth.playCandleBlow();

    // 2. Play celebratory fanfare chime after puff
    setTimeout(() => {
      soundSynth.playWishGrantedFanfare();
    }, 450);

    // 3. Celebratory Confetti explosion
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#FDE047', '#D8B4FE', '#F472B6', '#38BDF8', '#4ADE80'],
    });

    // Extra sparkling bursts
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0.2, y: 0.7 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 0.8, y: 0.7 },
      });
    }, 400);
  };

  const relightCandles = () => {
    setCandlesLit(true);
    setWishGranted(false);
    setBlowLevel(0);
    soundSynth.playSparkle();
  };

  // Microphone blow detection
  const startMicrophone = async () => {
    try {
      setMicError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('Microphone not supported on this device. Please use the button below!');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListeningMic(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let sustainedBlow = 0;

      const detectBlow = () => {
        if (!analyserRef.current || !candlesLit) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Sum volume in lower and mid breath frequency bands
        let sum = 0;
        for (let i = 2; i < 20; i++) {
          sum += dataArray[i];
        }
        const average = sum / 18;
        const normalized = Math.min(100, (average / 140) * 100);
        setBlowLevel(normalized);

        // Threshold for human blowing into microphone
        if (average > 75) {
          sustainedBlow++;
          if (sustainedBlow > 4) {
            extinguishCandles();
            return;
          }
        } else {
          sustainedBlow = Math.max(0, sustainedBlow - 1);
        }

        animFrameRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch {
      setMicError('Microphone permission was denied. You can tap the "Blow Out Candles" button!');
      setIsListeningMic(false);
    }
  };

  const stopMicrophone = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListeningMic(false);
    setBlowLevel(0);
  };

  const toggleMicrophone = () => {
    if (isListeningMic) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  // Cake flavor styles
  const flavorStyles = {
    lavender: {
      tier1: 'from-[#F3E8FF] to-[#E9D5FF]',
      tier2: 'from-[#FAF5FF] to-[#F3E8FF]',
      tier3: 'from-[#EDE9FE] to-[#DDD6FE]',
      frosting: '#8B5CF6',
      drip: '#C4B5FD',
      pearl: '#FAF5FF',
    },
    velvet: {
      tier1: 'from-[#FFE4E6] to-[#FECDD3]',
      tier2: 'from-[#FFF1F2] to-[#FFE4E6]',
      tier3: 'from-[#FCE7F3] to-[#FBCFE8]',
      frosting: '#F43F5E',
      drip: '#FDA4AF',
      pearl: '#FFF1F2',
    },
    matcha: {
      tier1: 'from-[#DCFCE7] to-[#BBF7D0]',
      tier2: 'from-[#F0FDF4] to-[#DCFCE7]',
      tier3: 'from-[#E0E7FF] to-[#C7D2FE]',
      frosting: '#10B981',
      drip: '#86EFAC',
      pearl: '#FEF9C3',
    },
  }[cakeFlavor];

  return (
    <section id="cake-section" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-transparent via-[#F7F2FA] to-transparent">
      <div className="max-w-2xl w-full mx-auto text-center space-y-6">
        {/* Section Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#6B21A8] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Centerpiece Moment</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2A1E38]">
            Make a Wish, Afreen!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-sans max-w-md mx-auto">
            Close your eyes, think of the happiest wish for your upcoming year, and blow out the candles!
          </p>
        </div>

        {/* Cake Flavor Selector (Custom Delight) */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-gray-400 font-medium">Flavor Frosting:</span>
          <button
            onClick={() => setCakeFlavor('lavender')}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
              cakeFlavor === 'lavender'
                ? 'bg-[#E9D5FF] text-[#581C87] font-semibold border border-[#D8B4FE]'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Lavender Cream 🪻
          </button>
          <button
            onClick={() => setCakeFlavor('velvet')}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
              cakeFlavor === 'velvet'
                ? 'bg-[#FFE4E6] text-[#9F1239] font-semibold border border-[#FDA4AF]'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Rose Berry 🍓
          </button>
          <button
            onClick={() => setCakeFlavor('matcha')}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
              cakeFlavor === 'matcha'
                ? 'bg-[#DCFCE7] text-[#166534] font-semibold border border-[#86EFAC]'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sweet Matcha 🍵
          </button>
        </div>

        {/* 3D CAKE DISPLAY */}
        <div className="relative py-8 flex flex-col items-center justify-center perspective-1500 select-none">
          {/* Ambient Cake Table Glow */}
          <div className="absolute bottom-6 w-80 h-16 bg-[#581C87]/10 rounded-full blur-2xl -z-10" />

          {/* Three Tier Cake Structure */}
          <div className="relative flex flex-col items-center">
            {/* CANDLES ON TOP */}
            <div className="relative z-30 flex items-end justify-center gap-5 sm:gap-7 mb-0">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Candle Flame / Smoke */}
                  {candlesLit ? (
                    <div
                      onClick={extinguishCandles}
                      className="relative cursor-pointer group p-1"
                      title="Tap flame or blow into mic to extinguish!"
                    >
                      {/* Flickering Outer Flame Glow */}
                      <div className="w-5 h-8 bg-gradient-to-t from-[#F59E0B] via-[#FBBF24] to-[#FEF08A] rounded-full animate-flame shadow-[0_0_15px_#F59E0B,0_0_25px_#FBBF24]" />
                      {/* Inner Blue Core */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-3 bg-blue-300 rounded-full opacity-70" />
                    </div>
                  ) : (
                    /* Smoke particles after blowing */
                    <div className="w-5 h-10 flex flex-col items-center justify-end">
                      <div className="w-2 h-2 rounded-full bg-gray-400/60 animate-ping" />
                      <div className="w-1.5 h-6 bg-gradient-to-t from-gray-500/40 to-transparent rounded-full opacity-60 animate-pulse" />
                    </div>
                  )}

                  {/* Candle Wick */}
                  <div className="w-0.5 h-2.5 bg-gray-700" />

                  {/* Candle Cylinder */}
                  <div
                    className={`w-3.5 h-12 rounded-t-sm shadow-xs border-x border-white/50 ${
                      idx === 1
                        ? 'bg-gradient-to-r from-[#FDE047] via-[#FEF08A] to-[#FACC15]'
                        : 'bg-gradient-to-r from-[#DDD6FE] via-[#EDE9FE] to-[#C4B5FD]'
                    }`}
                  >
                    {/* Candle spiral stripes */}
                    <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,#FFFFFF_3px,#FFFFFF_6px)]" />
                  </div>
                </div>
              ))}
            </div>

            {/* TOP TIER (Smallest) */}
            <div className="relative z-20 flex flex-col items-center">
              {/* Top frosting edge with decorative piping & berries */}
              <div className="w-36 sm:w-44 h-5 rounded-full bg-white shadow-xs border-b border-[#F3E8FF] flex items-center justify-around px-2">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full shadow-2xs"
                    style={{ backgroundColor: flavorStyles.frosting }}
                  />
                ))}
              </div>

              {/* Top Layer Body */}
              <div
                className={`w-32 sm:w-40 h-14 rounded-b-xl bg-gradient-to-b ${flavorStyles.tier3} shadow-md border-x border-b border-white/70 relative overflow-hidden`}
              >
                {/* Frosting Drips */}
                <div className="absolute top-0 inset-x-0 flex justify-around">
                  <div className="w-3 h-5 rounded-b-full bg-white opacity-80" />
                  <div className="w-4 h-7 rounded-b-full bg-white opacity-90" />
                  <div className="w-3 h-4 rounded-b-full bg-white opacity-80" />
                  <div className="w-4 h-6 rounded-b-full bg-white opacity-90" />
                  <div className="w-3 h-5 rounded-b-full bg-white opacity-80" />
                </div>
                {/* Cake Texture Lines */}
                <div className="absolute bottom-2 inset-x-3 h-0.5 bg-white/40" />
              </div>
            </div>

            {/* MIDDLE TIER */}
            <div className="relative z-10 -mt-2 flex flex-col items-center">
              {/* Frosting pearls */}
              <div className="w-52 sm:w-60 h-6 rounded-full bg-white shadow-xs border-b border-[#F3E8FF] flex items-center justify-around px-3">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full shadow-2xs"
                    style={{ backgroundColor: i % 2 === 0 ? flavorStyles.drip : '#FEF08A' }}
                  />
                ))}
              </div>

              {/* Middle Layer Body */}
              <div
                className={`w-48 sm:w-56 h-16 rounded-b-xl bg-gradient-to-b ${flavorStyles.tier2} shadow-md border-x border-b border-white/70 relative overflow-hidden`}
              >
                {/* Decorative Swag piping */}
                <div className="absolute inset-x-4 top-2 flex justify-between opacity-60">
                  <span className="text-xs">✨</span>
                  <span className="text-xs font-serif italic text-purple-900/60 font-semibold">AFREEN</span>
                  <span className="text-xs">✨</span>
                </div>
                <div className="absolute bottom-3 inset-x-4 h-0.5 bg-white/40" />
              </div>
            </div>

            {/* BASE TIER (Largest) */}
            <div className="relative z-0 -mt-2 flex flex-col items-center">
              {/* Base frosting trim */}
              <div className="w-68 sm:w-80 h-7 rounded-full bg-white shadow-xs border-b border-[#F3E8FF] flex items-center justify-around px-4">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full shadow-2xs"
                    style={{ backgroundColor: flavorStyles.frosting }}
                  />
                ))}
              </div>

              {/* Base Layer Body */}
              <div
                className={`w-64 sm:w-76 h-20 rounded-b-2xl bg-gradient-to-b ${flavorStyles.tier1} shadow-lg border-x border-b border-white/80 relative overflow-hidden`}
              >
                {/* Gold floral decorative pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7C3AED_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="absolute bottom-4 inset-x-6 flex items-center justify-center gap-2 text-xs text-purple-950 font-medium">
                  <span>🎂 May Your Year Be Blessed With Joy 🎂</span>
                </div>
              </div>
            </div>

            {/* CAKE STAND / PLATTER */}
            <div className="relative -mt-2 flex flex-col items-center">
              <div className="w-76 sm:w-92 h-5 rounded-full bg-gradient-to-r from-[#F1F5F9] via-[#FFFFFF] to-[#E2E8F0] shadow-md border border-gray-200" />
              <div className="w-24 sm:w-32 h-6 bg-gradient-to-b from-[#E2E8F0] to-[#CBD5E1] rounded-b-md shadow-xs" />
              <div className="w-40 sm:w-48 h-3 rounded-full bg-gradient-to-r from-[#CBD5E1] via-[#E2E8F0] to-[#CBD5E1] shadow-md" />
            </div>
          </div>
        </div>

        {/* WISH GRANTED BANNER / REVEAL */}
        {wishGranted ? (
          <div className="bg-gradient-to-r from-[#FAF5FF] via-white to-[#FFFBEB] p-6 rounded-3xl border-2 border-[#D8B4FE] shadow-xl text-center space-y-3 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>WISH REGISTERED IN THE UNIVERSE</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#581C87] tracking-tight">
              ✨ WISH GRANTED! ✨
            </h3>

            <p className="text-gray-700 font-sans text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              May every single dream, goal, and quiet hope you held in your heart while blowing those candles find its way to you this year, Afreen!
            </p>

            <div className="pt-2">
              <button
                onClick={relightCandles}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6B21A8] font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Relight Candles & Wish Again</span>
              </button>
            </div>
          </div>
        ) : (
          /* INTERACTION CONTROLS */
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Primary Blow Button */}
              <button
                onClick={extinguishCandles}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#9333EA] via-[#7C3AED] to-[#A855F7] text-white font-semibold text-sm shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Wind className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>Blow Out Candles 💨</span>
              </button>

              {/* Microphone detection button */}
              <button
                onClick={toggleMicrophone}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  isListeningMic
                    ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#B91C1C] animate-pulse'
                    : 'bg-white border-[#E9D5FF] text-[#6D28D9] hover:bg-[#FAF5FF]'
                }`}
              >
                {isListeningMic ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Stop Mic (Listening for your breath...)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-purple-600" />
                    <span>Blow with Real Microphone 🎙️</span>
                  </>
                )}
              </button>
            </div>

            {/* Mic blow meter when listening */}
            {isListeningMic && (
              <div className="max-w-xs mx-auto space-y-1">
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>Breath detector:</span>
                  <span>{blowLevel > 60 ? 'Blowing detected!' : 'Blow into your mic now!'}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-600 h-full transition-all duration-100"
                    style={{ width: `${blowLevel}%` }}
                  />
                </div>
              </div>
            )}

            {micError && (
              <p className="text-xs text-amber-700 bg-amber-50 py-1.5 px-3 rounded-lg max-w-sm mx-auto">
                {micError}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
