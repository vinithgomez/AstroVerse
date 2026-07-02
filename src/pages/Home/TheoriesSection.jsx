import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import Badge from '../../components/Badge'

gsap.registerPlugin(ScrollTrigger)

const SAMPLE_THEORIES = [
  {
    badge: 'proven',
    era: 'Modern · 1964',
    title: 'Big Bang Theory',
    teaser: 'The universe began as an infinitely dense singularity ~13.8 billion years ago and has been expanding ever since.',
    category: 'Cosmological',
  },
  {
    badge: 'hypothesis',
    era: 'Contemporary · 1980s',
    title: 'String Theory',
    teaser: 'All fundamental particles are one-dimensional vibrating strings of energy. Requires 10 or 11 dimensions.',
    category: 'Theoretical Physics',
  },
  {
    badge: 'debated',
    era: 'Contemporary · 2003',
    title: 'Multiverse Hypothesis',
    teaser: 'Our universe is just one of infinitely many bubble universes, each with different physical constants.',
    category: 'Cosmological',
  },
]

export default function TheoriesSection() {
  const sectionRef = useRef()
  const headingRef = useRef()
  const cardsRef   = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0, y: 50,
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', end: 'top 55%', scrub: 1 },
      })
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 60, x: i % 2 === 0 ? -20 : 20,
          scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 60%', scrub: 1 },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--space-24) var(--space-6)',
      }}
    >
      {/* Nebula purple ambient bleed */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60%',
          height: '140%',
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-5%',
          width: '50%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(79,142,247,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-purple)', marginBottom: 'var(--space-3)' }}>
            Theories & Discoveries
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
            Science at the edge<br />of what we know
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 'var(--leading-relaxed)' }}>
            Proven fact. Working hypothesis. Fierce debate. Understand the status of every major theory.
          </p>
        </div>

        {/* Theory cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {SAMPLE_THEORIES.map((theory, i) => (
            <div
              key={theory.title}
              ref={el => { cardsRef.current[i] = el }}
              className="card-glass"
              style={{
                padding: 'var(--space-6)',
                cursor: 'pointer',
                transition: 'transform var(--transition-base)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <Badge variant={theory.badge} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                  {theory.era}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-purple)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>
                {theory.category}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', margin: 'var(--space-2) 0 var(--space-3)' }}>
                {theory.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                {theory.teaser}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
          <Link to="/theories" className="btn-secondary" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-3) var(--space-8)' }}>
            Explore All Theories
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
