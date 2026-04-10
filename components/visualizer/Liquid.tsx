"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BandSplitter } from "@/engine/audio/bandSplitter";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uBass;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // 🌊 Wave distortion
  float wave = sin(uv.y * 10.0 + uTime * 2.0) * 0.1;

  // 🎵 Audio influence
  uv.x += wave * (0.5 + uBass);

  // 🎨 Color
  vec3 color = vec3(
    0.2 + uBass,
    0.3 + wave,
    0.8 - uBass
  );

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function Liquid({ engineRef, controls }: any) {
    const meshRef = useRef<any>(null);
    const materialRef = useRef<any>(null);
    const splitterRef = useRef<BandSplitter | null>(null);

    useFrame(({ clock }) => {
        if (!materialRef.current || !engineRef.current) return;

        const time = clock.getElapsedTime();

        const data = engineRef.current.getFrequencyData();

        if (!splitterRef.current) {
            splitterRef.current = new BandSplitter(44100, 2048);
        }

        const bands = splitterRef.current.split(data);

        // Update shader uniforms
        materialRef.current.uniforms.uTime.value = time;
        const bassMultiplier = controls?.bassMultiplier ?? 1;

        materialRef.current.uniforms.uBass.value =
            (bands.bass / 255) * bassMultiplier;
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[6, 6]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uBass: { value: 0 },
                }}
            />
        </mesh>
    );
}