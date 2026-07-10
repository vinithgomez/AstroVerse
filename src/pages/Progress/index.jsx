import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, Award, Lock, GraduationCap, Rocket,
  Bookmark, Trash2, ExternalLink, HelpCircle, Sparkles,
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import DifficultyBadge from '../../components/DifficultyBadge'
import ProgressBar from '../../components/ProgressBar'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { TIERS, getModulesByTier, ALL_MODULES_ORDERED, getModule } from '../../data/modules'
import { getBody } from '../../data/planets'
import { getTheory } from '../../data/theories'
import { BADGE_CATALOG } from '../../data/badges'

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
]

const BOOKMARK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'planet', label: 'Planets' },
  { id: 'module', label: 'Modules' },
  { id: 'theory', label: 'Theories' },
  { id: 'news', label: 'News' },
]

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Guest gate ────────────────────────────────────────────────────────────
function GuestGate() {
  return (
    <div className="card-glass" style={{ padding: 'var(--space-16) var(--space-8)', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      <Sparkles size={32} strokeWidth={1.5} style={{ color: 'var(--color-blue)', marginBottom: 'var(--space-4)' }} />
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
        Sign up to track your progress
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
        Create a free account to save module completions, quiz scores, badges, and bookmarks across every device.
      </p>
      <Link to="/auth/signup" className="btn-primary" style={{ display: 'inline-flex' }}>
        Create Free Account
        <ArrowRight size={16} strokeWidth={1.5} />
      </Link>
    </div>
  )
}

// ── Stat tile ─────────────────────────────────────────────────────────────
function StatTile({ label, value }) {
  return (
    <div className="card-glass" style={{ padding: 'var(--space-5)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: 'var(--space-2)' }}>
        {value}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
        {label}
      </p>
    </div>
  )
}

// ── Learning Progress ─────────────────────────────────────────────────────
function TierProgress({ tier, modules, progressRows }) {
  const completedIds = new Set(progressRows.filter(r => r.completed).map(r => r.module_id))
  const completedCount = modules.filter(m => completedIds.has(m.id)).length

  return (
    <div className="card-glass" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 600, color: tier.color }}>
          {tier.label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
          {completedCount} / {modules.length}
        </span>
      </div>
      <ProgressBar value={completedCount} max={modules.length} showPercent={false} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        {modules.map(m => {
          const done = completedIds.has(m.id)
          return (
            <span
              key={m.id}
              title={m.title}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: done ? 'var(--color-success)' : 'var(--color-surface)',
                border: `1px solid ${done ? 'var(--color-success)' : 'var(--color-border)'}`,
                color: done ? '#fff' : 'var(--color-text-faint)',
              }}
            >
              {done ? <CheckCircle2 size={13} strokeWidth={2} /> : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{m.title.charAt(0)}</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── Badge tile ────────────────────────────────────────────────────────────
function BadgeTile({ meta, earnedAt }) {
  const earned = !!earnedAt
  const Icon = meta.id === 'first-steps' ? Rocket : GraduationCap

  return (
    <div
      className="card-glass"
      style={{
        padding: 'var(--space-5)', textAlign: 'center', opacity: earned ? 1 : 0.5,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
      }}
    >
      <div
        style={{
          width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: earned ? 'var(--color-warning)' : 'var(--color-surface-high)',
          color: earned ? '#1a1200' : 'var(--color-text-faint)',
        }}
      >
        {earned ? <Icon size={20} strokeWidth={1.5} /> : <Lock size={18} strokeWidth={1.5} />}
      </div>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {meta.label}
      </p>
      {meta.topicTitle && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          {meta.topicTitle}
        </p>
      )}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: earned ? 'var(--color-success)' : 'var(--color-text-faint)' }}>
        {earned ? `Earned ${formatDate(earnedAt)}` : meta.lockedHint}
      </p>
    </div>
  )
}

// ── Bookmark resolution ───────────────────────────────────────────────────
function resolveBookmark(row, newsMap) {
  if (row.content_type === 'planet') {
    const body = getBody(row.content_id)
    return body
      ? { title: body.name, subtitle: 'Planet', href: `/explorer?focus=${body.id}`, dotColor: body.color }
      : { title: 'Planet no longer available', subtitle: 'Planet', href: null, unavailable: true }
  }
  if (row.content_type === 'module') {
    const mod = getModule(row.content_id)
    return mod
      ? { title: mod.title, subtitle: 'Module', href: `/learn/${mod.id}` }
      : { title: 'Module no longer available', subtitle: 'Module', href: null, unavailable: true }
  }
  if (row.content_type === 'theory') {
    const theory = getTheory(row.content_id)
    return theory
      ? { title: theory.title, subtitle: 'Theory', href: `/theories/${theory.id}` }
      : { title: 'Theory no longer available', subtitle: 'Theory', href: null, unavailable: true }
  }
  if (row.content_type === 'news') {
    const article = newsMap[row.content_id]
    return article
      ? { title: article.title, subtitle: article.source, href: article.link, external: true }
      : { title: 'Article no longer in the live feed', subtitle: 'News', href: null, unavailable: true }
  }
  return { title: row.content_id, subtitle: row.content_type, href: null, unavailable: true }
}

// ── Dashboard (logged-in) ─────────────────────────────────────────────────
function Dashboard({ user }) {
  const [loading, setLoading] = useState(true)
  const [progressRows, setProgressRows] = useState([])
  const [quizRows, setQuizRows] = useState([])
  const [badgeRows, setBadgeRows] = useState([])
  const [bookmarkRows, setBookmarkRows] = useState([])
  const [newsMap, setNewsMap] = useState({})
  const [bookmarkFilter, setBookmarkFilter] = useState('all')
  const [level, setLevel] = useState(user.user_metadata?.level_preference ?? 'beginner')

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      supabase.from('progress').select('module_id, completed, completed_at, created_at').eq('user_id', user.id),
      supabase.from('quiz_scores').select('id, topic, difficulty, score, total, taken_at').eq('user_id', user.id).order('taken_at', { ascending: false }),
      supabase.from('badges').select('badge_id, earned_at').eq('user_id', user.id),
      supabase.from('bookmarks').select('id, content_type, content_id, saved_at').eq('user_id', user.id).order('saved_at', { ascending: false }),
    ]).then(([progress, quiz, badges, bookmarks]) => {
      if (cancelled) return
      if (progress.error) console.error('[Progress] failed to load progress:', progress.error)
      if (quiz.error) console.error('[Progress] failed to load quiz_scores:', quiz.error)
      if (badges.error) console.error('[Progress] failed to load badges:', badges.error)
      if (bookmarks.error) console.error('[Progress] failed to load bookmarks:', bookmarks.error)
      setProgressRows(progress.data ?? [])
      setQuizRows(quiz.data ?? [])
      setBadgeRows(badges.data ?? [])
      setBookmarkRows(bookmarks.data ?? [])
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [user.id])

  // Only fetch the live news feed if there's actually a news bookmark to resolve.
  useEffect(() => {
    if (!bookmarkRows.some(r => r.content_type === 'news')) return
    let cancelled = false
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (cancelled || !Array.isArray(data.articles)) return
        setNewsMap(Object.fromEntries(data.articles.map(a => [a.id, a])))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [bookmarkRows])

  const completedModules = useMemo(
    () => progressRows.filter(r => r.completed).map(r => ({ ...getModule(r.module_id), completedAt: r.completed_at })).filter(m => m.id),
    [progressRows],
  )

  const resumeModule = useMemo(() => {
    const inProgress = progressRows
      .filter(r => !r.completed)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    for (const r of inProgress) {
      if (getModule(r.module_id)) return r.module_id
    }
    return null
  }, [progressRows])

  const avgScore = useMemo(() => {
    if (quizRows.length === 0) return null
    const total = quizRows.reduce((sum, r) => sum + (r.total ? (r.score / r.total) * 100 : 0), 0)
    return Math.round(total / quizRows.length)
  }, [quizRows])

  const bestByTopic = useMemo(() => {
    const map = {}
    for (const r of quizRows) {
      const pct = r.total ? Math.round((r.score / r.total) * 100) : 0
      if (!map[r.topic]) map[r.topic] = { count: 0, best: 0 }
      map[r.topic].count += 1
      map[r.topic].best = Math.max(map[r.topic].best, pct)
    }
    return Object.entries(map).filter(([, v]) => v.count > 1)
  }, [quizRows])

  const bookmarksFiltered = bookmarkFilter === 'all' ? bookmarkRows : bookmarkRows.filter(r => r.content_type === bookmarkFilter)

  async function removeBookmark(row) {
    setBookmarkRows(prev => prev.filter(r => r.id !== row.id))
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('content_type', row.content_type)
      .eq('content_id', row.content_id)
    if (error) console.error('[Progress] failed to remove bookmark:', error)
  }

  async function changeLevel(newLevel) {
    const prev = level
    setLevel(newLevel)
    const { error } = await supabase.auth.updateUser({ data: { level_preference: newLevel } })
    if (error) { console.error('[Progress] failed to save level preference:', error); setLevel(prev) }
  }

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-glass" style={{ padding: 'var(--space-5)', height: 90, opacity: 0.5 }} />
        ))}
      </div>
    )
  }

  const displayName = (user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Explorer')

  return (
    <>
      {/* Overview */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
          Progress Dashboard
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Welcome back, {displayName}
          </h1>
          <Link to={resumeModule ? `/learn/${resumeModule}` : '/learn'} className="btn-primary">
            {resumeModule ? 'Resume Learning' : 'Start Learning'}
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-12)' }}>
        <StatTile label="Modules Complete" value={`${completedModules.length} / ${ALL_MODULES_ORDERED.length}`} />
        <StatTile label="Quizzes Taken" value={quizRows.length} />
        <StatTile label="Average Score" value={avgScore === null ? '—' : `${avgScore}%`} />
        <StatTile label="Badges Earned" value={badgeRows.length} />
      </div>

      {/* Learning Progress */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
          Learning Progress
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {TIERS.map(tier => (
            <TierProgress key={tier.id} tier={tier} modules={getModulesByTier(tier.id)} progressRows={progressRows} />
          ))}
        </div>

        {completedModules.length > 0 ? (
          <div className="card-glass" style={{ padding: 'var(--space-5)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Completed Modules
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {completedModules
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                .map(m => (
                  <Link key={m.id} to={`/learn/${m.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                      <CheckCircle2 size={14} strokeWidth={1.5} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      {m.title}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', flexShrink: 0 }}>
                      {formatDate(m.completedAt)}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
            You haven't completed any modules yet —{' '}
            <Link to="/learn" style={{ color: 'var(--color-blue)' }}>start with Foundation</Link>.
          </p>
        )}
      </section>

      {/* Quiz History */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
          Quiz History
        </h2>

        {quizRows.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
            You haven't taken any quizzes yet —{' '}
            <Link to="/quiz" style={{ color: 'var(--color-blue)' }}>test what you know</Link>.
          </p>
        ) : (
          <>
            {bestByTopic.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                {bestByTopic.map(([topic, v]) => (
                  <div key={topic} className="card-glass" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Best · {topic === 'random-mix' ? 'Random Mix' : (getModule(topic)?.title ?? topic)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-success)' }}>
                      {v.best}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {quizRows.map(r => {
                const pct = r.total ? Math.round((r.score / r.total) * 100) : 0
                const topicTitle = r.topic === 'random-mix' ? 'Random Mix' : (getModule(r.topic)?.title ?? r.topic)
                return (
                  <div key={r.id} className="card-glass" style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {topicTitle}
                      </span>
                      {r.difficulty && <DifficultyBadge level={r.difficulty} />}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                        {formatDate(r.taken_at)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 700, color: pct >= 80 ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                        {r.score}/{r.total} ({pct}%)
                      </span>
                      <Link
                        to={r.topic === 'random-mix' ? '/quiz' : `/quiz?module=${r.topic}`}
                        className="btn-ghost"
                        style={{ fontSize: 'var(--text-xs)' }}
                      >
                        Retake
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* Badges */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
          Badges
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
          {BADGE_CATALOG.map(meta => (
            <BadgeTile key={meta.id} meta={meta} earnedAt={badgeRows.find(b => b.badge_id === meta.id)?.earned_at} />
          ))}
        </div>
      </section>

      {/* Bookmarks */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
          Bookmarks
        </h2>

        {bookmarkRows.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
            You haven't bookmarked anything yet — look for the <Bookmark size={13} strokeWidth={1.5} style={{ display: 'inline', verticalAlign: -2 }} /> icon on planets, modules, theories, and news articles.
          </p>
        ) : (
          <>
            <div style={{ display: 'inline-flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '4px', gap: '2px', marginBottom: 'var(--space-5)' }}>
              {BOOKMARK_FILTERS.map(f => {
                const active = bookmarkFilter === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setBookmarkFilter(f.id)}
                    style={{
                      padding: 'var(--space-2) var(--space-4)', borderRadius: '6px', fontSize: 'var(--text-sm)', fontWeight: 500,
                      fontFamily: 'var(--font-body)', transition: 'all var(--transition-base)',
                      background: active ? 'var(--color-blue)' : 'transparent', color: active ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

            {bookmarksFiltered.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
                No bookmarks in this category yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {bookmarksFiltered.map(row => {
                  const resolved = resolveBookmark(row, newsMap)
                  const content = (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0, flex: 1 }}>
                        {resolved.dotColor && <span style={{ width: 10, height: 10, borderRadius: '50%', background: resolved.dotColor, flexShrink: 0 }} />}
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500,
                            color: resolved.unavailable ? 'var(--color-text-faint)' : 'var(--color-text-primary)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {resolved.title}
                          </p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                            {resolved.subtitle} · {formatDate(row.saved_at)}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                        {resolved.href && <ExternalLink size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-faint)' }} />}
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation(); removeBookmark(row) }}
                          className="btn-ghost"
                          aria-label="Remove bookmark"
                          style={{ padding: 'var(--space-2)', color: 'var(--color-text-faint)' }}
                        >
                          <Trash2 size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                    </>
                  )

                  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)' }

                  return resolved.href ? (
                    resolved.external ? (
                      <a key={row.id} href={resolved.href} target="_blank" rel="noopener noreferrer" className="card-glass" style={rowStyle}>{content}</a>
                    ) : (
                      <Link key={row.id} to={resolved.href} className="card-glass" style={rowStyle}>{content}</Link>
                    )
                  ) : (
                    <div key={row.id} className="card-glass" style={rowStyle}>{content}</div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Level Preference */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
          Level Preference
        </h2>
        <div className="card-glass" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <HelpCircle size={18} strokeWidth={1.5} style={{ color: 'var(--color-text-faint)' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Content explanations across the app are tailored to this level. Currently: <DifficultyBadge level={level} />
            </p>
          </div>
          <div style={{ display: 'inline-flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '4px', gap: '2px' }}>
            {LEVELS.map(l => {
              const active = level === l.id
              return (
                <button
                  key={l.id}
                  onClick={() => changeLevel(l.id)}
                  style={{
                    padding: 'var(--space-2) var(--space-4)', borderRadius: '6px', fontSize: 'var(--text-sm)', fontWeight: 500,
                    fontFamily: 'var(--font-body)', transition: 'all var(--transition-base)',
                    background: active ? 'var(--color-blue)' : 'transparent', color: active ? '#fff' : 'var(--color-text-muted)',
                  }}
                >
                  {l.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Progress() {
  const { user, loading: authLoading } = useAuth()

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {authLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-glass" style={{ padding: 'var(--space-5)', height: 90, opacity: 0.4 }} />
              ))}
            </div>
          ) : user ? (
            <Dashboard user={user} />
          ) : (
            <GuestGate />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
