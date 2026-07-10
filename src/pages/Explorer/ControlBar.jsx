import { useState } from 'react'
import { Play, Pause, RotateCcw, Orbit, Tag, Gauge, Move3d, SlidersHorizontal, X } from 'lucide-react'

const ICON_BTN = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 'var(--radius-btn)',
  transition: 'all var(--transition-fast)',
}

function ToggleBtn({ active, onClick, label, children, style }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        ...ICON_BTN,
        color: active ? 'var(--color-blue)' : 'var(--color-text-muted)',
        background: active ? 'var(--color-blue-10)' : 'transparent',
        ...style,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-primary)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-muted)' }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div aria-hidden style={{ width: 1, height: 22, background: 'var(--color-border)', flexShrink: 0 }} />
}

// ── Mobile: one row of a 2-column drawer, full 44px+ tap target with a
// visible label (icon-only is fine with a mouse hovering for a tooltip, but
// a touch user has no hover state to discover what an icon means). ─────────
function DrawerRow({ icon, label, active, onClick, fullWidth }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        gridColumn: fullWidth ? '1 / -1' : undefined,
        padding: 'var(--space-3)', minHeight: 44,
        borderRadius: 'var(--radius-btn)',
        background: active ? 'var(--color-blue-10)' : 'var(--color-surface)',
        border: `1px solid ${active ? 'var(--color-blue)' : 'var(--color-border)'}`,
        color: active ? 'var(--color-blue)' : 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500,
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ── Mobile: compact always-visible bar (play/pause, speed, expand) plus an
// expandable drawer above it for the rest — the full desktop bar simply
// doesn't fit (and its icon-only buttons are too small/undiscoverable to
// tap reliably) at phone widths. ────────────────────────────────────────
function MobileControlBar({
  playing, onTogglePlay, speed, onSpeedChange, onReset,
  showOrbits, onToggleOrbits, showLabels, onToggleLabels,
  quality, onToggleQuality, freeCam, onToggleFreeCam,
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="md:hidden" style={{ position: 'fixed', bottom: 'var(--space-4)', left: 'var(--space-4)', right: 'var(--space-4)', zIndex: 50 }}>
      {expanded && (
        <div
          className="glass"
          style={{
            borderRadius: 'var(--radius-panel)', padding: 'var(--space-3)', marginBottom: 'var(--space-3)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)',
          }}
        >
          <DrawerRow icon={<RotateCcw size={16} strokeWidth={1.5} />} label="Reset Camera" onClick={onReset} />
          <DrawerRow icon={<Move3d size={16} strokeWidth={1.5} />} label="Free Roam" active={freeCam} onClick={onToggleFreeCam} />
          <DrawerRow icon={<Orbit size={16} strokeWidth={1.5} />} label="Orbit Lines" active={showOrbits} onClick={onToggleOrbits} />
          <DrawerRow icon={<Tag size={16} strokeWidth={1.5} />} label="Labels" active={showLabels} onClick={onToggleLabels} />
          <DrawerRow
            icon={<Gauge size={16} strokeWidth={1.5} />}
            label={`Quality: ${quality === 'high' ? 'High' : 'Low'}`}
            onClick={onToggleQuality}
            fullWidth
          />
        </div>
      )}

      <div
        className="glass"
        style={{
          borderRadius: 'var(--radius-panel)', display: 'flex', alignItems: 'center',
          gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)',
        }}
      >
        <ToggleBtn active={false} onClick={onTogglePlay} label={playing ? 'Pause' : 'Play'} style={{ minWidth: 44, minHeight: 44 }}>
          {playing ? <Pause size={18} strokeWidth={1.5} /> : <Play size={18} strokeWidth={1.5} />}
        </ToggleBtn>

        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={speed}
          onChange={e => onSpeedChange(parseFloat(e.target.value))}
          style={{ flex: 1, minWidth: 0, accentColor: 'var(--color-blue)', minHeight: 44 }}
          aria-label="Simulation speed"
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', minWidth: 30, flexShrink: 0 }}>
          {speed.toFixed(2)}x
        </span>

        <ToggleBtn
          active={expanded}
          onClick={() => setExpanded(v => !v)}
          label={expanded ? 'Fewer controls' : 'More controls'}
          style={{ minWidth: 44, minHeight: 44 }}
        >
          {expanded ? <X size={18} strokeWidth={1.5} /> : <SlidersHorizontal size={18} strokeWidth={1.5} />}
        </ToggleBtn>
      </div>
    </div>
  )
}

// ── Desktop: unchanged full bar, every control always visible. ──────────
function DesktopControlBar({
  playing, onTogglePlay, speed, onSpeedChange, onReset,
  showOrbits, onToggleOrbits, showLabels, onToggleLabels,
  quality, onToggleQuality, freeCam, onToggleFreeCam,
}) {
  return (
    <div
      className="glass hidden md:flex"
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        borderRadius: 'var(--radius-panel)',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        maxWidth: 'calc(100vw - var(--space-8))',
        overflowX: 'auto',
      }}
    >
      <ToggleBtn active={false} onClick={onTogglePlay} label={playing ? 'Pause' : 'Play'}>
        {playing ? <Pause size={17} strokeWidth={1.5} /> : <Play size={17} strokeWidth={1.5} />}
      </ToggleBtn>

      <Divider />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '0 var(--space-2)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', minWidth: 34 }}>
          {speed.toFixed(2)}x
        </span>
        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={speed}
          onChange={e => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: 96, accentColor: 'var(--color-blue)' }}
          aria-label="Simulation speed"
        />
      </div>

      <Divider />

      <ToggleBtn
        active={freeCam}
        onClick={onToggleFreeCam}
        label={freeCam ? 'Free Roam: On (camera never auto-follows)' : 'Free Roam: Off (clicking a body flies the camera to it)'}
      >
        <Move3d size={16} strokeWidth={1.5} />
      </ToggleBtn>

      <ToggleBtn active={false} onClick={onReset} label="Reset Camera">
        <RotateCcw size={16} strokeWidth={1.5} />
      </ToggleBtn>

      <ToggleBtn active={showOrbits} onClick={onToggleOrbits} label="Toggle Orbit Lines">
        <Orbit size={17} strokeWidth={1.5} />
      </ToggleBtn>

      <ToggleBtn active={showLabels} onClick={onToggleLabels} label="Toggle Labels">
        <Tag size={16} strokeWidth={1.5} />
      </ToggleBtn>

      <Divider />

      <button
        onClick={onToggleQuality}
        title="Toggle render quality"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-btn)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--color-text-muted)',
          transition: 'color var(--transition-fast)',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
      >
        <Gauge size={15} strokeWidth={1.5} />
        {quality === 'high' ? 'HIGH' : 'LOW'}
      </button>
    </div>
  )
}

export default function ControlBar(props) {
  return (
    <>
      <MobileControlBar {...props} />
      <DesktopControlBar {...props} />
    </>
  )
}
