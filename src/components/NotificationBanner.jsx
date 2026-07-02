import { useState, useEffect, useCallback } from 'react'
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'

const VARIANTS = {
  info:    { Icon: Info,          color: 'var(--color-blue)',    bg: 'var(--color-blue-10)',    border: 'var(--color-blue-20)' },
  success: { Icon: CheckCircle2,  color: 'var(--color-success)', bg: 'var(--color-success-10)', border: 'rgba(34,197,94,0.2)' },
  warning: { Icon: AlertTriangle, color: 'var(--color-warning)', bg: 'var(--color-warning-10)', border: 'rgba(234,179,8,0.2)' },
  danger:  { Icon: AlertCircle,   color: 'var(--color-danger)',  bg: 'var(--color-danger-10)',  border: 'rgba(239,68,68,0.2)' },
}

const FADE_DURATION = 300

export default function NotificationBanner({ variant = 'info', children, dismissible = true, autoDismiss }) {
  const [dismissed, setDismissed] = useState(false)
  const [fading,    setFading]    = useState(false)
  const { Icon, color, bg, border } = VARIANTS[variant] ?? VARIANTS.info

  const startFade = useCallback(() => {
    setFading(true)
    setTimeout(() => setDismissed(true), FADE_DURATION)
  }, [])

  useEffect(() => {
    if (!autoDismiss) return
    const t = setTimeout(startFade, autoDismiss)
    return () => clearTimeout(t)
  }, [autoDismiss, startFade])

  if (dismissed) return null

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-card)',
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
      }}
    >
      <Icon size={18} strokeWidth={1.5} style={{ color, flexShrink: 0, marginTop: '1px' }} />
      <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
        {children}
      </span>
      {dismissible && (
        <button
          onClick={startFade}
          aria-label="Dismiss"
          style={{ color: 'var(--color-text-muted)', display: 'flex', transition: 'color var(--transition-fast)' }}
          className="btn-ghost"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
