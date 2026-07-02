import * as THREE from 'three'

const TARGET_PIXEL_RADIUS = 11

/**
 * A fixed world-space hit-sphere radius is only clickable-sized at the
 * distance it was tuned for — at the Explorer's wide default zoom (needed to
 * fit Pluto's whole orbit in frame), a "generous" 0.5-unit sphere for a small
 * body projects to only a few screen pixels. This instead targets a roughly
 * constant ON-SCREEN pixel radius regardless of camera distance, clamped so
 * it never shrinks below the body's own visible/ring size or grows enough to
 * swallow a neighboring orbit at extreme zoom-out.
 */
export function dynamicHitRadius(camera, size, worldPos, minRadius, maxRadius = 2.0) {
  const dist = camera.position.distanceTo(worldPos)
  const vFovRad = THREE.MathUtils.degToRad(camera.fov)
  const worldPerPixel = (2 * dist * Math.tan(vFovRad / 2)) / size.height
  const desired = worldPerPixel * TARGET_PIXEL_RADIUS
  return THREE.MathUtils.clamp(desired, minRadius, maxRadius)
}
