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
          object in the scene; lit planet surfaces never cross the threshold.

          `mipmapBlur` is permanently OFF here, in BOTH quality modes — this
          is the final fix for the long-standing black-screen bug (CLAUDE.md
          §8), closed out 2026-07-10 after finally reproducing and screenshot-
          verifying it against real GPU hardware (an AMD Radeon via ANGLE/
          D3D11 — Playwright launched with `--use-gl=angle --use-angle=d3d11
          --ignore-gpu-blocklist`, NOT the software/SwiftShader fallback
          headless Chromium uses by default, which never reproduced this bug
          in any earlier session).

          Two earlier fix attempts targeted the wrong variable:
          1. First diagnosis (an earlier session, different reporting
             context): assumed `multisampling: 0` + `mipmapBlur` was the bad
             combo specifically in LOW quality mode, and "fixed" it with
             `mipmapBlur={!lowEnd}` (i.e. mipmapBlur ON in high mode, OFF in
             low mode) + multisampling left at `lowEnd ? 0 : 8`. That code
             shipped but was never actually screenshot-verified — it just
             looked plausible on paper.
          2. This session's real-GPU screenshot pass proved that fix was
             backwards for at least this hardware: LOW quality (mipmapBlur
             off) rendered perfectly every time — Sun, planets, orbits,
             starfield, all correct. HIGH quality (mipmapBlur ON) went solid
             black — Sun, planets, orbits, and starfield all invisible,
             only the DOM-overlaid text labels still showing — on a cold
             load, after toggling low→high, and on an Earth close-up.
             Oddly, a Saturn close-up in nominally the same HIGH/mipmapBlur-
             on state rendered fine, which rules out a purely deterministic
             per-mode bug and points instead at a genuine race in the
             driver's mip-chain generation for the Bloom render target —
             i.e. mipmapBlur is unsafe on this GPU regardless of framing,
             it just doesn't fail on literally every single frame.

          Given mipmapBlur has now caused a full black-screen failure in TWO
          separate real-GPU/driver combinations (whatever produced the
          original low-quality report, and this session's AMD/ANGLE/D3D11
          setup) under DIFFERENT multisampling values each time, the only
          fix that isn't just "reshuffle which mode is currently lucky" is
          to never use it at all. `radius` was bumped 0.3 → 0.45 and low-
          mode `intensity` 0.4 → 0.5 to compensate for losing mipmapBlur's
          extra softness/spread — see the visual-quality pass below.

          `multisampling` is ALSO now forced to 0 in both modes, not just
          low. With mipmapBlur removed, the full-canvas black screen is
          gone at multisampling=8 (the high-quality value) — but a smaller,
          related artifact remained: a sharp solid-black rectangle
          corrupting the frame directly around a planet's label (Neptune,
          reproduced consistently), never happening at multisampling=0.
          This is the exact same failure signature already documented above
          for `multisampling: 2` in an earlier session ("some drivers
          mishandle an arbitrary/unsupported sample count in the render
          target resolve step, corrupting exactly the brightest region of
          the frame") — just triggered by 8x instead of 2x on this
          particular driver. Between three separate observed sample counts
          (2, 8, and implicitly whatever the original low-quality report's
          GPU choked on) all causing resolve corruption of some kind, and
          only 0 ever being clean across every test, nonzero multisampling
          on the EffectComposer isn't safe on this hardware at any value —
          so it's off unconditionally. The base WebGL context's own
          `antialias` prop (set in ExplorerCanvas.jsx, still `!lowEnd`)
          is a separate, unrelated antialiasing mechanism applied before
          post-processing even runs, so high quality doesn't lose edge AA
          entirely by dropping this. */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.95}
          luminanceSmoothing={0.2}
          intensity={lowEnd ? 0.5 : 0.75}
          mipmapBlur={false}
          radius={0.45}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
  )
}
