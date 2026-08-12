class AudioPlayer {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();

    this.audio.preload = 'metadata';
    this.audio.volume = 0.8;

    this.audio.addEventListener('loadedmetadata', () => {
      console.log(
        '🎵 Audio metadata loaded:',
        this.audio.duration
      );
    });

    this.audio.addEventListener('canplay', () => {
      console.log('✅ Audio can play');
    });

    this.audio.addEventListener('playing', () => {
      console.log('▶️ Audio is actually playing');
    });

    this.audio.addEventListener('pause', () => {
      console.log('⏸️ Audio paused');
    });

    this.audio.addEventListener('ended', () => {
      console.log('⏭️ Audio ended');
    });

    this.audio.addEventListener('error', () => {
      const error = this.audio.error;

      console.error('❌ AUDIO ERROR', {
        code: error?.code,
        message: error?.message,
        src: this.audio.src,
        networkState: this.audio.networkState,
        readyState: this.audio.readyState,
      });
    });
  }

  load(url: string) {
    if (!url) {
      console.error('❌ Empty audio URL');
      return;
    }

    console.log('🎵 Loading:', url);

    this.audio.pause();

    this.audio.src = url;

    this.audio.load();
  }

  async play() {
    if (!this.audio.src) {
      throw new Error('No audio source loaded');
    }

    console.log('▶️ Playing:', this.audio.src);

    await this.audio.play();

    console.log('✅ Playback started');
  }

  pause() {
    this.audio.pause();
  }

  seek(time: number) {
    if (!Number.isFinite(time)) return;

    if (this.audio.readyState >= 1) {
      this.audio.currentTime = time;
    }
  }

  setVolume(volume: number) {
    this.audio.volume = Math.max(
      0,
      Math.min(1, volume)
    );
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return Number.isFinite(this.audio.duration)
      ? this.audio.duration
      : 0;
  }

  onTimeUpdate(callback: (time: number) => void) {
    const handler = () => {
      callback(this.audio.currentTime);
    };

    this.audio.addEventListener(
      'timeupdate',
      handler
    );

    return () => {
      this.audio.removeEventListener(
        'timeupdate',
        handler
      );
    };
  }

  onLoadedMetadata(
    callback: (duration: number) => void
  ) {
    const handler = () => {
      const duration = Number.isFinite(
        this.audio.duration
      )
        ? this.audio.duration
        : 0;

      callback(duration);
    };

    this.audio.addEventListener(
      'loadedmetadata',
      handler
    );

    return () => {
      this.audio.removeEventListener(
        'loadedmetadata',
        handler
      );
    };
  }

  onEnded(callback: () => void) {
    this.audio.addEventListener(
      'ended',
      callback
    );

    return () => {
      this.audio.removeEventListener(
        'ended',
        callback
      );
    };
  }

  onError(callback: () => void) {
    const handler = () => {
      callback();
    };

    this.audio.addEventListener(
      'error',
      handler
    );

    return () => {
      this.audio.removeEventListener(
        'error',
        handler
      );
    };
  }
}

export const audioPlayer = new AudioPlayer();
