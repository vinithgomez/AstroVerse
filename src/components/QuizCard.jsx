import { Lock, HelpCircle } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge'
import { getModuleIcon } from './moduleIcons'

export default function QuizCard({ module, questionCount, selected, locked, lockReason, onSelect }) {
  const Icon = getModuleIcon(module.icon)

  return (
    <button
      onClick={() => !locked && onSelect(module.id)}
      disabled={locked}
      className="card-glass"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        padding: 'var(--space-5)',
        textAlign: 'left',
        width: '100%',
        opacity: locked ? 0.55 : 1,
        cursor: locked ? 'not-allowed' : 'pointer',
        border: selected ? '1px solid var(--color-blue)' : '1px solid var(--glass-border)',
        boxShadow: selected ? '0 0 0 1px var(--color-blue), 0 0 24px var(--color-blue-10)' : 'none',
      }}
      title={locked ? lockReason : undefined}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 44, height: 44, borderRadius: 'var(--radius-card)', flexShrink: 0,
          background: selected ? 'var(--color-blue)' : 'var(--color-blue-10)',
          color: selected ? '#fff' : 'var(--color-blue)',
        }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
          <h3 style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {module.title}
          </h3>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <DifficultyBadge level={module.tier} />
            {locked && <Lock size={16} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)' }} />}
          </div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
          <HelpCircle size={12} strokeWidth={1.5} />
          {questionCount} questions
        </span>
      </div>
    </button>
  )
}
