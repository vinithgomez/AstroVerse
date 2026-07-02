import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Starfield from './Starfield'
import Sun from './Sun'
import Planet from './Planet'
import CameraRig from './CameraRig'
import { sun, planets, moons } from '../data/planets'

export default function Scene({
  playingRef, speedRef, showOrbits, showLabels, lowEnd,
  selectedId, onSelect, resetSignal, defaultPosition, freeCam,
}) {
  const bodyRefs = useRef({})
  const registerRef = (id, obj) => {
    if (obj) bodyRefs.current[id] = obj
    else delete bodyRefs.current[id]
  }

  // Pluto's own orbit distance alone isn't a safe "does it fit on screen"
  // bound — depending on where it currently sits around that orbit, its
  // worst-case (edge-on) screen position needs roughly orbitRadius/sin(halfFOV)
  // of camera distance to stay in frame. 2.4× gives comfortable headroom
  // without zooming the default view out so far the inner planets vanish.
  const maxDistance = Math.max(...planets.map(p => p.scene.distance)) * 2.4

  const planetProps = {
    playingRef, speedRef, showOrbits, showLabels,
    selectedId, onSelect, registerRef, lowEnd,
  }

  return (
    <>
      <Starfield lowEnd={lowEnd} />

      <Sun onSelect={onSelect} registerRef={registerRef} lowEnd={lowEnd} />

      {planets.map(body => (
        <Planet key={body.id} body={body} {...planetProps}>
          {body.id === 'earth' && moons.map(m => (
            <Planet key={m.id} body={m} {...planetProps} />
          ))}
        </Planet>
      ))}

      <CameraRig
        selectedId={selectedId}
        bodyRefs={bodyRefs}
        defaultPosition={defaultPosition}
        resetSignal={resetSignal}
        freeCam={freeCam}
      />

      {/* enableDamping deliberately OFF: OrbitControls' damping keeps a hidden
          internal rotation-velocity/spherical-delta state that decays across
          many frames rather than resolving in the one that applied it. That's
          fine for pure user-driven dragging, but this scene ALSO drives the
          camera programmatically (click-to-focus, return-to-default, the
          Free Roam entry snap in CameraRig) — mixing direct position/target
          writes with damping's carried-over internal state produced a
          reproducible bug: select a planet, deselect, enable Free Roam, then
          drag, and the scene would render solid black (even the skybox)
          indefinitely. Camera position/target were verified sane via debug
          logging when this happened, which pointed at OrbitControls' own
          internal bookkeeping rather than anything in CameraRig. Turning off
          damping means every update() fully resolves in the frame it's
          called, leaving no hidden state to desync — at the cost of the
          camera stopping instantly on release instead of gliding briefly. */}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={sun.scene.radius * 1.8}
        maxDistance={maxDistance}
      />

      {/* Luminance-threshold bloom — simpler and more robust than object-
          selection SelectiveBloom, and achieves the same "Sun only" result
          because the Sun is the only toneMapped=false / emissive-bright
          object in the scene; lit planet surfaces never cross the threshold. */}
      <EffectComposer multisampling={lowEnd ? 0 : 8}>
        <Bloom
          luminanceThreshold={0.95}
          luminanceSmoothing={0.2}
          intensity={lowEnd ? 0.4 : 0.65}
          mipmapBlur
          radius={0.3}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
  )
}
