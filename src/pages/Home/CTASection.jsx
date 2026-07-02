import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UserPlus, Eye } from 'lucide-react'
import LogoMark from '../../components/LogoMark'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef()
  const innerRef   = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(innerRef.current, {
        opacity: 0, y: 60,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 45%', scrub: 1.2 },
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
        padding: 'var(--space-32) var(--space-6)',
      }}
    >
      {/* Nebula gradient background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(139,92,246,0.13) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 50%, rgba(79,142,247,0.10) 0%, transparent 60%),
            var(--color-bg)
          `,
          pointerEvents: 'none',
        }}
      />
      {/* Top border glow */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(79,142,247,0.4), transparent)' }} />

      <div
        ref={innerRef}
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-panel)',
            background: 'var(--color-blue-10)',
            border: '1px solid var(--color-blue-20)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <LogoMark size={40} />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-tight)',
            lineHeight: 'var(--leading-tight)',
            marginBottom: 'var(--space-5)',
            color: 'var(--color-text-primary)',
          }}
        >
          Ready to explore the{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, var(--color-blue), var(--color-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            universe?
          </span>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-muted)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-10)',
            maxWidth: '500px',
            margin: '0 auto var(--space-10)',
          }}
        >
          Create a free account to save your progress, earn badges, and track your journey from the solar system to the cosmic horizon.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/auth/signup"
            className="btn-primary"
            style={{ fontSize: 'var(--text-base)', padding: 'var(--space-4) var(--space-10)' }}
          >
            <UserPlus size={18} strokeWidth={1.5} />
            Create Free Account
          </Link>
          <Link
            to="/learn"
            className="btn-secondary"
            style={{ fontSize: 'var(--text-base)', padding: 'var(--space-4) var(--space-10)' }}
          >
            <Eye size={18} strokeWidth={1.5} />
            Continue as Guest
          </Link>
        </div>

        <p style={{ marginTop: 'var(--space-5)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)' }}>
          No credit card required · Full access as a guest · Progress saves with an account
        </p>
      </div>
    </section>
  )
}
