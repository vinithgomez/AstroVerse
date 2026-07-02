import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getBody } from '../data/planets'

const DAMP   = 2.2 // higher = snappier convergence; tuned for a ~1.5s feel
const ORIGIN = new THREE.Vector3(0, 0, 0)

/**
 * Drives the camera in two distinct modes:
 *  - selectedId set: continuously follow that (moving) body every frame.
 *  - otherwise: camera is fully free (OrbitControls only) — EXCEPT for a
 *    transient "return to default" animation fired the moment a selection is
 *    cleared or Reset Camera is pressed, which stops driving the camera once
 *    it arrives. Without this transient/free split, a naive "always lerp
 *    toward default when nothing's selected" would fight the user's own
 *    drag/zoom on every frame, making free roaming impossible.
 *
 * freeCam (Free Roam toggle in ControlBar) is a HARD gate at the top of the
 * frame loop: when it's on, this component does not touch the camera at all,
 * full stop — not the follow-on-select behavior, not the return-to-default
 * transient either. Previously only the follow branch checked freeCam, so a
 * return-to-default already in flight (e.g. from closing the info panel
 * moments earlier) kept fighting the user's drag even with Free Roam on —
 * exactly the "turning it on still behaves like off" glitch reported. Now
 * ANY pending return simply pauses while freeCam is true and resumes the
 * instant it's turned off. Reset Camera itself always disables Free Roam
 * (see ExplorerPage's handleReset) so the button is guaranteed to visibly
 * take effect regardless of the toggle's state.
 */
export default function CameraRig({ selectedId, bodyRefs, defaultPosition, resetSignal, freeCam }) {
  const { camera, controls } = useThree()
  const desiredPos   = useMemo(() => new THREE.Vector3(), [])
  const bodyWorldPos = useMemo(() => new THREE.Vector3(), [])
  const offsetDir    = useMemo(() => new THREE.Vector3(1, 0.55, 1).normalize(), [])

  const returning    = useRef(false)
  const prevSelected = useRef(selectedId)
  const prevReset    = useRef(resetSignal)

  useEffect(() => {
    const clearedSelection = prevSelected.current !== null && selectedId === null
    const resetPressed     = resetSignal !== prevReset.current
    if (clearedSelection || resetPressed) returning.current = true
    prevSelected.current = selectedId
    prevReset.current    = resetSignal
  }, [selectedId, resetSignal])

  // Entering Free Roam mid-transient used to just FREEZE camera.position and
  // controls.target wherever their independent lerps happened to be —
  // heading toward two DIFFERENT destinations (a followed body vs. the
  // default view). That leaves them a badly mismatched pair: OrbitControls
  // derives its rotation radius from the vector between them, and a wildly
  // wrong radius can put the next drag's camera position far outside the
  // starfield sphere — an all-black scene that never recovers on its own.
  // So instead of freezing mid-flight, snap instantly to a fully consistent
  // pair the moment Free Roam engages, then hand off to pure OrbitControls.
  useEffect(() => {
    if (!freeCam || !controls) return

    if (selectedId && bodyRefs.current[selectedId]) {
      bodyRefs.current[selectedId].getWorldPosition(bodyWorldPos)
      const body = getBody(selectedId)
      const dist = (body?.scene.radius ?? 1) * 5.5
      camera.position.copy(bodyWorldPos).addScaledVector(offsetDir, dist)
      controls.target.copy(bodyWorldPos)
    } else if (returning.current) {
      camera.position.copy(defaultPosition)
      controls.target.copy(ORIGIN)
    }

    returning.current = false
    controls.update()
    // Only the freeCam transition itself should trigger this snap — other
    // values are read fresh from closure at that moment, not tracked here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeCam])

  useFrame((_, delta) => {
    if (!controls || freeCam) return
    const t = 1 - Math.exp(-delta * DAMP)

    if (selectedId && bodyRefs.current[selectedId]) {
      returning.current = false
      bodyRefs.current[selectedId].getWorldPosition(bodyWorldPos)
      const body = getBody(selectedId)
      const dist = (body?.scene.radius ?? 1) * 5.5
      desiredPos.copy(bodyWorldPos).addScaledVector(offsetDir, dist)

      camera.position.lerp(desiredPos, t)
      controls.target.lerp(bodyWorldPos, t)
      controls.update()
      return
    }

    if (returning.current) {
      camera.position.lerp(defaultPosition, t)
      controls.target.lerp(ORIGIN, t)
      controls.update()
      if (camera.position.distanceTo(defaultPosition) < 0.05 && controls.target.length() < 0.05) {
        returning.current = false
      }
    }
  })

  return null
}
