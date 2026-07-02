import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { preload, useTexture } from '../../lib/textureLoader'

// ── Kick off all texture downloads the moment this module is evaluated ────────
// All fetches run in parallel so the total wait is max(individual loads),
// not the sum.  4 K for the Earth maps is plenty for a hero section where
// the sphere is ~300 px in diameter; the full 8 K files are reserved for the
// Explorer page.  Clouds only need 2 K.
preload('/textures/earth/8k_earth_daymap.jpg',       4096)
preload('/textures/earth/8k_earth_nightmap.jpg',      4096)
preload('/textures/earth/8k_earth_clouds.jpg',        2048)
preload('/textures/Skybox/8k_stars_milky_way.jpg',   4096)

// ── Fresnel atmosphere shader ────────────────────────────────────────────────
const ATM_VERT = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`
const ATM_FRAG = `
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

// ── Drag constants ───────────────────────────────────────────────────────────
const AUTO_SPEED    = 0.05   // rad/s idle self-rotation
const SENS_H        = 0.005  // rad/px horizontal drag
const SENS_V        = 0.003  // rad/px vertical drag
const TILT_LIMIT    = 0.28   // max X-axis tilt (≈16°)
const COMMIT_PX     = 6      // px before direction is committed
const RESUME_MS     = 2000   // ms after release before auto-rotation resumes

// ── Sub-components ───────────────────────────────────────────────────────────
function StarfieldSphere({ lowEnd }) {
  const meshRef = useRef()
  const texture = useTexture('/textures/Skybox/8k_stars_milky_way.jpg', 4096)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.006
  })

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[400, lowEnd ? 16 : 32, lowEnd ? 16 : 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

function StarPoints({ count }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 180 + Math.random() * 50
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#ffffff" sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

function AtmosphereMesh() {
  const uniforms = useMemo(() => ({
    glowColor: { value: new THREE.Color(0x4f8ef7) },
    exponent:  { value: 3.8 },
    intensity: { value: 1.2 },
  }), [])

  return (
    <mesh>
      <sphereGeometry args={[2.72, 64, 64]} />
      <shaderMaterial
        vertexShader={ATM_VERT}
        fragmentShader={ATM_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ── Main scene ───────────────────────────────────────────────────────────────
export default function EarthScene({ heroProgress, lowEnd = false }) {
  const earthGroupRef = useRef()
  const cloudsRef     = useRef()
  const { gl } = useThree()

  // ── Rotation state (absolute, so scroll-driven position/scale stays separate)
  const rotY         = useRef(0)   // accumulated Y rotation (auto + drag)
  const rotX         = useRef(0)   // X-axis tilt from drag (clamped)
  const isAutoActive = useRef(true) // false while dragging / during 2s idle
  const resumeTimer  = useRef(null)

  // ── Textures — suspend-compatible; all fetches already in-flight (see top) ─
  const dayMap    = useTexture('/textures/earth/8k_earth_daymap.jpg',  4096)
  const nightMap  = useTexture('/textures/earth/8k_earth_nightmap.jpg', 4096)
  const cloudsMap = useTexture('/textures/earth/8k_earth_clouds.jpg',   2048)

  // Set max anisotropy once per texture (needs GL context — can't do in hook)
  useMemo(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy()
    ;[dayMap, nightMap, cloudsMap].forEach(t => { t.anisotropy = maxAniso })
  }, [dayMap, nightMap, cloudsMap, gl])

  // ── Drag interaction via canvas DOM events ────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement

    // Let the browser handle vertical pan (native scroll) on touch devices.
    // Horizontal drags are captured by JS below.
    canvas.style.touchAction = 'pan-y'
    canvas.style.cursor = 'grab'

    let dragging   = false
    let committed  = false
    let sx = 0, sy = 0, lx = 0, ly = 0

    const handleDown = (e) => {
      dragging  = true
      committed = false
      clearTimeout(resumeTimer.current)
      isAutoActive.current = false
      sx = lx = e.clientX
      sy = ly = e.clientY
    }

    const handleMove = (e) => {
      if (!dragging) return

      if (!committed) {
        const adx = Math.abs(e.clientX - sx)
        const ady = Math.abs(e.clientY - sy)
        if (adx < COMMIT_PX && ady < COMMIT_PX) return // not enough movement yet

        if (ady > adx) {
          // Vertical dominant → cancel drag so native scroll can take over
          dragging = false
          canvas.style.cursor = 'grab'
          resumeTimer.current = setTimeout(() => { isAutoActive.current = true }, 400)
          return
        }

        // Horizontal dominant → commit to drag and capture
        committed = true
        try { canvas.setPointerCapture(e.pointerId) } catch {}
        canvas.style.cursor = 'grabbing'
        lx = e.clientX
        ly = e.clientY
        return
      }

      const dx = e.clientX - lx
      const dy = e.clientY - ly
      rotY.current += dx * SENS_H
      rotX.current = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, rotX.current + dy * SENS_V))
      lx = e.clientX
      ly = e.clientY
    }

    const handleUp = (e) => {
      if (!dragging) return
      if (committed) {
        try { canvas.releasePointerCapture(e.pointerId) } catch {}
      }
      dragging  = false
      committed = false
      canvas.style.cursor = 'grab'
      // Resume auto-rotation after RESUME_MS of stillness
      resumeTimer.current = setTimeout(() => { isAutoActive.current = true }, RESUME_MS)
    }

    canvas.addEventListener('pointerdown',   handleDown)
    canvas.addEventListener('pointermove',   handleMove)
    canvas.addEventListener('pointerup',     handleUp)
    canvas.addEventListener('pointercancel', handleUp)

    return () => {
      canvas.removeEventListener('pointerdown',   handleDown)
      canvas.removeEventListener('pointermove',   handleMove)
      canvas.removeEventListener('pointerup',     handleUp)
      canvas.removeEventListener('pointercancel', handleUp)
      canvas.style.touchAction = ''
      canvas.style.cursor = ''
      clearTimeout(resumeTimer.current)
    }
  }, [gl])

  // ── Per-frame update ──────────────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!earthGroupRef.current) return

    // Auto self-rotation (paused while user has interacted)
    if (isAutoActive.current) {
      rotY.current += delta * AUTO_SPEED
    }

    // Apply rotation — only Y and X, never position/scale (those are scroll-driven)
    earthGroupRef.current.rotation.y = rotY.current
    earthGroupRef.current.rotation.x = rotX.current

    // Clouds drift independently in local space
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.035

    // ── Scroll-driven: drift right + recede (progress 0.35 → 1.0) ─────────
    // This is PURELY position and scale — never touches rotation
    const p = heroProgress?.current ?? 0
    const anim  = Math.max(0, (p - 0.35) / 0.65)
    const eased = anim < 0.5
      ? 2 * anim * anim
      : 1 - Math.pow(-2 * anim + 2, 2) / 2

    earthGroupRef.current.position.x = eased * 3.2
    earthGroupRef.current.scale.setScalar(1 - eased * 0.42)
  })

  return (
    <>
      <StarfieldSphere lowEnd={lowEnd} />
      <StarPoints count={lowEnd ? 800 : 2000} />

      <directionalLight position={[-5, 3, 5]} intensity={1.8} color="#fff5e0" />
      <ambientLight intensity={0.06} />

      <group ref={earthGroupRef}>
        <mesh>
          <sphereGeometry args={[2.5, lowEnd ? 32 : 64, lowEnd ? 32 : 64]} />
          <meshPhongMaterial
            map={dayMap}
            emissiveMap={nightMap}
            emissive={new THREE.Color(0x223355)}
            emissiveIntensity={0.35}
            specular={new THREE.Color(0x336699)}
            shininess={18}
          />
        </mesh>

        {!lowEnd && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[2.52, 64, 64]} />
            <meshPhongMaterial map={cloudsMap} transparent opacity={0.38} depthWrite={false} />
          </mesh>
        )}

        {!lowEnd && <AtmosphereMesh />}
      </group>
    </>
  )
}
