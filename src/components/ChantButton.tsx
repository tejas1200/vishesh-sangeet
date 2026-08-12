import React from 'react';
import { Flame } from 'lucide-react';

interface ChantButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const ChantButton: React.FC<ChantButtonProps> = ({ onClick, isActive = false }) => {
  return (
    <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30">
      {/* <button
        onClick={onClick}
        aria-label="Open Sacred Chant Mode"
        className={`group flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:bg-white/20 transition-all cursor-pointer active:scale-95 ${
          isActive ? 'bg-white/25 border-orange-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : ''
        }`}
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-white">Chant</span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#4a1c17] flex items-center justify-center shadow group-hover:scale-105 transition-transform shrink-0">
          <Flame className="w-4 h-4 fill-[#4a1c17]" />
        </div>
      </button> */}
    </div>
  );
};

