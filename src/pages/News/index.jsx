import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Rss, RotateCcw, SatelliteDish } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import NewsCard from '../../components/NewsCard'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'

const SOURCES = ['All', 'NASA', 'Space.com']
const FETCH_TIMEOUT_MS = 10000

function useNewsFeed() {
  const [state, setState] = useState({ loading: true, articles: [], stale: false, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    setState(s => ({ ...s, loading: true, error: null }))

    fetch('/api/news', { signal: controller.signal })
      .then(async res => {
        const data = await res.json().catch(() => null)
        if (!data || !Array.isArray(data.articles) || data.articles.length === 0) {
          throw new Error('empty')
        }
        setState({ loading: false, articles: data.articles, stale: !!data.stale, error: null })
      })
      .catch(err => {
        setState({
          loading: false, articles: [], stale: false,
          error: err.name === 'AbortError' ? 'timeout' : 'failed',
        })
      })
      .finally(() => clearTimeout(timeout))

    return () => { controller.abort(); clearTimeout(timeout) }
  }, [reloadKey])

  return { ...state, retry: () => setReloadKey(k => k + 1) }
}

export default function News() {
  const { user } = useAuth()
  const { loading, articles, stale, error, retry } = useNewsFeed()
  const [source, setSource] = useState('All')
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [guestPrompt, setGuestPrompt] = useState(false)
  // Guards against a race where the initial bookmarks-list read resolves
  // AFTER the user has already toggled a card — without this, the stale
  // batch response would silently overwrite an optimistic toggle made right
  // after the page loads.
  const hasToggledRef = useRef(false)

  useEffect(() => {
    hasToggledRef.current = false
    if (!user) { setBookmarkedIds(new Set()); return }
    let cancelled = false
    supabase
      .from('bookmarks')
      .select('content_id')
      .eq('user_id', user.id)
      .eq('content_type', 'news')
      .then(({ data, error: err }) => {
        if (cancelled || hasToggledRef.current) return
        if (err) { console.error('[News] failed to load bookmarks from Supabase:', err); return }
        setBookmarkedIds(new Set((data ?? []).map(row => row.content_id)))
      })
    return () => { cancelled = true }
  }, [user])

  async function toggleBookmark(article) {
    if (!user) { setGuestPrompt(true); return }
    setGuestPrompt(false)
    hasToggledRef.current = true
    const wasBookmarked = bookmarkedIds.has(article.id)
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      wasBookmarked ? next.delete(article.id) : next.add(article.id)
      return next
    })

    if (!wasBookmarked) {
      const { error: err } = await supabase.from('bookmarks').upsert(
        { user_id: user.id, content_type: 'news', content_id: article.id },
        { onConflict: 'user_id,content_type,content_id' },
      )
      if (err) console.error('[News] failed to save bookmark to Supabase:', err)
    } else {
      const { error: err } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', 'news')
        .eq('content_id', article.id)
      if (err) console.error('[News] failed to remove bookmark from Supabase:', err)
    }
  }

  const filtered = useMemo(
    () => (source === 'All' ? articles : articles.filter(a => a.source === source)),
    [articles, source],
  )

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
                Space News
              </p>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)' }}>
                The universe, live
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Rss size={14} strokeWidth={1.5} style={{ color: 'var(--color-blue)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                NASA · Space.com
              </span>
            </div>
          </div>

          {/* Source filter */}
          {!loading && !error && (
            <div style={{ display: 'inline-flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '4px', gap: '2px', marginBottom: 'var(--space-10)' }}>
              {SOURCES.map(s => {
                const active = source === s
                return (
                  <button
                    key={s}
                    onClick={() => setSource(s)}
                    style={{
                      padding: 'var(--space-2) var(--space-5)',
                      borderRadius: '6px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      fontFamily: 'var(--font-body)',
                      transition: 'all var(--transition-base)',
                      background: active ? 'var(--color-blue)' : 'transparent',
                      color: active ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          )}

          {stale && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-warning)', marginTop: -24, marginBottom: 'var(--space-8)' }}>
              Showing the last successfully fetched articles — live feeds are temporarily unreachable.
            </p>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-glass" style={{ padding: 'var(--space-5)', height: 260 }}>
                  <div style={{ width: '40%', height: 12, borderRadius: 4, background: 'var(--color-surface-high)', marginBottom: 'var(--space-4)', opacity: 0.6 }} />
                  <div style={{ width: '90%', height: 16, borderRadius: 4, background: 'var(--color-surface-high)', marginBottom: 'var(--space-3)', opacity: 0.6 }} />
                  <div style={{ width: '100%', height: 16, borderRadius: 4, background: 'var(--color-surface-high)', marginBottom: 'var(--space-6)', opacity: 0.4 }} />
                  <div style={{ width: '60%', height: 10, borderRadius: 4, background: 'var(--color-surface-high)', opacity: 0.4 }} />
                </div>
              ))}
            </div>
          )}

          {/* Error / empty state */}
          {!loading && error && (
            <div className="card-glass" style={{ padding: 'var(--space-12)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
              <SatelliteDish size={32} strokeWidth={1.5} style={{ color: 'var(--color-text-faint)' }} />
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Signal lost
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: 380 }}>
                {error === 'timeout'
                  ? 'The news feeds are taking too long to respond. This is usually temporary.'
                  : 'We couldn\'t reach NASA or Space.com right now. This is usually temporary — try again in a moment.'}
              </p>
              <button className="btn-secondary" onClick={retry}>
                <RotateCcw size={16} strokeWidth={1.5} />
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            filtered.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                {filtered.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    bookmarked={bookmarkedIds.has(article.id)}
                    onToggleBookmark={() => toggleBookmark(article)}
                  />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', padding: 'var(--space-12) 0' }}>
                No articles from {source} right now.
              </p>
            )
          )}

          {guestPrompt && (
            <p style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
              <Link to="/auth/signup" style={{ color: 'var(--color-blue)' }}>Sign up</Link> to save bookmarks across devices.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
