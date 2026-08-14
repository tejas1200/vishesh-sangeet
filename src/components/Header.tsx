import React, { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';

interface HeaderProps {
  onOpenMenu?: () => void;
  onlineCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onlineCount = 0,
}) => {
  const developerUrl = 'https://alfaastack.site';

  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  );

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-8 pt-4 sm:pt-5 pointer-events-none">
      {/* Online Status - Center */}
      <div className="flex justify-center pointer-events-auto">
        <div className="flex flex-col items-center">
          <div
            className="
              h-9
              flex items-center justify-center gap-2
              px-3.5 sm:px-4
              rounded-full
              border border-white/20
              bg-white/10
              backdrop-blur-xl
              text-white
              text-[10px] sm:text-xs
              font-medium uppercase tracking-wider
              shadow-lg
              whitespace-nowrap
            "
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </span>

            <span>{onlineCount} Online</span>
          </div>

          {/* Live clock below online tag */}
          <span
            className="
              mt-1
              text-[9px] sm:text-[10px]
              font-medium
              tracking-widest
              text-white/70
              tabular-nums
              whitespace-nowrap
            "
          >
            {currentTime}
          </span>
        </div>
      </div>

      {/* Developer - Top Right */}
      <div className="absolute top-4 right-3 sm:top-5 sm:right-8 pointer-events-auto">
        <a
          href={developerUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Developer"
          title="Developer"
          className="
            h-9
            flex items-center justify-center gap-1.5
            px-3 sm:px-4
            rounded-full
            border border-white/20
            bg-white/10
            backdrop-blur-xl
            text-white
            text-[10px] sm:text-xs
            font-medium uppercase tracking-wider
            shadow-lg
            hover:bg-white/20
            hover:border-white/30
            hover:scale-[1.03]
            active:scale-95
            transition-all
            whitespace-nowrap
          "
        >
          <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />

          <span className="sm:hidden">Dev</span>
          <span className="hidden sm:inline">Developer</span>
        </a>
      </div>
    </header>
  );
};
