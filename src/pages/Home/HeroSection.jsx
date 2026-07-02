import { useEffect, useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const EarthCanvas = lazy(() => import('./EarthCanvas'))

const isLowEnd =
  typeof navigator !== 'undefined' &&
  navigator.hardwareConcurrency != null &&
  navigator.hardwareConcurrency <= 4

export default function HeroSection() {
  const sectionRef    = useRef()
  const heroProgress  = useRef(0)

  // Label (brand mark — independent animated element)
  const labelRef      = useRef()

  // Heading lines + supporting copy
  const line1Ref      = useRef()
  const line2Ref      = useRef()
  const subtitleRef   = useRef()
  const ctasRef       = useRef()
  const scrollHintRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Initial state ───────────────────────────────────────────────────
      // Read label's rendered position before any transforms, so we can compute
      // how far right to shift it so its midpoint aligns with the viewport center.
      const labelEl = labelRef.current
      const { left: labelLeft, width: labelWidth } = labelEl.getBoundingClientRect()
      const centerOffsetX = window.innerWidth / 2 - labelLeft - labelWidth / 2

      // Label starts centered on screen (shifted right from its CSS left:clamp(...)),
      // opacity 0 — no scale or y change, so it never encroaches on heading space.
      gsap.set(labelEl, { opacity: 0, x: centerOffsetX })

      gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: 50 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(ctasRef.current, { opacity: 0, y: 20 })
      gsap.set(scrollHintRef.current, { opacity: 0 })

      // ── Entrance sequence (not scroll-driven) ──────────────────────────
      const intro = gsap.timeline({ delay: 0.3 })

      // 1. Label sweeps left from page-center to its settled left-third position
      intro.to(labelEl, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
      })

      // 2. Heading fades up alongside (starts 0.55s after label begins)
      intro.to(line1Ref.current, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.55)
      intro.to(line2Ref.current, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.75)

      // 3. Subtitle + CTAs follow
      intro.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.1)
      intro.to(ctasRef.current,     { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.25)
      intro.to(scrollHintRef.current, { opacity: 1, duration: 0.6 }, '+=0.3')

      // ── Scroll-driven pin ──────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          scrub: 1.8,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => { heroProgress.current = self.progress },
        },
        defaults: { ease: 'none' },
      })

      // No text tweens — all text elements stay fully visible for the entire
      // pin duration. The Earth drift/recede is driven by heroProgress.current
      // inside EarthScene's useFrame, not by this timeline. This placeholder
      // tween keeps the timeline alive so onUpdate fires throughout the pin.
      tl.to({}, { duration: 1 })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {/* Three.js Earth canvas — lazy loaded, receives pointer events */}
      <Suspense fallback={null}>
        <EarthCanvas heroProgress={heroProgress} lowEnd={isLowEnd} />
      </Suspense>

      {/* Radial vignette — pointer-events: none so canvas drag works */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'radial-gradient(ellipse 70% 80% at 40% 50%, transparent 30%, rgba(10,10,15,0.55) 70%, rgba(10,10,15,0.92) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Brand label ─────────────────────────────────────────────────────
          Final resting position: left third, clearly above the heading.
          CSS top uses max() so it's always below the navbar (≥88px) but
          scales up on tall viewports (14vh).
          Animation sweeps in from page-center → left via GSAP x offset.
          pointer-events: none — it's decorative.                           */}
      <p
        ref={labelRef}
        aria-label="AstroVerse — Space Education Platform"
        style={{
          position: 'absolute',
          left: 'clamp(2rem, 7vw, 80px)',
          top: 'max(88px, 14vh)',
          zIndex: 10,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-blue)',
            lineHeight: 1.25,
          }}
        >
          AstroVerse
        </span>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
            marginTop: '0.3em',
          }}
        >
          Space Education Platform
        </span>
        {/* Decorative rule beneath the label */}
        <span
          aria-hidden
          style={{
            display: 'block',
            height: '1px',
            width: '100%',
            marginTop: '0.6em',
            background: 'linear-gradient(90deg, var(--color-blue-20), transparent)',
          }}
        />
      </p>

      {/* ── Heading + copy ───────────────────────────────────────────────────
          pointer-events: none on the wrapper — only CTAs need clicks.      */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-16) var(--space-8) 0 clamp(var(--space-8), 8vw, 120px)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ maxWidth: '700px' }}>

          {/* Heading */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: 'var(--space-6)',
              overflow: 'visible',
            }}
          >
            <span
              ref={line1Ref}
              style={{
                display: 'block',
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                color: 'var(--color-text-primary)',
                willChange: 'transform, opacity',
              }}
            >
              Explore the
            </span>
            <span
              ref={line2Ref}
              style={{
                display: 'block',
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                background: 'linear-gradient(90deg, var(--color-blue) 0%, var(--color-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                willChange: 'transform, opacity',
              }}
            >
              Universe.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(var(--text-base), 1.8vw, var(--text-xl))',
              color: 'var(--color-text-muted)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: '480px',
              marginBottom: 'var(--space-8)',
              willChange: 'transform, opacity',
            }}
          >
            From the surface of Mars to the edge of the observable universe — learn astronomy your way, at your pace.
          </p>

          {/* CTAs — pointer-events: auto restored here so links are clickable */}
          <div
            ref={ctasRef}
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              willChange: 'transform, opacity',
              pointerEvents: 'auto',
            }}
          >
            <Link to="/auth/signup" className="btn-primary" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-4) var(--space-8)' }}>
              Begin Your Journey
              <ChevronRight size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/explorer" className="btn-secondary" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-4) var(--space-8)' }}>
              <Globe size={18} strokeWidth={1.5} />
              Explore the Solar System
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 'var(--space-8)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-2)',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <ScrollArrow />
      </div>
    </section>
  )
}

function ScrollArrow() {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}>
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(6px); opacity: 0.9; }
        }
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          75%       { transform: translateY(6px); opacity: 0.2; }
        }
      `}</style>
      <rect x="1" y="1" width="18" height="26" rx="9" stroke="#4a5568" strokeWidth="1.5" />
      <rect x="8.5" y="6" width="3" height="7" rx="1.5" fill="#4f8ef7" style={{ animation: 'scrollDot 2s ease-in-out infinite' }} />
    </svg>
  )
}
