import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import DesignSystem from '../pages/Dev/DesignSystem'
import Home from '../pages/Home'
import ModuleList from '../pages/Learn/ModuleList'
import ModuleDetail from '../pages/Learn/ModuleDetail'
import QuizStart from '../pages/Quiz/QuizStart'
import QuizPlay from '../pages/Quiz/QuizPlay'
import TheoriesHub from '../pages/Theories/TheoriesHub'
import TheoryDetail from '../pages/Theories/TheoryDetail'
import SignUpPage from '../pages/Auth/SignUpPage'
import SignInPage from '../pages/Auth/SignInPage'

// Three.js is a large dependency — don't load it until the user actually
// navigates to /explorer (mirrors the Home hero's EarthCanvas code-split).
const ExplorerPage = lazy(() => import('../pages/Explorer'))

// Placeholder — real pages added as they're built
function Placeholder({ name }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{name} — coming soon</p>
    </div>
  )
}

export const router = createBrowserRouter([
  { path: '/',             element: <Home /> },
  { path: '/learn',            element: <ModuleList /> },
  { path: '/learn/:moduleId',  element: <ModuleDetail /> },
  {
    path: '/explorer',
    element: (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--color-bg)' }} />}>
        <ExplorerPage />
      </Suspense>
    ),
  },
  { path: '/quiz',         element: <QuizStart /> },
  { path: '/quiz/play',    element: <QuizPlay /> },
  { path: '/theories',          element: <TheoriesHub /> },
  { path: '/theories/:theoryId', element: <TheoryDetail /> },
  { path: '/news',         element: <Placeholder name="News" /> },
  { path: '/progress',     element: <Placeholder name="Progress" /> },
  { path: '/auth/signup',  element: <SignUpPage /> },
  { path: '/auth/signin',  element: <SignInPage /> },
  { path: '/auth/reset',   element: <Placeholder name="Reset Password" /> },

  // Design system preview
  { path: '/dev/design-system', element: <DesignSystem /> },
])
