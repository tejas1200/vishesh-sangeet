import React from 'react';

interface HeaderProps {
  onOpenMenu?: () => void;
  onlineCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onlineCount = 0,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-6 sm:px-10 py-4 sm:py-5 flex items-center justify-center pointer-events-none">

      {/* Online Status */}
      <div className="pointer-events-auto">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-xs font-medium uppercase tracking-wider text-white shadow-lg">

          {/* Animated Online Indicator */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">

            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_#34d399]" />

          </span>

          {/* Real Online Count */}
          <span>
            {onlineCount}{' '}
            {onlineCount === 1 ? 'Online' : 'Online'}
          </span>

        </div>
      </div>

    </header>
  );
};