# AstroVerse

**A premium space education web app — explore the universe, one orbit at a time.**

AstroVerse teaches astronomy and space science to students from beginner to advanced level, combining a real-time 3D solar system, structured learning modules, and interactive quizzes in a dark, cinematic interface inspired by "NASA meets Apple." It's built for school students and self-learners alike — content and explanations scale to the learner's level rather than assuming prior knowledge.

Guest Mode is the default experience: the entire app is usable without an account, with a non-blocking prompt to sign up once progress is worth saving.

---

## Features

- **3D Solar System Explorer** — a fully interactive Three.js solar system with real NASA/NSSDC-verified orbital data, physically-informed distance and rotation scaling, click-to-focus camera, a Free Roam mode for unrestricted navigation, and per-planet info panels with live stats
- **Learning Modules** — a visual progression map of astronomy topics with lesson content scaled to the learner's level
- **Quiz System** — five question types (multiple choice, image-based, true/false, ordering, fill-in-blank) with immediate feedback and scoring
- **Theories & Discoveries** — a filterable hub covering cosmological, astrophysics, and planetary science theories, plus a historical discovery timeline
- **Space News** — a live feed aggregating NASA and Space.com articles
- **Progress Dashboard** — cross-device tracking of module completion, quiz scores, badges, and bookmarks
- **Authentication** — Supabase-backed email/password and Google OAuth, with full guest access and a frictionless upgrade path

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS with a custom design token system |
| 3D Engine | Three.js via `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` |
| Scroll Animation | GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Icons | Lucide |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (for auth — the app runs without one, but sign-in/sign-up won't work)

### Setup

```bash
# Clone the repo
git clone https://github.com/vinithgomez/AstroVerse.git
cd AstroVerse

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# then fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings

# Run the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Other scripts

```bash
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

---

## Project Structure

```
src/
├── pages/            Home, Explorer, Auth, and placeholder routes for
│                      Learn/Quiz/Theories/News/Progress
├── components/        Shared UI — Navbar, Footer, badges, tooltips, banners
├── three/              Explorer's Three.js scene — Sun, Planet, CameraRig,
│                       Starfield, OrbitPath, shaders
├── context/            AuthContext (Supabase session state)
├── data/               Static content — planets.js, quizBank.js, theories.js, modules.js
├── lib/                 supabaseClient.js, textureLoader.js
├── hooks/               useLenis (smooth-scroll setup)
├── routes/              React Router route definitions
└── styles/tokens/       Design system tokens (colors, typography, spacing, motion)

public/textures/        Per-planet texture assets (organized by body)
```

---

## Current Build Status

**✅ Complete**
- **Landing page** (`/`) — pinned Three.js Earth hero, scroll-driven solar system reveal, and scroll-triggered content sections
- **Authentication** (`/auth/signup`, `/auth/signin`) — Supabase email/password + Google OAuth, session handling, guest mode
- **Solar System Explorer** (`/explorer`) — the flagship page: all 9 planets + Moon with verified orbital data, click-to-focus camera, Free Roam mode, control bar (play/pause, speed, orbit/label toggles, quality settings), and per-planet info panels
- **Learning Modules** (`/learn`, `/learn/:moduleId`) — 20 modules across Beginner/Intermediate/Advanced tiers with real astronomy content, tier progression map with unlock gating, inline glossary tooltips, "Did You Know" facts, related planet/theory cross-links, and progress tracking (guest via `localStorage`, logged-in via Supabase)
- **Quiz System** (`/quiz`, `/quiz/play`) — 124 questions across all 20 topics and five question types (multiple choice, true/false, fill-in-the-blank, image-based, ordering), topic/difficulty selection with a Random Mix option, immediate per-question feedback with explanations, full results breakdown, and badge/score persistence to Supabase for logged-in users
- **Theories & Discoveries** (`/theories`, `/theories/:theoryId`) — 38 theories (cosmological, astrophysics, planetary science) plus a 27-entry Discoveries Timeline, filterable by category/status/era/difficulty with search, Beginner/Advanced explanation toggle, evidence for/against, related theory/discovery/module cross-links, and bookmarking for logged-in users

**🚧 In progress / not yet built**
- Space News (`/news`)
- Progress Dashboard (`/progress`)
- Password reset flow (`/auth/reset`) — placeholder only

**Known gaps**
- News RSS fetching needs a server-side proxy to work around CORS
- Some planet fact-panel data (moon counts, temperatures), Learning Module content, Quiz question content, and Theories & Discoveries content is drafted from general knowledge and still needs verification against reliable sources

---

## About This Project

AstroVerse is being built collaboratively with [Claude Code](https://claude.com/claude-code), Anthropic's CLI-based coding agent — used throughout for implementation, debugging, and maintaining project context session to session (see `CLAUDE.md` in this repo for the full build log and decision history).
