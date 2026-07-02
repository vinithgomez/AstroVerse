import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import EarthScene from './EarthScene'

// Renders nothing; fires onReady exactly once, after Suspense resolves.
// Must live inside the same Suspense as EarthScene so it only mounts once
// all textures have finished loading.
function ReadySignal({ onReady }) {
  useEffect(() => { onReady() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

// On-brand loading indicator — shown while textures are in-flight.
// Uses an SVG animated stroke so no CSS keyframe injection is needed.
function CanvasLoader() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        {/* Dim track */}
        <circle cx="18" cy="18" r="13" stroke="rgba(79,142,247,0.12)" strokeWidth="2.5" />
        {/* Animated arc */}
        <circle
          cx="18" cy="18" r="13"
          stroke="#4f8ef7"
          strokeWidth="2.5"
          strokeDasharray="20 62"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  )
}

export default function EarthCanvas({ heroProgress, lowEnd }) {
  const [ready, setReady] = useState(false)

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {/* Loading indicator — visible until all textures have resolved */}
      {!ready && <CanvasLoader />}

      {/* Canvas container — starts rendering immediately (kicks off texture
          fetches via the module-level preload() calls in EarthScene) but stays
          transparent until ReadySignal fires, then fades in smoothly.         */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: ready ? 1 : 0,
          transition: ready ? 'opacity 0.9s ease' : 'none',
        }}
      >
        <Canvas
          gl={{ antialias: !lowEnd, powerPreference: 'high-performance' }}
          dpr={lowEnd ? 1 : Math.min(window.devicePixelRatio, 2)}
          style={{ background: 'transparent' }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
          <Suspense fallback={null}>
            <EarthScene heroProgress={heroProgress} lowEnd={lowEnd} />
            {/* ReadySignal is inside the Suspense so it only mounts after
                EarthScene's useHeroTexture calls have all resolved.           */}
            <ReadySignal onReady={() => setReady(true)} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
