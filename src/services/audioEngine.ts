// Web Audio API engine for Jain spiritual soundscapes & tanpura harmonics

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private masterGain: GainNode | null = null;
  private tanpuraGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private analyserNode: AnalyserNode | null = null;
  private bellInterval: number | null = null;

  // Base frequencies for serene tanpura drone (Pa - Sa - Sa - Sa harmonics)
  private rootFreq = 136.1; // 136.1 Hz is the sacred OM frequency (C#)

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 64;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);

      this.tanpuraGain = this.ctx.createGain();
      this.tanpuraGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.tanpuraGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTrack(_trackId: string) {
    this.initCtx();
    if (!this.ctx || !this.tanpuraGain) return;

    this.stopDrone();
    this.isRunning = true;

    // Create 4 tanpura string oscillators
    // String 1: Fifth (Panchama / Pa = 1.5 * root)
    // String 2 & 3: Middle Sa (2 * root)
    // String 4: Low Sa (root)
    const stringFreqs = [
      this.rootFreq * 1.5, // Pa (204.15 Hz)
      this.rootFreq * 2.0, // Sa
      this.rootFreq * 2.0, // Sa
      this.rootFreq,       // Low Sa
    ];

    stringFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.tanpuraGain) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (idx * 0.3), this.ctx.currentTime);

      // Subtle LFO pulse for tanpura pluck feel
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.05, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      lfo.connect(lfoGain.gain);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      osc.connect(gain);
      if (panner) {
        panner.pan.setValueAtTime((idx - 1.5) * 0.4, this.ctx.currentTime);
        gain.connect(panner);
        panner.connect(this.tanpuraGain);
      } else {
        gain.connect(this.tanpuraGain);
      }

      osc.start();
      lfo.start();
      this.oscillators.push(osc, lfo);
    });

    // Schedule gentle temple chime every 8 seconds
    this.ringTempleBell();
    if (this.bellInterval) window.clearInterval(this.bellInterval);
    this.bellInterval = window.setInterval(() => {
      if (this.isRunning) {
        this.ringTempleBell();
      }
    }, 8000);
  }

  public ringTempleBell() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();

    bellOsc.type = 'sine';
    // Bright bell harmonic resonance (~1080 Hz)
    bellOsc.frequency.setValueAtTime(1080, this.ctx.currentTime);
    bellOsc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 3.0);

    bellGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

    bellOsc.connect(bellGain);
    bellGain.connect(this.masterGain);

    bellOsc.start();
    bellOsc.stop(this.ctx.currentTime + 3.6);
  }

  public pause() {
    this.stopDrone();
  }

  private stopDrone() {
    this.isRunning = false;
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Safe catch if already stopped
      }
    });
    this.oscillators = [];
    if (this.bellInterval) {
      window.clearInterval(this.bellInterval);
      this.bellInterval = null;
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(16);
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new AudioEngine();
