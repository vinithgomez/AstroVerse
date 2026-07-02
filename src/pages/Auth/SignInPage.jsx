import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import LogoMark from '../../components/LogoMark'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.48 14.42 17.64 12 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
      fontSize: 'var(--text-xs)', color: 'var(--color-danger)',
      marginTop: 'var(--space-1)',
    }}>
      <AlertCircle size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
      {msg}
    </p>
  )
}

const INPUT_BASE = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-btn)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  transition: 'border-color var(--transition-base), box-shadow var(--transition-base)',
  boxSizing: 'border-box',
}

const LABEL = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--weight-medium)',
  color: 'var(--color-text-muted)',
  marginBottom: 'var(--space-1)',
}

function apiError(msg = '') {
  if (/invalid login credentials/i.test(msg))
    return 'Incorrect email or password.'
  if (/email not confirmed/i.test(msg))
    return 'Please confirm your email address first.'
  if (/too many requests/i.test(msg))
    return 'Too many attempts. Please wait a moment and try again.'
  return 'Something went wrong. Please try again.'
}

export default function SignInPage() {
  const navigate = useNavigate()

  const [email,   setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [errors,  setErrors]  = useState({})
  const [formErr, setFormErr] = useState('')
  const [busy,    setBusy]    = useState(false)

  function validate() {
    const e = {}
    if (!email.trim())                     e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Please enter a valid email address.'
    if (!password)                         e.password = 'Password is required.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setFormErr('')
    setBusy(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) { setFormErr(apiError(error.message)); setBusy(false); return }

    navigate('/', {
      state: { notification: 'Welcome back — good to see you again.', variant: 'success' },
    })
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  const onFocus = e => { e.target.style.borderColor = 'var(--color-blue)';   e.target.style.boxShadow = '0 0 0 3px var(--color-blue-10)' }
  const onBlur  = e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-6)', background: 'var(--color-bg)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 50% at 15% 25%, rgba(79,142,247,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 60% 60% at 85% 75%, rgba(139,92,246,0.08) 0%, transparent 65%)
        `,
      }} />

      {/* Card */}
      <div className="card-glass" style={{
        width: '100%', maxWidth: '440px',
        padding: 'var(--space-8)', position: 'relative', zIndex: 1,
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <LogoMark size={44} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
            AstroVerse
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)',
          letterSpacing: 'var(--tracking-tight)', textAlign: 'center',
          marginBottom: 'var(--space-2)',
        }}>
          Welcome back
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)', textAlign: 'center',
          lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)',
        }}>
          Sign in to continue your journey through the universe.
        </p>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)',
            background: 'transparent', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)', color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)', cursor: 'pointer',
            transition: 'border-color var(--transition-base)',
            marginBottom: 'var(--space-5)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', whiteSpace: 'nowrap' }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Email */}
          <div>
            <label style={LABEL} htmlFor="si-email">Email</label>
            <input
              id="si-email" type="email" autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ ...INPUT_BASE, ...(errors.email ? { borderColor: 'var(--color-danger)' } : {}) }}
              onFocus={onFocus} onBlur={onBlur}
            />
            <FieldError msg={errors.email} />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-1)' }}>
              <label style={{ ...LABEL, marginBottom: 0 }} htmlFor="si-pw">Password</label>
              <Link to="/auth/reset" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', transition: 'color var(--transition-base)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-blue)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-faint)' }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="si-pw" type={showPw ? 'text' : 'password'} autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                style={{
                  ...INPUT_BASE,
                  paddingRight: 'calc(var(--space-4) + var(--space-8))',
                  ...(errors.password ? { borderColor: 'var(--color-danger)' } : {}),
                }}
                onFocus={onFocus} onBlur={onBlur}
              />
              <button
                type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                {showPw ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
            <FieldError msg={errors.password} />
          </div>

          {/* API-level error */}
          {formErr && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-danger-10)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-btn)',
            }}>
              <AlertCircle size={14} strokeWidth={1.5} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)' }}>{formErr}</span>
            </div>
          )}

          <button
            type="submit" className="btn-primary" disabled={busy}
            style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-sm)', padding: 'var(--space-3) var(--space-4)', opacity: busy ? 0.7 : 1, cursor: busy ? 'wait' : 'pointer', marginTop: 'var(--space-1)' }}
          >
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Sign-up link */}
        <p style={{ textAlign: 'center', marginTop: 'var(--space-5)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/auth/signup" style={{ color: 'var(--color-blue)', fontWeight: 'var(--weight-medium)' }}>Get started</Link>
        </p>
      </div>

      {/* Continue as Guest */}
      <Link
        to="/"
        style={{ marginTop: 'var(--space-5)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', padding: 'var(--space-2) var(--space-4)', transition: 'color var(--transition-base)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-faint)' }}
      >
        Continue as Guest
      </Link>
    </div>
  )
}
