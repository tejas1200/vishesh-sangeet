import React from 'react';
import { Code2 } from 'lucide-react';

interface HeaderProps {
  onOpenMenu?: () => void;
  onlineCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onlineCount = 0,
}) => {
  const developerUrl = 'https://alfaastack.site';

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-8 py-4 sm:py-5 pointer-events-none">

      {/* Developer Button - Top Right */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-8 pointer-events-auto">
        <a
          href={developerUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Developer"
          title="Developer"
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            sm:px-3.5
            sm:py-2
            rounded-full
            border
            border-white/20
            bg-white/10
            backdrop-blur-xl
            text-white
            shadow-lg
            hover:bg-white/20
            hover:border-white/30
            hover:scale-105
            active:scale-95
            transition-all
          "
        >
          <Code2 className="w-4 h-4 sm:w-[17px] sm:h-[17px]" />

          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">
            Dev
          </span>
        </a>
      </div>

      {/* Online Status - Center */}
      <div className="flex justify-center pointer-events-auto">
        <div className="
          flex
          items-center
          gap-2.5
          px-4
          py-1.5
          rounded-full
          border
          border-white/20
          bg-white/10
          backdrop-blur-xl
          text-xs
          font-medium
          uppercase
          tracking-wider
          text-white
          shadow-lg
        ">
          {/* Animated Online Indicator */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="
              animate-ping
              absolute
              inline-flex
              h-full
              w-full
              rounded-full
              bg-emerald-400
              opacity-75
            />

            <span className="
              relative
              inline-flex
              rounded-full
              h-2
              w-2
              bg-emerald-400
            
            />
          </span>

          <span>
            {onlineCount} Online
          </span>
        </div>
      </div>

    </header>
  );
};