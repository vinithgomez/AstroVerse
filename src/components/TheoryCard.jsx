import { Link } from 'react-router-dom'
import Badge from './Badge'
import DifficultyBadge from './DifficultyBadge'
import { CATEGORIES } from '../data/theories'

export default function TheoryCard({ theory }) {
  const category = CATEGORIES.find(c => c.id === theory.category)

  return (
    <Link
      to={`/theories/${theory.id}`}
      className="card-glass"
      style={{
        display: 'block',
        padding: 'var(--space-6)',
        transition: 'transform var(--transition-base)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', gap: 'var(--space-3)' }}>
        <Badge variant={theory.status} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', flexShrink: 0 }}>
          {theory.year}
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase', color: category?.color ?? 'var(--color-text-muted)',
        }}
      >
        {category?.label ?? theory.category}
      </span>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', margin: 'var(--space-2) 0 var(--space-3)' }}>
        {theory.title}
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
        {theory.summary}
      </p>
      <DifficultyBadge level={theory.difficulty} />
    </Link>
  )
}
