import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Bookmark, BookmarkCheck, BookOpen, HelpCircle } from 'lucide-react'
import DifficultyBadge from '../../components/DifficultyBadge'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { PLANET_TO_MODULE_ID } from '../../data/modules'

function formatNumber(n) {
  return Math.round(n).toLocaleString('en-US')
}

function formatDistance(km) {
  if (km >= 1_000_000) return `${(Math.round(km / 100_000) / 10).toLocaleString('en-US')} million km`
  return `${formatNumber(km)} km`
}

function formatPeriodDays(days) {
  if (days >= 365) return `${formatNumber(days)} days (${(days / 365.25).toFixed(1)} yrs)`
  return `${(Math.round(days * 10) / 10).toLocaleString('en-US')} days`
}

function formatRotation(hours) {
  const abs = Math.abs(hours)
  return abs >= 24 ? `${(abs / 24).toFixed(1)} days` : `${abs.toFixed(1)} hrs`
}

function formatTemp([lo, hi]) {
  return lo === hi ? `${lo}°C` : `${lo}°C to ${hi}°C`
}

const STAT_LABEL = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }
const STAT_VALUE = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', textAlign: 'right' }

function Stat({ label, value }) {
  if (value == null) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-4)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
      <span style={STAT_LABEL}>{label}</span>
      <span style={STAT_VALUE}>{value}</span>
    </div>
  )
}

export default function InfoPanel({ body, onClose }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Keep rendering the last-selected body's content while the panel slides
  // out, so the close animation doesn't cut the content away instantly.
  const [displayBody, setDisplayBody] = useState(null)
  const [bookmarked, setBookmarked]   = useState(false)
  const [guestPrompt, setGuestPrompt] = useState(false)

  useEffect(() => {
    if (body) setDisplayBody(body)
  }, [body])

  useEffect(() => {
    setBookmarked(false)
    setGuestPrompt(false)
  }, [displayBody?.id])

  const open = !!body

  async function handleBookmark() {
    if (!displayBody) return
    if (!user) { setGuestPrompt(true); return }
    setGuestPrompt(false)
    const next = !bookmarked
    setBookmarked(next) // optimistic — see CLAUDE.md §8, bookmarks table not yet created
    try {
      if (next) {
        await supabase.from('bookmarks').upsert({ user_id: user.id, body_id: displayBody.id })
      } else {
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('body_id', displayBody.id)
      }
    } catch {
      // Fails silently until the bookmarks table exists — the optimistic
      // toggle still reflects intent for the current session.
    }
  }

  return (
    <div
      className="glass"
      aria-hidden={!open}
      style={{
        position: 'fixed',
        top: 'calc(64px + var(--space-4))',
        right: open ? 'var(--space-4)' : 'calc(-1 * min(380px, 100vw))',
        width: 'min(360px, calc(100vw - var(--space-8)))',
        maxHeight: 'calc(100vh - 64px - var(--space-8) - 100px)',
        overflowY: 'auto',
        borderRadius: 'var(--radius-panel)',
        padding: 'var(--space-6)',
        zIndex: 60,
        transition: 'right var(--transition-slow)',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {displayBody && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                {displayBody.name}
              </h2>
              <DifficultyBadge level={displayBody.difficulty} />
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: 'var(--space-2)' }} aria-label="Close">
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div style={{ marginBottom: 'var(--space-5)' }}>
            <Stat label="Radius" value={`${formatNumber(displayBody.radiusKm)} km`} />
            {displayBody.orbits && (
              <Stat
                label={displayBody.orbits === 'earth' ? 'Distance from Earth' : 'Distance from Sun'}
                value={formatDistance(displayBody.distanceKm)}
              />
            )}
            {displayBody.orbitalPeriodDays != null && (
              <Stat label="Orbital Period" value={formatPeriodDays(displayBody.orbitalPeriodDays)} />
            )}
            {displayBody.rotationPeriodHours != null && (
              <Stat label="Rotation Period" value={formatRotation(displayBody.rotationPeriodHours)} />
            )}
            {displayBody.axialTiltDeg != null && <Stat label="Axial Tilt" value={`${displayBody.axialTiltDeg}°`} />}
            <Stat label="Moons" value={formatNumber(displayBody.facts.numMoons)} />
            <Stat label="Surface Temp" value={formatTemp(displayBody.facts.tempRangeC)} />
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
            {displayBody.facts.description}
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/learn/${PLANET_TO_MODULE_ID[displayBody.id] ?? displayBody.id}`)}>
              <BookOpen size={16} strokeWidth={1.5} />
              Learn More
            </button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(`/quiz?topic=${displayBody.id}`)}>
              <HelpCircle size={16} strokeWidth={1.5} />
              Quiz Me
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', color: bookmarked ? 'var(--color-blue)' : 'var(--color-text-muted)' }}
          >
            {bookmarked ? <BookmarkCheck size={16} strokeWidth={1.5} /> : <Bookmark size={16} strokeWidth={1.5} />}
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          {guestPrompt && (
            <p style={{ marginTop: 'var(--space-3)', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
              <Link to="/auth/signup" style={{ color: 'var(--color-blue)' }}>Sign up</Link> to save bookmarks across devices.
            </p>
          )}
        </>
      )}
    </div>
  )
}
