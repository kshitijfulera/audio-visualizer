export class AudioEngine {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaElementAudioSourceNode | null = null;

  public dataArray: Uint8Array;
  public bufferLength: number;

  constructor() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;

    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  async init(audioElement: HTMLAudioElement) {
    if (this.source) return; // prevent duplicate connection

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    this.source = this.audioContext.createMediaElementSource(audioElement);

    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.dataArray as any);
    return this.dataArray;
  }

  getTimeDomainData() {
    const timeArray = new Uint8Array(this.bufferLength);
    this.analyser.getByteTimeDomainData(timeArray as any);
    return timeArray;
  }
}