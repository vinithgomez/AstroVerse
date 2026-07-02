import { useState } from 'react'
import {
  Rocket, Star, Search, ChevronRight, BookOpen,
  Zap, Globe, FlaskConical, Trophy, Bell
} from 'lucide-react'
import Badge from '../../components/Badge'
import DifficultyBadge from '../../components/DifficultyBadge'
import ProgressBar from '../../components/ProgressBar'
import GlossaryTooltip from '../../components/GlossaryTooltip'
import DidYouKnowChip from '../../components/DidYouKnowChip'
import NotificationBanner from '../../components/NotificationBanner'
import LevelSelector from '../../components/LevelSelector'
import Navbar from '../../components/Navbar'

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 'var(--space-16)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <p style={{ fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-2)' }}>
          Component
        </p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
        <div style={{ height: '1px', background: 'var(--color-border)', marginTop: 'var(--space-4)' }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  )
}

function ColorSwatch({ name, value, token }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: '140px' }}>
      <div style={{ width: '100%', height: '64px', borderRadius: 'var(--radius-card)', background: value, border: '1px solid var(--color-border)' }} />
      <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{name}</p>
      <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{value}</p>
      <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)' }}>{token}</p>
    </div>
  )
}

function TypeSample({ name, style: s, children }) {
  return (
    <div style={{ width: '100%', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
      <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>{name}</p>
      <p style={s}>{children}</p>
    </div>
  )
}

export default function DesignSystem() {
  const [level, setLevel] = useState('beginner')

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg)',
          paddingTop: 'calc(72px + var(--space-12))',
          paddingBottom: 'var(--space-24)',
        }}
      >
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--space-6)' }}>

          {/* Header */}
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <p style={{ fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
              Internal · Design System Preview
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-tight)' }}>
              AstroVerse<br />
              <span style={{ color: 'var(--color-blue)' }} className="text-glow-blue">Design System</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: '520px', lineHeight: 'var(--leading-relaxed)' }}>
              Tokens, components, and visual primitives. Every element on a single page for visual verification before real pages are built.
            </p>
          </div>

          {/* ── COLORS ─────────────────────────────────────── */}
          <Section title="Color Tokens">
            <ColorSwatch name="Background"    value="#0a0a0f" token="--color-bg" />
            <ColorSwatch name="Surface"       value="#0f1117" token="--color-surface" />
            <ColorSwatch name="Surface High"  value="#161b27" token="--color-surface-high" />
            <ColorSwatch name="Border"        value="#1e2130" token="--color-border" />
            <ColorSwatch name="Blue (Primary)"value="#4f8ef7" token="--color-blue" />
            <ColorSwatch name="Purple"        value="#8b5cf6" token="--color-purple" />
            <ColorSwatch name="Success"       value="#22c55e" token="--color-success" />
            <ColorSwatch name="Warning"       value="#eab308" token="--color-warning" />
            <ColorSwatch name="Danger"        value="#ef4444" token="--color-danger" />
            <ColorSwatch name="Debate"        value="#f97316" token="--color-debate" />
            <ColorSwatch name="Text Primary"  value="#f0f4ff" token="--color-text-primary" />
            <ColorSwatch name="Text Muted"    value="#8892a4" token="--color-text-muted" />
          </Section>

          {/* ── TYPOGRAPHY ─────────────────────────────────── */}
          <Section title="Typography">
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <TypeSample
                name="Space Grotesk / 7xl / 700 — Hero heading"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-7xl)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)' }}
              >
                Explore the Cosmos
              </TypeSample>
              <TypeSample
                name="Space Grotesk / 4xl / 700 — Section heading"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}
              >
                The Solar System
              </TypeSample>
              <TypeSample
                name="Space Grotesk / 2xl / 600 — Card heading"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}
              >
                Black Hole Formation
              </TypeSample>
              <TypeSample
                name="Inter / base / 400 — Body copy"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)', maxWidth: '65ch' }}
              >
                A black hole is a region of spacetime where gravity is so strong that nothing — not even light or other electromagnetic waves — has enough speed to escape it. The boundary of no escape is called the event horizon. Although it has a great effect on the fate and circumstances of an object crossing it, according to general relativity it has no locally detectable features.
              </TypeSample>
              <TypeSample
                name="Inter / sm / 400 — Muted / secondary text"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}
              >
                Last updated · June 2026 · 8 min read
              </TypeSample>
              <TypeSample
                name="JetBrains Mono / sm / 400 — Data / stats"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-blue)' }}
              >
                1 AU = 149,597,870.7 km · T = 365.25d · v = 29.78 km/s
              </TypeSample>
              <TypeSample
                name="Inter / xs / 600 / wide spacing — Label / overline"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}
              >
                Module 3 · Stellar Evolution
              </TypeSample>
            </div>
          </Section>

          {/* ── BUTTONS ────────────────────────────────────── */}
          <Section title="Buttons">
            <button className="btn-primary">
              <Rocket size={16} strokeWidth={1.5} />
              Start Learning
            </button>
            <button className="btn-primary">
              Get Started
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
            <button className="btn-secondary">
              <BookOpen size={16} strokeWidth={1.5} />
              Learn More
            </button>
            <button className="btn-secondary">Explore</button>
            <button className="btn-ghost">
              <Star size={16} strokeWidth={1.5} />
              Bookmark
            </button>
            <button className="btn-ghost">Cancel</button>
            <div style={{ width: '100%', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-3)' }}>Hover over buttons to see glow / lift effects</p>
            </div>
          </Section>

          {/* ── GLASS CARD ─────────────────────────────────── */}
          <Section title="Glass Card">
            <div className="card-glass" style={{ padding: 'var(--space-6)', minWidth: '300px', maxWidth: '380px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-card)', background: 'var(--color-blue-10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={20} strokeWidth={1.5} style={{ color: 'var(--color-blue)' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>The Solar System</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Module 1 · Beginner</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                Discover the eight planets, their moons, and the forces that keep them in orbit around our star.
              </p>
              <ProgressBar value={65} label="Progress" />
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <DifficultyBadge level="beginner" />
                <Badge variant="proven" />
              </div>
            </div>

            <div className="card-glass" style={{ padding: 'var(--space-6)', minWidth: '300px', maxWidth: '380px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-card)', background: 'var(--color-purple-10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} strokeWidth={1.5} style={{ color: 'var(--color-purple)' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>Dark Matter</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Module 9 · Advanced</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                Explore the invisible mass that makes up 27% of the universe — evidence, models, and ongoing mysteries.
              </p>
              <ProgressBar value={0} label="Progress" />
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <DifficultyBadge level="advanced" />
                <Badge variant="debated" />
              </div>
            </div>
          </Section>

          {/* ── STATUS BADGES ──────────────────────────────── */}
          <Section title="Status Badges">
            <Badge variant="proven" />
            <Badge variant="hypothesis" />
            <Badge variant="disproven" />
            <Badge variant="debated" />
          </Section>

          {/* ── DIFFICULTY BADGES ──────────────────────────── */}
          <Section title="Difficulty Badges">
            <DifficultyBadge level="beginner" />
            <DifficultyBadge level="intermediate" />
            <DifficultyBadge level="advanced" />
          </Section>

          {/* ── PROGRESS BAR ───────────────────────────────── */}
          <Section title="Progress Bar">
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <ProgressBar value={100} label="The Solar System" />
              <ProgressBar value={65}  label="Stellar Evolution" />
              <ProgressBar value={30}  label="Black Holes" />
              <ProgressBar value={0}   label="Dark Matter" />
            </div>
          </Section>

          {/* ── SEARCH INPUT ───────────────────────────────── */}
          <Section title="Search Input">
            <div style={{ position: 'relative', minWidth: '320px' }}>
              <Search
                size={16}
                strokeWidth={1.5}
                style={{
                  position: 'absolute',
                  left: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="search"
                placeholder="Search theories, topics..."
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4) var(--space-3) calc(var(--space-4) + 20px + var(--space-2))',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-btn)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  transition: 'border-color var(--transition-base), box-shadow var(--transition-base)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--color-blue)'
                  e.target.style.boxShadow = '0 0 0 3px var(--color-blue-10)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--color-border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </Section>

          {/* ── LEVEL SELECTOR ─────────────────────────────── */}
          <Section title="Level Selector">
            <LevelSelector value={level} onChange={setLevel} />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
              Selected: <span style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-mono)' }}>{level}</span>
            </p>
          </Section>

          {/* ── GLOSSARY TOOLTIP ───────────────────────────── */}
          <Section title="Glossary Tooltip">
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
              The <GlossaryTooltip term="Event Horizon" definition="The boundary around a black hole beyond which nothing can escape. At this distance, the escape velocity equals the speed of light.">event horizon</GlossaryTooltip> is the point of no return. Beyond it, even light cannot escape the gravitational pull of a <GlossaryTooltip term="Black Hole" definition="A region of spacetime where gravity is so strong that nothing — not even light — can escape from it. Formed by the collapse of massive stars.">black hole</GlossaryTooltip>.
            </p>
          </Section>

          {/* ── DID YOU KNOW ───────────────────────────────── */}
          <Section title="Did You Know Chip">
            <div style={{ maxWidth: '520px' }}>
              <DidYouKnowChip>
                If you could travel at the speed of light, it would still take you over 4 years to reach the nearest star system, Alpha Centauri — and over 100,000 years to cross our own galaxy.
              </DidYouKnowChip>
            </div>
          </Section>

          {/* ── NOTIFICATION BANNERS ───────────────────────── */}
          <Section title="Notification Banner">
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <NotificationBanner variant="info">
                <strong>Progress saved.</strong> Your quiz results and module completion are synced across all your devices.
              </NotificationBanner>
              <NotificationBanner variant="success">
                <strong>Module complete!</strong> You've earned the <em>Solar System Explorer</em> badge.
              </NotificationBanner>
              <NotificationBanner variant="warning">
                <strong>Heads up.</strong> This theory is still under active debate — facts presented reflect current scientific consensus.
              </NotificationBanner>
              <NotificationBanner variant="danger">
                <strong>Sign in required.</strong> Create a free account to save your progress before it's lost.
              </NotificationBanner>
            </div>
          </Section>

          {/* ── NAVBAR NOTE ────────────────────────────────── */}
          <Section title="Navbar">
            <div style={{ width: '100%' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                The Navbar is rendered at the top of this page (fixed, glass, full-width). Resize the window to test mobile hamburger behavior.
              </p>
            </div>
          </Section>

          {/* ── ICON SAMPLE ────────────────────────────────── */}
          <Section title="Icon Library (Lucide / 1.5px stroke)">
            {[Rocket, Star, Search, BookOpen, Globe, Zap, FlaskConical, Trophy, Bell, ChevronRight].map((Icon, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-card)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </div>
            ))}
          </Section>

        </div>
      </div>
    </>
  )
}
