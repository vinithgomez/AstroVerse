import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import NotificationBanner from '../../components/NotificationBanner'
import HeroSection from './HeroSection'
import SolarRevealSection from './SolarRevealSection'
import LearnSection from './LearnSection'
import TheoriesSection from './TheoriesSection'
import QuizSection from './QuizSection'
import NewsSection from './NewsSection'
import CTASection from './CTASection'
import { useLenis } from '../../hooks/useLenis'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  useLenis()
  const location = useLocation()
  const [toast, setToast] = useState(() => location.state?.notification
    ? { msg: location.state.notification, variant: location.state.variant ?? 'success' }
    : null
  )

  useEffect(() => {
    if (location.state?.notification) {
      window.history.replaceState({}, '')
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(id)
  }, [])

  return (
    <div style={{ background: 'var(--color-bg)', overflowX: 'hidden' }}>
      <Navbar />

      {/* Success / info toast from auth redirect */}
      {toast && (
        <div style={{ position: 'fixed', top: 'calc(64px + var(--space-3))', left: '50%', transform: 'translateX(-50%)', zIndex: 200, width: 'max-content', maxWidth: 'calc(100vw - var(--space-8))' }}>
          <NotificationBanner variant={toast.variant} autoDismiss={4000}>
            {toast.msg}
          </NotificationBanner>
        </div>
      )}

      <main>
        <HeroSection />
        <SolarRevealSection />

        {/* Section separator */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)', margin: '0 var(--space-6)' }} />

        <LearnSection />

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)', margin: '0 var(--space-6)' }} />

        <TheoriesSection />

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)', margin: '0 var(--space-6)' }} />

        <QuizSection />

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)', margin: '0 var(--space-6)' }} />

        <NewsSection />

        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
