const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function LevelSelector({ value, onChange }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-btn)',
        padding: '4px',
        gap: '2px',
      }}
    >
      {LEVELS.map((level) => {
        const active = value === level.toLowerCase()
        return (
          <button
            key={level}
            onClick={() => onChange?.(level.toLowerCase())}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: '6px',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              transition: 'all var(--transition-base)',
              background: active ? 'var(--color-blue)' : 'transparent',
              color: active ? '#fff' : 'var(--color-text-muted)',
              boxShadow: active ? '0 0 12px var(--color-blue-glow)' : 'none',
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
  )
}
