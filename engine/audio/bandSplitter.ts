export class BandSplitter {
  private sampleRate: number;
  private fftSize: number;

  constructor(sampleRate: number, fftSize: number) {
    this.sampleRate = sampleRate;
    this.fftSize = fftSize;
  }

  private getFrequency(index: number) {
    return (index * this.sampleRate) / this.fftSize;
  }

  split(data: Uint8Array) {
    let bass = 0;
    let lowMid = 0;
    let mid = 0;
    let high = 0;

    let bassCount = 0;
    let lowMidCount = 0;
    let midCount = 0;
    let highCount = 0;

    for (let i = 0; i < data.length; i++) {
      const freq = this.getFrequency(i);

      if (freq >= 20 && freq < 150) {
        bass += data[i];
        bassCount++;
      } else if (freq >= 150 && freq < 800) {
        lowMid += data[i];
        lowMidCount++;
      } else if (freq >= 800 && freq < 3000) {
        mid += data[i];
        midCount++;
      } else if (freq >= 3000) {
        high += data[i];
        highCount++;
      }
    }

    return {
      bass: bassCount ? bass / bassCount : 0,
      lowMid: lowMidCount ? lowMid / lowMidCount : 0,
      mid: midCount ? mid / midCount : 0,
      high: highCount ? high / highCount : 0,
    };
  }
}