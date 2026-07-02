export default function ProgressBar({ value = 0, max = 100, label, showPercent = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {label}
            </span>
          )}
          {showPercent && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-blue)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          height: '6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(90deg, var(--color-blue), var(--color-purple))',
            transition: 'width var(--transition-slow)',
          }}
        />
      </div>
    </div>
  )
}
