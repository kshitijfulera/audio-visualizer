export class BeatDetector {
  private minEnergy = 20;
  private prevBass = 0;
  private prevLowMid = 0;
  private prevHigh = 0;

  // sensitivity thresholds (we'll tune later)
  private bassThreshold = 1.6;
  private clapThreshold = 1.2;
  private hatThreshold = 1.1;

  detect(bands: {
    bass: number;
    lowMid: number;
    mid: number;
    high: number;
  }) {
    const events = {
      kick: false,
      clap: false,
      hat: false,
    };

    // 🔥 KICK (bass spike)
    if (bands.bass > this.prevBass * this.bassThreshold) {
      events.kick = true;
    }

    // 🔥 CLAP (low-mid spike)
    if (bands.lowMid > this.prevLowMid * this.clapThreshold) {
      events.clap = true;
    }

    // 🔥 HI-HAT (high freq spike)
    if (bands.high > this.prevHigh * this.hatThreshold) {
      events.hat = true;
    }

    // update previous values
    this.prevBass = bands.bass;
    this.prevLowMid = bands.lowMid;
    this.prevHigh = bands.high;

    return events;
  }
}