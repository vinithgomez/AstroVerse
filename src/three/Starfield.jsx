import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '../lib/textureLoader'

// Large inverted skybox sphere, slow independent auto-rotation — deliberately
// not tied to playingRef/speedRef so the background keeps a faint sense of
// motion even while the simulation is paused.
export default function Starfield({ lowEnd }) {
  const meshRef = useRef()
  const texture = useTexture('/textures/Skybox/8k_stars_milky_way.jpg', lowEnd ? 2048 : 4096)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.004
  })

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[600, lowEnd ? 24 : 48, lowEnd ? 24 : 48]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}
