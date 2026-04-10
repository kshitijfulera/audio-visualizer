"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BandSplitter } from "@/engine/audio/bandSplitter";

const PARTICLE_COUNT = 1000;

export default function Particles({ engineRef, controls }: any) {
    const pointsRef = useRef<THREE.Points>(null);
    const splitterRef = useRef<BandSplitter | null>(null);

    // Initial positions
    const positions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 5;
    }

    useFrame(() => {
        if (!pointsRef.current || !engineRef.current) return;

        const data = engineRef.current.getFrequencyData();

        if (!splitterRef.current) {
            splitterRef.current = new BandSplitter(44100, 2048);
        }

        const bands = splitterRef.current.split(data);

        const bassForce = (bands.bass / 50) * controls.particleIntensity; // explosion strength

        const posAttr = pointsRef.current.geometry.attributes.position;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Push outward (explosion)
            posAttr.array[i3] += (Math.random() - 0.5) * bassForce;
            posAttr.array[i3 + 1] += (Math.random() - 0.5) * bassForce;
            posAttr.array[i3 + 2] += (Math.random() - 0.5) * bassForce + 0.01;
        }

        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>

            <pointsMaterial
                size={0.07}
                color="white"
                transparent
                opacity={1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}