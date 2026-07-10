import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import TheoryCard from '../../../components/TheoryCard'
import BottomSheet from '../../../components/BottomSheet'
import DiscoveryTimeline from './DiscoveryTimeline'
import { theories, CATEGORIES, STATUSES, DIFFICULTIES, ERAS, getDiscoveriesTimeline } from '../../../data/theories'

const THEORY_CATEGORIES = CATEGORIES.filter(c => c.id !== 'discovery')

const selectStyle = {
  padding: 'var(--space-2) var(--space-3)',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-btn)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
}

const TABS = [
  { id: 'theories', label: 'Theories' },
  { id: 'timeline', label: 'Discoveries Timeline' },
]

function FilterField({ label, children }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

export default function TheoriesHub() {
  const [tab, setTab] = useState('theories')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [era, setEra] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilterCount = [category, status, difficulty, era].filter(v => v !== 'all').length

  function clearFilters() {
    setCategory('all'); setStatus('all'); setDifficulty('all'); setEra('all')
  }

  const theoryList = useMemo(() => {
    const q = query.trim().toLowerCase()
    return theories
      .filter(t => t.category !== 'discovery')
      .filter(t => category === 'all' || t.category === category)
      .filter(t => status === 'all' || t.status === status)
      .filter(t => era === 'all' || t.era === era)
      .filter(t => difficulty === 'all' || t.difficulty === difficulty)
      .filter(t => !q || t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q))
  }, [query, category, status, era, difficulty])

  const discoveryList = useMemo(() => {
    const q = query.trim().toLowerCase()
    return getDiscoveriesTimeline()
      .filter(d => era === 'all' || d.era === era)
      .filter(d => !q || d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q))
  }, [query, era])

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-purple)', marginBottom: 'var(--space-3)' }}>
              Theories & Discoveries
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
              Science at the edge of what we know
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: '560px', lineHeight: 'var(--leading-relaxed)' }}>
              Proven fact. Working hypothesis. Fierce debate. Explore the theories that explain the universe, and the discoveries that shaped them.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'inline-flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '4px', gap: '2px', marginBottom: 'var(--space-8)' }}>
            {TABS.map(t => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: 'var(--space-2) var(--space-5)',
                    borderRadius: '6px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-base)',
                    background: active ? 'var(--color-blue)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text-muted)',
                    minHeight: 44,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Filters + search — desktop: full inline row. Mobile: search bar
              + a single "Filters" button opening a bottom sheet, since 3-4
              stacked <select> elements ate a huge amount of vertical space
              above the fold on a phone before any actual content appeared. */}
          <div
            className="hidden md:flex"
            style={{
              flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)',
              marginBottom: 'var(--space-10)',
            }}
          >
            {tab === 'theories' && (
              <>
                <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
                  <option value="all">All Categories</option>
                  {THEORY_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
                  <option value="all">All Statuses</option>
                  {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={selectStyle}>
                  <option value="all">All Difficulties</option>
                  {DIFFICULTIES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </>
            )}
            <select value={era} onChange={e => setEra(e.target.value)} style={selectStyle}>
              <option value="all">All Eras</option>
              {ERAS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>

            <div style={{ position: 'relative', minWidth: 240, marginLeft: 'auto' }}>
              <Search size={16} strokeWidth={1.5} style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search theories & discoveries…"
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

          <div className="flex md:hidden" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-10)' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <Search size={16} strokeWidth={1.5} style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search…"
                style={{
                  width: '100%', minHeight: 44,
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
            <button
              onClick={() => setFiltersOpen(true)}
              className="card-glass"
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0,
                padding: 'var(--space-2) var(--space-4)', minHeight: 44,
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
                position: 'relative',
              }}
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    minWidth: 18, height: 18, borderRadius: 'var(--radius-full)',
                    background: 'var(--color-blue)', color: '#fff',
                    fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Filters
              </h2>
              <button onClick={() => setFiltersOpen(false)} className="btn-ghost" style={{ padding: 'var(--space-2)', minWidth: 44, minHeight: 44 }} aria-label="Close filters">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {tab === 'theories' && (
                <>
                  <FilterField label="Category">
                    <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...selectStyle, width: '100%', minHeight: 44 }}>
                      <option value="all">All Categories</option>
                      {THEORY_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </FilterField>
                  <FilterField label="Status">
                    <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...selectStyle, width: '100%', minHeight: 44 }}>
                      <option value="all">All Statuses</option>
                      {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </FilterField>
                  <FilterField label="Difficulty">
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ ...selectStyle, width: '100%', minHeight: 44 }}>
                      <option value="all">All Difficulties</option>
                      {DIFFICULTIES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                    </select>
                  </FilterField>
                </>
              )}
              <FilterField label="Era">
                <select value={era} onChange={e => setEra(e.target.value)} style={{ ...selectStyle, width: '100%', minHeight: 44 }}>
                  <option value="all">All Eras</option>
                  {ERAS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                </select>
              </FilterField>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button onClick={clearFilters} className="btn-secondary" style={{ flex: 1 }}>
                Clear All
              </button>
              <button onClick={() => setFiltersOpen(false)} className="btn-primary" style={{ flex: 1 }}>
                Show Results
              </button>
            </div>
          </BottomSheet>

          {/* Content */}
          {tab === 'theories' ? (
            theoryList.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                {theoryList.map(theory => <TheoryCard key={theory.id} theory={theory} />)}
              </div>
            ) : (
              <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', padding: 'var(--space-12) 0' }}>
                No theories match your filters.
              </p>
            )
          ) : (
            <DiscoveryTimeline discoveries={discoveryList} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
