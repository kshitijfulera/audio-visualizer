uniform float uTime;
uniform float uBass;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // 🌊 Controlled wave
  float wave = sin(uv.y * 10.0 + uTime * 2.0) * 0.05;

  // 🎯 Clamp bass influence
  float bass = clamp(uBass, 0.0, 1.0);

  // Apply distortion safely
  uv.x += wave * (0.3 + bass);

  // 🔒 Clamp UVs to avoid stretching
  uv = clamp(uv, 0.0, 1.0);

  // 🎨 Smooth gradient color
  vec3 color = mix(
    vec3(0.1, 0.2, 0.8),   // blue
    vec3(1.0, 0.2, 0.6),   // pink
    uv.x + bass * 0.5
  );

  gl_FragColor = vec4(color, 1.0);
}