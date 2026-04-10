import { useRef } from "react";
import { AudioEngine } from "@/engine/audio/audioEngine";

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<AudioEngine | null>(null);

  const initAudio = async () => {
    if (!audioRef.current) return;

    // ✅ Create engine ONLY ONCE
    if (!engineRef.current) {
      engineRef.current = new AudioEngine();
      await engineRef.current.init(audioRef.current);
    }
  };

  return {
    audioRef,
    engineRef,
    initAudio,
  };
};