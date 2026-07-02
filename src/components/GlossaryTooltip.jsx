import { useState } from 'react'

export default function GlossaryTooltip({ term, definition, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0}
        style={{
          color: 'var(--color-blue)',
          borderBottom: '1px dashed var(--color-blue)',
          cursor: 'help',
          outline: 'none',
        }}
      >
        {children ?? term}
      </span>
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            minWidth: '200px',
            maxWidth: '280px',
            padding: 'var(--space-3)',
            background: 'var(--color-surface-high)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--leading-relaxed)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          <span style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-1)', color: 'var(--color-blue)', fontFamily: 'var(--font-heading)' }}>
            {term}
          </span>
          {definition}
        </span>
      )}
    </span>
  )
}
