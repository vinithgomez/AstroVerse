import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { getBadgeMeta, moduleMasterBadgeId } from '../data/badges'

// Simple, fixed badge thresholds — writes to Supabase `badges` table for
// logged-in users. `isFirstQuizEver` must be determined by the caller
// (checked against quiz_scores before this quiz's own score is inserted).
// Label/description text lives in data/badges.js (BADGE_CATALOG), shared
// with the Progress Dashboard's badge grid so the two can't drift apart.
export function computeEarnedBadges({ topic, percentage, isFirstQuizEver }) {
  const badges = []
  if (isFirstQuizEver) {
    const meta = getBadgeMeta('first-steps')
    badges.push({ badge_id: meta.id, label: meta.label, description: meta.description })
  }
  if (percentage >= 80 && topic !== 'random-mix') {
    const meta = getBadgeMeta(moduleMasterBadgeId(topic))
    badges.push({ badge_id: meta.id, label: meta.label, description: meta.description })
  }
  return badges
}

// Writes a completed quiz's score and any earned badges to Supabase for
// logged-in users (quiz_scores: id, user_id, topic, difficulty, score,
// total, taken_at; badges: id, user_id, badge_id, earned_at,
// unique(user_id, badge_id) — both tables live with RLS, see CLAUDE.md §6).
// Guests get their score/badges shown locally but nothing is written.
export function useQuizSubmission() {
  const { user } = useAuth()

  const submitQuizResult = useCallback(async ({ topic, difficulty, score, total }) => {
    if (!user) {
      const percentage = Math.round((score / total) * 100)
      return { saved: false, badges: computeEarnedBadges({ topic, percentage, isFirstQuizEver: false }) }
    }

    const { count, error: countError } = await supabase
      .from('quiz_scores')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if (countError) console.error('[useQuizSubmission] failed to check prior quiz history:', countError)
    const isFirstQuizEver = !countError && (count ?? 0) === 0

    const percentage = Math.round((score / total) * 100)
    const badges = computeEarnedBadges({ topic, percentage, isFirstQuizEver })

    const { error: scoreError } = await supabase.from('quiz_scores').insert({
      user_id: user.id,
      topic,
      difficulty,
      score,
      total,
      taken_at: new Date().toISOString(),
    })
    if (scoreError) console.error('[useQuizSubmission] failed to write quiz score to Supabase:', scoreError)

    for (const badge of badges) {
      const { error: badgeError } = await supabase.from('badges').upsert(
        { user_id: user.id, badge_id: badge.badge_id, earned_at: new Date().toISOString() },
        { onConflict: 'user_id,badge_id' },
      )
      if (badgeError) console.error(`[useQuizSubmission] failed to write badge "${badge.badge_id}" to Supabase:`, badgeError)
    }

    return { saved: !scoreError, badges }
  }, [user])

  return { submitQuizResult, isGuest: !user }
}
