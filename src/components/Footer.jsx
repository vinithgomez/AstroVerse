import { Link } from 'react-router-dom'
import LogoMark from './LogoMark'

const FOOTER_LINKS = [
  { label: 'Learn',    to: '/learn' },
  { label: 'Explorer', to: '/explorer' },
  { label: 'Quiz',     to: '/quiz' },
  { label: 'Theories', to: '/theories' },
  { label: 'News',     to: '/news' },
  { label: 'Progress', to: '/progress' },
]

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-12) var(--space-6)',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text-primary)',
              flexShrink: 0, padding: 'var(--space-2) 0', minHeight: 44,
            }}
          >
            <LogoMark size={22} />
            AstroVerse
          </Link>

          <nav aria-label="Footer navigation" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            {FOOTER_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--color-text-muted)',
                  padding: 'var(--space-2) var(--space-4)',
                  minHeight: 44,
                  borderRadius: 'var(--radius-btn)',
                  transition: 'color var(--transition-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', flexShrink: 0 }}>
            © 2026 AstroVerse. Explore the universe.
          </p>
        </div>
      </div>
    </footer>
  )
}
