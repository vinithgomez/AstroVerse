import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, ExternalLink, ArrowRight, Rss } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Mock cards until the RSS proxy is implemented (see CLAUDE.md §8)
const MOCK_NEWS = [
  {
    source: 'NASA',
    category: 'Exploration',
    title: 'Artemis III Mission Timeline Confirmed for Lunar South Pole Landing',
    excerpt: 'NASA has confirmed the flight timeline for Artemis III, which will return humans to the Moon and land the first woman and first person of color at the lunar south pole.',
    time: '2h ago',
    isBreaking: true,
  },
  {
    source: 'Space.com',
    category: 'Astronomy',
    title: "James Webb Telescope Captures Earliest Known Galaxy's Detailed Structure",
    excerpt: "JWST has imaged JADES-GS-z14-0 in unprecedented detail, revealing structured features in a galaxy that formed just 290 million years after the Big Bang.",
    time: '6h ago',
    isBreaking: false,
  },
  {
    source: 'NASA',
    category: 'Science',
    title: 'Parker Solar Probe Sets New Record Approaching the Sun',
    excerpt: 'The spacecraft has reached 6.1 million kilometers from the solar surface — closer than any human-made object in history — and is transmitting new data on solar wind dynamics.',
    time: '1d ago',
    isBreaking: false,
  },
]

export default function NewsSection() {
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
          opacity: 0, y: 50,
          scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 62%', scrub: 1.2 },
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
      <div ref={headingRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-12)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
            Space News
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)' }}>
            The universe, live
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Rss size={14} strokeWidth={1.5} style={{ color: 'var(--color-blue)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            NASA · Space.com
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
        {MOCK_NEWS.map((item, i) => (
          <div
            key={item.title}
            ref={el => { cardsRef.current[i] = el }}
            className="card-glass"
            style={{
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              transition: 'transform var(--transition-base)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-blue)', fontWeight: 600 }}>
                {item.source}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {item.category}
              </span>
              {item.isBreaking && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-border)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-danger)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)' }}>
                    ● BREAKING
                  </span>
                </>
              )}
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-snug)', flex: 1 }}>
              {item.title}
            </h3>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {item.excerpt}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-faint)' }}>
                <Clock size={12} strokeWidth={1.5} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{item.time}</span>
              </div>
              <ExternalLink size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-faint)' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
        <Link to="/news" className="btn-secondary" style={{ fontSize: 'var(--text-base)', padding: 'var(--space-3) var(--space-8)' }}>
          All Space News
          <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  )
}
