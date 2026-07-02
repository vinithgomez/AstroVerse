import { Lightbulb } from 'lucide-react'

export default function DidYouKnowChip({ children }) {
  return (
    <aside
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: 'var(--color-blue-10)',
        border: '1px solid var(--color-blue-20)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <Lightbulb
        size={18}
        strokeWidth={1.5}
        style={{ color: 'var(--color-blue)', flexShrink: 0, marginTop: '2px' }}
      />
      <div>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-1)' }}>
          Did You Know?
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
          {children}
        </p>
      </div>
    </aside>
  )
}
