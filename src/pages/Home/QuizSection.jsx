import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import DifficultyBadge from '../../components/DifficultyBadge'

gsap.registerPlugin(ScrollTrigger)

const SAMPLE_Q = {
  question: 'What is the approximate surface temperature of the Sun?',
  options: ['2,500°C', '5,500°C', '10,000°C', '50,000°C'],
  correct: 1,
}

export default function QuizSection() {
  const sectionRef  = useRef()
  const leftRef     = useRef()
  const rightRef    = useRef()
  const [selected, setSelected]   = useState(null)
  const [revealed, setRevealed]   = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        opacity: 0, x: -60,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', end: 'top 50%', scrub: 1.2 },
      })
      gsap.from(rightRef.current, {
        opacity: 0, x: 60,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', end: 'top 50%', scrub: 1.2 },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSelect = (i) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
  }

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'var(--space-24) var(--space-6)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-16)',
          alignItems: 'center',
        }}
      >
        {/* Left — copy */}
        <div ref={leftRef}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
            Quiz System
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
            Test what<br />you've learned
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)', maxWidth: '420px' }}>
            Adaptive questions, immediate explanations, and badges you actually earn. Five question types across every topic and difficulty.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
            {['Multiple Choice', 'True / False', 'Image-Based', 'Ordering', 'Fill in Blank'].map(type => (
              <span
                key={type}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  padding: 'var(--space-1) var(--space-3)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <Zap size={10} strokeWidth={1.5} style={{ color: 'var(--color-blue)' }} />
                {type}
              </span>
            ))}
          </div>
          <Link to="/quiz" className="btn-primary" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-4) var(--space-8)' }}>
            Take a Quiz
            <ChevronRight size={18} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Right — interactive sample question card */}
        <div ref={rightRef}>
          <div
            className="card-glass"
            style={{ padding: 'var(--space-6)', boxShadow: '0 0 40px rgba(79,142,247,0.06)' }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                Sample Question · 1 of 10
              </span>
              <DifficultyBadge level="beginner" />
            </div>

            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-snug)', marginBottom: 'var(--space-5)' }}>
              {SAMPLE_Q.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {SAMPLE_Q.options.map((opt, i) => {
                const isCorrect = i === SAMPLE_Q.correct
                const isSelected = i === selected
                let bg     = 'var(--color-surface)'
                let border = 'var(--color-border)'
                let color  = 'var(--color-text-primary)'

                if (revealed && isCorrect) {
                  bg = 'var(--color-success-10)'; border = 'rgba(34,197,94,0.4)'; color = 'var(--color-success)'
                } else if (revealed && isSelected && !isCorrect) {
                  bg = 'var(--color-danger-10)'; border = 'rgba(239,68,68,0.4)'; color = 'var(--color-danger)'
                } else if (isSelected) {
                  bg = 'var(--color-blue-10)'; border = 'var(--color-blue)'
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3) var(--space-4)',
                      background: bg,
                      border: `1px solid ${border}`,
                      borderRadius: 'var(--radius-btn)',
                      color,
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                      cursor: revealed ? 'default' : 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', minWidth: 18, opacity: 0.6 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {revealed && isCorrect && <CheckCircle2 size={16} strokeWidth={1.5} />}
                    {revealed && isSelected && !isCorrect && <XCircle size={16} strokeWidth={1.5} />}
                  </button>
                )
              })}
            </div>

            {revealed && (
              <p style={{ marginTop: 'var(--space-4)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                ✨ <strong style={{ color: 'var(--color-text-primary)' }}>Explanation:</strong> The Sun's photosphere (visible surface) is approximately 5,500°C. Its corona reaches millions of degrees — a phenomenon still being studied.
              </p>
            )}

            {!revealed && (
              <p style={{ marginTop: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', textAlign: 'center' }}>
                Select an answer above
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
