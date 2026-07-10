// badges.js — the single source of truth for every badge the app can award.
//
// `quiz_scores`/`badges` writes (useQuizSubmission.js) and the Progress
// Dashboard's badge grid (locked + earned tiles) both need the exact same
// label/description/unlock-hint text per badge id — defined once here so
// they can't drift apart.

import { ALL_MODULES_ORDERED } from './modules'

export function moduleMasterBadgeId(topicId) {
  return `module-master-${topicId}`
}

export const BADGE_CATALOG = [
  {
    id: 'first-steps',
    label: 'First Steps',
    description: 'Completed your first quiz.',
    lockedHint: 'Complete any quiz to earn this.',
  },
  ...ALL_MODULES_ORDERED.map(m => ({
    id: moduleMasterBadgeId(m.id),
    label: 'Module Master',
    topicTitle: m.title,
    description: `Scored 80% or higher on the "${m.title}" quiz.`,
    lockedHint: `Score 80%+ on the ${m.title} quiz to unlock.`,
  })),
]

export function getBadgeMeta(badgeId) {
  return BADGE_CATALOG.find(b => b.id === badgeId) ?? {
    id: badgeId, label: badgeId, description: '', lockedHint: '',
  }
}
