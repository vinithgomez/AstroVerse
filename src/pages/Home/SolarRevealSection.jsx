import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ── Planet data ───────────────────────────────────────────────────────────────
const PLANETS = [
  { name: 'Sun',     size: 78, isStar: true,  texture: '/textures/sun/8k_sun.jpg',                color: '#FDB813', glow: 'rgba(253,184,19,0.28)'   },
  { name: 'Mercury', size: 13,                 texture: '/textures/mercury/8k_mercury.jpg',         color: '#9c9c9c', glow: 'rgba(180,180,180,0.25)'  },
  { name: 'Venus',   size: 20,                 texture: '/textures/venus/4k_venus_atmosphere.jpg',  color: '#deb887', glow: 'rgba(232,205,160,0.25)'  },
  { name: 'Earth',   size: 22,                 texture: '/textures/earth/8k_earth_daymap.jpg',      color: '#1a6ba0', glow: 'rgba(79,142,247,0.35)'   },
  { name: 'Mars',    size: 16,                 texture: '/textures/mars/8k_mars.jpg',               color: '#8b2500', glow: 'rgba(193,68,14,0.3)'     },
  { name: 'Jupiter', size: 56,                 texture: '/textures/Jupiter/8k_jupiter.jpg',         color: '#c88b3a', glow: 'rgba(200,139,58,0.3)'    },
  { name: 'Saturn',  size: 46, hasRing: true,  texture: '/textures/saturn/8k_saturn.jpg',           color: '#d4b96a', glow: 'rgba(228,209,145,0.25)' },
  { name: 'Uranus',  size: 32,                 texture: '/textures/uranus/2k_uranus.jpg',           color: '#5ec8c8', glow: 'rgba(125,232,232,0.25)'  },
  { name: 'Neptune', size: 30,                 texture: '/textures/neptune/2k_neptune.jpg',         color: '#3444aa', glow: 'rgba(63,84,186,0.3)'     },
]

// ── Star dots: computed once at module load — Math.random() never runs on render
const STAR_DOTS = Array.from({ length: 80 }, (_, i) => ({
  id:      i,
  top:     (i * 47 % 97) + (i % 3) * 0.4,
  left:    (i * 83 % 97) + (i % 5) * 0.3,
  size:    (i % 3) * 0.5 + 0.5,
  opacity: (i % 5) * 0.08 + 0.1,
}))

// ── Texture loading: fetch → createImageBitmap (off main thread) → tiny canvas ─
// Module-level cache so re-mounts never re-fetch.
const textureCache = new Map()  // url → Promise<ImageBitmap>

function targetPx(displaySize) {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
  // 2× physical pixels, capped at 256. Far smaller than 8K for a 78 px sphere.
  return Math.min(Math.ceil(displaySize * dpr * 2), 256)
}

async function fetchAndScale(url, px) {
  const resp   = await fetch(url)
  const blob   = await resp.blob()
  // Decode off the main thread — won't stall the scroll animation
  const source = await createImageBitmap(blob)
  const w = Math.min(source.width, px)
  const h = Math.round(source.height * (w / source.width))
  const cvs = document.createElement('canvas')
  cvs.width = w; cvs.height = h
  cvs.getContext('2d').drawImage(source, 0, 0, w, h)
  source.close()
  return createImageBitmap(cvs)
}

function getBitmap(planet) {
  if (!textureCache.has(planet.texture)) {
    textureCache.set(planet.texture, fetchAndScale(planet.texture, targetPx(planet.size)))
  }
  return textureCache.get(planet.texture)
}

// ── Canvas painting helpers ───────────────────────────────────────────────────
function paintFallback(canvas, color) {
  const ctx = canvas.getContext('2d')
  const r = canvas.width / 2
  ctx.beginPath()
  ctx.arc(r, r, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

function paintWithTexture(canvas, bitmap, isStar) {
  const ctx = canvas.getContext('2d')
  const dw = canvas.width, dh = canvas.height

  ctx.save()
  ctx.beginPath()
  ctx.arc(dw / 2, dh / 2, dw / 2, 0, Math.PI * 2)
  ctx.clip()

  // Object-fit: cover — equirectangular textures are 2:1; scale to fill the
  // square canvas so the equatorial band is always centered and visible.
  const sw = bitmap.width, sh = bitmap.height
  const scale = Math.max(dw / sw, dh / sh)
  const ox = (dw - sw * scale) / 2
  const oy = (dh - sh * scale) / 2
  ctx.drawImage(bitmap, ox, oy, sw * scale, sh * scale)

  // Directional shading: bright top-left, dark bottom-right (planet).
  // Star gets a gentle centre-vignette — it emits light rather than reflects.
  const g = isStar
    ? ctx.createRadialGradient(dw * 0.44, dh * 0.40, dw * 0.10, dw * 0.50, dh * 0.50, dw * 0.50)
    : ctx.createRadialGradient(dw * 0.30, dh * 0.27, 0,          dw * 0.55, dh * 0.55, dw * 0.72)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, isStar ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.70)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, dw, dh)

  ctx.restore()
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SaturnRing({ size }) {
  return (
    <div
      aria-hidden
      style={{
        position:     'absolute',
        top:          '50%',
        left:         '50%',
        transform:    'translate(-50%, -50%) rotate(-22deg)',
        width:         size * 2.2,
        height:        size * 0.45,
        borderRadius: '50%',
        background:   `radial-gradient(ellipse at 50% 50%,
          transparent               42%,
          rgba(220,196,118,0.18)   45%,
          rgba(242,220,150,0.68)   50%,
          rgba(218,194,116,0.46)   56%,
          rgba(188,164,88,0.14)    62%,
          transparent               67%)`,
        pointerEvents: 'none',
        zIndex:         1,
      }}
    />
  )
}

function StarDots() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STAR_DOTS.map(d => (
        <div
          key={d.id}
          style={{
            position:     'absolute',
            top:          `${d.top}%`,
            left:         `${d.left}%`,
            width:          d.size,
            height:         d.size,
            borderRadius: '50%',
            background:   '#fff',
            opacity:        d.opacity,
          }}
        />
      ))}
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function SolarRevealSection() {
  const sectionRef = useRef()
  const headingRef = useRef()
  const planetRefs = useRef([])
  const canvasRefs = useRef([])
  const btnRef     = useRef()

  // ── Effect 1: paint fallbacks immediately; load textures when section nears ─
  useEffect(() => {
    // Ref callbacks fire before effects, so canvasRefs.current is already fully
    // populated. Paint solid-color fallbacks right away — no blank flash.
    PLANETS.forEach((planet, i) => {
      const cv = canvasRefs.current[i]
      if (cv) paintFallback(cv, planet.color)
    })

    let cancelled = false

    // Begin loading when the section is within 600 px of the viewport.
    // The 600 px head start gives createImageBitmap (off-thread decode) time to
    // finish before the entrance animation runs.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        // All 9 fetches fire in parallel. Each paints its canvas as it resolves.
        // Direct DOM write — no setState, so there are zero React re-renders
        // while textures are loading or during the GSAP animation.
        PLANETS.forEach((planet, i) => {
          getBitmap(planet).then(bitmap => {
            if (cancelled) return
            const cv = canvasRefs.current[i]
            if (cv) paintWithTexture(cv, bitmap, planet.isStar)
          })
        })
      },
      { rootMargin: '0px 0px 600px 0px' },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { cancelled = true; observer.disconnect() }
  }, [])

  // ── Effect 2: GSAP pin + entrance animation ───────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // willChange promotes every animated element to its own compositor layer
      // before the timeline starts, so transforms never trigger a paint pass.
      gsap.set(planetRefs.current, {
        x:          '110vw',
        opacity:     0,
        willChange: 'transform, opacity',
      })
      gsap.set(headingRef.current, { opacity: 0, y: 30, willChange: 'transform, opacity' })
      gsap.set(btnRef.current,     { opacity: 0, y: 16, willChange: 'transform, opacity' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:    sectionRef.current,
          start:      'top top',
          end:        '+=200%',
          scrub:       2,
          pin:         true,
          pinSpacing:  true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.10 }, 0)

      PLANETS.forEach((_, i) => {
        tl.to(planetRefs.current[i], { x: 0, opacity: 1, duration: 0.22 }, 0.08 + i * 0.10)
      })

      const lastEnd = 0.08 + (PLANETS.length - 1) * 0.10 + 0.22
      tl.to(btnRef.current, { opacity: 1, y: 0, duration: 0.10 }, lastEnd + 0.04)
      tl.to({}, { duration: 0.20 })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Canvas internal resolution = CSS px × DPR for crisp 1:1 physical pixels
  const dpr = Math.min(
    typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1,
    2,
  )

  return (
    <section
      ref={sectionRef}
      style={{
        position:       'relative',
        width:          '100%',
        height:         '100vh',
        overflow:       'hidden',
        background:     'var(--color-bg)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            'var(--space-12)',
      }}
    >
      <StarDots />

      {/* Heading */}
      <div ref={headingRef} style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--text-xs)',
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
          color:         'var(--color-blue)',
          marginBottom:  'var(--space-3)',
          opacity:        0.8,
        }}>
          Section 2
        </p>
        <h2 style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(2rem, 5vw, 3.5rem)',
          fontWeight:     700,
          color:         'var(--color-text-primary)',
          letterSpacing: 'var(--tracking-tight)',
        }}>
          Our Solar System
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'var(--text-lg)',
          color:      'var(--color-text-muted)',
          marginTop:  'var(--space-3)',
        }}>
          Eight planets. One star. Countless discoveries.
        </p>
      </div>

      {/* Planet row */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            'clamp(12px, 2.5vw, 32px)',
          padding:        '0 var(--space-8)',
          overflowX:      'auto',
          overflowY:      'visible',
          scrollbarWidth: 'none',
          maxWidth:       '100vw',
        }}
      >
        {PLANETS.map((planet, i) => {
          const cvsPx = Math.round(planet.size * dpr)
          return (
            <div
              key={planet.name}
              ref={el => { planetRefs.current[i] = el }}
              style={{ display: 'flex', alignItems: 'flex-end' }}
            >
              <div style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:            8,
                flexShrink:     0,
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <canvas
                    ref={el => { canvasRefs.current[i] = el }}
                    width={cvsPx}
                    height={cvsPx}
                    style={{
                      width:        planet.size,
                      height:       planet.size,
                      borderRadius: '50%',
                      display:      'block',
                      position:     'relative',
                      boxShadow:    `0 0 10px ${planet.glow}, 0 0 22px ${planet.glow}`,
                    }}
                  />
                  {planet.hasRing && <SaturnRing size={planet.size} />}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   'var(--text-xs)',
                  color:      'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {planet.name}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div ref={btnRef}>
        <Link
          to="/explorer"
          className="btn-primary"
          style={{ fontSize: 'var(--text-base)', padding: 'var(--space-4) var(--space-8)' }}
        >
          Open Explorer
          <ArrowRight size={18} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  )
}
