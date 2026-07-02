// Shared Fresnel-rim shaders for the Explorer scene.
//
// Both the planet atmosphere glow and the Sun's corona use the same
// view-angle-dependent falloff (computed entirely in GLSL, driven by the
// shader's own alpha channel) — this sidesteps the landing-page Sun-glow bug
// noted in CLAUDE.md §6 ("Section 2 Sun glow fix"), where a CSS radial-gradient
// interpolating `transparent` through implicit black produced a hard visible
// edge. A real alpha falloff has no such edge because there is no color
// channel to interpolate through in the first place.

export const FRESNEL_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`

export const FRESNEL_FRAGMENT = /* glsl */ `
  uniform vec3 glowColor;
  uniform float exponent;
  uniform float intensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - max(0.0, dot(vViewDir, vNormal)), exponent);
    gl_FragColor = vec4(glowColor, fresnel * intensity);
  }
`

import * as THREE from 'three'

export function fresnelUniforms(colorHex, exponent = 3.5, intensity = 1.0) {
  return {
    glowColor: { value: new THREE.Color(colorHex) },
    exponent:  { value: exponent },
    intensity: { value: intensity },
  }
}
