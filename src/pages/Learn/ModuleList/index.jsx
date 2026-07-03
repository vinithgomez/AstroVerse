import { useState, useMemo } from 'react'
import { Search, Check } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import ModuleCard from '../../../components/ModuleCard'
import ProgressBar from '../../../components/ProgressBar'
import { TIERS, getModulesByTier, ALL_MODULES_ORDERED, getUnlockThreshold } from '../../../data/modules'
import { useProgress } from '../../../hooks/useProgress'

const TIER_FILTERS = [{ id: 'all', label: 'All' }, ...TIERS.map(t => ({ id: t.id, label: t.label }))]

function statusOf(progressMap, moduleId) {
  return progressMap[moduleId] === 'complete'
    ? 'complete'
    : progressMap[moduleId] === 'in_progress'
      ? 'in_progress'
      : 'not_started'
}

function TierSection({ tier, modules, progressMap, locked, lockReason }) {
  const completedCount = modules.filter(m => progressMap[m.id] === 'complete').length

  return (
    <section style={{ marginBottom: 'var(--space-16)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: tier.color, marginBottom: 'var(--space-1)' }}>
            {tier.subtitle}
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {tier.label}
          </h2>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {completedCount} / {modules.length} complete
        </span>
      </div>

      {locked && (
        <div
          className="card-glass"
          style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            🔒 {lockReason}
          </span>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {modules.length > 1 && (
          <div aria-hidden style={{ position: 'absolute', left: 15, top: 32, bottom: 32, width: 2, background: 'var(--color-border)' }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {modules.map((module, i) => {
            const status = statusOf(progressMap, module.id)
            return (
              <div key={module.id} style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--space-4)' }}>
                <div style={{ flexShrink: 0, width: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 'var(--space-5)' }}>
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: status === 'complete' ? 'var(--color-success)' : 'var(--color-surface)',
                      border: `2px solid ${status === 'complete' ? 'var(--color-success)' : status === 'in_progress' ? 'var(--color-blue)' : 'var(--color-border)'}`,
                      color: status === 'complete' ? '#fff' : 'var(--color-text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      flexShrink: 0,
                    }}
                  >
                    {status === 'complete' ? <Check size={14} strokeWidth={2} /> : i + 1}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ModuleCard
                    module={module}
                    status={status}
                    locked={locked}
                    lockReason={locked ? lockReason : undefined}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function ModuleList() {
  const { progressMap, loading } = useProgress()
  const [activeTier, setActiveTier] = useState('all')
  const [query, setQuery] = useState('')

  const totalModules = ALL_MODULES_ORDERED.length
  const totalComplete = ALL_MODULES_ORDERED.filter(m => progressMap[m.id] === 'complete').length

  const tierData = useMemo(() => {
    return TIERS.map((tier, i) => {
      const allInTier = getModulesByTier(tier.id)
      const q = query.trim().toLowerCase()
      const filtered = q
        ? allInTier.filter(m => m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q))
        : allInTier

      let locked = false
      let lockReason
      if (i > 0) {
        const prevTier = TIERS[i - 1]
        const prevModules = getModulesByTier(prevTier.id)
        const prevCompleted = prevModules.filter(m => progressMap[m.id] === 'complete').length
        const threshold = getUnlockThreshold(tier.id)
        locked = prevCompleted < threshold
        lockReason = `Complete ${threshold} ${prevTier.label} module${threshold === 1 ? '' : 's'} to unlock`
      }

      return { tier, modules: filtered, locked, lockReason }
    })
  }, [query, progressMap])

  const visibleTierData = activeTier === 'all' ? tierData : tierData.filter(t => t.tier.id === activeTier)

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
              Learning Path
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
              Learning Modules
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: '560px', lineHeight: 'var(--leading-relaxed)' }}>
              Structured modules that grow with you — from your first orbit to the edge of known physics.
            </p>
          </div>

          {/* Overall progress */}
          <div className="card-glass" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
            <ProgressBar value={totalComplete} max={totalModules} label={`${totalComplete} of ${totalModules} modules complete`} />
          </div>

          {/* Filter + search */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-12)',
            }}
          >
            <div style={{ display: 'inline-flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '4px', gap: '2px' }}>
              {TIER_FILTERS.map(f => {
                const active = activeTier === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveTier(f.id)}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: '6px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      fontFamily: 'var(--font-body)',
                      transition: 'all var(--transition-base)',
                      background: active ? 'var(--color-blue)' : 'transparent',
                      color: active ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

            <div style={{ position: 'relative', minWidth: 240 }}>
              <Search size={16} strokeWidth={1.5} style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search modules…"
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-4) var(--space-2) calc(var(--space-3) + 20px)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-btn)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Tier sections */}
          {!loading && visibleTierData.map(({ tier, modules, locked, lockReason }) => (
            modules.length > 0 || query === '' ? (
              <TierSection key={tier.id} tier={tier} modules={modules} progressMap={progressMap} locked={locked} lockReason={lockReason} />
            ) : null
          ))}

          {!loading && visibleTierData.every(t => t.modules.length === 0) && (
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', padding: 'var(--space-12) 0' }}>
              No modules match "{query}".
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
