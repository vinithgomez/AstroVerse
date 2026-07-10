import { distance } from 'fastest-levenshtein'

function normalize(s) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  return 1 - distance(a, b) / maxLen
}

// Case-insensitive, whitespace-trimmed exact match first; if none hits, falls
// back to a normalized Levenshtein similarity score against each candidate so
// small typos ("paralax") still register as correct. Runs synchronously,
// entirely client-side — no network call, no LLM, no loading state, since a
// fill-in-the-blank quiz answer doesn't need one.
export function isFuzzyMatch(userAnswer, acceptableAnswers, threshold = 0.8) {
  const norm = normalize(userAnswer)
  if (acceptableAnswers.some(a => normalize(a) === norm)) return true
  return acceptableAnswers.some(a => similarity(norm, normalize(a)) >= threshold)
}
