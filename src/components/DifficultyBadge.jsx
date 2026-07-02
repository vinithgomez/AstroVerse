const VARIANTS = {
  beginner:     { cls: 'badge diff-beginner',     label: 'Beginner' },
  intermediate: { cls: 'badge diff-intermediate', label: 'Intermediate' },
  advanced:     { cls: 'badge diff-advanced',     label: 'Advanced' },
}

export default function DifficultyBadge({ level = 'beginner', children }) {
  const { cls, label } = VARIANTS[level] ?? VARIANTS.beginner
  return <span className={cls}>{children ?? label}</span>
}
