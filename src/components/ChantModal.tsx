import React, { useState } from 'react';
import { X, Flame, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Track } from '../types';
import { audioEngine } from '../services/audioEngine';

interface ChantModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const ChantModal: React.FC<ChantModalProps> = ({
  isOpen,
  onClose,
  track,
  isPlaying,
  onTogglePlay,
}) => {
  const [chantCount, setChantCount] = useState(0);
  const targetBeads = 108;

  if (!isOpen) return null;

  const handleIncrementChant = () => {
    setChantCount((prev) => prev + 1);
    audioEngine.ringTempleBell();
  };

  const handleResetCount = () => {
    setChantCount(0);
  };

  const progressPercent = Math.min(100, Math.round((chantCount / targetBeads) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[94dvh] overflow-y-auto overflow-x-hidden rounded-[26px] sm:rounded-[32px] bg-[#1a0f0e]/90 backdrop-blur-2xl border border-white/20 shadow-[0_0_50px_rgba(156,74,61,.4)] p-4 sm:p-6 text-white">
        {/* Background aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#9c4a3d]/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-300">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-devanagari font-bold text-amber-100">
                पवित्र जाप (Sacred Chant)
              </h3>
              <p className="text-xs font-sans text-amber-200/80">
                Navkar Japa &amp; Spiritual Meditation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 flex flex-col items-center text-center">
          {/* Devanagari Verse Card */}
          <div className="w-full p-3 sm:p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-center">
            <h4 className="text-xl sm:text-2xl font-devanagari font-bold text-amber-200 leading-relaxed drop-shadow">
              {track.titleDevanagari}
            </h4>
            <div className="mt-3 space-y-1.5 text-sm sm:text-base font-devanagari-subtle text-amber-100/90 leading-relaxed">
              {track.lyricsDevanagari && track.lyricsDevanagari.slice(0, 5).map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          {/* 108 Mala Beads Counter Ring */}
          <div className="mt-4 sm:mt-6 flex flex-col items-center">
            <button
              onClick={handleIncrementChant}
              className="group relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-950 via-stone-900 to-amber-900 border-2 border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none"
            >
              {/* Outer Progress Ring SVG */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="66"
                  className="stroke-stone-800 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="66"
                  className="stroke-amber-400 fill-none transition-all duration-300"
                  strokeWidth="6"
                  strokeDasharray="414"
                  strokeDashoffset={414 - (414 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <span className="text-3xl font-cinzel font-bold text-amber-100 group-hover:text-amber-200">
                {chantCount}
              </span>
              <span className="text-xs font-sans text-stone-400 tracking-wider uppercase mt-0.5">
                / {targetBeads} Beads
              </span>

              <Sparkles className="w-4 h-4 text-amber-400 mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            <p className="mt-2 text-xs font-sans text-amber-200/70">
              Tap counter circle after each chant recitation
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch justify-center gap-2.5 sm:gap-4 w-full">
            <button
              onClick={onTogglePlay}
              className={`flex-1 py-2.5 px-4 rounded-xl border font-sans font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                isPlaying
                  ? 'bg-amber-600/40 border-amber-400 text-amber-100'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-stone-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlaying ? 'Pause Audio Chant' : 'Play Audio Chant'}</span>
            </button>

            <button
              onClick={handleResetCount}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-stone-300 hover:text-stone-100 font-sans text-sm flex items-center gap-1.5 transition-colors"
              title="Reset Count"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {chantCount >= targetBeads && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-sans flex items-center justify-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>108 Chant Mala Round Completed! Shanti &amp; Ananda.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
