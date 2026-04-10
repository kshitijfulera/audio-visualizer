"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Liquid from "./Liquid";
import Particles from "./Particles";
import { Leva, useControls } from "leva";

export default function Scene({ engineRef }: any) {
    const controls = useControls({
        mode: {
            value: "combined",
            options: ["liquid", "particles", "combined"],
        },

        bassMultiplier: { value: 1, min: 0.5, max: 5 },
        particleIntensity: { value: 1, min: 0.1, max: 5 },
        bloomIntensity: { value: 1.5, min: 0, max: 5 },
    });

    return (
        <>
            <Leva collapsed />

            <Canvas camera={{ position: [0, 0, 3] }}>
                {/* 🎛 MODE SWITCHING */}
                {controls.mode === "liquid" && (
                    <Liquid engineRef={engineRef} controls={controls} />
                )}

                {controls.mode === "particles" && (
                    <Particles engineRef={engineRef} controls={controls} />
                )}

                {controls.mode === "combined" && (
                    <>
                        <Liquid engineRef={engineRef} controls={controls} />
                        <Particles engineRef={engineRef} controls={controls} />
                    </>
                )}

                {/* ✨ BLOOM */}
                <EffectComposer>
                    <Bloom
                        intensity={controls.bloomIntensity}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                    />
                </EffectComposer>
            </Canvas>
        </>
    );
}