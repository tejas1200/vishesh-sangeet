import React from 'react';
import { Flame } from 'lucide-react';

interface ChantButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const ChantButton: React.FC<ChantButtonProps> = ({ onClick, isActive = false }) => (
  <div className="fixed right-3 sm:right-8 bottom-32 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-40">
    {/* <button
      onClick={onClick}
      aria-label="Open Sacred Chant Mode"
      className={`group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:bg-white/20 transition-all cursor-pointer active:scale-95 ${
        isActive ? 'bg-white/25 border-orange-400/50 shadow-[0_0_20px_rgba(245,158,11,.4)]' : ''
      }`}
    >
      <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-white">Chant</span>
      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#4a1c17] flex items-center justify-center shadow">
        <Flame className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-[#4a1c17]" />
      </span>
    </button> */}
  </div>
);
