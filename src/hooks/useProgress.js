import { useState, useEffect, useCallback, useRef } from 'react'
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
  // Per-module write queue — the automatic "mark in-progress on mount" write
  // and an explicit "mark complete" click can fire only milliseconds apart;
  // without ordering, two concurrent upserts to the same row race and
  // whichever REQUEST happens to reach the DB last wins, regardless of which
  // was issued first (so a fast completion could get silently clobbered back
  // to in-progress). Chaining onto a per-moduleId promise serializes writes
  // in call order instead of network-arrival order.
  const writeQueueRef = useRef({})
  // Synchronous mirror of progressMap, used for two related races:
  //
  // 1. "Never downgrade" guard — React state updates (setProgressMap)
  //    aren't necessarily applied/re-rendered before the next setStatus call
  //    fires. The mount effect's markInProgress and a near-simultaneous
  //    manual markComplete click can both be *called* before either's
  //    setProgressMap update has been reflected back through the
  //    `progressMap` closure, so checking `progressMap[moduleId]` (a value
  //    from render time) can miss a status change that technically already
  //    happened moments earlier.
  //
  // 2. Stale-load-overwrite guard — the initial Supabase fetch below is
  //    already in flight by the time a user can click anything, and it can
  //    resolve *after* a manual markComplete call. Without tracking which
  //    modules were touched locally since the fetch started, the fetch's
  //    own setProgressMap(map) — reflecting the DB as it was BEFORE the
  //    click — would silently clobber the just-made optimistic update once
  //    it resolves (see touchedSinceLoadRef below).
  //
  // Written synchronously the instant setStatus runs, independent of
  // React's render/commit timing, so both guards always see the true latest
  // status regardless of which caller happens to run first.
  const statusRef = useRef({})
  const touchedSinceLoadRef = useRef(new Set())

  useEffect(() => {
    let cancelled = false
    touchedSinceLoadRef.current = new Set()

    async function load() {
      if (!user) {
        const map = readGuestProgress()
        statusRef.current = map
        setProgressMap(map)
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
        // Any module touched locally after this fetch started is more
        // current than what the fetch itself returned — keep the local
        // value for those, use the fetched value for everything else.
        for (const id of touchedSinceLoadRef.current) {
          if (statusRef.current[id] !== undefined) map[id] = statusRef.current[id]
        }
        statusRef.current = map
        setProgressMap(map)
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user])

  const setStatus = useCallback(async (moduleId, status) => {
    // Never downgrade a completed module back to in-progress — checked
    // against the synchronous ref (see comment above), not the possibly-
    // stale `progressMap` closure.
    if (statusRef.current[moduleId] === 'complete' && status === 'in_progress') return
    statusRef.current = { ...statusRef.current, [moduleId]: status }
    touchedSinceLoadRef.current.add(moduleId)

    setProgressMap(prev => {
      const next = { ...prev, [moduleId]: status }
      if (!user) writeGuestProgress(next)
      return next
    })

    if (user) {
      const prior = writeQueueRef.current[moduleId] ?? Promise.resolve()
      const thisWrite = prior.then(() => supabase.from('progress').upsert(
        {
          user_id: user.id,
          module_id: moduleId,
          completed: status === 'complete',
          completed_at: status === 'complete' ? new Date().toISOString() : null,
        },
        { onConflict: 'user_id,module_id' },
      ))
      writeQueueRef.current[moduleId] = thisWrite.then(() => {}, () => {})
      const { error } = await thisWrite
      if (error) console.error('[useProgress] failed to write progress to Supabase:', error)
    }
  }, [user])

  const markInProgress = useCallback((moduleId) => setStatus(moduleId, 'in_progress'), [setStatus])
  const markComplete   = useCallback((moduleId) => setStatus(moduleId, 'complete'),   [setStatus])

  return { progressMap, loading, markInProgress, markComplete, isGuest: !user }
}
