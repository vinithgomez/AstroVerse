import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Billboards automatically (Html always faces the camera). distanceFactor
// makes it shrink/grow with camera distance like a real world-space object
// rather than staying a constant screen size. Opacity is driven imperatively
// via a direct style mutation in useFrame — never React state — so orbiting
// planets don't trigger a re-render every frame.
export default function PlanetLabel({ name, radius, visible }) {
  const groupRef = useRef()
  const divRef   = useRef()
  const { camera } = useThree()
  const worldPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!groupRef.current || !divRef.current) return
    groupRef.current.getWorldPosition(worldPos)
    const dist = camera.position.distanceTo(worldPos)

    const hideBelow = radius * 3.2
    const fadeRange = radius * 2.5
    const opacity = visible
      ? THREE.MathUtils.clamp((dist - hideBelow) / fadeRange, 0, 1)
      : 0

    divRef.current.style.opacity = opacity
    divRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none'
  })

  return (
    <group ref={groupRef} position={[0, radius * 1.7, 0]}>
      <Html center distanceFactor={60} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div
          ref={divRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#f0f4ff',
            textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s linear',
            userSelect: 'none',
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  )
}
