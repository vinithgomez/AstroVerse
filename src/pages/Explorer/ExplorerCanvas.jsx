import { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Scene from '../../three/Scene'
import LoadingScreen from './LoadingScreen'

// Starting camera position: 30–45° above the ecliptic plane (CLAUDE.md §6
// decision), cinematic 3/4 azimuth so the whole system reads at a glance.
const ELEVATION_DEG = 35
const AZIMUTH_DEG   = 35
const DISTANCE      = 120

function computeDefaultPosition() {
  const e = THREE.MathUtils.degToRad(ELEVATION_DEG)
  const a = THREE.MathUtils.degToRad(AZIMUTH_DEG)
  return new THREE.Vector3(
    DISTANCE * Math.cos(e) * Math.cos(a),
    DISTANCE * Math.sin(e),
    DISTANCE * Math.cos(e) * Math.sin(a),
  )
}

const DEFAULT_POSITION = computeDefaultPosition()
// A stable array reference, computed once at module scope. Passing
// `DEFAULT_POSITION.toArray()` directly in JSX created a NEW array every
// render of ExplorerCanvas (e.g. from toggling any control-bar button) —
// drei's <PerspectiveCamera> re-applies its `position` prop whenever that
// reference changes, so the camera was silently snapping back to the
// default view on almost any interaction. This was the root cause of the
// "camera always resets" bug.
const DEFAULT_POSITION_ARR = DEFAULT_POSITION.toArray()

// Fires once, after Suspense resolves (all textures loaded) — same pattern
// as Home/EarthCanvas.jsx's ReadySignal.
function ReadySignal({ onReady }) {
  useEffect(() => { onReady() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export default function ExplorerCanvas({
  playingRef, speedRef, showOrbits, showLabels, lowEnd,
  selectedId, onSelect, resetSignal, freeCam,
}) {
  const [ready, setReady] = useState(false)

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {!ready && <LoadingScreen />}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: ready ? 1 : 0,
          transition: ready ? 'opacity 1s ease' : 'none',
        }}
      >
        <Canvas
          gl={{ antialias: !lowEnd, powerPreference: 'default' }}
          dpr={lowEnd ? 1 : Math.min(window.devicePixelRatio, 2)}
          onPointerMissed={() => onSelect(null)}
        >
          <PerspectiveCamera makeDefault position={DEFAULT_POSITION_ARR} fov={50} near={0.1} far={2000} />
          <Suspense fallback={null}>
            <Scene
              playingRef={playingRef}
              speedRef={speedRef}
              showOrbits={showOrbits}
              showLabels={showLabels}
              lowEnd={lowEnd}
              selectedId={selectedId}
              onSelect={onSelect}
              resetSignal={resetSignal}
              defaultPosition={DEFAULT_POSITION}
              freeCam={freeCam}
            />
            <ReadySignal onReady={() => setReady(true)} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
