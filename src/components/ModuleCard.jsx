import { Link } from 'react-router-dom'
import { Lock, ChevronRight, CheckCircle2, CircleDashed, Clock } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge'
import { getModuleIcon } from './moduleIcons'

function StatusIndicator({ status }) {
  if (status === 'complete') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-success)' }}>
        <CheckCircle2 size={13} strokeWidth={1.5} />
        Complete
      </span>
    )
  }
  if (status === 'in_progress') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-blue)' }}>
        <CircleDashed size={13} strokeWidth={1.5} />
        In Progress
      </span>
    )
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-faint)' }}>
      Not Started
    </span>
  )
}

export default function ModuleCard({ module, status = 'not_started', locked = false, lockReason }) {
  const Icon = getModuleIcon(module.icon)

  const inner = (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-blue-10)',
          color: 'var(--color-blue)',
        }}
      >
        <Icon size={22} strokeWidth={1.5} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {module.title}
          </h3>
          <DifficultyBadge level={module.tier} />
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-2)' }}>
          {module.summary}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-faint)' }}>
            <Clock size={12} strokeWidth={1.5} />
            {module.estimatedMinutes} min
          </span>
          {!locked && <StatusIndicator status={status} />}
        </div>
        {locked && lockReason && (
          <p style={{ marginTop: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            {lockReason}
          </p>
        )}
      </div>

      {locked ? (
        <Lock size={18} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
      ) : (
        <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
      )}
    </>
  )

  const sharedStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-4)',
    padding: 'var(--space-5)',
    opacity: locked ? 0.55 : 1,
  }

  if (locked) {
    return (
      <div className="card-glass" style={sharedStyle} aria-disabled="true">
        {inner}
      </div>
    )
  }

  return (
    <Link to={`/learn/${module.id}`} className="card-glass" style={{ ...sharedStyle, cursor: 'pointer' }}>
      {inner}
    </Link>
  )
}
