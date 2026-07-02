import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '../lib/textureLoader'
import { FRESNEL_VERTEX, FRESNEL_FRAGMENT, fresnelUniforms } from './shaders/fresnel'
import { dynamicHitRadius } from './hitRadius'
import { sun } from '../data/planets'

const ORIGIN = new THREE.Vector3(0, 0, 0)

export default function Sun({ onSelect, registerRef, lowEnd }) {
  const meshRef = useRef()
  const hitRef  = useRef()
  const { gl } = useThree()
  const texture = useTexture(sun.textures.map, lowEnd ? 3072 : 8192)

  useMemo(() => {
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  }, [texture, gl])

  // Rim-only Fresnel glow on a slightly larger shell — the same technique as
  // the landing-page Earth atmosphere. A proper GLSL alpha falloff (not a CSS
  // radial-gradient) never produces the hard edge noted in CLAUDE.md §6.
  // Kept tight (small scale, higher exponent) so it reads as a crisp glow at
  // any zoom rather than a soft blur — the actual softness previously seen
  // was DPR=1 + no antialiasing from an over-eager low-quality default, not
  // this shell (see ExplorerPage's quality default fix).
  const coronaUniforms = useMemo(() => fresnelUniforms(sun.color, 3.5, 0.5), [])

  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.02
    if (hitRef.current) {
      const r = dynamicHitRadius(state.camera, state.size, ORIGIN, sun.scene.radius * 1.6)
      hitRef.current.scale.setScalar(r)
    }
  })

  return (
    <group
      ref={el => registerRef?.('sun', el)}
      onClick={e => { e.stopPropagation(); onSelect?.('sun') }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'auto' }}
    >
      {/* Primary light source for the whole scene. Intensity tuned down from
          an earlier 6 — combined with the 0.85 Bloom threshold, directly-lit
          planet faces (bright side facing the Sun) were crossing it and
          rendering as blown-out white circles instead of their textures. */}
      <pointLight color="#fff6e0" intensity={4.5} decay={2} />
      <ambientLight intensity={0.12} />

      <mesh ref={meshRef}>
        <sphereGeometry args={[sun.scene.radius, lowEnd ? 32 : 96, lowEnd ? 32 : 96]} />
        {/* toneMapped=false keeps this reliably above the Bloom luminance
            threshold regardless of scene exposure — see Scene.jsx comment. */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Dynamically-sized invisible hit-sphere, consistent with Planet.jsx,
          so the Sun stays easy to click even when tiny at the default wide
          zoom (its own corona shell already helps, but this guarantees it). */}
      <mesh ref={hitRef}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh scale={1.12}>
        <sphereGeometry args={[sun.scene.radius, 32, 32]} />
        <shaderMaterial
          vertexShader={FRESNEL_VERTEX}
          fragmentShader={FRESNEL_FRAGMENT}
          uniforms={coronaUniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
