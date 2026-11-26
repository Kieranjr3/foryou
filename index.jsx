import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  Music,
  VolumeX,
  Sparkles,
  RotateCcw,
  MailOpen,
  Mail,
  Edit3,
  Check,
  Send
} from 'lucide-react';

/**
 * ============================================================================
 * 💌 EASY CUSTOMIZATION SETTINGS (EDIT THESE TO PERSONALIZE YOUR CARD!)
 * ============================================================================
 */
const RECIPIENT_NAME = 'My Love';
const SENDER_NAME = 'Your Secret Admirer';

const LOVE_LETTER_PARAGRAPHS = [
  "From the moment you came into my life, every ordinary day started feeling a little brighter, warmer, and infinitely sweeter.",
  "You have the kindest heart, the most contagious laugh, and a way of making me smile even when we're miles apart. Being around you is effortlessly my favorite place to be.",
  "Thank you for saying yes and making me the happiest person today. Here's to endless laughs, cozy dates, and making our favorite memories together."
];

const NO_BUTTON_PLEAS = [
  'No',
  'Are you sure?',
  'Pookie please...',
  "Don't break my heart 😿",
  'Pretty please with a cherry on top?',
  'I’ll give you extra cuddles!',
  'Even the kitty is crying now...',
  'Okay, now you have to click Yes!'
];

/**
 * ============================================================================
 * 🎵 WEB AUDIO API: WARM MUSIC-BOX SYNTHESIZER (ZERO EXTERNAL MP3s)
 * ============================================================================
 */
class RomanticMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;

    // Gentle romantic Fmaj7 -> Cmaj7 -> Dm7 -> Bbmaj7 music-box arpeggio (Hz)
    this.notes = [
      659.25, // E5
      783.99, // G5
      987.77, // B5
      880.00, // A5
      783.99, // G5
      659.25, // E5
      587.33, // D5
      659.25, // E5
      523.25, // C5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      698.46, // F5
      587.33, // D5
      523.25, // C5
      493.88  // B4
    ];

    this.bassNotes = [
      174.61, null, null, null, // F3
      130.81, null, null, null, // C3
      146.83, null, null, null, // D3
      116.54, null, null, null  // Bb2
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.22;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 2100;

      // Soft stereo-feel echo delay
      this.delay = this.ctx.createDelay();
      this.delay.delayTime.value = 0.36;

      this.feedback = this.ctx.createGain();
      this.feedback.gain.value = 0.32;

      this.delay.connect(this.feedback);
      this.feedback.connect(this.delay);

      this.filter.connect(this.masterGain);
      this.filter.connect(this.delay);
      this.delay.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  triggerChime(freq, duration = 1.9, volume = 0.26) {
    if (!this.ctx || !freq) return;
    const now = this.ctx.currentTime;

    const fundamental = this.ctx.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(freq, now);

    // Delicate bell overtone
    const overtone = this.ctx.createOscillator();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const env = this.ctx.createGain();
    const overtoneEnv = this.ctx.createGain();

    // ADSR Envelope
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(volume, now + 0.02); // Attack
    env.gain.exponentialRampToValueAtTime(volume * 0.45, now + 0.28); // Decay -> Sustain
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Release

    overtoneEnv.gain.setValueAtTime(0.0001, now);
    overtoneEnv.gain.linearRampToValueAtTime(volume * 0.16, now + 0.015);
    overtoneEnv.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.45);

    fundamental.connect(env);
    overtone.connect(overtoneEnv);
    env.connect(this.filter);
    overtoneEnv.connect(this.filter);

    fundamental.start(now);
    overtone.start(now);
    fundamental.stop(now + duration + 0.05);
    overtone.stop(now + duration + 0.05);
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;

    const loop = () => {
      if (!this.isPlaying) return;
      const idx = this.step % this.notes.length;
      this.triggerChime(this.notes[idx], 1.85, 0.23);

      const bass = this.bassNotes[idx];
      if (bass) {
        this.triggerChime(bass, 2.5, 0.14);
      }

      this.step++;
      this.timer = setTimeout(loop, 520);
    };

    loop();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

/**
 * ============================================================================
 * 🌸 AMBIENT FLOATING PASTEL HEARTS BACKGROUND
 * ============================================================================
 */
const AmbientFloatingHearts = () => {
  const hearts = useRef(
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.7 + 3) % 96}%`,
      size: 14 + (i % 4) * 6,
      duration: 13 + (i % 5) * 3.5,
      delay: -(i * 1.4),
      opacity: 0.22 + (i % 3) * 0.1,
      color: ['#F48B94', '#F8B4C4', '#E87480', '#FAD0D8'][i % 4]
    }))
  ).current;

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute -bottom-12 animate-ambient-rise"
          style={{
            left: h.left,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            color: h.color
          }}
        >
          <Heart
            className="fill-current"
            style={{ width: `${h.size}px`, height: `${h.size}px` }}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * 🎉 CELEBRATORY CONFETTI & HEARTS OVERLAY
 * ============================================================================
 */
const CelebrationOverlay = ({ active }) => {
  if (!active) return null;

  const pieces = Array.from({ length: 42 }).map((_, i) => {
    const angle = (i / 42) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const distance = 110 + Math.random() * 260;
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance - 60,
      rot: Math.random() * 540 - 270,
      scale: 0.75 + Math.random() * 0.75,
      delay: Math.random() * 140,
      isHeart: i % 2 === 0,
      color: ['#F48B94', '#E87480', '#FF6B8B', '#FFD166', '#80ED99', '#FFB5C2'][
        i % 6
      ]
    };
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute animate-celebration-pop"
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}ms`,
            color: p.color
          }}
        >
          {p.isHeart ? (
            <Heart
              className="fill-current drop-shadow-xs"
              style={{ width: `${20 * p.scale}px`, height: `${20 * p.scale}px` }}
            />
          ) : (
            <span
              className="block rounded-sm shadow-2xs"
              style={{
                width: `${10 * p.scale}px`,
                height: `${6 * p.scale}px`,
                backgroundColor: p.color
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * 🐱 KAWAII CARTOON CAT MASCOT (DYNAMIC EXPRESSIONS & SPRING REACTIONS)
 * ============================================================================
 * Moods:
 * - 'neutral': Sweet :3 smile, rosy cheeks, floating heart
 * - 'sad': Teary pleading puppy-dog eyes & wobbly frown when 'No' is clicked
 * - 'heartEyes': Pure joy with big heart-eyes when 'Yes' is hovered!
 * - 'happy': Squishy closed happy arcs + sparkles when petted/clicked!
 */
const KawaiiCatMascot = ({ mood, onPet }) => {
  const [earTwitch, setEarTwitch] = useState(false);
  const [petHearts, setPetHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEarTwitch(true);
      setTimeout(() => setEarTwitch(false), 300);
    }, 3400);
    return () => clearInterval(interval);
  }, []);

  const handleCatClick = () => {
    setEarTwitch(true);
    setTimeout(() => setEarTwitch(false), 320);

    const burst = Array.from({ length: 6 }).map((_, idx) => ({
      id: Date.now() + idx + Math.random(),
      tx: (Math.random() - 0.5) * 110,
      ty: -45 - Math.random() * 55,
      scale: 0.75 + Math.random() * 0.5,
      delay: idx * 55
    }));
    setPetHearts((prev) => [...prev.slice(-12), ...burst]);
    onPet();
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Floating Heart Above Head */}
      <div
        className={`mb-1 transition-all duration-300 ${
          mood === 'sad'
            ? 'opacity-45 scale-90 translate-y-1 text-[#9E8B90]'
            : mood === 'heartEyes'
            ? 'opacity-100 scale-125 -translate-y-1 text-[#E85D75]'
            : 'opacity-95 scale-100 animate-float-bob text-[#F48B94]'
        }`}
      >
        <Heart className="w-8 h-8 fill-current drop-shadow-xs" />
      </div>

      {/* Petting Heart Particles */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
        {petHearts.map((p) => (
          <span
            key={p.id}
            onAnimationEnd={() =>
              setPetHearts((prev) => prev.filter((item) => item.id !== p.id))
            }
            className="absolute animate-pet-heart text-[#F48B94]"
            style={{
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              animationDelay: `${p.delay}ms`
            }}
          >
            <Heart
              className="fill-current"
              style={{ width: `${18 * p.scale}px`, height: `${18 * p.scale}px` }}
            />
          </span>
        ))}
      </div>

      {/* Interactive Kawaii Cat Button */}
      <button
        type="button"
        onClick={handleCatClick}
        aria-label="Pet the cute kawaii cat"
        className={`group relative cursor-pointer focus:outline-none rounded-full p-1.5 sm:p-2 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 hover:scale-105 ${
          mood === 'sad'
            ? 'animate-sad-droop'
            : mood === 'heartEyes'
            ? 'scale-105 animate-excited-bounce'
            : 'animate-gentle-bounce'
        }`}
      >
        {/* Soft Blush Aura Behind Cat */}
        <div
          className={`absolute inset-4 rounded-full blur-xl transition-colors duration-500 ${
            mood === 'sad'
              ? 'bg-[#CBD5E1]/50'
              : mood === 'heartEyes'
              ? 'bg-[#F48B94]/45'
              : 'bg-[#F8B4C4]/35'
          }`}
        />

        <svg
          viewBox="0 0 240 215"
          className="relative z-10 w-36 h-32 xs:w-40 xs:h-36 sm:w-52 sm:h-46 overflow-visible drop-shadow-sm"
        >
          {/* Swishing Cute Tail */}
          <path
            d="M 176 164 Q 214 152 208 118 Q 204 98 190 108"
            fill="none"
            stroke="#4A353B"
            strokeWidth="13"
            strokeLinecap="round"
            className="origin-[176px_164px] transition-transform duration-500 group-hover:rotate-12"
          />
          <path
            d="M 176 164 Q 214 152 208 118 Q 204 98 190 108"
            fill="none"
            stroke="#FFFDFB"
            strokeWidth="7"
            strokeLinecap="round"
            className="origin-[176px_164px] transition-transform duration-500 group-hover:rotate-12"
          />

          {/* Chunky Chibi Body */}
          <ellipse
            cx="120"
            cy="158"
            rx="66"
            ry="44"
            fill="#FFFDFB"
            stroke="#4A353B"
            strokeWidth="3.8"
          />

          {/* Cute Pink Belly Patch */}
          <ellipse cx="120" cy="164" rx="40" ry="26" fill="#FDE8EC" />

          {/* Left Ear */}
          <g
            className={`origin-[72px_72px] transition-transform duration-200 ${
              mood === 'sad'
                ? '-rotate-18'
                : earTwitch
                ? '-rotate-12'
                : 'rotate-0'
            }`}
          >
            <path
              d="M 52 80 L 42 26 L 94 56 Z"
              fill="#FFFDFB"
              stroke="#4A353B"
              strokeWidth="3.8"
              strokeLinejoin="round"
            />
            <path d="M 57 71 L 50 38 L 83 57 Z" fill="#F8B4C4" />
          </g>

          {/* Right Ear */}
          <g
            className={`origin-[168px_72px] transition-transform duration-200 ${
              mood === 'sad'
                ? 'rotate-18'
                : earTwitch
                ? 'rotate-12'
                : 'rotate-0'
            }`}
          >
            <path
              d="M 188 80 L 198 26 L 146 56 Z"
              fill="#FFFDFB"
              stroke="#4A353B"
              strokeWidth="3.8"
              strokeLinejoin="round"
            />
            <path d="M 183 71 L 190 38 L 157 57 Z" fill="#F8B4C4" />
          </g>

          {/* Chunky Chibi Head */}
          <ellipse
            cx="120"
            cy="102"
            rx="72"
            ry="55"
            fill="#FFFDFB"
            stroke="#4A353B"
            strokeWidth="3.8"
          />

          {/* Soft Pastel Ear-Stripe Accent */}
          <path
            d="M 112 48 L 120 63 L 128 48"
            fill="none"
            stroke="#F8B4C4"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Rosy Blushing Cheeks */}
          <ellipse
            cx="74"
            cy="114"
            rx="12"
            ry="7.5"
            fill="#F48B94"
            opacity={mood === 'heartEyes' || mood === 'happy' ? '0.85' : '0.55'}
          />
          <ellipse
            cx="166"
            cy="114"
            rx="12"
            ry="7.5"
            fill="#F48B94"
            opacity={mood === 'heartEyes' || mood === 'happy' ? '0.85' : '0.55'}
          />

          {/* ==============================================================
              DYNAMIC EYES BY MOOD
             ============================================================== */}
          {mood === 'heartEyes' ? (
            /* HEART EYES (Hovering Yes!) */
            <>
              <path
                d="M 88 106 C 76 97 73 87 80 82 C 84 79 88 83 88 86 C 88 83 92 79 96 82 C 103 87 100 97 88 106 Z"
                fill="#E85D75"
                stroke="#4A353B"
                strokeWidth="2.4"
              />
              <path
                d="M 152 106 C 140 97 137 87 144 82 C 148 79 152 83 152 86 C 152 83 156 79 160 82 C 167 87 164 97 152 106 Z"
                fill="#E85D75"
                stroke="#4A353B"
                strokeWidth="2.4"
              />
            </>
          ) : mood === 'sad' ? (
            /* TEARY PLEADING PUPPY EYES (Clicked No!) */
            <>
              {/* Pleading Droopy Eyebrows */}
              <path
                d="M 74 84 L 96 78"
                stroke="#4A353B"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 166 84 L 144 78"
                stroke="#4A353B"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Big Shiny Teary Eyes */}
              <circle cx="88" cy="98" r="10.5" fill="#4A353B" />
              <circle cx="84.5" cy="94" r="3.8" fill="#FFFFFF" />
              <circle cx="92" cy="102" r="2" fill="#FFFFFF" />

              <circle cx="152" cy="98" r="10.5" fill="#4A353B" />
              <circle cx="148.5" cy="94" r="3.8" fill="#FFFFFF" />
              <circle cx="156" cy="102" r="2" fill="#FFFFFF" />

              {/* Shimmering Teardrops */}
              <path
                d="M 74 106 Q 68 117 74 121 Q 80 117 74 106 Z"
                fill="#7DD3FC"
                stroke="#4A353B"
                strokeWidth="1.5"
              />
              <path
                d="M 166 106 Q 160 117 166 121 Q 172 117 166 106 Z"
                fill="#7DD3FC"
                stroke="#4A353B"
                strokeWidth="1.5"
              />
            </>
          ) : mood === 'happy' ? (
            /* SQUISHY HAPPY ARCS + SPARKLES (Petted!) */
            <>
              <path
                d="M 77 100 Q 88 86 99 100"
                fill="none"
                stroke="#4A353B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 141 100 Q 152 86 163 100"
                fill="none"
                stroke="#4A353B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Sparkle Stars */}
              <path
                d="M 46 66 L 49 73 L 56 76 L 49 79 L 46 86 L 43 79 L 36 76 L 43 73 Z"
                fill="#FBBF24"
              />
              <path
                d="M 194 66 L 197 73 L 204 76 L 197 79 L 194 86 L 191 79 L 184 76 L 191 73 Z"
                fill="#FBBF24"
              />
            </>
          ) : (
            /* DEFAULT SWEET KAWAII EYES */
            <>
              <circle cx="88" cy="97" r="8.5" fill="#4A353B" />
              <circle cx="85" cy="93.5" r="3" fill="#FFFFFF" />
              <circle cx="152" cy="97" r="8.5" fill="#4A353B" />
              <circle cx="149" cy="93.5" r="3" fill="#FFFFFF" />
            </>
          )}

          {/* Little Pink Triangle Nose */}
          <path
            d="M 115 107 L 125 107 L 120 113 Z"
            fill="#F48B94"
            stroke="#4A353B"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Cute :3 Mouth (or Wobbly Frown when Sad) */}
          {mood === 'sad' ? (
            <path
              d="M 108 124 Q 114 118 120 122 Q 126 118 132 124"
              fill="none"
              stroke="#4A353B"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 108 117 Q 114 124 120 116 Q 126 124 132 117"
              fill="none"
              stroke="#4A353B"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          )}

          {/* Whiskers */}
          <g stroke="#4A353B" strokeWidth="2.4" strokeLinecap="round" opacity="0.75">
            <line x1="36" y1="98" x2="56" y2="102" />
            <line x1="34" y1="112" x2="55" y2="111" />
            <line x1="204" y1="98" x2="184" y2="102" />
            <line x1="206" y1="112" x2="185" y2="111" />
          </g>

          {/* Cute Little Paws */}
          <ellipse
            cx="94"
            cy="192"
            rx="16"
            ry="11"
            fill="#FFFDFB"
            stroke="#4A353B"
            strokeWidth="3.5"
          />
          <ellipse
            cx="146"
            cy="192"
            rx="16"
            ry="11"
            fill="#FFFDFB"
            stroke="#4A353B"
            strokeWidth="3.5"
          />
        </svg>
      </button>

      {/* Tiny Caption Hint */}
      <span className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[#8C6D75] bg-white/75 px-3 py-1 rounded-full border border-[#F48B94]/25">
        {mood === 'sad'
          ? '😿 Kitty is begging you to reconsider...'
          : mood === 'heartEyes'
          ? '😻 Yay!! Click Yes!!'
          : '🐾 Tap kitty for good luck!'}
      </span>
    </div>
  );
};

/**
 * ============================================================================
 * 💌 STAGE 2: 3D CORAL-PINK ENVELOPE & LOVE LETTER REVEAL
 * ============================================================================
 */
const SpecialDeliveryStage = ({ recipientName, senderName, onReplay }) => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [hugCount, setHugCount] = useState(0);
  const [floatingHugs, setFloatingHugs] = useState([]);

  const handleSendHug = () => {
    setHugCount((prev) => prev + 1);
    const newHugs = Array.from({ length: 8 }).map((_, idx) => ({
      id: Date.now() + idx + Math.random(),
      tx: (Math.random() - 0.5) * 140,
      ty: -65 - Math.random() * 80,
      emoji: idx % 2 === 0 ? '🤗' : '💖',
      delay: idx * 60
    }));
    setFloatingHugs((prev) => [...prev.slice(-16), ...newHugs]);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center animate-stage-enter px-3.5 sm:px-6">
      {/* Header Pill Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F48B94]/20 border border-[#F48B94]/40 text-[#C94A5A] text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase shadow-2xs">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span>SPECIAL DELIVERY</span>
      </div>

      {/* Romantic Title */}
      <h1
        style={{ fontSize: 'clamp(1.85rem, 7.5vw, 3.5rem)' }}
        className="font-script font-bold text-[#4A353B] mt-2 leading-[1.15] break-words max-w-full"
      >
        For My Dearest{' '}
        <span className="text-[#E85D75] block sm:inline">{recipientName}</span>
      </h1>

      <p className="text-xs sm:text-base font-medium text-[#7D6169] mt-1">
        You have a romantic letter waiting!
      </p>

      {/* ====================================================================
          3D INTERACTIVE CORAL-PINK ENVELOPE STAGE (PORTRAIT-OPTIMIZED)
         ==================================================================== */}
      <div
        className={`relative w-full flex flex-col items-center transition-all duration-700 ${
          isEnvelopeOpen ? 'mt-36 sm:mt-48' : 'mt-6 sm:mt-9'
        }`}
      >
        {/* 3D Perspective Container */}
        <div className="relative w-full max-w-[21.5rem] sm:max-w-md [perspective:1300px]">
          <div
            onClick={() => !isEnvelopeOpen && setIsEnvelopeOpen(true)}
            role={!isEnvelopeOpen ? 'button' : undefined}
            tabIndex={!isEnvelopeOpen ? 0 : undefined}
            onKeyDown={(e) => {
              if (!isEnvelopeOpen && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setIsEnvelopeOpen(true);
              }
            }}
            aria-label={
              isEnvelopeOpen
                ? 'Opened love letter'
                : 'Click coral envelope to open love letter'
            }
            className={`group relative w-full h-48 sm:h-64 rounded-3xl shadow-[0_18px_42px_rgba(232,116,128,0.28)] transition-all duration-700 [transform-style:preserve-3d] ${
              !isEnvelopeOpen ? 'cursor-pointer hover:-translate-y-1.5' : ''
            }`}
          >
            {/* Envelope Back Lining */}
            <div className="absolute inset-0 rounded-3xl bg-[#D9606D] border-2 border-[#C84E5B]" />

            {/* ==============================================================
                SLIDING TEXTURED CREAM LOVE LETTER CARD
               ============================================================== */}
            <div
              className={`absolute left-2.5 right-2.5 sm:left-3.5 sm:right-3.5 rounded-2xl bg-[#FFFDF9] border border-[#F48B94]/40 shadow-xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${
                isEnvelopeOpen
                  ? '-translate-y-32 sm:-translate-y-44 h-[19.5rem] sm:h-[24.5rem] z-30 p-4 sm:p-7'
                  : 'translate-y-2.5 h-40 sm:h-52 z-10 p-3.5 opacity-95'
              }`}
            >
              {/* Subtle Cream Paper Lines */}
              <div className="h-full flex flex-col justify-between text-left overflow-y-auto overscroll-contain pr-1">
                <div>
                  <div className="flex items-center justify-between border-b border-[#F48B94]/30 pb-2 mb-2.5">
                    <span className="font-script text-xl sm:text-3xl font-bold text-[#E85D75] truncate">
                      Dearest {recipientName},
                    </span>
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#F48B94] fill-[#F48B94] shrink-0" />
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#4A353B] leading-relaxed font-medium">
                    {LOVE_LETTER_PARAGRAPHS.map((para, index) => (
                      <p key={index}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Signature & Cute Cat Paw-Print Stamp */}
                <div className="mt-3 pt-2.5 border-t border-[#F48B94]/25 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8C6D75] font-semibold">
                      Forever yours,
                    </p>
                    <p className="font-script text-lg sm:text-2xl font-bold text-[#4A353B] truncate">
                      {senderName}
                    </p>
                  </div>

                  {/* Cute Cat Paw-Print Signature Stamp */}
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-[#FDE8EC] border border-[#F48B94]/40 text-[#E85D75] -rotate-3 shrink-0"
                    title="Sealed with a kitty paw print"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      fill="currentColor"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      aria-hidden="true"
                    >
                      <path d="M50 56c-12 0-22 9-22 18 0 6 5 10 11 10 4 0 7-2 11-2s7 2 11 2c6 0 11-4 11-10 0-9-10-18-22-18z" />
                      <ellipse cx="26" cy="43" rx="7" ry="10" transform="rotate(-22 26 43)" />
                      <ellipse cx="42" cy="31" rx="7" ry="10" transform="rotate(-8 42 31)" />
                      <ellipse cx="58" cy="31" rx="7" ry="10" transform="rotate(8 58 31)" />
                      <ellipse cx="74" cy="43" rx="7" ry="10" transform="rotate(22 74 43)" />
                    </svg>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      Paw-Approved
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==============================================================
                CORAL-PINK ENVELOPE FRONT POCKET FOLDS
               ============================================================== */}
            <div className="absolute inset-0 z-20 pointer-events-none rounded-3xl overflow-hidden">
              <svg
                viewBox="0 0 400 250"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                {/* Left Fold */}
                <polygon points="0,0 205,132 0,250" fill="#EE7A86" />
                {/* Right Fold */}
                <polygon points="400,0 195,132 400,250" fill="#E8707D" />
                {/* Bottom Fold */}
                <polygon points="0,250 200,118 400,250" fill="#F48B94" />
                <polyline
                  points="0,250 200,118 400,250"
                  fill="none"
                  stroke="#FFFDF9"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* ==============================================================
                3D TOP FLAP + SCALLOPED RED-AND-WHITE HEART WAX SEAL
               ============================================================== */}
            <div
              style={{
                transformOrigin: 'top center',
                transform: isEnvelopeOpen ? 'rotateX(180deg)' : 'rotateX(0deg)'
              }}
              className={`absolute top-0 left-0 right-0 h-28 sm:h-36 transition-transform duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] pointer-events-none ${
                isEnvelopeOpen ? 'z-0' : 'z-30'
              }`}
            >
              <svg
                viewBox="0 0 400 140"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-md"
              >
                <polygon
                  points="0,0 400,0 200,134"
                  fill={isEnvelopeOpen ? '#D9606D' : '#F6969F'}
                  stroke="#FFFDF9"
                  strokeOpacity="0.3"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Scalloped Red-and-White Heart Wax Seal */}
              {!isEnvelopeOpen && (
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-md overflow-visible"
                  >
                    {/* Scalloped Crimson Wax Edge */}
                    <path
                      d="M50 4 C56 4 60 9 66 11 C72 13 79 11 84 16 C89 21 87 28 89 34 C91 40 96 44 96 50 C96 56 91 60 89 66 C87 72 89 79 84 84 C79 89 72 87 66 89 C60 91 56 96 50 96 C44 96 40 91 34 89 C28 87 21 89 16 84 C11 79 13 72 11 66 C9 60 4 56 4 50 C4 44 9 40 11 34 C13 28 11 21 16 16 C21 11 28 13 34 11 C40 9 44 4 50 4 Z"
                      fill="#DC2626"
                      stroke="#991B1B"
                      strokeWidth="2.5"
                    />
                    {/* Inner Raised Wax Rim */}
                    <circle
                      cx="50"
                      cy="50"
                      r="33"
                      fill="none"
                      stroke="#FCA5A5"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                    {/* Crisp White Embossed Heart */}
                    <path
                      d="M50 68 C34 56 30 43 39 36 C44 32 49 36 50 40 C51 36 56 32 61 36 C70 43 66 56 50 68 Z"
                      fill="#FFFDF9"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Pill Buttons Below Envelope (Thumb-Friendly Min 44px Height) */}
        <div className="relative z-30 mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={() => setIsEnvelopeOpen((prev) => !prev)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#E85D75] hover:bg-[#D94B64] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isEnvelopeOpen ? (
              <>
                <Mail className="w-4 h-4" />
                <span>Close Envelope</span>
              </>
            ) : (
              <>
                <MailOpen className="w-4 h-4" />
                <span>Click Envelope to Open</span>
              </>
            )}
          </button>

          {isEnvelopeOpen && (
            <div className="relative">
              {/* Floating Virtual Hugs Burst */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-40">
                {floatingHugs.map((h) => (
                  <span
                    key={h.id}
                    onAnimationEnd={() =>
                      setFloatingHugs((prev) =>
                        prev.filter((item) => item.id !== h.id)
                      )
                    }
                    className="absolute text-lg sm:text-xl animate-pet-heart"
                    style={{
                      '--tx': `${h.tx}px`,
                      '--ty': `${h.ty}px`,
                      animationDelay: `${h.delay}ms`
                    }}
                  >
                    {h.emoji}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSendHug}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#FDE8EC] active:scale-95 text-[#E85D75] border-2 border-[#F48B94] font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>
                  Virtual Hug {hugCount > 0 ? `(${hugCount})` : ''}
                </span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onReplay}
            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/85 hover:bg-white text-[#7D6169] hover:text-[#4A353B] border border-[#F48B94]/30 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 💖 MAIN APPLICATION (2-STAGE VALENTINE & LOVE LETTER EXPERIENCE)
 * ============================================================================
 */
export default function App() {
  // Customizable recipient & sender names initialized from top constants
  const [recipientName, setRecipientName] = useState(RECIPIENT_NAME);
  const [senderName, setSenderName] = useState(SENDER_NAME);
  const [isEditingNames, setIsEditingNames] = useState(false);

  // 2-Stage state ('question' | 'delivery')
  const [stage, setStage] = useState('question');
  const [showCelebration, setShowCelebration] = useState(false);

  // Stage 1 interactive states
  const [noCount, setNoCount] = useState(0);
  const [isHoveringYes, setIsHoveringYes] = useState(false);
  const [isPettingCat, setIsPettingCat] = useState(false);

  // Ambient Web Audio Music Box
  const musicBoxRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    musicBoxRef.current = new RomanticMusicBox();
    return () => {
      if (musicBoxRef.current) {
        musicBoxRef.current.stop();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!musicBoxRef.current) return;
    if (isMusicPlaying) {
      musicBoxRef.current.stop();
      setIsMusicPlaying(false);
    } else {
      musicBoxRef.current.start();
      setIsMusicPlaying(true);
    }
  };

  // Determine current kawaii cat expression
  const catMood = isHoveringYes
    ? 'heartEyes'
    : isPettingCat
    ? 'happy'
    : noCount > 0
    ? 'sad'
    : 'neutral';

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1);
    setIsPettingCat(false);
  };

  const handlePetCat = useCallback(() => {
    setIsPettingCat(true);
    setTimeout(() => setIsPettingCat(false), 1100);
  }, []);

  const handleYesClick = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setStage('delivery');
    }, 280);
    setTimeout(() => {
      setShowCelebration(false);
    }, 2400);
  };

  const handleReplay = () => {
    setStage('question');
    setNoCount(0);
    setIsHoveringYes(false);
    setIsPettingCat(false);
  };

  // Dynamic growing 'Yes' button dimensions bounded cleanly for mobile viewports
  const yesFontSize = Math.min(34, 17 + noCount * 3.2);
  const yesPaddingX = Math.min(52, 26 + noCount * 5.5);
  const yesPaddingY = Math.min(24, 12 + noCount * 2.5);
  const currentNoText =
    NO_BUTTON_PLEAS[Math.min(noCount, NO_BUTTON_PLEAS.length - 1)];

  return (
    <div className="relative min-h-dvh w-full bg-gradient-to-br from-[#FFF9F5] via-[#FDE8EC] to-[#FAD7DF] text-[#4A353B] overflow-x-hidden flex flex-col justify-between">
      {/* Google Fonts ('Playfair Display' + 'Quicksand') & Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Quicksand:wght@500;600;700&display=swap');

        body {
          font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #FFF9F5;
        }

        .font-script {
          font-family: 'Playfair Display', Georgia, serif;
        }

        @keyframes ambientRise {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.9);
            opacity: 0;
          }
          15% {
            opacity: 0.35;
          }
          85% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(-112vh) rotate(25deg) scale(1.1);
            opacity: 0;
          }
        }

        .animate-ambient-rise {
          animation: ambientRise linear infinite;
        }

        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .animate-gentle-bounce {
          animation: gentleBounce 2.6s ease-in-out infinite;
        }

        @keyframes excitedBounce {
          0%, 100% { transform: translateY(0px) scale(1.05); }
          50% { transform: translateY(-12px) scale(1.09); }
        }

        .animate-excited-bounce {
          animation: excitedBounce 0.65s ease-in-out infinite;
        }

        @keyframes sadDroop {
          0%, 100% { transform: translateY(3px) rotate(-1.5deg); }
          50% { transform: translateY(5px) rotate(1.5deg); }
        }

        .animate-sad-droop {
          animation: sadDroop 1.8s ease-in-out infinite;
        }

        @keyframes floatBob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.12); }
        }

        .animate-float-bob {
          animation: floatBob 2.2s ease-in-out infinite;
        }

        @keyframes petHeart {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.4);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(1.25);
          }
        }

        .animate-pet-heart {
          animation: petHeart 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes celebrationPop {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(0.4);
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1.1);
          }
        }

        .animate-celebration-pop {
          animation: celebrationPop 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes stageEnter {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-stage-enter {
          animation: stageEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Tactile Fine-Grain Paper Texture Overlay */}
      <svg
        className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.045]"
        aria-hidden="true"
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* Ambient Pastel Floating Hearts */}
      <AmbientFloatingHearts />

      {/* Celebratory Confetti & Hearts Burst */}
      <CelebrationOverlay active={showCelebration} />

      {/* ====================================================================
          TOP FLOATING CONTROLS (QUICK NAME CUSTOMIZER & MUSIC-BOX PILL)
         ==================================================================== */}
      <header className="relative z-30 w-full max-w-5xl mx-auto px-3.5 sm:px-6 pt-3.5 sm:pt-5 flex items-center justify-between gap-2">
        {/* Subtle Quick-Edit Pill for Personalizing Names Live */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsEditingNames((prev) => !prev)}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-[#F48B94]/30 text-xs font-bold text-[#7D6169] hover:text-[#4A353B] shadow-2xs transition-all cursor-pointer"
          >
            {isEditingNames ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Done</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-[#E85D75]" />
                <span>Personalize</span>
              </>
            )}
          </button>

          {isEditingNames && (
            <div className="absolute left-0 mt-2 w-60 sm:w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#F48B94]/40 shadow-xl space-y-2.5 z-50">
              <div>
                <label className="block text-[11px] font-bold text-[#7D6169] mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value || 'My Love')}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[#FFF9F5] border border-[#F48B94]/40 text-xs font-bold text-[#4A353B] focus:outline-none focus:border-[#E85D75]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#7D6169] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) =>
                    setSenderName(e.target.value || 'Your Secret Admirer')
                  }
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[#FFF9F5] border border-[#F48B94]/40 text-xs font-bold text-[#4A353B] focus:outline-none focus:border-[#E85D75]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Floating Music-Note Pill Button (Top-Right Corner) */}
        <button
          type="button"
          onClick={toggleMusic}
          aria-pressed={isMusicPlaying}
          aria-label={
            isMusicPlaying ? 'Mute music box melody' : 'Play music box melody'
          }
          className={`min-h-[44px] shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 shadow-2xs cursor-pointer active:scale-95 ${
            isMusicPlaying
              ? 'bg-[#E85D75] text-white border-[#E85D75]'
              : 'bg-white/85 hover:bg-white text-[#4A353B] border-[#F48B94]/35'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isMusicPlaying
                ? 'bg-white/20 text-white'
                : 'bg-[#FDE8EC] text-[#E85D75]'
            }`}
          >
            {isMusicPlaying ? (
              <Music className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </span>
          <span className="text-xs font-bold tracking-wide">
            {isMusicPlaying ? 'Melody On' : 'Play Melody'}
          </span>
        </button>
      </header>

      {/* ====================================================================
          MAIN STAGE ROUTER (STAGE 1 vs STAGE 2)
         ==================================================================== */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-5 sm:py-10">
        {stage === 'question' ? (
          /* ================================================================
              STAGE 1: THE PLAYFUL 'WILL YOU BE MY VALENTINE?' SCREEN
             ================================================================ */
          <section
            aria-labelledby="valentine-heading"
            className="w-full max-w-md sm:max-w-xl mx-auto px-4 flex flex-col items-center text-center animate-stage-enter"
          >
            {/* Expressive Kawaii Cat Mascot Centerpiece */}
            <KawaiiCatMascot mood={catMood} onPet={handlePetCat} />

            {/* Romantic Script Heading */}
            <h1
              id="valentine-heading"
              style={{ fontSize: 'clamp(2.1rem, 9.5vw, 3.75rem)' }}
              className="font-script font-bold text-[#4A353B] mt-3.5 sm:mt-5 leading-[1.12] drop-shadow-2xs max-w-full"
            >
              Will you be my{' '}
              <span className="text-[#E85D75] italic">Valentine?</span>
            </h1>

            {recipientName !== 'My Love' && (
              <p className="text-xs sm:text-base font-semibold text-[#7D6169] mt-1.5">
                A special question just for {recipientName} ♥
              </p>
            )}

            {/* Interactive 'Yes' & 'No' Buttons (Bounded Safely for 360px+ Screens) */}
            <div className="mt-6 sm:mt-8 w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Vibrant Growing Green 'Yes' Button */}
              <button
                type="button"
                onClick={handleYesClick}
                onMouseEnter={() => setIsHoveringYes(true)}
                onMouseLeave={() => setIsHoveringYes(false)}
                style={{
                  fontSize: `${yesFontSize}px`,
                  paddingLeft: `${yesPaddingX}px`,
                  paddingRight: `${yesPaddingX}px`,
                  paddingTop: `${yesPaddingY}px`,
                  paddingBottom: `${yesPaddingY}px`
                }}
                className="min-h-[48px] max-w-full rounded-full bg-gradient-to-b from-[#34D399] to-[#10B981] hover:from-[#10B981] hover:to-[#059669] text-white font-bold shadow-[0_10px_28px_rgba(16,185,129,0.4)] hover:shadow-[0_14px_34px_rgba(16,185,129,0.55)] active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer leading-none flex items-center justify-center gap-2"
              >
                <span>Yes!</span>
                {noCount >= 2 && <Heart className="w-5 h-5 fill-current inline shrink-0" />}
              </button>

              {/* Pleading Red 'No' Button */}
              <button
                type="button"
                onClick={handleNoClick}
                className="min-h-[46px] max-w-full px-5 py-3 rounded-full bg-gradient-to-b from-[#FB7185] to-[#E11D48] hover:from-[#F43F5E] hover:to-[#BE123C] text-white font-bold text-xs sm:text-base shadow-[0_8px_20px_rgba(225,29,72,0.3)] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                {currentNoText}
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================
              STAGE 2: THE 'SPECIAL DELIVERY' LOVE LETTER REVEAL
             ================================================================ */
          <SpecialDeliveryStage
            recipientName={recipientName}
            senderName={senderName}
            onReplay={handleReplay}
          />
        )}
      </main>

      {/* Subtle Romantic Footer */}
      <footer className="relative z-10 pb-4 sm:pb-5 text-center px-4">
        <p className="text-[11px] sm:text-xs font-semibold text-[#8C6D75]/80">
          Handcrafted with warm cream, blush pink & kitty purrs ♥
        </p>
      </footer>
    </div>
  );
}