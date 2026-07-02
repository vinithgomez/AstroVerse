import * as THREE from 'three'

// Module-level caches — persist for the page lifetime so textures are never
// fetched twice and the suspend pattern works correctly across re-renders.
const resolved = new Map()  // url → THREE.Texture
const pending  = new Map()  // url → Promise<void>

async function fetchAndResize(url, maxWidth) {
  const resp = await fetch(url)
  const blob = await resp.blob()

  const source = await createImageBitmap(blob)

  // Clamp to maxWidth (or keep original size if already smaller)
  const w = Math.min(source.width, maxWidth)
  const h = Math.round(source.height * (w / source.width))

  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  // WebGL 2 ignores UNPACK_FLIP_Y_WEBGL for ImageBitmap sources, so
  // THREE.Texture.flipY = true has no effect on ImageBitmap.  We pre-flip
  // vertically here using a canvas 2-D transform instead — universally
  // supported — then set flipY = false on the texture so Three.js does NOT
  // attempt a second flip.
  ctx.translate(0, h)
  ctx.scale(1, -1)
  ctx.drawImage(source, 0, 0, w, h)
  source.close()

  return createImageBitmap(canvas)
}

function kick(url, maxWidth) {
  if (resolved.has(url) || pending.has(url)) return
  pending.set(
    url,
    fetchAndResize(url, maxWidth).then(bitmap => {
      const tex = new THREE.Texture(bitmap)
      tex.colorSpace  = THREE.SRGBColorSpace
      tex.flipY       = false  // pre-flipped in fetchAndResize; avoid double-flip
      tex.needsUpdate = true
      resolved.set(url, tex)
    })
  )
}

/**
 * Start fetching a texture before the component that needs it mounts.
 * Call at module scope so all downloads fire in parallel.
 */
export function preload(url, maxWidth = 4096) {
  kick(url, maxWidth)
}

/**
 * Suspend-compatible hook. Throws the pending Promise while loading (React
 * Suspense catches it), returns the THREE.Texture once resolved.
 */
export function useTexture(url, maxWidth = 4096) {
  if (!resolved.has(url)) {
    kick(url, maxWidth)
    throw pending.get(url)
  }
  return resolved.get(url)
}
