import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen, Lock, ChevronRight } from 'lucide-react'
import DifficultyBadge from '../../components/DifficultyBadge'

gsap.registerPlugin(ScrollTrigger)

const PATHS = [
  {
    level: 'beginner',
    title: 'Foundation',
    subtitle: 'Start your journey',
    description: 'Planets, stars, the Moon, and the scale of our solar system. No prerequisites.',
    modules: 8,
    color: 'var(--color-blue)',
    glow: 'rgba(79,142,247,0.12)',
    icon: '🌍',
    locked: false,
  },
  {
    level: 'intermediate',
    title: 'Deep Space',
    subtitle: 'Expand your view',
    description: 'Stellar evolution, galaxies, black holes, and the lifecycle of stars.',
    modules: 10,
    color: 'var(--color-purple)',
    glow: 'rgba(139,92,246,0.12)',
    icon: '🌌',
    locked: false,
  },
  {
    level: 'advanced',
    title: 'The Cosmos',
    subtitle: 'Push the frontier',
    description: 'Cosmology, dark matter, dark energy, quantum gravity, and the early universe.',
    modules: 12,
    color: 'var(--color-purple)',
    glow: 'rgba(139,92,246,0.08)',
    icon: '⚛️',
    locked: true,
  },
]

export default function LearnSection() {
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
          opacity: 0, y: 60,
          scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 60%', scrub: 1 },
          delay: i * 0.05,
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'var(--space-24) var(--space-6)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}
    >
      {/* Heading */}
      <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
          Learning Path
        </p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
          Your path through the cosmos
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 'var(--leading-relaxed)' }}>
          Structured modules that grow with you — from your first orbit to the edge of known physics.
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {PATHS.map((path, i) => (
          <div
            key={path.level}
            ref={el => { cardsRef.current[i] = el }}
            className="card-glass"
            style={{
              padding: 'var(--space-8)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: path.locked ? 'none' : `0 0 40px ${path.glow}`,
              opacity: path.locked ? 0.6 : 1,
            }}
          >
            {/* Top glow line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: path.locked ? 'var(--color-border)' : `linear-gradient(90deg, transparent, ${path.color}, transparent)` }} />

            {/* Icon + badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
              <div style={{ fontSize: 32, lineHeight: 1 }}>{path.icon}</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <DifficultyBadge level={path.level} />
                {path.locked && <Lock size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)' }} />}
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
              {path.subtitle}
            </p>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
              {path.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
              {path.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                {path.modules} modules
              </span>
              <Link
                to={path.locked ? '/auth/signup' : '/learn'}
                className={path.locked ? 'btn-ghost' : 'btn-primary'}
                style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)' }}
              >
                <BookOpen size={14} strokeWidth={1.5} />
                {path.locked ? 'Unlock' : 'Start'}
                <ChevronRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
        <Link to="/learn" className="btn-secondary" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-3) var(--space-8)' }}>
          View All Modules
        </Link>
      </div>
    </section>
  )
}
