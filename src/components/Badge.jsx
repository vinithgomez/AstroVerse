import { CheckCircle2, FlaskConical, XCircle, MessageCircleQuestion } from 'lucide-react'

const VARIANTS = {
  proven:     { cls: 'badge badge-proven',     Icon: CheckCircle2,          label: 'Proven' },
  hypothesis: { cls: 'badge badge-hypothesis', Icon: FlaskConical,           label: 'Hypothesis' },
  disproven:  { cls: 'badge badge-disproven',  Icon: XCircle,               label: 'Disproven' },
  debated:    { cls: 'badge badge-debated',    Icon: MessageCircleQuestion,  label: 'Debated' },
}

export default function Badge({ variant = 'hypothesis', children }) {
  const { cls, Icon, label } = VARIANTS[variant] ?? VARIANTS.hypothesis
  return (
    <span className={cls}>
      <Icon size={12} strokeWidth={1.5} />
      {children ?? label}
    </span>
  )
}
