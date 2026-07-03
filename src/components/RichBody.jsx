import GlossaryTooltip from './GlossaryTooltip'

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Wraps the FIRST occurrence of each glossary term found in `text` in an
// inline hoverable GlossaryTooltip. `usedTerms` is a Set shared across every
// section of the same module (see ModuleDetail) so a term already tooltipped
// once earlier in the lesson doesn't get wrapped again on every repeat.
function renderWithGlossary(text, glossaryTerms, usedTerms) {
  if (!glossaryTerms?.length) return text

  // Longest term first, so a multi-word term (e.g. "Near-Earth Object") is
  // matched whole rather than pre-empted by a shorter substring.
  const sorted = [...glossaryTerms].sort((a, b) => b.term.length - a.term.length)
  const pattern = sorted.map(g => escapeRegex(g.term)).join('|')
  if (!pattern) return text

  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) => {
    const match = sorted.find(g => g.term.toLowerCase() === part.toLowerCase())
    if (match && !usedTerms.has(match.term)) {
      usedTerms.add(match.term)
      return (
        <GlossaryTooltip key={i} term={match.term} definition={match.definition}>
          {part}
        </GlossaryTooltip>
      )
    }
    return part
  })
}

// Deliberately a plain function, NOT a React component rendered as
// `<RichBody />`. If this were its own component, React 18 StrictMode's
// dev-mode double-invoke would call it twice per section with the SAME
// `usedTerms` Set reference (since it's passed down as an unchanged prop
// object) — the first (discarded) invocation would mark every term "used",
// so the second (actually committed) invocation would find them all already
// used and wrap nothing. Calling this as a plain function directly inside
// ModuleDetail's own render body keeps the whole first-occurrence pass
// within ONE render call, so it isn't cross-contaminated by that pattern —
// see ModuleDetail's `usedTerms` comment for the other half of this fix.
export default function renderBody(text, glossaryTerms, usedTerms) {
  const paragraphs = text.split('\n\n')
  return paragraphs.map((para, i) => (
    <p
      key={i}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-base)',
        color: 'var(--color-text-muted)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-4)',
      }}
    >
      {renderWithGlossary(para, glossaryTerms, usedTerms)}
    </p>
  ))
}
