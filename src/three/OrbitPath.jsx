import { useMemo } from 'react'
import * as THREE from 'three'

// Circular approximation of each body's orbit — real eccentricities aren't
// in the verified dataset (orbital-data.txt only covers period/tilt/radius/
// distance), and every planet besides Mercury and Pluto is close enough to
// circular that the difference wouldn't read visually at this scale anyway.
export default function OrbitPath({ radius, color = '#ffffff', opacity = 0.15, segments = 128 }) {
  const geometry = useMemo(() => {
    const points = []
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius, segments])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}
