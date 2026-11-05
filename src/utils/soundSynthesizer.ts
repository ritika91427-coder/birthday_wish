/**
 * Pure Web Audio API Synthesizer for Afreen's Birthday Experience
 * Synthesizes sound effects and background music box tracks without any copyrighted files.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private activeBgmNodes: (AudioNode | number)[] = [];
  private currentTrack: 'birthday' | 'lullaby' = 'birthday';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public getCurrentTrack(): 'birthday' | 'lullaby' {
    return this.currentTrack;
  }

  public setTrack(track: 'birthday' | 'lullaby') {
    this.currentTrack = track;
    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
      this.startBackgroundMusic();
    }
  }

  // --- SOUND EFFECTS ---

  /** Soft paper envelope tear & magic sparkle chime */
  public playEnvelopeOpen() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // 1. Paper rustle noise
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.3);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.4);

      // 2. Rising magic harp bells
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.15 + idx * 0.08);

        gain.gain.setValueAtTime(0.18, now + 0.15 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7 + idx * 0.08);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + 0.15 + idx * 0.08);
        osc.stop(now + 0.75 + idx * 0.08);
      });
    } catch {
      // safe fallback
    }
  }

  /** Soft paper card flipping whoosh */
  public playCardFlip() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  /** Gentle puff when blowing candles */
  public playCandleBlow() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.7;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.linearRampToValueAtTime(200, now + 0.65);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.7);
    } catch {}
  }

  /** Confetti party popper */
  public playConfettiPop() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // Pop thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.16);

      // Sparkle crackle
      const chord = [784, 988, 1175, 1568];
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(freq, now + idx * 0.02);

        sGain.gain.setValueAtTime(0.12, now + idx * 0.02);
        sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4 + idx * 0.02);

        sOsc.connect(sGain);
        sGain.connect(this.sfxGain);
        sOsc.start(now + idx * 0.02);
        sOsc.stop(now + 0.45 + idx * 0.02);
      });
    } catch {}
  }

  /** Bursting celebratory firecrackers / crackers effect */
  public playFirecracker() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // Burst of rapid crackle pops
      const popCount = 7;
      for (let i = 0; i < popCount; i++) {
        const time = now + i * 0.06 + Math.random() * 0.02;

        // Snappy low-mid pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const startFreq = 220 + Math.random() * 140;
        osc.frequency.setValueAtTime(startFreq, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.06);

        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(time);
        osc.stop(time + 0.08);

        // High frequency sizzle
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * 0.5;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        noise.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noise.start(time);
        noise.stop(time + 0.06);
      }
    } catch {}
  }

  /** Triumphant wish granted celebration fanfare chime */
  public playWishGrantedFanfare() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // Celebration arpeggio: C5 -> G5 -> C6 -> E6 -> G6
      const fanfare = [
        { f: 523.25, t: 0, d: 0.3 },
        { f: 659.25, t: 0.12, d: 0.3 },
        { f: 783.99, t: 0.24, d: 0.3 },
        { f: 1046.5, t: 0.36, d: 0.8 },
        { f: 1318.5, t: 0.5, d: 0.9 },
        { f: 1567.98, t: 0.65, d: 1.5 },
      ];

      fanfare.forEach((n) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const oscTri = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        oscTri.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        oscTri.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

        osc.connect(gain);
        oscTri.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + n.t);
        oscTri.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.05);
        oscTri.stop(now + n.t + n.d + 0.05);
      });
    } catch {}
  }

  /** Gentle sparkling bell chime for buttons or card reveals */
  public playSparkle() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      const freqs = [880, 1174.66, 1318.51, 1760];
      freqs.forEach((f, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.12, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.45);
      });
    } catch {}
  }

  // --- BACKGROUND MUSIC ENGINE ---

  /** Start playing the background music box / warm acoustic chimes */
  public startBackgroundMusic() {
    this.initContext();
    if (!this.ctx || this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    if (this.currentTrack === 'birthday') {
      this.playBirthdayLoop();
    } else {
      this.playLullabyLoop();
    }
  }

  public stopBackgroundMusic() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.activeBgmNodes.forEach((node) => {
      if (typeof node === 'object' && 'stop' in node) {
        try {
          (node as AudioScheduledSourceNode).stop();
        } catch {}
      }
    });
    this.activeBgmNodes = [];
  }

  public toggleBackgroundMusic(): boolean {
    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  /** Play a music-box note */
  private playMusicBoxNote(freq: number, startTime: number, duration: number, volume: number = 0.14) {
    if (!this.ctx || !this.bgmGain) return;

    // Harmonic 1: Sine fundamental
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmonic 2: Soft triangle sparkle
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    gain1.gain.setValueAtTime(volume, startTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    gain2.gain.setValueAtTime(volume * 0.3, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(this.bgmGain);
    gain2.connect(this.bgmGain);

    osc1.start(startTime);
    osc2.start(startTime);

    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);

    this.activeBgmNodes.push(osc1, osc2);
  }

  /** Looping Happy Birthday Music Box */
  private playBirthdayLoop() {
    if (!this.ctx || !this.isBgmPlaying) return;
    const now = this.ctx.currentTime + 0.1;
    const tempo = 0.44; // seconds per beat

    // Melody: Note and beat duration
    // Standard notes in C major:
    // G4(392), A4(440), B4(493.88), C5(523.25), D5(587.33), E5(659.25), F5(698.46), G5(783.99)
    const melody: { f: number; beat: number; len: number }[] = [
      // Phrase 1: "Happy birthday to you"
      { f: 392.0, beat: 0, len: 0.75 },     // Hap-
      { f: 392.0, beat: 0.75, len: 0.25 },  // py
      { f: 440.0, beat: 1.0, len: 1.0 },    // birth-
      { f: 392.0, beat: 2.0, len: 1.0 },    // day
      { f: 523.25, beat: 3.0, len: 1.0 },   // to
      { f: 493.88, beat: 4.0, len: 2.0 },   // you

      // Phrase 2: "Happy birthday to you"
      { f: 392.0, beat: 6.5, len: 0.75 },   // Hap-
      { f: 392.0, beat: 7.25, len: 0.25 },  // py
      { f: 440.0, beat: 7.5, len: 1.0 },    // birth-
      { f: 392.0, beat: 8.5, len: 1.0 },    // day
      { f: 587.33, beat: 9.5, len: 1.0 },   // to
      { f: 523.25, beat: 10.5, len: 2.0 },  // you

      // Phrase 3: "Happy birthday dear Afreen"
      { f: 392.0, beat: 13.0, len: 0.75 },  // Hap-
      { f: 392.0, beat: 13.75, len: 0.25 }, // py
      { f: 783.99, beat: 14.0, len: 1.0 },  // birth-
      { f: 659.25, beat: 15.0, len: 1.0 },  // day
      { f: 523.25, beat: 16.0, len: 1.0 },  // dear
      { f: 493.88, beat: 17.0, len: 1.0 },  // Af-
      { f: 440.0, beat: 18.0, len: 1.5 },   // reen!

      // Phrase 4: "Happy birthday to you"
      { f: 698.46, beat: 20.0, len: 0.75 }, // Hap-
      { f: 698.46, beat: 20.75, len: 0.25 },// py
      { f: 659.25, beat: 21.0, len: 1.0 },  // birth-
      { f: 523.25, beat: 22.0, len: 1.0 },  // day
      { f: 587.33, beat: 23.0, len: 1.0 },  // to
      { f: 523.25, beat: 24.0, len: 2.5 },  // you~
    ];

    // Gentle chordal bass accompaniment (C, G, C, F, C, G, C)
    const accompaniment: { f: number; beat: number }[] = [
      { f: 261.63, beat: 0 }, { f: 329.63, beat: 1 }, { f: 392.0, beat: 2 },
      { f: 246.94, beat: 3 }, { f: 293.66, beat: 4 }, { f: 392.0, beat: 5 },
      { f: 246.94, beat: 6.5 }, { f: 293.66, beat: 8 }, { f: 392.0, beat: 9 },
      { f: 261.63, beat: 10.5 }, { f: 329.63, beat: 11.5 },
      { f: 261.63, beat: 13 }, { f: 329.63, beat: 14.5 }, { f: 392.0, beat: 16 },
      { f: 349.23, beat: 17 }, { f: 440.0, beat: 18.5 },
      { f: 349.23, beat: 20 }, { f: 261.63, beat: 21.5 }, { f: 293.66, beat: 23 },
      { f: 261.63, beat: 24 }, { f: 329.63, beat: 25 }, { f: 523.25, beat: 26 },
    ];

    melody.forEach((m) => {
      const startTime = now + m.beat * tempo;
      this.playMusicBoxNote(m.f, startTime, m.len * tempo * 1.5, 0.16);
    });

    accompaniment.forEach((a) => {
      const startTime = now + a.beat * tempo;
      this.playMusicBoxNote(a.f * 0.5, startTime, 1.2, 0.08); // warm bass octave
    });

    const totalSeconds = (28 * tempo) * 1000;
    this.bgmTimer = window.setTimeout(() => {
      if (this.isBgmPlaying && this.currentTrack === 'birthday') {
        this.playBirthdayLoop();
      }
    }, totalSeconds);
  }

  /** Cozy Friendship Lullaby Track (Warm ambient chords & twinkle) */
  private playLullabyLoop() {
    if (!this.ctx || !this.isBgmPlaying) return;
    const now = this.ctx.currentTime + 0.1;
    const tempo = 0.55;

    // Arpeggiated progression: Cmaj7 - Am9 - Fmaj7 - G6
    const chords = [
      // Cmaj7 (C, E, G, B)
      [261.63, 329.63, 392.0, 493.88, 523.25],
      // Am9 (A, C, E, G, B)
      [220.0, 261.63, 329.63, 392.0, 493.88],
      // Fmaj7 (F, A, C, E)
      [174.61, 220.0, 261.63, 329.63, 440.0],
      // G6 (G, B, D, E)
      [196.0, 246.94, 293.66, 329.63, 392.0],
    ];

    chords.forEach((chord, cIdx) => {
      const chordStart = now + cIdx * 4 * tempo;
      // Arpeggiate
      chord.forEach((note, nIdx) => {
        this.playMusicBoxNote(note, chordStart + nIdx * (tempo * 0.7), 2.2, 0.1);
        if (nIdx === 0) {
          // Warm root note
          this.playMusicBoxNote(note * 0.5, chordStart, 3.0, 0.09);
        }
      });
    });

    const totalSeconds = (16 * tempo) * 1000;
    this.bgmTimer = window.setTimeout(() => {
      if (this.isBgmPlaying && this.currentTrack === 'lullaby') {
        this.playLullabyLoop();
      }
    }, totalSeconds);
  }
}

export const soundSynth = new SoundSynthesizer();
