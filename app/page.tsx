"use client";

import Scene from "@/components/visualizer/Scene";
import { useAudio } from "@/hooks/useAudio";

export default function Home() {
  const { audioRef, engineRef, initAudio } = useAudio();

  return (
    <main className="w-screen h-screen bg-black">
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
        <audio
          ref={audioRef}
          controls
          src="/audio/song.mp3"
          onPlay={initAudio}
        />
      </div>

      <Scene engineRef={engineRef} />
    </main>
  );
}