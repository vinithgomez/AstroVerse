import LogoMark from '../../components/LogoMark'

export default function LoadingScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-5)',
        background: 'var(--color-bg)',
      }}
    >
      <div style={{ animation: 'explorerPulse 2.2s ease-in-out infinite' }}>
        <LogoMark size={56} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        >
          Loading the Solar System
        </p>
        <div style={{ width: 160, height: 2, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div
            style={{
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-blue), var(--color-purple))',
              animation: 'explorerBar 1.4s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes explorerPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes explorerBar   { 0% { transform: translateX(-120%); } 100% { transform: translateX(360%); } }
      `}</style>
    </div>
  )
}
