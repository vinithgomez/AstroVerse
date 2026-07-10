import { Link } from 'react-router-dom'
import { ERAS } from '../../../data/theories'

export default function DiscoveryTimeline({ discoveries }) {
  if (discoveries.length === 0) {
    return (
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', padding: 'var(--space-12) 0' }}>
        No discoveries match your filters.
      </p>
    )
  }

  const eraGroups = ERAS
    .map(era => ({ era, items: discoveries.filter(d => d.era === era.id) }))
    .filter(g => g.items.length > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      {eraGroups.map(({ era, items }) => (
        <section key={era.id}>
          <p
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase', color: 'var(--color-warning)', marginBottom: 'var(--space-5)',
            }}
          >
            {era.label}
          </p>

          <div style={{ position: 'relative' }}>
            {items.length > 1 && (
              <div aria-hidden style={{ position: 'absolute', left: 5, top: 8, bottom: 8, width: 2, background: 'var(--color-border)' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {items.map(d => (
                <Link
                  key={d.id}
                  to={`/theories/${d.id}`}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)' }}
                >
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 'var(--space-1)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-warning)', zIndex: 1, flexShrink: 0 }} />
                  </div>
                  <div className="card-glass" style={{ flex: 1, minWidth: 0, padding: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {d.title}
                      </h3>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-warning)', flexShrink: 0 }}>
                        {d.year}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                      {d.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
