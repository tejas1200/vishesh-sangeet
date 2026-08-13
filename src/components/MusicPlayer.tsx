import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, ListMusic
} from 'lucide-react';
import { Track } from '../types';
import jainMusicCover from '../assets/images/jain-music-cover.jpg';

interface MusicPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isRepeat: boolean;
  onToggleRepeat: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  onOpenPlaylist: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track, isPlaying, onPlayPause, onPrevious, onNext,
  currentTime, duration, onSeek, volume, onVolumeChange,
  isRepeat, onToggleRepeat, isShuffle, onToggleShuffle,
  onOpenPlaylist,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    let animId = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 18;
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = Math.max(2, width / barCount - 2);

      for (let i = 0; i < barCount; i++) {
        const factor = isPlaying ? Math.sin(phase + i * 0.4) * 0.5 + 0.5 : 0.15;
        const barHeight = Math.max(3, factor * (height - 4));
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;
        ctx.fillStyle = isPlaying ? 'rgba(251,191,36,.85)' : 'rgba(255,255,255,.2)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
      if (isPlaying) phase += 0.08;
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <div className="
        relative overflow-visible backdrop-blur-2xl bg-black/25
        border border-white/20 rounded-3xl sm:rounded-full
        px-3 py-2 sm:px-5 sm:py-2.5
        flex flex-col sm:flex-row items-stretch sm:items-center
        gap-2.5 sm:gap-5 shadow-[0_15px_35px_rgba(0,0,0,.5)]
        text-white min-h-[135px] sm:min-h-[68px]
      ">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto sm:max-w-xs">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20 shadow">
            <img
              src={track.coverUrl || jainMusicCover}
              alt={track.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className="text-xs sm:text-sm font-semibold tracking-tight truncate">{track.title}</h3>
              <span className="text-[10px] opacity-70 bg-white/10 px-1.5 py-0.5 rounded-full shrink-0 hidden sm:inline">
                {track.titleDevanagari}
              </span>
            </div>
            <p className="text-[11px] text-white/60 truncate">{track.subtitle}</p>
          </div>
        </div>

        <div className="w-full sm:flex-1 sm:max-w-md mx-0 sm:mx-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex justify-between text-[10px] font-mono text-white/60 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={Math.min(currentTime, duration || 100)}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="w-full h-1.5 sm:h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-orange-300"
              aria-label="Song progress"
            />
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-2 shrink-0">
            <button onClick={onPrevious} className="p-2 sm:p-1 rounded-full opacity-75 hover:opacity-100 active:scale-90" aria-label="Previous Track">
              <SkipBack className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onPlayPause}
              aria-label={isPlaying ? 'Pause Track' : 'Play Track'}
              className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-white text-[#4a1c17] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow shrink-0"
            >
              {isPlaying ? <Pause className="w-5 h-5 sm:w-4 sm:h-4 fill-[#4a1c17]" /> : <Play className="w-5 h-5 sm:w-4 sm:h-4 fill-[#4a1c17] translate-x-0.5" />}
            </button>
            <button onClick={onNext} className="p-2 sm:p-1 rounded-full opacity-75 hover:opacity-100 active:scale-90" aria-label="Next Track">
              <SkipForward className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-2 w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
          <button onClick={onToggleShuffle} className={`p-2 rounded-full ${isShuffle ? 'text-orange-300 bg-white/10' : 'text-white/60'}`} title="Shuffle">
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={onToggleRepeat} className={`p-2 rounded-full ${isRepeat ? 'text-orange-300 bg-white/10' : 'text-white/60'}`} title="Repeat">
            <Repeat className="w-4 h-4" />
          </button>
          <button onClick={onOpenPlaylist} className="p-2 rounded-full text-white/75 hover:text-white" title="Playlist">
            <ListMusic className="w-4 h-4" />
          </button>
          <div className="relative">
            <button onClick={() => setShowVolumeSlider(v => !v)} className="p-2 rounded-full text-white/75 hover:text-white" title="Volume">
              {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
            </button>
            {showVolumeSlider && (
              <div className="absolute right-0 bottom-11 p-3 rounded-2xl bg-[#1a0f0e]/95 backdrop-blur-xl border border-white/20 shadow-xl flex flex-col sm:flex-row items-center gap-2 z-50">
                <input
                  type="range" min={0} max={1} step={0.05}
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-24 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-orange-400"
                  aria-label="Volume"
                />
                <span className="text-[10px] font-mono w-8 text-center">{Math.round(volume * 100)}%</span>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} width={180} height={24} className="absolute top-2 right-4 w-20 h-3 opacity-40 pointer-events-none sm:hidden" />
      </div>
    </div>
  );
};
