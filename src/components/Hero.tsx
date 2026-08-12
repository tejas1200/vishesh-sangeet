import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="absolute top-24 left-0 right-0 flex flex-col items-center text-center w-full select-none pointer-events-none z-10">

      {/* Marathi Calligraphy Title */}
      <h1
        className="text-6xl sm:text-7xl md:text-8xl text-white leading-none"
        style={{
          fontFamily: '"Yatra One", cursive', 
          fontWeight: 400,
          textShadow:
            '0 3px 8px rgba(0,0,0,0.45), 0 8px 28px rgba(0,0,0,0.5)',
        }}
      >
        विशेष-संगीत
      </h1>

      {/* Subtitle */}
      {/* <p className="mt-4 text-base sm:text-xl text-white/90 font-light tracking-widest uppercase">
        Gurudev ke Sangeet Sangrah se
      </p> */}

      {/* Description */}
      {/* <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-xs font-medium">
        Developed By Tejas Saitwal
      </p> */}

    </div>
  );
};