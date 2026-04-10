"use client";

import { useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";
import { BandSplitter } from "@/engine/audio/bandSplitter";
import { BeatDetector } from "@/engine/audio/beatDetector";
import { BPMDetector } from "@/engine/audio/bpmDetector";

export default function Home() {
  const { audioRef, engineRef, initAudio } = useAudio();

  useEffect(() => {
    let splitter: BandSplitter | null = null;
    let detector: BeatDetector | null = null;
    let bpmDetector: BPMDetector | null = null;

    const animate = () => {
      if (
        engineRef.current &&
        audioRef.current &&
        !audioRef.current.paused
      ) {
        const data = engineRef.current.getFrequencyData();

        if (!splitter) splitter = new BandSplitter(44100, 2048);
        if (!detector) detector = new BeatDetector();
        if (!bpmDetector) bpmDetector = new BPMDetector();

        const bands = splitter.split(data);
        const events = detector.detect(bands);

        const bpm = bpmDetector.detect(events.kick);

        if (bpm > 0) {
          console.log("BPM:", bpm);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <main className="w-screen h-screen bg-black flex flex-col items-center justify-center">
      <audio
        ref={audioRef}
        controls
        src="/audio/song.mp3"
        className="mb-4"
        onPlay={initAudio}
      />

      <p className="text-white">BPM detection active (check console)</p>
    </main>
  );
}