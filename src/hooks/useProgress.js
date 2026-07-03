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
// logged-in users (Supabase `progress` table: id, user_id, module_id,
// completed boolean, completed_at, created_at, unique(user_id, module_id),
// RLS restricted to auth.uid() = user_id — see CLAUDE.md §6). The table now
// exists, so a write/read failure here is a real bug, not expected
// degradation — errors are logged loudly rather than swallowed.
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
      const { data, error } = await supabase
        .from('progress')
        .select('module_id, completed')
        .eq('user_id', user.id)

      if (error) {
        console.error('[useProgress] failed to load progress from Supabase:', error)
      } else if (!cancelled && data) {
        const map = {}
        data.forEach(row => { map[row.module_id] = row.completed ? 'complete' : 'in_progress' })
        setProgressMap(map)
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user])

  const setStatus = useCallback(async (moduleId, status) => {
    // Never downgrade a completed module back to in-progress — checked
    // against current state before writing anywhere, local or remote.
    if (progressMap[moduleId] === 'complete' && status === 'in_progress') return

    setProgressMap(prev => {
      const next = { ...prev, [moduleId]: status }
      if (!user) writeGuestProgress(next)
      return next
    })

    if (user) {
      const { error } = await supabase.from('progress').upsert(
        {
          user_id: user.id,
          module_id: moduleId,
          completed: status === 'complete',
          completed_at: status === 'complete' ? new Date().toISOString() : null,
        },
        { onConflict: 'user_id,module_id' },
      )
      if (error) console.error('[useProgress] failed to write progress to Supabase:', error)
    }
  }, [user, progressMap])

  const markInProgress = useCallback((moduleId) => setStatus(moduleId, 'in_progress'), [setStatus])
  const markComplete   = useCallback((moduleId) => setStatus(moduleId, 'complete'),   [setStatus])

  return { progressMap, loading, markInProgress, markComplete, isGuest: !user }
}
