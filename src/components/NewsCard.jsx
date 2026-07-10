import { Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react'

const DAY_MS = 24 * 60 * 60 * 1000

function relativeTime(iso) {
  if (!iso) return null
  const diffMs = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(diffMs)) return null
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function isBreaking(iso) {
  if (!iso) return false
  return Date.now() - new Date(iso).getTime() < DAY_MS
}

export default function NewsCard({ article, bookmarked, onToggleBookmark }) {
  const breaking = isBreaking(article.publishedAt)

  return (
    <div
      className="card-glass"
      onClick={() => window.open(article.link, '_blank', 'noopener,noreferrer')}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform var(--transition-base)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {article.thumbnail && (
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--color-surface-high)' }}>
          <img
            src={article.thumbnail}
            alt=""
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <button
        onClick={e => { e.stopPropagation(); onToggleBookmark() }}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this article'}
        className="btn-ghost"
        style={{
          position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)',
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(8px)',
          color: bookmarked ? 'var(--color-blue)' : '#fff', borderRadius: 'var(--radius-full)',
        }}
      >
        {bookmarked ? <BookmarkCheck size={16} strokeWidth={1.5} /> : <Bookmark size={16} strokeWidth={1.5} />}
      </button>

      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-blue)', fontWeight: 600 }}>
            {article.source}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-border)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {article.category || 'Space News'}
          </span>
          {breaking && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-danger)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)' }}>
                ● BREAKING
              </span>
            </>
          )}
        </div>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-snug)' }}>
          {article.title}
        </h3>

        {article.summary && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', flex: 1 }}>
            {article.summary}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-faint)' }}>
            <Clock size={12} strokeWidth={1.5} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{relativeTime(article.publishedAt) ?? 'Unknown date'}</span>
          </div>
          <ExternalLink size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-faint)' }} />
        </div>
      </div>
    </div>
  )
}
