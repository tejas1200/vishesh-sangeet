import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Music2,
  ListMusic
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
  track,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isRepeat,
  onToggleRepeat,
  isShuffle,
  onToggleShuffle,
  onOpenPlaylist,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Format seconds into m:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Canvas waveform visualizer animation when playing
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        phase += 0.08;
        const barCount = 18;
        const width = canvas.width;
        const height = canvas.height;
        const barWidth = width / barCount - 2;

        for (let i = 0; i < barCount; i++) {
          // Dynamic sine wave heights simulating audio spectrum
          const hFactor = Math.sin(phase + i * 0.4) * 0.5 + 0.5;
          const barHeight = Math.max(3, hFactor * (height - 4));
          const x = i * (barWidth + 2);
          const y = (height - barHeight) / 2;

          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, 'rgba(251, 191, 36, 0.9)'); // Amber 400
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0.4)'); // Amber 500

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else {
        // Flat muted static lines when paused
        const barCount = 18;
        const width = canvas.width;
        const height = canvas.height;
        const barWidth = width / barCount - 2;

        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 2);
          const y = height / 2 - 1.5;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, 3, 1);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-0">
      {/* Small strip music player with rounded sides & transparent glass blur effect */}
     <div className="relative overflow-visible backdrop-blur-2xl bg-white/10 border border-white/20 rounded-full py-3.5 px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] text-white min-h-[76px]">
        
        {/* Left: Thumbnail & Track Details */}
        <div className="flex items-center gap-3 shrink-0 min-w-0 max-w-[170px] sm:max-w-xs">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-white/20 shadow">
            <img
              src={
                track.coverUrl || jainMusicCover }
              alt={track.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-white truncate">
                {track.title}
              </h3>
              <span className="text-[10px] font-normal opacity-70 bg-white/10 px-1.5 py-0.2 rounded-full shrink-0 hidden sm:inline">
                {track.titleDevanagari}
              </span>
            </div>
            <p className="text-[11px] text-white/60 truncate">
              {track.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Progress Slider & Time + Main Controls */}
        <div className="flex-1 max-w-md mx-1 sm:mx-2 flex items-center gap-2 sm:gap-3">
          {/* Time & Progress bar */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex justify-between items-center text-[10px] font-mono text-white/60 mb-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-orange-300 focus:outline-none"
            />
          </div>

          {/* Play/Pause & Prev/Next Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onPrevious}
              className="p-1 opacity-70 hover:opacity-100 text-white transition-opacity active:scale-95"
              aria-label="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayPause}
              aria-label={isPlaying ? 'Pause Track' : 'Play Track'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#4a1c17] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow cursor-pointer shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-[#4a1c17]" />
              ) : (
                <Play className="w-4 h-4 fill-[#4a1c17] translate-x-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-1 opacity-70 hover:opacity-100 text-white transition-opacity active:scale-95"
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Shuffle, Repeat, Playlist, Volume */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onToggleShuffle}
            className={`p-1 rounded-full transition-opacity hidden sm:block ${
              isShuffle ? 'text-orange-300 opacity-100' : 'opacity-50 hover:opacity-100 text-white'
            }`}
            title={isShuffle ? 'Shuffle Enabled' : 'Enable Shuffle'}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`p-1 rounded-full transition-opacity hidden sm:block ${
              isRepeat ? 'text-orange-300 opacity-100' : 'opacity-50 hover:opacity-100 text-white'
            }`}
            title={isRepeat ? 'Repeat Track' : 'Enable Repeat'}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenPlaylist}
            title="View Playlist"
            className="p-1.5 rounded-full opacity-70 hover:opacity-100 text-white transition-opacity"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <div className="relative flex items-center">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="p-1.5 rounded-full opacity-70 hover:opacity-100 text-white transition-opacity"
              title="Volume Control"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-300" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute right-0 bottom-10 p-2.5 rounded-2xl bg-[#1a0f0e]/95 backdrop-blur-xl border border-white/20 shadow-xl flex items-center gap-2 z-30">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-orange-400"
                />
                <span className="text-[10px] font-mono text-white/80 w-6 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
