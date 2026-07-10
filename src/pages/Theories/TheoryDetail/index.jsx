import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, XCircle } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Badge from '../../../components/Badge'
import DifficultyBadge from '../../../components/DifficultyBadge'
import { getTheory, CATEGORIES } from '../../../data/theories'
import { getModule } from '../../../data/modules'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../lib/supabaseClient'

function NotFound() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 'calc(64px + var(--space-16))', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>Theory not found.</p>
        <Link to="/theories" className="btn-primary" style={{ display: 'inline-flex', marginTop: 'var(--space-6)' }}>
          Back to Theories
        </Link>
      </div>
    </div>
  )
}

export default function TheoryDetail() {
  const { theoryId } = useParams()
  const { user } = useAuth()
  const theory = getTheory(theoryId)

  const [explanation, setExplanation] = useState('beginner')
  const [bookmarked, setBookmarked] = useState(false)
  const [guestPrompt, setGuestPrompt] = useState(false)
  // Guards against a race where the initial "is this bookmarked?" read
  // resolves AFTER the user has already manually toggled it — without this,
  // the stale response silently overwrites the optimistic update, making a
  // real click appear to do nothing if it happens right after page load.
  const hasToggledRef = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setExplanation('beginner')
    setGuestPrompt(false)
    hasToggledRef.current = false
    if (!theory) return
    if (!user) { setBookmarked(false); return }

    let cancelled = false
    supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_type', 'theory')
      .eq('content_id', theory.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled || hasToggledRef.current) return
        if (error) console.error('[TheoryDetail] failed to load bookmark state from Supabase:', error)
        setBookmarked(!!data)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theoryId, user])

  if (!theory) return <NotFound />

  const category = CATEGORIES.find(c => c.id === theory.category)
  const relatedModule = theory.relatedModuleId ? getModule(theory.relatedModuleId) : null
  const relatedTheories = (theory.relatedTheoryIds ?? []).map(getTheory).filter(Boolean)
  const relatedDiscoveries = (theory.relatedDiscoveryIds ?? []).map(getTheory).filter(Boolean)

  async function handleBookmark() {
    if (!user) { setGuestPrompt(true); return }
    setGuestPrompt(false)
    hasToggledRef.current = true
    const nextVal = !bookmarked
    setBookmarked(nextVal)

    if (nextVal) {
      const { error } = await supabase.from('bookmarks').upsert(
        { user_id: user.id, content_type: 'theory', content_id: theory.id },
        { onConflict: 'user_id,content_type,content_id' },
      )
      if (error) console.error('[TheoryDetail] failed to save bookmark to Supabase:', error)
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', 'theory')
        .eq('content_id', theory.id)
      if (error) console.error('[TheoryDetail] failed to remove bookmark from Supabase:', error)
    }
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 var(--space-6)' }}>

          <Link
            to="/theories"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', minHeight: 44 }}
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            All Theories
          </Link>

          {/* Header */}
          <header style={{ marginBottom: 'var(--space-10)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <Badge variant={theory.status} />
              <button
                onClick={handleBookmark}
                className="btn-ghost"
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this theory'}
                style={{ color: bookmarked ? 'var(--color-blue)' : 'var(--color-text-muted)', minWidth: 44, minHeight: 44, justifyContent: 'center' }}
              >
                {bookmarked ? <BookmarkCheck size={20} strokeWidth={1.5} /> : <Bookmark size={20} strokeWidth={1.5} />}
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: category?.color, marginBottom: 'var(--space-3)' }}>
              {category?.label}
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
              {theory.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              <DifficultyBadge level={theory.difficulty} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                Proposed by {theory.proposedBy} · {theory.year}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {theory.summary}
            </p>
          </header>

          {/* Beginner / Advanced toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '4px', gap: '2px', marginBottom: 'var(--space-6)' }}>
            {['beginner', 'advanced'].map(level => {
              const active = explanation === level
              return (
                <button
                  key={level}
                  onClick={() => setExplanation(level)}
                  style={{
                    padding: 'var(--space-2) var(--space-5)',
                    borderRadius: '6px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    textTransform: 'capitalize',
                    transition: 'all var(--transition-base)',
                    background: active ? 'var(--color-blue)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text-muted)',
                    minHeight: 44,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {level}
                </button>
              )
            })}
          </div>

          <article style={{ marginBottom: 'var(--space-10)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
              {explanation === 'beginner' ? theory.beginnerExplanation : theory.advancedExplanation}
            </p>
          </article>

          {/* Evidence */}
          {(theory.evidenceFor?.length > 0 || theory.evidenceAgainst?.length > 0) && (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
              {theory.evidenceFor?.length > 0 && (
                <div className="card-glass" style={{ padding: 'var(--space-5)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-success)', marginBottom: 'var(--space-4)' }}>
                    <CheckCircle2 size={14} strokeWidth={1.5} />
                    Evidence For
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {theory.evidenceFor.map((item, i) => (
                      <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', paddingLeft: 'var(--space-4)', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--color-success)' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {theory.evidenceAgainst?.length > 0 && (
                <div className="card-glass" style={{ padding: 'var(--space-5)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>
                    <XCircle size={14} strokeWidth={1.5} />
                    Evidence Against
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {theory.evidenceAgainst.map((item, i) => (
                      <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', paddingLeft: 'var(--space-4)', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--color-danger)' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Related theories */}
          {relatedTheories.length > 0 && (
            <section style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Related Theories
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {relatedTheories.map(t => (
                  <Link key={t.id} to={`/theories/${t.id}`} className="card-glass" style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                    {t.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related discoveries */}
          {relatedDiscoveries.length > 0 && (
            <section style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Related Discoveries
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {relatedDiscoveries.map(d => (
                  <Link key={d.id} to={`/theories/${d.id}`} className="card-glass" style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                    {d.title} <span style={{ color: 'var(--color-text-faint)' }}>· {d.year}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related module */}
          {relatedModule && (
            <section style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Learn More
              </h3>
              <Link to={`/learn/${relatedModule.id}`} className="card-glass" style={{ display: 'inline-block', padding: 'var(--space-4) var(--space-5)' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                  {relatedModule.title}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {relatedModule.summary}
                </p>
              </Link>
            </section>
          )}

          {guestPrompt && (
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
              <Link to="/auth/signup" style={{ color: 'var(--color-blue)' }}>Sign up</Link> to save bookmarks across devices.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
