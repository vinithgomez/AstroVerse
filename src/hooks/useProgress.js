import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

const GUEST_KEY = 'astroverse_guest_progress'

function readGuestProgress() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY)) || {}
  } catch {
    return {}
  }
}

function writeGuestProgress(map) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(map))
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — progress
    // simply won't persist across reloads for this guest session.
  }
}

// Centralizes Learn-module progress for both guests (localStorage, session/
// browser-only — no cross-device sync, which guests don't get anyway) and
// logged-in users (Supabase `progress` table). The `progress` table does not
// exist yet (see CLAUDE.md §8, same gap already flagged for `bookmarks`) —
// writes are optimistic and fail silently until it's created.
export function useProgress() {
  const { user } = useAuth()
  const [progressMap, setProgressMap] = useState({}) // { [moduleId]: 'in_progress' | 'complete' }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!user) {
        setProgressMap(readGuestProgress())
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('progress')
          .select('module_id, status')
          .eq('user_id', user.id)
        if (error) throw error
        if (!cancelled && data) {
          const map = {}
          data.forEach(row => { map[row.module_id] = row.status })
          setProgressMap(map)
        }
      } catch {
        // progress table doesn't exist yet — see CLAUDE.md §8. Guest-style
        // in-session state (empty map) is the safe fallback.
        if (!cancelled) setProgressMap({})
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user])

  const setStatus = useCallback(async (moduleId, status) => {
    setProgressMap(prev => {
      // Never downgrade a completed module back to in-progress.
      if (prev[moduleId] === 'complete' && status === 'in_progress') return prev
      const next = { ...prev, [moduleId]: status }
      if (!user) writeGuestProgress(next)
      return next
    })

    if (user) {
      try {
        await supabase.from('progress').upsert({
          user_id: user.id,
          module_id: moduleId,
          status,
          completed_at: status === 'complete' ? new Date().toISOString() : null,
        })
      } catch {
        // Fails silently until the progress table exists — the optimistic
        // update above still reflects intent for the current session.
      }
    }
  }, [user])

  const markInProgress = useCallback((moduleId) => setStatus(moduleId, 'in_progress'), [setStatus])
  const markComplete   = useCallback((moduleId) => setStatus(moduleId, 'complete'),   [setStatus])

  return { progressMap, loading, markInProgress, markComplete, isGuest: !user }
}
