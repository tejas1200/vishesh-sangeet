import React, { useMemo, useState } from 'react';
import {
  X,
  Music,
  BookOpen,
  Info,
  Sparkles,
  Check,
  Heart,
  Search,
  ListMusic,
} from 'lucide-react';

import { Track } from '../types';
import jainMusicCover from '../assets/images/V4.png';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  currentTrack: Track;
  onSelectTrack: (index: number) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  tracks,
  currentTrack,
  onSelectTrack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'tracks' | 'lyrics' | 'about'
  >('tracks');

  const [searchQuery, setSearchQuery] = useState('');

  /*
   * ----------------------------------------------------
   * SEARCH SONGS
   * ----------------------------------------------------
   *
   * Searches:
   * - Track number
   * - English title
   * - Devanagari title
   * - Subtitle
   *
   * Search is performed locally, so there is no
   * Supabase request for every keystroke.
   */

  const filteredTracks = useMemo(() => {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return tracks;
  }

  return tracks.filter((track) => {
    const number =
      String(track.track_number);

    const title =
      track.title?.toLowerCase() || '';

    const devanagari =
      track.titleDevanagari?.toLowerCase() || '';

    const subtitle =
      track.subtitle?.toLowerCase() || '';

    return (
      number.includes(query) ||
      title.includes(query) ||
      devanagari.includes(query) ||
      subtitle.includes(query)
    );
  });
}, [tracks, searchQuery]);


  /*
   * ----------------------------------------------------
   * CLEAR SEARCH
   * ----------------------------------------------------
   */

  const clearSearch = () => {
    setSearchQuery('');
  };


  /*
   * ----------------------------------------------------
   * CLOSE DRAWER
   * ----------------------------------------------------
   */

  if (!isOpen) return null;


  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        justify-start

        bg-black/70
        backdrop-blur-md

        animate-in
        fade-in
        duration-300
      "
      onClick={onClose}
    >

      {/* ==================================================
          SIDE GLASS DRAWER
      ================================================== */}

      <div
        className="
          relative

          w-full
          sm:max-w-md

          h-full

          bg-[#1a0f0e]/95
          backdrop-blur-2xl

          border-r
          border-white/15

          px-4
          py-4

          sm:p-6

          text-white

          flex
          flex-col

          shadow-2xl

          overflow-hidden

          overscroll-contain
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="flex flex-col min-h-0 flex-1">


          {/* ==================================================
              DRAWER HEADER
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between

              pb-3
              sm:pb-4

              border-b
              border-white/10

              shrink-0
            "
          >

            <div className="flex items-center gap-2 min-w-0">

              <span
                className="
                  text-xl
                  sm:text-2xl

                  font-serif

                  text-white

                  tracking-widest

                  truncate
                "
                style={{
                  fontFamily: 'Georgia, serif',
                }}
              >
                विशेष-संगीत
              </span>

              <span
                className="
                  hidden
                  xs:inline-flex
                  sm:inline-flex

                  text-[10px]

                  font-sans

                  px-2.5
                  py-0.5

                  rounded-full

                  bg-orange-500/20

                  text-orange-200

                  border
                  border-orange-400/30

                  uppercase

                  tracking-wider

                  shrink-0
                "
              >
                Spiritual
              </span>

            </div>


            {/* Close */}
            <button
              onClick={onClose}
              className="
                p-2

                rounded-full

                bg-white/10
                hover:bg-white/20

                text-stone-300
                hover:text-stone-100

                transition-colors

                shrink-0
              "
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>

          </div>


          {/* ==================================================
              NAVIGATION TABS
          ================================================== */}

          <div
            className="
              grid
              grid-cols-3

              items-center

              gap-1
              sm:gap-2

              my-3
              sm:my-4

              p-1

              rounded-xl

              bg-stone-900/80

              border
              border-white/10

              shrink-0
            "
          >

            {/* Bhajans */}
            <button
              onClick={() => setActiveTab('tracks')}
              className={`
                w-full

                py-2
                px-1
                sm:px-3

                rounded-lg

                text-xs

                font-sans
                font-medium

                flex
                items-center
                justify-center

                gap-1.5

                transition-colors

                ${
                  activeTab === 'tracks'
                    ? 'bg-amber-600/50 text-amber-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }
              `}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Bhajans</span>
            </button>


            {/* Lyrics */}
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`
                w-full

                py-2
                px-1
                sm:px-3

                rounded-lg

                text-xs

                font-sans
                font-medium

                flex
                items-center
                justify-center

                gap-1.5

                transition-colors

                ${
                  activeTab === 'lyrics'
                    ? 'bg-amber-600/50 text-amber-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }
              `}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lyrics</span>
            </button>


            {/* About */}
            <button
              onClick={() => setActiveTab('about')}
              className={`
                w-full

                py-2
                px-1
                sm:px-3

                rounded-lg

                text-xs

                font-sans
                font-medium

                flex
                items-center
                justify-center

                gap-1.5

                transition-colors

                ${
                  activeTab === 'about'
                    ? 'bg-amber-600/50 text-amber-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }
              `}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </button>

          </div>


          {/* ==================================================
              TRACKS TAB
          ================================================== */}

          {activeTab === 'tracks' && (
            <div className="flex flex-col min-h-0 flex-1">


              {/* ==================================================
                  SEARCH BAR
              ================================================== */}

              <div className="relative shrink-0 mb-3">

                <Search
                  className="
                    absolute
                    left-3

                    top-1/2
                    -translate-y-1/2

                    w-4
                    h-4

                    text-white/40

                    pointer-events-none
                  "
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search songs..."
                  aria-label="Search songs"
                  className="
                    w-full

                    h-11

                    pl-10
                    pr-10

                    rounded-2xl

                    bg-white/10
                    backdrop-blur-xl

                    border
                    border-white/15

                    text-white

                    text-sm

                    placeholder:text-white/40

                    outline-none

                    focus:bg-white/15
                    focus:border-amber-400/40

                    transition-all
                  "
                />


                {/* Clear Search */}
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="
                      absolute

                      right-3

                      top-1/2
                      -translate-y-1/2

                      w-6
                      h-6

                      rounded-full

                      bg-white/10

                      flex
                      items-center
                      justify-center

                      text-white/50

                      hover:text-white
                      hover:bg-white/20

                      transition
                    "
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

              </div>


              {/* ==================================================
                  COLLECTION HEADER
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  mb-2

                  px-1

                  shrink-0
                "
              >

                <h4
                  className="
                    text-xs

                    font-sans
                    font-semibold

                    text-stone-400

                    uppercase

                    tracking-wider
                  "
                >
                  {searchQuery.trim()
                    ? 'Search Results'
                    : 'Sacred Collection'}
                </h4>


                <span
                  className="
                    text-[10px]

                    text-white/40

                    font-mono

                    bg-white/5

                    px-2
                    py-1

                    rounded-full
                  "
                >
                  {searchQuery.trim()
                    ? `${filteredTracks.length} found`
                    : `${tracks.length} songs`}
                </span>

              </div>


              {/* ==================================================
                  SONG LIST
              ================================================== */}

              <div
                className="
                  flex-1

                  min-h-0

                  overflow-y-auto

                  overscroll-contain

                  space-y-2

                  pr-1

                  pb-2

                  scrollbar-thin
                  scrollbar-thumb-white/20
                  scrollbar-track-transparent
                "
              >

                {/* ==================================================
                    NO RESULTS
                ================================================== */}

                {filteredTracks.length === 0 && (
                  <div
                    className="
                      flex
                      flex-col

                      items-center
                      justify-center

                      text-center

                      py-16

                      px-6
                    "
                  >

                    <div
                      className="
                        w-14
                        h-14

                        rounded-2xl

                        bg-white/5

                        border
                        border-white/10

                        flex
                        items-center
                        justify-center

                        mb-4
                      "
                    >
                      <Search
                        className="
                          w-6
                          h-6

                          text-white/30
                        "
                      />
                    </div>

                    <p
                      className="
                        text-sm

                        font-medium

                        text-white/70
                      "
                    >
                      No songs found
                    </p>

                    <p
                      className="
                        text-xs

                        text-white/35

                        mt-1
                      "
                    >
                      Try another song name
                    </p>

                  </div>
                )}


                {/* ==================================================
                    SONGS
                ================================================== */}

                {filteredTracks.map((track) => {

                  /*
                   * IMPORTANT:
                   *
                   * Search results have a new array index.
                   * We must find the ORIGINAL index from tracks[]
                   * before calling onSelectTrack().
                   */

                  const originalIndex =
                    tracks.findIndex(
                      (item) =>
                        item.id === track.id
                    );


                  const isSelected =
                    track.id === currentTrack.id;


                  /*
                   * Supabase field:
                   *
                   * track_number
                   *
                   * We use a safe fallback so this component
                   * won't break if your current Track interface
                   * hasn't been updated yet.
                   */

                  const trackWithNumber =
                    track as Track & {
                      track_number?: number;
                    };


                  const trackNumber = track.track_number;


                  return (
                    <button
                      key={track.id}
                      onClick={() => {

                        if (originalIndex === -1) {
                          return;
                        }

                        onSelectTrack(
                          originalIndex
                        );

                        onClose();
                      }}
                      className={`
                        w-full

                        p-2.5
                        sm:p-3

                        rounded-xl

                        border

                        text-left

                        transition-all

                        flex
                        items-center

                        gap-3

                        group

                        ${
                          isSelected
                            ? `
                              bg-amber-950/50
                              border-amber-500/50
                              text-amber-100
                              shadow-md
                            `
                            : `
                              bg-stone-900/40
                              hover:bg-stone-900/80
                              border-white/10
                              text-stone-300
                              hover:text-stone-100
                            `
                        }
                      `}
                    >


                      {/* ==================================================
                          NUMBER
                      ================================================== */}

                      <div
                        className={`
                          w-8
                          sm:w-9

                          shrink-0

                          text-center

                          font-mono

                          text-[11px]
                          sm:text-xs

                          ${
                            isSelected
                              ? 'text-amber-300'
                              : 'text-white/35'
                          }
                        `}
                      >
                        {String(
                          trackNumber
                        ).padStart(2, '0')}
                      </div>


                      {/* ==================================================
                          COVER IMAGE
                      ================================================== */}

                      <img
                        src={
                          track.coverUrl ||
                          jainMusicCover
                        }
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="
                          w-9
                          h-9

                          sm:w-10
                          sm:h-10

                          rounded-lg

                          object-cover

                          shrink-0

                          border
                          border-white/10
                        "
                      />


                      {/* ==================================================
                          SONG DETAILS
                      ================================================== */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <div
                          className="
                            text-sm

                            font-cinzel
                            font-semibold

                            truncate

                            group-hover:text-amber-200

                            transition-colors
                          "
                        >
                          {track.title}
                        </div>


                        {(track.titleDevanagari ||
                          track.subtitle) && (
                          <div
                            className="
                              text-xs

                              font-devanagari

                              text-amber-300/80

                              truncate

                              mt-0.5
                            "
                          >
                            {track.titleDevanagari}

                            {track.titleDevanagari &&
                              track.subtitle && (
                                <span> • </span>
                              )}

                            {track.subtitle}
                          </div>
                        )}

                      </div>


                      {/* ==================================================
                          CURRENT SONG INDICATOR
                      ================================================== */}

                      {isSelected && (
                        <Check
                          className="
                            w-4
                            h-4

                            text-amber-400

                            shrink-0

                            ml-1
                          "
                        />
                      )}

                    </button>
                  );
                })}

              </div>

            </div>
          )}


          {/* ==================================================
              LYRICS TAB
          ================================================== */}

          {activeTab === 'lyrics' && (
            <div
              className="
                mt-4

                space-y-4

                overflow-y-auto

                flex-1

                min-h-0
              "
            >

              <div
                className="
                  p-4

                  rounded-xl

                  bg-amber-950/30

                  border
                  border-amber-500/20
                "
              >

                <h4
                  className="
                    text-lg

                    font-devanagari
                    font-bold

                    text-amber-200
                  "
                >
                  {currentTrack.titleDevanagari}
                  {' '}
                  ({currentTrack.title})
                </h4>


                <p
                  className="
                    text-xs

                    font-sans

                    text-stone-400

                    mt-0.5
                  "
                >
                  {currentTrack.metadata}
                </p>


                <div
                  className="
                    mt-4

                    space-y-2

                    text-sm

                    font-devanagari-subtle

                    text-amber-100

                    leading-relaxed
                  "
                >

                  {currentTrack.lyricsDevanagari?.map(
                    (line, idx) => (
                      <p
                        key={idx}
                        className="
                          p-1.5

                          rounded

                          bg-black/20
                        "
                      >
                        {line}
                      </p>
                    )
                  )}

                </div>


                {currentTrack.meaning && (
                  <div
                    className="
                      mt-4

                      pt-3

                      border-t
                      border-amber-500/20

                      text-xs

                      font-sans

                      text-stone-300

                      italic
                    "
                  >
                    <strong
                      className="
                        text-amber-300
                        not-italic
                      "
                    >
                      Meaning:{' '}
                    </strong>

                    {currentTrack.meaning}
                  </div>
                )}

              </div>

            </div>
          )}


          {/* ==================================================
              ABOUT TAB
          ================================================== */}

          {activeTab === 'about' && (
            <div
              className="
                mt-4

                space-y-4

                text-xs

                font-sans

                leading-relaxed

                text-stone-300

                overflow-y-auto

                flex-1

                min-h-0
              "
            >

              <div
                className="
                  p-4

                  rounded-xl

                  bg-stone-900/60

                  border
                  border-white/10

                  space-y-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    text-amber-200

                    font-cinzel

                    text-sm

                    font-semibold
                  "
                >
                  <Sparkles
                    className="
                      w-4
                      h-4

                      text-amber-400
                    "
                  />

                  <span>
                    About Vishesh-Sangeet
                  </span>
                </div>


                <p>
                  Vishesh-Sangeet is a peaceful
                  spiritual music portal dedicated
                  to the soulful devotional songs of... <br/>
                  ✨ प.पू. आचार्य श्री विमल सागरजी गुरुदेव, <br/>
                  ✨ प.पू. आचार्य श्री विराग सागरजी गुरुदेव,<br/>
                  ✨ प.पू. उपाध्याय श्री विशेष सागरजी गुरुदेव.
                </p>


                <p>
                  Inspired by traditional Jain temple
                  architecture, sacred mantras, and
                  meditative resonances, this platform
                  offers a divine space for inner
                  reflection and spiritual elevation.
                </p>

              </div>


              <div
                className="
                  p-4

                  rounded-xl

                  bg-stone-900/60

                  border
                  border-white/10

                  space-y-3
                "
              >

                <p>
                  <strong
                    className="
                      flex
                      items-center
                      gap-2

                      text-amber-200

                      font-cinzel

                      text-sm

                      font-semibold
                    "
                  >
                    Developed By:
                  </strong>

                  💠Alfaastack Technologie's Jamner, 
                  in collaboration with    <br />
                  ⭐Miss. Monali
                  Jain - Guru-Bhakt Parivar. <br />
                  📍Jamner, Maharashtra. <br/><br/>
                  🟩 If you have any  suggestions feel free to reach out to us at -  <br/>📧 alfaastack@gmail.com 
                   📞 9322738223
                </p>
                

                 


                <p className="pt-2">

                  <a
                    href="https://alfaastack.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      gap-2

                      text-amber-200

                      font-cinzel

                      text-sm

                      font-semibold

                      hover:text-amber-100

                      transition-colors
                    "
                  >
                    🌐 Visit Us - Alfaastack Technologies
                  </a>

                </p>

              </div>

            </div>
          )}

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            pt-4

            border-t
            border-white/10

            text-center

            text-[11px]

            font-sans

            text-stone-400

            flex
            items-center
            justify-center

            gap-1

            shrink-0
          "
        >
          <span>
            Jai Jinendra
          </span>

          <Heart
            className="
              w-3
              h-3

              text-rose-400

              fill-rose-400

              inline
            "
          />

        </div>

      </div>

    </div>
  );
};