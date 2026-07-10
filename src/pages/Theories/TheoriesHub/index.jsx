import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import TheoryCard from '../../../components/TheoryCard'
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

export default function TheoriesHub() {
  const [tab, setTab] = useState('theories')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [era, setEra] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

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
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Filters + search */}
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)',
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
