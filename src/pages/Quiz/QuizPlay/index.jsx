import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import {
  CheckCircle2, XCircle, ChevronUp, ChevronDown, Award, RotateCcw, ArrowRight, Home,
} from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import DifficultyBadge from '../../../components/DifficultyBadge'
import ProgressBar from '../../../components/ProgressBar'
import { getBody } from '../../../data/planets'
import { getModule, TIERS, getModulesByTier, getUnlockThreshold } from '../../../data/modules'
import { getQuestionsForTopic, getQuestionsForTopics, generateQuizSet } from '../../../data/quizBank'
import { useQuizSubmission } from '../../../hooks/useQuizSubmission'
import { useProgress } from '../../../hooks/useProgress'
import { isFuzzyMatch } from '../../../lib/fuzzyMatch'

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function topicLabel(topic) {
  if (topic === 'random-mix') return 'Random Mix'
  return getModule(topic)?.title ?? topic
}

// ── Answer option button (shared by multiple-choice / true-false / image) ──
function OptionButton({ label, onClick, submitted, isSelected, isCorrectOption }) {
  let bg = 'var(--color-surface)', border = 'var(--color-border)', color = 'var(--color-text-primary)'
  if (submitted && isCorrectOption) { bg = 'var(--color-success-10)'; border = 'rgba(34,197,94,0.4)'; color = 'var(--color-success)' }
  else if (submitted && isSelected && !isCorrectOption) { bg = 'var(--color-danger-10)'; border = 'rgba(239,68,68,0.4)'; color = 'var(--color-danger)' }
  else if (isSelected) { bg = 'var(--color-blue-10)'; border = 'var(--color-blue)' }

  return (
    <button
      onClick={onClick}
      disabled={submitted}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-4)', background: bg, border: `1px solid ${border}`,
        borderRadius: 'var(--radius-btn)', color, fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-base)', textAlign: 'left', width: '100%',
        cursor: submitted ? 'default' : 'pointer', transition: 'all var(--transition-fast)',
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {submitted && isCorrectOption && <CheckCircle2 size={18} strokeWidth={1.5} />}
      {submitted && isSelected && !isCorrectOption && <XCircle size={18} strokeWidth={1.5} />}
    </button>
  )
}

function ExplanationBox({ isCorrect, explanation }) {
  return (
    <div
      style={{
        marginTop: 'var(--space-5)', padding: 'var(--space-5)',
        background: isCorrect ? 'var(--color-success-10)' : 'var(--color-danger-10)',
        border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        borderRadius: 'var(--radius-card)',
      }}
    >
      <p style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)',
        color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)', marginBottom: 'var(--space-2)',
      }}>
        {isCorrect ? <CheckCircle2 size={16} strokeWidth={1.5} /> : <XCircle size={16} strokeWidth={1.5} />}
        {isCorrect ? 'Correct' : 'Not quite'}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
        {explanation}
      </p>
    </div>
  )
}

// ── Active question ─────────────────────────────────────────────────────────
function QuestionCard({ q, onAnswered }) {
  const [submitted, setSubmitted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [selectedBool, setSelectedBool] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [orderState, setOrderState] = useState(() => shuffle(q.items ?? []))
  const [lastCorrect, setLastCorrect] = useState(false)

  useEffect(() => {
    setSubmitted(false); setSelectedIndex(null); setSelectedBool(null)
    setTextAnswer(''); setOrderState(shuffle(q.items ?? [])); setLastCorrect(false)
  }, [q.id])

  function finish(userAnswer, correctAnswer, isCorrect) {
    setSubmitted(true)
    setLastCorrect(isCorrect)
    onAnswered({ questionId: q.id, question: q.question, type: q.type, userAnswer, correctAnswer, isCorrect, explanation: q.explanation })
  }

  function handleChoice(i) {
    if (submitted) return
    setSelectedIndex(i)
    finish(q.options[i], q.options[q.correctIndex], i === q.correctIndex)
  }

  function handleTrueFalse(val) {
    if (submitted) return
    setSelectedBool(val)
    finish(val ? 'True' : 'False', q.correctAnswer ? 'True' : 'False', val === q.correctAnswer)
  }

  function handleFillSubmit() {
    if (submitted || !textAnswer.trim()) return
    const isCorrect = isFuzzyMatch(textAnswer, q.acceptableAnswers)
    finish(textAnswer.trim(), q.acceptableAnswers[0], isCorrect)
  }

  function moveItem(idx, dir) {
    if (submitted) return
    setOrderState(prev => {
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }
  function handleOrderSubmit() {
    if (submitted) return
    const isCorrect = orderState.every((item, i) => item === q.items[i])
    finish(orderState.join(' → '), q.items.join(' → '), isCorrect)
  }

  const body = q.type === 'image' ? getBody(q.bodyId) : null

  return (
    <div>
      {body && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <div
            aria-hidden
            style={{
              width: 120, height: 120, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${body.color} 85%, white), ${body.color} 55%, color-mix(in srgb, ${body.color} 60%, black))`,
              boxShadow: `0 0 40px color-mix(in srgb, ${body.color} 30%, transparent)`,
            }}
          />
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-snug)', marginBottom: 'var(--space-6)' }}>
        {q.question}
      </p>

      {(q.type === 'multiple-choice' || q.type === 'image') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {q.options.map((opt, i) => (
            <OptionButton
              key={i}
              label={opt}
              onClick={() => handleChoice(i)}
              submitted={submitted}
              isSelected={selectedIndex === i}
              isCorrectOption={i === q.correctIndex}
            />
          ))}
        </div>
      )}

      {q.type === 'true-false' && (
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <OptionButton label="True" onClick={() => handleTrueFalse(true)} submitted={submitted} isSelected={selectedBool === true} isCorrectOption={q.correctAnswer === true} />
          </div>
          <div style={{ flex: 1 }}>
            <OptionButton label="False" onClick={() => handleTrueFalse(false)} submitted={submitted} isSelected={selectedBool === false} isCorrectOption={q.correctAnswer === false} />
          </div>
        </div>
      )}

      {q.type === 'fill-blank' && (
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            value={textAnswer}
            onChange={e => setTextAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleFillSubmit() }}
            disabled={submitted}
            placeholder="Type your answer…"
            style={{
              flex: 1, padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)',
              color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', outline: 'none',
            }}
          />
          <button className="btn-primary" onClick={handleFillSubmit} disabled={submitted || !textAnswer.trim()}>
            Check
          </button>
        </div>
      )}

      {q.type === 'ordering' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {orderState.map((item, i) => (
            <div
              key={item}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', minWidth: 16 }}>{i + 1}</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{item}</span>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <button onClick={() => moveItem(i, -1)} disabled={submitted || i === 0} className="btn-ghost" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Move up">
                  <ChevronUp size={16} strokeWidth={1.5} />
                </button>
                <button onClick={() => moveItem(i, 1)} disabled={submitted || i === orderState.length - 1} className="btn-ghost" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Move down">
                  <ChevronDown size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
          {!submitted && (
            <button className="btn-primary" onClick={handleOrderSubmit} style={{ marginTop: 'var(--space-3)', alignSelf: 'flex-start' }}>
              Submit Order
            </button>
          )}
        </div>
      )}

      {submitted && <ExplanationBox isCorrect={lastCorrect} explanation={q.explanation} />}
    </div>
  )
}

// ── Results ──────────────────────────────────────────────────────────────────
function ResultsScreen({ topic, difficulty, answers, onRetake }) {
  const score = answers.filter(a => a.isCorrect).length
  const total = answers.length
  const percentage = Math.round((score / total) * 100)
  const { submitQuizResult, isGuest } = useQuizSubmission()
  const [badges, setBadges] = useState([])
  const [saved, setSaved] = useState(null)
  const hasWrittenRef = useRef(false)

  useEffect(() => {
    if (hasWrittenRef.current) return
    hasWrittenRef.current = true
    submitQuizResult({ topic, difficulty, score, total }).then(result => {
      setBadges(result.badges)
      setSaved(result.saved)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 'var(--space-3)' }}>
          {topicLabel(topic)} — Results
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
          {score} <span style={{ color: 'var(--color-text-faint)', fontSize: '0.5em' }}>/ {total}</span>
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', color: percentage >= 80 ? 'var(--color-success)' : 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          {percentage}%
        </p>
      </div>

      {badges.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
          {badges.map(badge => (
            <div
              key={badge.badge_id}
              className="card-glass"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)' }}
            >
              <Award size={22} strokeWidth={1.5} style={{ color: 'var(--color-warning)' }} />
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{badge.label}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isGuest && saved === false && (
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', marginBottom: 'var(--space-8)' }}>
          <Link to="/auth/signup" style={{ color: 'var(--color-blue)' }}>Sign up</Link> to save this score and your badges.
        </p>
      )}

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        {answers.map((a, i) => (
          <div key={a.questionId} className="card-glass" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {i + 1}. {a.question}
              </p>
              {a.isCorrect
                ? <CheckCircle2 size={18} strokeWidth={1.5} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                : <XCircle size={18} strokeWidth={1.5} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
              Your answer: <span style={{ color: a.isCorrect ? 'var(--color-success)' : 'var(--color-danger)' }}>{a.userAnswer}</span>
            </p>
            {!a.isCorrect && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>
                Correct answer: {a.correctAnswer}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {a.explanation}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-primary" onClick={onRetake}>
          <RotateCcw size={16} strokeWidth={1.5} />
          Retake Quiz
        </button>
        <Link to="/quiz" className="btn-secondary">
          <ArrowRight size={16} strokeWidth={1.5} />
          Try a Different Topic
        </Link>
        <Link to="/learn" className="btn-secondary">
          <Home size={16} strokeWidth={1.5} />
          Back to Learning Modules
        </Link>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function QuizPlay() {
  const location = useLocation()
  const { progressMap } = useProgress()

  const [session, setSession] = useState(() => location.state?.questions ? location.state : null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])

  if (!session?.questions?.length) {
    return <Navigate to="/quiz" replace />
  }

  const { questions, topic, difficulty } = session
  const currentQuestion = questions[currentIndex]
  const phase = currentIndex >= questions.length ? 'results' : 'question'

  function handleAnswered(record) {
    setAnswers(prev => [...prev, record])
  }

  function handleNext() {
    setCurrentIndex(i => i + 1)
  }

  function handleRetake() {
    let pool
    if (topic === 'random-mix') {
      const unlockedModuleIds = TIERS
        .map((tier, i) => {
          if (i === 0) return { tier, locked: false }
          const prevModules = getModulesByTier(TIERS[i - 1].id)
          const prevCompleted = prevModules.filter(m => progressMap[m.id] === 'complete').length
          return { tier, locked: prevCompleted < getUnlockThreshold(tier.id) }
        })
        .filter(t => !t.locked)
        .flatMap(t => getModulesByTier(t.tier.id).map(m => m.id))
      pool = getQuestionsForTopics(unlockedModuleIds)
    } else {
      pool = getQuestionsForTopic(topic)
    }
    const freshQuestions = generateQuizSet(pool, 10)
    setSession({ questions: freshQuestions, topic, difficulty })
    setCurrentIndex(0)
    setAnswers([])
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(64px + var(--space-10))', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {phase === 'question' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                {difficulty && <DifficultyBadge level={difficulty} />}
              </div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <ProgressBar value={currentIndex + (answers.length > currentIndex ? 1 : 0)} max={questions.length} showPercent={false} />
              </div>

              <div className="card-glass" style={{ padding: 'var(--space-8)' }}>
                <QuestionCard key={currentQuestion.id} q={currentQuestion} onAnswered={handleAnswered} />

                {answers.length > currentIndex && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
                    <button className="btn-primary" onClick={handleNext}>
                      {currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
                      <ArrowRight size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {phase === 'results' && (
            <ResultsScreen topic={topic} difficulty={difficulty} answers={answers} onRetake={handleRetake} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
