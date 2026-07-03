import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Shuffle, ChevronRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import QuizCard from '../../../components/QuizCard'
import { TIERS, getModulesByTier, getUnlockThreshold, PLANET_TO_MODULE_ID } from '../../../data/modules'
import { getQuestionsForTopic, getQuestionsForTopics, generateQuizSet } from '../../../data/quizBank'
import { useProgress } from '../../../hooks/useProgress'

export default function QuizStart() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { progressMap } = useProgress()

  // Pre-select topic from either /quiz?module=<moduleId> (Learn's "Take the
  // Quiz" button) or /quiz?topic=<planetId> (Explorer's "Quiz Me" button,
  // which passes a PLANET id, not a module id — routed through the same
  // PLANET_TO_MODULE_ID map used for InfoPanel's "Learn More" fix).
  const initialTopic = useMemo(() => {
    const moduleParam = searchParams.get('module')
    if (moduleParam) return moduleParam
    const topicParam = searchParams.get('topic')
    if (topicParam) return PLANET_TO_MODULE_ID[topicParam] ?? topicParam
    return null
  }, [searchParams])

  const [selectedTopic, setSelectedTopic] = useState(initialTopic)
  const [randomMix, setRandomMix] = useState(false)

  useEffect(() => {
    if (initialTopic) { setSelectedTopic(initialTopic); setRandomMix(false) }
  }, [initialTopic])

  const tierData = useMemo(() => {
    return TIERS.map((tier, i) => {
      const modules = getModulesByTier(tier.id)
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
      return { tier, modules, locked, lockReason }
    })
  }, [progressMap])

  const unlockedModuleIds = useMemo(
    () => tierData.filter(t => !t.locked).flatMap(t => t.modules.map(m => m.id)),
    [tierData],
  )

  function handleSelectTopic(moduleId) {
    setSelectedTopic(moduleId)
    setRandomMix(false)
  }

  function handleSelectRandomMix() {
    setRandomMix(true)
    setSelectedTopic(null)
  }

  function handleStart() {
    let pool, topic, difficulty
    if (randomMix) {
      pool = getQuestionsForTopics(unlockedModuleIds)
      topic = 'random-mix'
      difficulty = null
    } else if (selectedTopic) {
      pool = getQuestionsForTopic(selectedTopic)
      topic = selectedTopic
      difficulty = pool[0]?.difficulty ?? null
    } else {
      return
    }

    const questions = generateQuizSet(pool, 10)
    if (questions.length === 0) return
    navigate('/quiz/play', { state: { questions, topic, difficulty } })
  }

  const canStart = randomMix || !!selectedTopic

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
              Quiz System
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)' }}>
              Test what you've learned
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: '560px', lineHeight: 'var(--leading-relaxed)' }}>
              Pick a topic, or let us mix questions from everything you've unlocked so far.
            </p>
          </div>

          {/* Random Mix */}
          <button
            onClick={handleSelectRandomMix}
            className="card-glass"
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              padding: 'var(--space-5)', width: '100%', textAlign: 'left',
              marginBottom: 'var(--space-10)',
              border: randomMix ? '1px solid var(--color-purple)' : '1px solid var(--glass-border)',
              boxShadow: randomMix ? '0 0 0 1px var(--color-purple), 0 0 24px var(--color-purple-10)' : 'none',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 'var(--radius-card)', flexShrink: 0,
              background: randomMix ? 'var(--color-purple)' : 'var(--color-purple-10)',
              color: randomMix ? '#fff' : 'var(--color-purple)',
            }}>
              <Shuffle size={20} strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                Random Mix
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Pulls questions across every topic you've unlocked so far.
              </p>
            </div>
          </button>

          {/* Topic grid, by tier */}
          {tierData.map(({ tier, modules, locked, lockReason }) => (
            <section key={tier.id} style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {tier.label}
                </h2>
                {locked && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                    🔒 {lockReason}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--space-4)' }}>
                {modules.map(module => (
                  <QuizCard
                    key={module.id}
                    module={module}
                    questionCount={getQuestionsForTopic(module.id).length}
                    selected={selectedTopic === module.id}
                    locked={locked}
                    lockReason={lockReason}
                    onSelect={handleSelectTopic}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Start button — floating action bar, not just a naked sticky
              button, so it reads as an intentional overlay rather than
              accidentally overlapping the topic grid behind it. */}
          <div
            className="glass"
            style={{
              position: 'sticky', bottom: 'var(--space-6)',
              display: 'flex', justifyContent: 'center',
              marginTop: 'var(--space-12)', padding: 'var(--space-4)',
              borderRadius: 'var(--radius-panel)',
            }}
          >
            <button
              className="btn-primary"
              disabled={!canStart}
              onClick={handleStart}
              style={{ padding: 'var(--space-4) var(--space-10)', fontSize: 'var(--text-base)', opacity: canStart ? 1 : 0.5, cursor: canStart ? 'pointer' : 'not-allowed' }}
            >
              Start Quiz
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
