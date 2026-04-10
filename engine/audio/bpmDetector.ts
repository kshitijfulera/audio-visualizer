export class BPMDetector {
  private lastBeatTime: number | null = null;
  private intervals: number[] = [];
  private maxSamples = 20;
  private lastBPM: number = 0;

  detect(isKick: boolean): number {
    const now = performance.now();

    if (isKick) {
      if (this.lastBeatTime !== null) {
        const interval = (now - this.lastBeatTime) / 1000;
        const bpm = 60 / interval;

        if (bpm >= 60 && bpm <= 180) {
          this.intervals.push(interval);
          if (this.intervals.length > this.maxSamples) {
            this.intervals.shift();
          }
        }
      }
      this.lastBeatTime = now;
    }

    if (this.intervals.length === 0) return 0;

    const sorted = [...this.intervals].sort((a, b) => a - b);
    const medianInterval = sorted[Math.floor(sorted.length / 2)];
    const rawBPM = 60 / medianInterval;

    this.lastBPM = this.lastBPM
      ? this.lastBPM * 0.8 + rawBPM * 0.2
      : rawBPM;

    return Math.round(this.lastBPM);
  }

  reset(): void {
    this.lastBeatTime = null;
    this.intervals = [];
    this.lastBPM = 0;
  }
}