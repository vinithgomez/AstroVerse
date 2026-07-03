import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Clock, Bookmark, BookmarkCheck,
  CheckCircle2, HelpCircle,
} from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import DifficultyBadge from '../../../components/DifficultyBadge'
import DidYouKnowChip from '../../../components/DidYouKnowChip'
import renderBody from '../../../components/RichBody'
import { getModuleIcon } from '../../../components/moduleIcons'
import { getModule, getAdjacentModules, TIERS } from '../../../data/modules'
import { getBody } from '../../../data/planets'
import { useProgress } from '../../../hooks/useProgress'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabaseClient'

function titleCaseFromSlug(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function NotFound() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 'calc(64px + var(--space-16))', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>Module not found.</p>
        <Link to="/learn" className="btn-primary" style={{ display: 'inline-flex', marginTop: 'var(--space-6)' }}>
          Back to Learning Modules
        </Link>
      </div>
    </div>
  )
}

export default function ModuleDetail() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const module = getModule(moduleId)

  const { progressMap, markInProgress, markComplete, isGuest } = useProgress()
  const [bookmarked, setBookmarked] = useState(false)
  const [guestPrompt, setGuestPrompt] = useState(false)

  // A term already tooltipped once earlier in the lesson shouldn't be
  // wrapped again every time it repeats — shared across all sections here.
  // Deliberately NOT memoized: React 18 StrictMode double-invokes the render
  // function in dev, and a useMemo-cached Set would carry mutations from the
  // discarded first pass into the second (actually committed) pass, marking
  // every term "already used" before it ever reached the DOM. A plain Set
  // created fresh on every render call keeps each invocation's bookkeeping
  // independent, which is what a "first occurrence in this render" tracker
  // needs.
  const usedTerms = new Set()

  useEffect(() => {
    window.scrollTo(0, 0)
    setBookmarked(false)
    setGuestPrompt(false)
  }, [moduleId])

  useEffect(() => {
    if (!module) return
    // Visiting a module counts as starting it, unless it's already complete.
    if (progressMap[module.id] !== 'complete') markInProgress(module.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.id])

  if (!module) return <NotFound />

  const Icon = getModuleIcon(module.icon)
  const status = progressMap[module.id]
  const isComplete = status === 'complete'
  const { prev, next } = getAdjacentModules(module.id)
  const tierMeta = TIERS.find(t => t.id === module.tier)

  async function handleBookmark() {
    if (!user) { setGuestPrompt(true); return }
    setGuestPrompt(false)
    const nextVal = !bookmarked
    setBookmarked(nextVal) // optimistic — bookmarks table not yet created, see CLAUDE.md §8
    try {
      if (nextVal) {
        await supabase.from('bookmarks').upsert({ user_id: user.id, body_id: module.id })
      } else {
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('body_id', module.id)
      }
    } catch {
      // Fails silently until the bookmarks table exists.
    }
  }

  function handleMarkComplete() {
    markComplete(module.id)
    if (!user) setGuestPrompt(true)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 var(--space-6)' }}>

          <Link
            to="/learn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            All Modules
          </Link>

          {/* Header */}
          <header style={{ marginBottom: 'var(--space-10)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 56, height: 56, borderRadius: 'var(--radius-card)',
                  background: 'var(--color-blue-10)', color: 'var(--color-blue)', flexShrink: 0,
                }}
              >
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <button
                onClick={handleBookmark}
                className="btn-ghost"
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this module'}
                style={{ color: bookmarked ? 'var(--color-blue)' : 'var(--color-text-muted)' }}
              >
                {bookmarked ? <BookmarkCheck size={20} strokeWidth={1.5} /> : <Bookmark size={20} strokeWidth={1.5} />}
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: tierMeta?.color, marginBottom: 'var(--space-3)' }}>
              {tierMeta?.label}
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
              {module.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <DifficultyBadge level={module.tier} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                <Clock size={13} strokeWidth={1.5} />
                {module.estimatedMinutes} min read
              </span>
              {isComplete && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
                  <CheckCircle2 size={13} strokeWidth={1.5} />
                  Complete
                </span>
              )}
            </div>
          </header>

          {/* Content */}
          <article>
            {module.content.map((section, i) => {
              const fact = module.didYouKnow?.length
                ? module.didYouKnow[i % module.didYouKnow.length]
                : null
              const showFact = fact && i > 0 && i % 2 === 0

              return (
                <div key={section.heading}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)' }}>
                    {section.heading}
                  </h2>
                  {renderBody(section.body, module.glossaryTerms, usedTerms)}
                  {showFact && (
                    <div style={{ margin: 'var(--space-6) 0' }}>
                      <DidYouKnowChip>{fact}</DidYouKnowChip>
                    </div>
                  )}
                </div>
              )
            })}
          </article>

          {/* Related planets */}
          {module.relatedPlanetIds?.length > 0 && (
            <section style={{ marginTop: 'var(--space-12)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Explore in 3D
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {module.relatedPlanetIds.map(id => {
                  const body = getBody(id)
                  if (!body) return null
                  return (
                    <Link
                      key={id}
                      to={`/explorer?focus=${id}`}
                      className="card-glass"
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)' }}
                    >
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: body.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{body.name}</span>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Related theories */}
          {module.relatedTheoryIds?.length > 0 && (
            <section style={{ marginTop: 'var(--space-8)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Related Theories
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {module.relatedTheoryIds.map(id => (
                  <Link
                    key={id}
                    to={`/theories/${id}`}
                    className="card-glass"
                    style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}
                  >
                    {titleCaseFromSlug(id)}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-12)', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ flex: '1 1 200px' }}
              onClick={handleMarkComplete}
              disabled={isComplete}
            >
              <CheckCircle2 size={16} strokeWidth={1.5} />
              {isComplete ? 'Completed' : 'Mark as Complete'}
            </button>
            <button
              className="btn-secondary"
              style={{ flex: '1 1 200px' }}
              onClick={() => navigate(`/quiz?module=${module.id}`)}
            >
              <HelpCircle size={16} strokeWidth={1.5} />
              Take the Quiz
            </button>
          </div>

          {guestPrompt && isGuest && (
            <p style={{ marginTop: 'var(--space-3)', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
              <Link to="/auth/signup" style={{ color: 'var(--color-blue)' }}>Sign up</Link> to save your progress across devices.
            </p>
          )}

          {/* Prev / Next */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)' }}>
            {prev ? (
              <Link to={`/learn/${prev.id}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                  <ArrowLeft size={12} strokeWidth={1.5} /> Previous
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/learn/${next.id}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', textAlign: 'right', marginLeft: 'auto' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', justifyContent: 'flex-end' }}>
                  Next <ArrowRight size={12} strokeWidth={1.5} />
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{next.title}</span>
              </Link>
            ) : <span />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
