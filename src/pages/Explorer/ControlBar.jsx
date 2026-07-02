import { Play, Pause, RotateCcw, Orbit, Tag, Gauge, Move3d } from 'lucide-react'

const ICON_BTN = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 'var(--radius-btn)',
  transition: 'all var(--transition-fast)',
}

function ToggleBtn({ active, onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        ...ICON_BTN,
        color: active ? 'var(--color-blue)' : 'var(--color-text-muted)',
        background: active ? 'var(--color-blue-10)' : 'transparent',
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

export default function ControlBar({
  playing, onTogglePlay, speed, onSpeedChange, onReset,
  showOrbits, onToggleOrbits, showLabels, onToggleLabels,
  quality, onToggleQuality, freeCam, onToggleFreeCam,
}) {
  return (
    <div
      className="glass"
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        borderRadius: 'var(--radius-panel)',
        display: 'flex',
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
