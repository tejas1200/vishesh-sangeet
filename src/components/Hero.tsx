import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div
      className="
        absolute
        top-20
        sm:top-24
        left-0
        right-0
        flex
        flex-col
        items-center
        text-center
        w-full
        px-4
        select-none
        pointer-events-none
        z-10
      "
    >
      <h1
        className="
          text-5xl
          sm:text-7xl
          md:text-8xl
          text-white
          leading-none
          whitespace-nowrap
        "
        style={{
          fontFamily: '"Yatra One", cursive',
          fontWeight: 400,
          textShadow:
            '0 3px 8px rgba(0,0,0,0.45), 0 8px 28px rgba(0,0,0,0.5)',
        }}
      >
        विशेष-संगीत
      </h1>
    </div>
  );
};