import { useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import ExplorerCanvas from './ExplorerCanvas'
import ControlBar from './ControlBar'
import InfoPanel from './InfoPanel'
import { getBody } from '../../data/planets'

// This is the flagship page — default to the highest quality unconditionally
// and only let genuinely low-power hardware auto-downgrade. The previous
// `<= 4` threshold caught most ordinary laptops (4 logical cores is common,
// not "low-end") and silently rendered everyone at half quality. `<= 2` only
// catches the rare truly constrained device; everyone else gets full quality
// by default and can drop to Low manually via the control bar if they want.
const isLowEndDevice =
  typeof navigator !== 'undefined' &&
  navigator.hardwareConcurrency != null &&
  navigator.hardwareConcurrency <= 2

export default function ExplorerPage() {
  const [playing, setPlaying]         = useState(true)
  const [speed, setSpeed]             = useState(1)
  const [showOrbits, setShowOrbits]   = useState(true)
  const [showLabels, setShowLabels]   = useState(true)
  const [qualityLow, setQualityLow]   = useState(isLowEndDevice)
  // Deep-link support: /explorer?focus=<bodyId>, used by Learn's "Explore in
  // 3D" related-planet cards. Read once at mount — this is a one-shot initial
  // selection, not a live sync back to the URL.
  const [searchParams] = useSearchParams()
  const initialFocus = searchParams.get('focus')
  const [selectedId, setSelectedId]   = useState(() => (initialFocus && getBody(initialFocus)) ? initialFocus : null)
  const [resetSignal, setResetSignal] = useState(0)
  const [freeCam, setFreeCam]         = useState(false)

  // Mirrored into refs so play/pause and speed changes never trigger a
  // Scene re-render — Planet.jsx reads these imperatively inside useFrame.
  const playingRef = useRef(playing)
  const speedRef   = useRef(speed)
  playingRef.current = playing
  speedRef.current   = speed

  const lowEnd = isLowEndDevice || qualityLow

  const handleReset = useCallback(() => {
    setSelectedId(null)
    setResetSignal(s => s + 1)
    // Reset Camera must always visibly work — if Free Roam were left on,
    // CameraRig's hard gate would silently swallow the return-to-default
    // animation. Turning it off here guarantees the button always does
    // something, regardless of the toggle's current state.
    setFreeCam(false)
  }, [])

  const selectedBody = selectedId ? getBody(selectedId) : null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Navbar />

      <ExplorerCanvas
        playingRef={playingRef}
        speedRef={speedRef}
        showOrbits={showOrbits}
        showLabels={showLabels}
        lowEnd={lowEnd}
        selectedId={selectedId}
        onSelect={setSelectedId}
        resetSignal={resetSignal}
        freeCam={freeCam}
      />

      <InfoPanel body={selectedBody} onClose={() => setSelectedId(null)} />

      <ControlBar
        playing={playing}
        onTogglePlay={() => setPlaying(p => !p)}
        speed={speed}
        onSpeedChange={setSpeed}
        onReset={handleReset}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits(v => !v)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(v => !v)}
        quality={qualityLow ? 'low' : 'high'}
        onToggleQuality={() => setQualityLow(v => !v)}
        freeCam={freeCam}
        onToggleFreeCam={() => setFreeCam(v => !v)}
      />
    </div>
  )
}
