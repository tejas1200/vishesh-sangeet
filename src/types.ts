export interface Track {
  id: string;

  track_number: number;

  title: string;

  titleDevanagari: string;

  subtitle: string;

  metadata: string;

  duration: number;

  audioUrl: string;

  coverUrl: string;

  composer?: string;

  raga?: string;

  description: string;

  lyricsDevanagari?: string[];

  lyricsEnglish?: string[];

  meaning?: string;
}


export interface PlayerState {
  currentTrackIndex: number;

  isPlaying: boolean;

  currentTime: number;

  duration: number;

  volume: number;

  isMuted: boolean;

  isRepeat: boolean;

  isShuffle: boolean;

  tanpuraDrone: boolean;

  templeBellVolume: number;
}


export interface ChantCounterState {
  count: number;

  targetCount: number;

  completedRounds: number;

  autoLoop: boolean;
}