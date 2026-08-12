import { useEffect, useState } from 'react';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MusicPlayer } from './components/MusicPlayer';
import { ChantButton } from './components/ChantButton';
import { ChantModal } from './components/ChantModal';
import { MenuDrawer } from './components/MenuDrawer';

import { getTracks } from './services/musicService';
import { audioPlayer } from './services/audioPlayer';
import { trackOnlineUsers } from './services/onlineUsers';

import { Track } from './types';

// Background video
// import heroVideo from './assets/images/LIVEBG.mp4';
import heroImg from './assets/images/V3.png';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] =
    useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(0.8);

  const [isRepeat, setIsRepeat] =
    useState(false);

  const [isShuffle, setIsShuffle] =
    useState(false);

  const [isChantModalOpen, setIsChantModalOpen] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  // ==========================================
  // REALTIME ONLINE USERS
  // ==========================================

  const [onlineCount, setOnlineCount] =
    useState(0);

  const currentTrack =
    tracks[currentTrackIndex];

  // ==========================================
  // TRACK ONLINE USER
  // ==========================================
useEffect(() => {
  let cleanup: (() => void) | undefined;

  const startPresence = async () => {
    try {
      cleanup = await trackOnlineUsers((count) => {
        console.log('🟢 Online users:', count);
        setOnlineCount(count);
      });
    } catch (error) {
      console.error('❌ Online presence error:', error);
      setOnlineCount(0);
    }
  };

  startPresence();

  return () => {
    cleanup?.();
  };
}, []);

  // ==========================================
  // LOAD TRACKS FROM SUPABASE
  // ==========================================

  useEffect(() => {
    async function loadTracks() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getTracks();

        console.log(
          '🎵 Tracks from Supabase:',
          data
        );

        setTracks(data);

        if (data.length > 0) {
          setCurrentTrackIndex(0);
        }
      } catch (err) {
        console.error(
          '❌ Failed to load tracks:',
          err
        );

        setError(
          'Unable to load songs from Supabase.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTracks();
  }, []);

  // ==========================================
  // LOAD CURRENT SONG
  // ==========================================

  useEffect(() => {
    if (!currentTrack?.audioUrl) {
      return;
    }

    console.log(
      '🎵 Current track:',
      currentTrack.title
    );

    console.log(
      '🔗 Audio URL:',
      currentTrack.audioUrl
    );

    audioPlayer.load(
      currentTrack.audioUrl
    );

    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack]);

  // ==========================================
  // PLAY / PAUSE
  // ==========================================

  useEffect(() => {
    if (!currentTrack?.audioUrl) {
      return;
    }

    if (!isPlaying) {
      audioPlayer.pause();
      return;
    }

    audioPlayer
      .play()
      .catch((err) => {
        console.error(
          '❌ Playback failed:',
          err
        );

        setIsPlaying(false);
      });
  }, [
    isPlaying,
    currentTrack,
  ]);

  // ==========================================
  // REAL AUDIO PROGRESS
  // ==========================================

  useEffect(() => {
    const unsubscribe =
      audioPlayer.onTimeUpdate(
        (time) => {
          setCurrentTime(time);
        }
      );

    return unsubscribe;
  }, []);

  // ==========================================
  // REAL AUDIO DURATION
  // ==========================================

  useEffect(() => {
    const unsubscribe =
      audioPlayer.onLoadedMetadata(
        (audioDuration) => {
          setDuration(
            audioDuration
          );
        }
      );

    return unsubscribe;
  }, []);

  // ==========================================
  // SONG ENDED
  // ==========================================

  useEffect(() => {
    const unsubscribe =
      audioPlayer.onEnded(() => {
        console.log(
          '⏭️ Song finished'
        );

        if (isRepeat) {
          audioPlayer.seek(0);

          audioPlayer
            .play()
            .catch(() => {
              setIsPlaying(false);
            });

          return;
        }

        handleNextTrack();
      });

    return unsubscribe;
  }, [
    isRepeat,
    isShuffle,
    currentTrackIndex,
    tracks.length,
  ]);

  // ==========================================
  // AUDIO ERROR
  // ==========================================

  useEffect(() => {
    const unsubscribe =
      audioPlayer.onError(() => {
        console.error(
          '❌ Unable to load/play audio'
        );

        setIsPlaying(false);
      });

    return unsubscribe;
  }, []);

  // ==========================================
  // VOLUME
  // ==========================================

  useEffect(() => {
    audioPlayer.setVolume(
      volume
    );
  }, [volume]);

  // ==========================================
  // PLAY / PAUSE BUTTON
  // ==========================================

  const handleTogglePlay =
    () => {
      if (
        !currentTrack?.audioUrl
      ) {
        console.error(
          '❌ Current track has no audio URL'
        );

        return;
      }

      setIsPlaying(
        (previous) =>
          !previous
      );
    };

  // ==========================================
  // PREVIOUS TRACK
  // ==========================================

  const handlePreviousTrack =
    () => {
      if (tracks.length === 0) {
        return;
      }

      setCurrentTime(0);

      setCurrentTrackIndex(
        (previous) =>
          previous === 0
            ? tracks.length - 1
            : previous - 1
      );

      setIsPlaying(true);
    };

  // ==========================================
  // NEXT TRACK
  // ==========================================

  const handleNextTrack =
    () => {
      if (tracks.length === 0) {
        return;
      }

      setCurrentTime(0);

      if (isShuffle) {
        let randomIndex =
          Math.floor(
            Math.random() *
              tracks.length
          );

        if (tracks.length > 1) {
          while (
            randomIndex ===
            currentTrackIndex
          ) {
            randomIndex =
              Math.floor(
                Math.random() *
                  tracks.length
              );
          }
        }

        setCurrentTrackIndex(
          randomIndex
        );
      } else {
        setCurrentTrackIndex(
          (previous) =>
            previous ===
            tracks.length - 1
              ? 0
              : previous + 1
        );
      }

      setIsPlaying(true);
    };

  // ==========================================
  // SEEK
  // ==========================================

  const handleSeek = (
    newTime: number
  ) => {
    audioPlayer.seek(
      newTime
    );

    setCurrentTime(
      newTime
    );
  };

  // ==========================================
  // VOLUME
  // ==========================================

  const handleVolumeChange =
    (newVolume: number) => {
      setVolume(newVolume);
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <main
        className="w-screen h-screen flex items-center justify-center text-white"
        style={{
          backgroundColor:
            '#4a1c17',
        }}
      >
        <div className="text-center">
          <div className="text-3xl font-semibold">
            Jin Sangeet
          </div>

          <div className="mt-3 text-white/60">
            Loading songs...
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main
        className="w-screen h-screen flex items-center justify-center text-white"
        style={{
          backgroundColor:
            '#4a1c17',
        }}
      >
        <div className="text-center">
          <div className="text-2xl font-semibold">
            Jin Sangeet
          </div>

          <div className="mt-3 text-red-200">
            {error}
          </div>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 px-5 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (
    !tracks.length ||
    !currentTrack
  ) {
    return (
      <main
        className="w-screen h-screen flex items-center justify-center text-white"
        style={{
          backgroundColor:
            '#4a1c17',
        }}
      >
        <div className="text-center">
          <div className="text-2xl font-semibold">
            Jin Sangeet
          </div>

          <div className="mt-3 text-white/60">
            No songs available.
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between text-white font-sans selection:bg-orange-200 select-none"
      style={{
        backgroundColor:
          '#4a1c17',
      }}
    >

      {/* ======================================
          VIDEO BACKGROUND
      ====================================== */}

      <div className="absolute inset-0 z-0 overflow-hidden">

        {/* <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        /> */}

        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={heroImg}
          alt="Background"
        />

        {/* Optional subtle glow */}

        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-orange-400 rounded-full blur-[150px] opacity-25 pointer-events-none" />

        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-[#9c4a3d] rounded-full blur-[150px] opacity-40 pointer-events-none" />

        {/* Subtle dot pattern */}

        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize:
              '40px 40px',
          }}
        />

      </div>

      {/* ======================================
          HEADER / REALTIME ONLINE USERS
      ====================================== */}

      <Header
        onlineCount={
          onlineCount
        }
      />

      {/* ======================================
          HERO
      ====================================== */}

      <section className="relative z-10 flex-1 flex items-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto w-full pt-16">
        <Hero />
      </section>

      {/* ======================================
          CHANT BUTTON
      ====================================== */}

      <ChantButton
        onClick={() =>
          setIsChantModalOpen(
            true
          )
        }
        isActive={
          isChantModalOpen
        }
      />

      {/* ======================================
          MUSIC PLAYER
      ====================================== */}

      <section className="relative z-20 pb-6 sm:pb-8">
        <MusicPlayer
          track={
            currentTrack
          }
          isPlaying={
            isPlaying
          }
          onPlayPause={
            handleTogglePlay
          }
          onPrevious={
            handlePreviousTrack
          }
          onNext={
            handleNextTrack
          }
          currentTime={
            currentTime
          }
          duration={
            duration
          }
          onSeek={
            handleSeek
          }
          volume={
            volume
          }
          onVolumeChange={
            handleVolumeChange
          }
          isRepeat={
            isRepeat
          }
          onToggleRepeat={() =>
            setIsRepeat(
              (previous) =>
                !previous
            )
          }
          isShuffle={
            isShuffle
          }
          onToggleShuffle={() =>
            setIsShuffle(
              (previous) =>
                !previous
            )
          }
          onOpenPlaylist={() =>
            setIsMenuOpen(
              true
            )
          }
        />
      </section>

      {/* ======================================
          CHANT MODAL
      ====================================== */}

      <ChantModal
        isOpen={
          isChantModalOpen
        }
        onClose={() =>
          setIsChantModalOpen(
            false
          )
        }
        track={
          currentTrack
        }
        isPlaying={
          isPlaying
        }
        onTogglePlay={
          handleTogglePlay
        }
      />

      {/* ======================================
          PLAYLIST
      ====================================== */}

      <MenuDrawer
        isOpen={
          isMenuOpen
        }
        onClose={() =>
          setIsMenuOpen(
            false
          )
        }
        tracks={
          tracks
        }
        currentTrack={
          currentTrack
        }
        onSelectTrack={(
          index
        ) => {
          setCurrentTrackIndex(
            index
          );

          setCurrentTime(
            0
          );

          setIsPlaying(
            true
          );
        }}
      />

    </main>
  );
}