import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import LogoMark from './LogoMark'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Learn',    to: '/learn' },
  { label: 'Explorer', to: '/explorer' },
  { label: 'Quiz',     to: '/quiz' },
  { label: 'Theories', to: '/theories' },
  { label: 'News',     to: '/news' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, loading, signOut } = useAuth()

  const displayName = user
    ? (user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Explorer').slice(0, 16)
    : null

  return (
    <nav
      className="fixed top-0 left-0 right-0 glass"
      style={{ borderBottom: '1px solid rgba(30, 33, 48, 0.8)', zIndex: 100 }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-6)',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)',
            padding: 'var(--space-2) 0', minHeight: 44,
          }}
        >
          <LogoMark size={22} />
          AstroVerse
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center" style={{ gap: 'var(--space-1)', flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className="btn-ghost"
                style={{
                  color: pathname.startsWith(to) ? 'var(--color-blue)' : 'var(--color-text-muted)',
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center" style={{ gap: 'var(--space-3)', flexShrink: 0 }}>
          {!loading && (user ? (
            <>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {displayName}
              </span>
              <button className="btn-ghost" onClick={signOut} style={{ color: 'var(--color-text-muted)' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/auth/signin" className="btn-ghost">Sign In</Link>
              <Link to="/auth/signup" className="btn-primary">Get Started</Link>
            </>
          ))}
        </div>

        {/* Mobile toggle — explicit 44px minimum, .btn-ghost's own padding
            alone renders at ~36px, under the tap-target guideline. */}
        <button
          className="md:hidden btn-ghost"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu — solid (not glass-translucent) background so hero/page
          content directly behind the dropdown never bleeds through and
          competes with the nav text. */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: 'var(--glass-border)',
            background: 'var(--color-bg)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="btn-ghost"
              style={{ justifyContent: 'flex-start', minHeight: 44 }}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: 'var(--space-2) 0' }} />
          {user ? (
            <button className="btn-secondary" onClick={() => { signOut(); setOpen(false) }}>Sign Out</button>
          ) : (
            <>
              <Link to="/auth/signin" className="btn-secondary" onClick={() => setOpen(false)}>Sign In</Link>
              <Link to="/auth/signup" className="btn-primary" onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
