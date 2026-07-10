// Mobile-only bottom sheet: scrim + a panel sliding up from the bottom edge,
// rounded top corners, tap-outside-to-close. Hidden entirely at md+ (desktop
// callers render their own side panel/inline UI instead) — this is a mobile
// interaction pattern, not a smaller version of a desktop one.
export default function BottomSheet({ open, onClose, children, maxHeight = '80vh', zIndex = 90 }) {
  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className="md:hidden"
        style={{
          position: 'fixed', inset: 0, zIndex: zIndex - 1,
          background: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--transition-slow)',
        }}
      />
      <div
        className="glass md:hidden"
        aria-hidden={!open}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          maxHeight, overflowY: 'auto',
          borderRadius: 'var(--radius-panel) var(--radius-panel) 0 0',
          padding: 'var(--space-5) var(--space-6) var(--space-8)',
          zIndex,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--transition-slow)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div aria-hidden style={{ width: 40, height: 4, borderRadius: 'var(--radius-full)', background: 'var(--color-border)', margin: '0 auto var(--space-4)' }} />
        {children}
      </div>
    </>
  )
}
