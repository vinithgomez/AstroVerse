# AstroVerse — Project Memory

> This file is the persistent memory for this project. Claude Code must read this file at the start of every session before doing anything else. Claude Code must also UPDATE this file whenever a meaningful decision is made, a feature is completed, a bug is fixed in a non-obvious way, or scope changes — so future sessions stay in sync without the user having to re-explain context.

---

## 1. Project Overview

**Name:** AstroVerse
**What it is:** A premium space education web app teaching astronomy to students from beginner to advanced level.
**Primary users:** Students studying astronomy/space (school + self-learners).
**Design feel:** "NASA meets Apple" — dark, cinematic, premium, immersive, but clean and readable. Not childish, not generic SaaS.

---

## 2. Tech Stack

```
Frontend:       React + Vite
Styling:        Tailwind CSS using AstroVerse design tokens
3D Engine:      Three.js via @react-three/fiber + @react-three/drei + @react-three/postprocessing
Scroll Anim:    GSAP + ScrollTrigger
Smooth Scroll:  Lenis (@studio-freight/lenis), synced with GSAP ScrollTrigger scrollerProxy
Auth:           Supabase Auth (Email/Password + Google OAuth)
Database:       Supabase PostgreSQL
Content data:   Static JS files (planets.js, quizBank.js, theories.js, modules.js)
News:           NASA RSS + Space.com RSS, fetched server-side (CORS workaround needed)
Deploy:         Vercel
```

---

## 3. Design System

```
Background:      #0a0a0f
Surface:         #0f1117
Border:          #1e2130
Primary accent:  #4f8ef7  (electric blue)
Secondary:       #8b5cf6  (nebula purple)
Success:         #22c55e  (Proven badge)
Warning:         #eab308  (Hypothesis badge)
Danger:          #ef4444  (Disproven badge)
Debate:          #f97316  (Debated badge)
Text primary:    #f0f4ff
Text muted:      #8892a4

Fonts: Space Grotesk (headings) / Inter (body) / JetBrains Mono (data, stats, orbital numbers)
Radius: 8px buttons, 12px cards, 16px large panels
Motion: 300ms ease-in-out, nothing snaps — everything glides
Components: glass cards (frosted, subtle border), glow-on-hover, status badges, difficulty badges
```

Design tokens should live in `/src/styles/tokens/` (colors.css, typography.css, spacing.css, motion.css, etc.) — define these as the first build step and import them everywhere; do not redefine values inline elsewhere.

Icon library: Lucide Icons, outlined style, 1.5px stroke.

---

## 4. Folder Structure

```
src/
├── pages/
│   ├── Home/
│   ├── Learn/{ModuleList, ModuleDetail}/
│   ├── Explorer/
│   ├── Quiz/{QuizStart, QuizQuestion, QuizResult}/
│   ├── Theories/{TheoriesHub, TheoryDetail, DiscoveryTimeline}/
│   ├── News/
│   ├── Progress/
│   └── Auth/
├── components/         (Navbar, Footer, PlanetCard, QuizCard, TheoryCard, NewsCard,
│                         ProgressBar, Badge, DifficultyBadge, GlossaryTooltip,
│                         DidYouKnowChip, LevelSelector, NotificationBanner)
├── three/
│   ├── Scene.jsx, Planet.jsx, Sun.jsx, OrbitPath.jsx, Starfield.jsx
│   └── shaders/atmosphere.glsl
├── data/                (planets.js, quizBank.js, theories.js, modules.js)
├── lib/                 (supabaseClient.js)
└── public/textures/      (organized per-planet folders, see Section 7)
```

---

## 5. Page-by-Page Behavior

**Home (Landing):** GSAP ScrollTrigger + Lenis smooth scroll. Pinned hero section with a REAL textured/lit Three.js Earth (not a CSS shape) that drifts/recedes on scroll. Text splits and slides apart on scroll. Section 2 is a pinned Solar System reveal — simplified planet spheres flying in one by one. Remaining sections (Learning Path, Theories Teaser, Quiz Teaser, News Teaser, Final CTA) use standard scroll-triggered entrance animations, not pinned.

**Learn:** `ModuleList` = visual progression map of topics, lock/complete state from Supabase. `ModuleDetail` = lesson text scaled to user's level, glossary tooltips, "Did You Know" chips, ends with Quiz CTA. Writes to `progress` table on completion.

**Explorer:** Full Three.js solar system. Sun = PointLight source. 9 planets + Moon, real textures, square-root-AU scaled distances, orbit speed = 1 Earth year : 20 seconds. Axial tilts per planet (Venus/Uranus reversed/sideways). OrbitControls free camera, starting position 30–45° above ecliptic. Click planet → camera lerps to focus + side info panel (stats from `planets.js`) + Learn More / Quiz Me buttons. Fresnel atmosphere shader on Earth, Venus, Mars, Jupiter, Neptune. Saturn rings = flat ring geometry + alpha PNG. Control bar: play/pause, speed slider, reset camera, toggle orbit lines/labels, quality toggle (Low/High).

**Quiz:** `QuizStart` (topic + difficulty) → `QuizQuestion` (5 types: multiple choice, image-based, true/false, ordering, fill-in-blank — randomized from `quizBank.js`, immediate feedback + explanation) → `QuizResult` (score, badge, writes to `quiz_scores` + `badges` tables; guests get a "sign up to save" prompt instead of silent loss).

**Theories:** `TheoriesHub` = filterable/searchable grid from static `theories.js` (Cosmological / Astrophysics / Planetary Science theories + historical Discoveries timeline). Filters: category, status, era, difficulty. `TheoryDetail` = Beginner/Advanced toggle explanation, proposer + date, evidence for/against, status badge, related links. `DiscoveryTimeline` = chronological visual timeline.

**News:** Fetches NASA + Space.com RSS via a server-side route (client-side fetch will fail on CORS — needs a Vercel serverless function or RSS-to-JSON proxy). Card grid, category filters, "Breaking" badge for <24h old posts.

**Progress:** Dashboard from Supabase — module completion map, quiz score history, badges, bookmarks, "Resume" button, level preference toggle.

**Auth:** Guest Mode is default — full app access without login. First quiz/module completion triggers a non-blocking "create free account to save your progress" prompt. Supabase email/password + Google OAuth.

---

## 6. Key Decisions Log

> Append new entries here as decisions are made. Do not delete old entries — this is a running log.

- **Storage:** Supabase (PostgreSQL + Auth) — NOT localStorage. Decided because students need cross-device progress sync. Guest Mode → Account Upgrade pattern used to reduce signup friction.
- **Orbit distance scaling:** Square root of real AU distances (not linear, not logarithmic).
- **Orbit speed:** 1 Earth year = 20 seconds (all other planets scale proportionally from this).
- **Starting camera angle (Explorer):** 30–45° above the ecliptic plane, cinematic tilt.
- **Theories/Discoveries data:** Static `theories.js` file (Option A — manual updates), not a CMS. May revisit CMS (Sanity/Contentful) later if content volume grows.
- **Pluto:** Included in the Explorer despite dwarf-planet status — treated as a teaching moment about planetary reclassification. Texture sourced from Planet Pixel Emporium (equirectangular), not NASA photo (which is angle-shot, not a usable texture map).
- **Landing page motion approach:** "GSAP ScrollTrigger pinned sections + Lenis smooth scroll" inspired by jeskojets.com. Hero planet (Earth) must be a REAL lit/textured Three.js render, not a CSS circle — all other reveal planets in Section 2 can be simplified low-poly for performance.
- **Design workflow:** All UI/UX design happens directly in Claude Code, not in a separate design tool. The Design System (Section 3) is the single source of truth for colors/typography/components and should be implemented as code-based tokens at the start of the build.
- **Lenis package rename:** `@studio-freight/lenis` has been deprecated and renamed to `lenis`. The project uses `lenis` (v1.3.x) going forward. All references to `@studio-freight/lenis` in CLAUDE.md and imports should be treated as `lenis`.
- **CSS import order:** All `@import` statements in `styles.css` must precede `@tailwind` directives — this is a PostCSS hard requirement. Base resets and token files are imported first, then Tailwind directives, then `@layer components` blocks inline.
- **Design system preview route:** `/dev/design-system` — renders all components (buttons, badges, cards, progress bar, tooltip, etc.) for visual QA. Not behind auth.
- **Project scaffolded manually:** Vite's interactive `create-vite` CLI couldn't accept piped stdin in this shell, so all project files (package.json, vite.config.js, index.html, etc.) were created by hand. This is equivalent in output to `npm create vite@latest --template react`.
- **Advanced difficulty badge color:** Changed from yellow (`--color-warning`) to solid filled purple (`--color-purple` / `#8b5cf6`, white text, no border). Reason: yellow clashed with the "Hypothesis" status badge — both would appear yellow on the Theories page, creating ambiguity. Intermediate difficulty keeps the light-tint purple style (purple-10 bg, purple text, purple border) so the two purple tiers are visually distinct: Intermediate = tinted/outlined, Advanced = solid/filled.
- **Landing page complete (Prompt 2).** Home page built at `/`. Hero (pinned, R3F Earth + Fresnel atmosphere + scroll-driven text split), Solar Reveal (pinned, CSS planet spheres flying in), Learn / Theories / Quiz / News / CTA sections (scroll-triggered fade-in). Lenis + GSAP ScrollTrigger wired in `useLenis` hook.
- **Earth texture choice (landing page):** Using `8k_earth_daymap.jpg` on the hero, NOT `earth_color_21k.jpg`. Reason: 21k texture causes GPU memory issues on most devices for a landing page use. The 21k file is reserved for potential future high-res mode. Normal/specular TIF maps are also unusable on web (Three.js doesn't support TIF) — flagged in Section 8.
- **Solar System Reveal (Section 2) implementation:** Used CSS spheres with radial gradients instead of a second R3F Canvas. Reason: Nine separate R3F canvases would be a performance disaster; a shared canvas for the reveal would add significant complexity. CSS radial gradients accurately simulate spherical 3D lighting for a teaser strip.
- **Vite chunk splitting:** Three.js vendor chunk isolated to `three-vendor` (~972KB gzipped 269KB). EarthCanvas code-split via `React.lazy()` so Three.js only loads on hero paint. `chunkSizeWarningLimit` raised to 1100 (Three.js is inherently large, no further splitting possible).
- **Low-end device fallback:** `navigator.hardwareConcurrency <= 4` detected at module scope in `HeroSection.jsx`. On low-end: atmosphere shader skipped, clouds layer skipped, star count halved (800 vs 2000), geometry segments halved, antialiasing off, DPR capped at 1.
- **Section 2 planet rendering — canvas-based, not `<img>` (performance fix):** Replaced `<img loading="lazy">` elements with `<canvas>` elements. Root causes of the stutter: (1) `loading="lazy"` fires based on layout position, not GSAP transform position — all 9 images started downloading/decoding on the main thread simultaneously as the animation began; (2) 8K textures were used for 13–78 px display spheres, causing enormous redundant decode work; (3) no `willChange` so browser didn't pre-promote animated elements to compositor layers. Fix: each planet is a `<canvas>` painted with a solid fallback color immediately, then with a fetch+`createImageBitmap`-resized texture (max 256 px, decoded off main thread) once an `IntersectionObserver` fires 600 px before the section enters view. Canvas painting is a direct DOM write — no React state updates during loading or animation. `willChange: 'transform, opacity'` added to all GSAP-animated elements. `StarDots` random values moved to module-level constant (never re-computed on render).
- **Section 2 Sun glow fix:** Reduced Sun's `glow` opacity from `rgba(253,184,19,0.55)` → `rgba(253,184,19,0.28)`. Root cause: yellow at 55% opacity on a near-black bg produced a visible halo even with moderate box-shadow blur values (10px/22px). Other planets use 0.2–0.3 opacity; Sun now matches. A `SunCorona` component was attempted and then deleted — it introduced a new rectangular artifact because CSS `transparent` in radial-gradients interpolates through black (`rgba(0,0,0,0)`), creating a visible edge on dark backgrounds.
- **LogoMark shared component:** Created `src/components/LogoMark.jsx` — a custom solar system SVG mark (three orbit rings, Sun at centre, Earth/Saturn/three outer planets). Replaces the Lucide `Telescope` icon in Navbar, CTASection, and Footer. Single source of truth: all three locations import `<LogoMark size={N} />`. `viewBox="0 0 22 22"`, planet positions computed as `x = 11 + R·sin(θ)`, `y = 11 − R·cos(θ)`.
- **Favicon updated:** `/public/favicon.svg` uses the same LogoMark geometry with an added `<circle cx="11" cy="11" r="11" fill="#0f1117"/>` background so the mark reads on bright browser tab bars. Uses SVG attribute syntax (hyphenated, not camelCase) since it is a static SVG file, not JSX.
- **Navbar/hero visual separation:** `.glass` class in `src/styles/tokens/base.css` updated — background changed from `var(--glass-bg)` (`rgba(15,17,23,0.7)`) to `rgba(10,10,15,0.75)`, backdrop-filter increased from `blur(12px)` to `blur(16px)`. Navbar inline `borderBottom` changed from `1px solid var(--glass-border)` (near-invisible white at 6% opacity) to `1px solid rgba(30,33,48,0.8)` (dark separator, matches `--color-border` at 80%). Hero text overlay (`HeroSection.jsx`) given `paddingTop: var(--space-16)` (64px), shifting the `justifyContent: center` reference point so the heading visually centers in the below-navbar area rather than the raw full-viewport height.
- **Auth system complete (Prompt 6).** `src/context/AuthContext.jsx` — global Supabase session listener via `getSession()` + `onAuthStateChange()`, exposes `{ user, loading, signOut }`. `src/pages/Auth/SignUpPage.jsx` — display name + email + password (show/hide) + confirm password form, Google OAuth, email-confirmation waiting state, client-side validation, mapped API errors. `src/pages/Auth/SignInPage.jsx` — email + password (show/hide) form, Google OAuth, "Forgot password?" link to `/auth/reset`, mapped API errors. `AuthProvider` wraps `RouterProvider` in `main.jsx`. Routes updated: `/auth/login` removed, `/auth/signin` + `/auth/signup` (real pages) + `/auth/reset` (placeholder) added. Navbar updated to use `useAuth()` — shows display name (truncated 16 chars) + "Sign Out" when logged in, "Sign In" + "Get Started" when logged out; flash prevented with `loading` guard. HeroSection "Begin Your Journey" button now routes to `/auth/signup`. Home page shows a fixed-position toast notification read from `location.state` after auth redirect, clears state via `window.history.replaceState`.
- **Toast auto-dismiss:** `NotificationBanner` gained an `autoDismiss` prop (milliseconds). When set, a timer fires `startFade` after the delay — sets `opacity: 0` via a `300ms ease-out` CSS transition, then unmounts after the transition completes. The × button uses the same `startFade` path (manual close also fades). Home page passes `autoDismiss={4000}` so both auth-redirect toasts (sign-in and sign-up) dismiss automatically after 4 seconds.
- **✅ Orbital data VERIFIED.** All 10 bodies (Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) in `orbital-data.txt` cross-checked by the user against NASA/NSSDC. One correction applied: Mercury's axial tilt 0.034° → 2° (NASA's orbital-plane-relative figure — the more meaningful value for a general audience; 0.034° used a stricter IAU reference frame not reflected in NASA's public sources). All other values matched exactly or within accepted rounding tolerance. `planets.js` can use this data with NO unverified warning comment.
- **Note on source discrepancy (do not "fix" this again):** A second pass against science.nasa.gov/facts (a looser, general-audience source) found orbital-period gaps for Uranus (30,589 vs 30,687 days, ~0.3%) and Neptune (59,800 vs 60,190 days, ~0.65%). Not an error — `orbital-data.txt` is anchored to the NSSDC Planetary Fact Sheet, the canonical precise source astronomers cite; science.nasa.gov rounds its public years→days conversion more loosely. Keep the current NSSDC-based values; do not overwrite with science.nasa.gov's rounder figures. Pluto's axial tilt (122.5° vs a "57°" figure seen elsewhere) is the same retrograde-convention difference already noted for Venus — 180° − 122.5° ≈ 57.5°, both describe the same real tilt, not an error.
- **Explorer page built at `/explorer` (flagship page).** Full Three.js solar system: `src/data/planets.js` (verified orbital data + scaling), `src/three/{Scene,Sun,Planet,OrbitPath,PlanetLabel,CameraRig,Starfield,shaders/fresnel.js}`, `src/pages/Explorer/{index,ExplorerCanvas,ControlBar,InfoPanel,LoadingScreen}.jsx`. Lazy-loaded via `React.lazy()` in `routes/index.jsx`, same code-split pattern as the landing-page hero.
- **Explorer scene scale constants (`src/data/planets.js`):** distance = √(AU) × 10 scene units (per existing §6 decision); radius = ∛(radiusKm / Earth radiusKm) × 0.55 scene units — cube-root chosen because real linear radius ratios (Sun ≈109× Earth) would force either an invisible Mercury or an off-screen Sun at any scale that also fits Mercury's orbit; cube-root compresses the range while preserving correct ordering (gas giant > terrestrial > Sun-adjacent tiny bodies). Moon's orbit radius around Earth is a fixed 2.4× Earth's own visual radius, NOT on the same √AU scale — true-to-scale the Moon would render inside Earth's sphere at this zoom.
- **Explorer time scale is TWO independent clocks, not one:** orbits use the existing "1 year = 20s" rule applied uniformly (including the Moon's real 27.3-day orbit around Earth, so all revolution motion shares one clock). Rotation (axial spin) is deliberately decoupled — at 20s/year, Earth's real day:year ratio would spin it ~18×/second, an invisible strobe. Rotation instead maps "1 Earth day = 8s," scaled proportionally per body from its own real rotation period, preserving correct relative order (Jupiter fastest, Mercury/Venus barely move) while staying legible.
- **Retrograde rotation is encoded through axial tilt alone, not a negative spin rate.** NASA's fact sheet lists both a >90° obliquity AND a negative rotation period for the same three bodies (Venus, Uranus, Pluto) — these are two redundant descriptions of one physical fact, not two to compose. The renderer always spins a body positively (right-hand rule) around its tilted local axis; when tilt exceeds 90° that positive local spin reads as retrograde to an outside observer, matching reality. Applying the negative sign on top would double-flip these three bodies into looking prograde. See the long comment above `rotationAngularSpeed` in `planets.js`.
- **Bloom is luminance-threshold, not object-selection `SelectiveBloom`.** `@react-three/postprocessing`'s `Bloom` with `luminanceThreshold={0.85}` + the Sun's `meshBasicMaterial` using `toneMapped={false}` achieves "Sun-only glow" just as reliably as the ref-based `SelectiveBloom` API, with far less wiring. No lit planet surface crosses the threshold, only the Sun's raw unclamped brightness does.
- **`PlanetLabel` uses drei `Html` with `distanceFactor={60}`, tuned empirically.** The first pass used `distanceFactor={12}` (copied from an unrelated reference scale) which made labels illegibly tiny (~2px) at the default wide overview camera position (~78–90 units out) while looking fine up close — confirmed visually via a Playwright screenshot pass. 60 balances legibility across the scene's actual distance range; the existing radius-based fade (`hideBelow`/`fadeRange` in `PlanetLabel.jsx`) already handles hiding labels when the camera is very close to that specific body, so the wide-view legibility and close-up fade don't fight each other.
- **Texture loader promoted to `src/lib/textureLoader.js`.** Was `src/pages/Home/useHeroTexture.js` (hero-only despite being fully generic — fetch → `createImageBitmap` resize → Suspense-compatible cache). Renamed hook `useHeroTexture` → `useTexture` and moved to `lib/` so the Explorer's 10 simultaneously-loading bodies could reuse the exact same dedup/resize/cache logic instead of duplicating it. `EarthScene.jsx` updated to the new import; the old file was deleted (no back-compat shim — nothing else referenced it).
- **Explorer's Earth texture uses `8k_earth_daymap.jpg`, not `earth_color_21k.jpg`.** Same call already made for the landing-page hero (§6, "Earth texture choice"), but doubly important here since Explorer loads all 10 bodies' textures simultaneously behind one Suspense boundary — the 21k file alone (28 MB) was enough to make first load visibly stall in local testing.
- **Explorer quality defaults to HIGH unconditionally (user-requested — this is the flagship page).** The auto-downgrade threshold in `ExplorerPage` (`navigator.hardwareConcurrency`) was `<= 4`, which caught most ordinary laptops (4 logical cores is common, not low-end) and silently rendered everyone at half quality — visible as dull planets and a soft/blurry Sun (DPR capped at 1, no antialiasing, halved geometry segments). Changed to `<= 2` so only genuinely constrained hardware auto-downgrades; texture ceiling raised to 8192px (was 4096) since most source files are already ≤8K and `fetchAndResize` never upscales past the source's native size anyway. Materials tuned too: planet `roughness` 0.9→0.75 + `metalness` 0→0.06, Sun `pointLight` intensity 4.5→6, `ambientLight` 0.08→0.12, anisotropic filtering added to all planet + Sun textures. Bloom `radius` reduced 0.6→0.3 and corona shell tightened (scale 1.18→1.12) — the visual "blur" complaint was mostly the low-quality default (DPR=1), not the bloom/corona itself, but both were tightened for crispness regardless.
- **Camera-reset bug root cause: `<PerspectiveCamera position={...}>` was handed a fresh array every render.** `ExplorerCanvas.jsx` called `DEFAULT_POSITION.toArray()` directly inline in JSX — a new array reference every time `ExplorerCanvas` re-rendered (e.g. from toggling ANY control-bar button), which caused drei's `<PerspectiveCamera>` to re-apply its `position` prop and silently snap the camera back to the default view on almost any interaction. Fixed by computing `DEFAULT_POSITION_ARR` once at module scope and reusing that same reference every render. This was the "no matter what I do it just goes back to zoom out" bug.
- **Free Roam toggle added (`freeCam` state in `ExplorerPage`, `Move3d` icon in `ControlBar`).** User-requested: when enabled, clicking a body still opens the info panel but `CameraRig` skips its follow-the-selected-body branch entirely, leaving the camera fully under OrbitControls. Reset Camera still works in either mode (it's a separate transient "return to default" trigger in `CameraRig`, not tied to selection). Default is off (click-to-focus is the spec'd default behavior), user toggles it on for pure free exploration.
- **Hit-spheres resized dynamically per-frame, not fixed world-space size (`src/three/hitRadius.js`).** First attempt used a fixed world-space invisible proxy sphere per body (e.g. `max(radius × 1.8, 0.4)` units) for easier clicking. This works fine at close zoom but becomes only a few *screen pixels* at the Explorer's necessarily-wide default view (needed to fit Pluto's orbit in frame — see below), making Moon/Pluto/Mercury effectively unclickable — confirmed via Playwright grid-search testing (a fixed-coordinate click reliably missed a ~0.5-unit target from ~150 units away). Fixed by computing each body's hit-sphere radius every frame from actual camera distance + FOV + viewport height, targeting a constant ~11px on-screen radius, clamped between the body's own minimum (visible radius, or ring outer edge for Saturn) and a 2.0-unit ceiling (to avoid swallowing a neighboring orbit at extreme zoom-out). Applied to both `Planet.jsx` and `Sun.jsx`.
- **Default camera distance increased 78 → 120, `maxDistance` multiplier 1.4× → 2.4× (`ExplorerCanvas.jsx` / `Scene.jsx`).** Pluto's own orbit radius alone isn't a safe "will it fit on screen" bound — depending on where it currently sits around that orbit (its `hashAngle` start position is deterministic per page load), its worst-case edge-on screen position needs roughly `orbitRadius / sin(halfFOV)` of camera distance to stay in frame. At the old 78/87.9 values Pluto was reliably clipped outside the 1400×900 test viewport; verified via Playwright DOM queries (label `getBoundingClientRect()`) that all 10 bodies now fall within frame at the default view.
- **Dim-on-select color was far too dark — read as a near-total blackout, not a "slight dim."** `Planet.jsx`'s `DIM_COLOR` (multiplies a non-selected planet's texture when another body is focused) was `0x555555` (33% brightness), which compounded with the scene's modest point-light + ambient lighting to look like the planet had been censored/blacked out — exactly what was reported. Changed to `0xb0b0b0` (~69%), a genuinely subtle dim.
- **Free Roam bug: entering it mid-transient could render the ENTIRE scene solid black (even the skybox), permanently, until reload.** Root cause was two-layered: (1) `CameraRig`'s hard `freeCam` gate froze `camera.position`/`controls.target` wherever their independent lerps happened to be when Free Roam engaged — fixed by snapping both to a fully consistent pair the instant Free Roam turns on (see the effect in `CameraRig.jsx`), which resolved the *positioning* half but the black screen still happened on the next drag. (2) The actual cause: `OrbitControls`' `enableDamping` maintains a hidden internal rotation-velocity/spherical-delta state that decays across many frames rather than resolving instantly — fine for pure user-driven dragging, but this scene ALSO drives the camera programmatically (click-to-focus, return-to-default, the Free Roam entry snap), and mixing direct position/target writes with damping's carried-over internal state left OrbitControls' bookkeeping inconsistent. Confirmed via direct instrumentation (`window.__debugCam` temporarily exposing camera.position/controls.target/distance every frame) that position/target were perfectly sane numbers even while the screen was black — this ruled out a positioning bug and pointed at OrbitControls' own internal state instead. Fixed by removing `enableDamping`/`dampingFactor` from `<OrbitControls>` entirely in `Scene.jsx` — every `update()` now fully resolves in the frame it's called, at the cost of the camera stopping instantly on drag-release instead of gliding briefly. Verified fixed across repeated select→deselect→toggle→drag cycles and multiple re-toggles in the same session.
- **Bloom/lighting overexposure found while debugging the above:** with damping removed, directly-lit planet faces (bright side facing the Sun) were crossing the `0.85` Bloom luminance threshold and rendering as blown-out white circles instead of their textures — a side effect of the intensity=6 point light bumped up during the earlier "dull planets" quality fix. Point light intensity brought back down to 4.5 and Bloom `luminanceThreshold` raised to `0.95` as a safety margin, so only the Sun's deliberately-unclamped (`toneMapped=false`) brightness ever triggers bloom.
- **Project pushed to GitHub.** Repo initialized and live at `https://github.com/vinithgomez/AstroVerse`. Git identity is configured LOCALLY for this repo only (`vinithgomez <vinithgomez36@gmail.com>`, set via `git config user.name`/`user.email` without `--global`) — not the machine's global git identity. `README.md` added (overview, features, tech stack, setup instructions, project structure, current build status — kept in sync with reality, not aspirational). Custom `PUSH` workflow documented in Section 10: commits on this repo never include Claude/Anthropic attribution of any kind, per explicit user instruction — this is a hard rule for every future commit, not just the first one.
- **Low quality mode caused a total solid-black canvas (Sun, planets, orbit lines, starfield all invisible — only drei `Html` labels still showed, since those are DOM overlays positioned by projection math, not by reading canvas pixels).** Root cause: `Scene.jsx`'s `<EffectComposer multisampling={lowEnd ? 0 : 8}>` combined with `Bloom`'s `mipmapBlur` option — `mipmapBlur` generates a mip chain off the composer's render target, and on some real GPU/driver combinations that fails silently and blacks out the whole composited frame when the target isn't multisampled. This did NOT reproduce under headless/software-rendered WebGL (Playwright/Chromium software fallback) in either a toggle-after-load test or a cold-start-in-low-mode test — only confirmed by the user on real hardware — so don't trust headless Playwright screenshots alone to rule out GPU-driver-specific rendering bugs. Every other `lowEnd` knob (sphere segments 96→32, texture size 8192→3072, `antialias`, `dpr`) only lowers a number and degrades gracefully; `multisampling: 0` combined with `mipmapBlur` was the one setting that flipped `EffectComposer` onto a structurally different code path. Fixed by disabling `mipmapBlur` entirely when `lowEnd` (`mipmapBlur={!lowEnd}`). A first attempt at the fix also bumped `multisampling` to `2` in low mode, on the assumption some nonzero sample count was required — that introduced a NEW artifact instead (a solid black square rendered directly over the Sun), because `2` isn't a universally-supported MSAA sample count the way `0` (no multisampling at all) is; some drivers mishandle an arbitrary/unsupported sample count during the render target resolve step, corrupting exactly the brightest region of the frame (the Sun, the scene's only `toneMapped={false}` object). `multisampling` was reverted back to `0` for low mode — `mipmapBlur={!lowEnd}` alone was the actual, sufficient fix; nonzero multisampling was never required. Lesson: when a real-hardware-only rendering bug doesn't reproduce under headless/software WebGL, prefer the most conservative change (disable the suspect feature) over also tweaking adjacent settings speculatively — each speculative tweak is itself unverifiable until the user tests on real hardware.
- **Outer planets (Saturn confirmed via close-up; same physics applies to Uranus/Neptune/Pluto) looked flat, dull, and nearly detail-less even in High quality mode, unrelated to texture resolution or segment count (both already correct/high).** Root cause: `Sun.jsx`'s `pointLight` used `decay={2}` (physically-correct inverse-square falloff), which is wrong for this scene's compressed distance scale — Saturn's orbit sits ~30 scene units out, and inverse-square falloff from a light tuned for inner-planet distances crushes anything that far to near-black. Confirmed via a Playwright close-up: Saturn rendered as a nearly uniform dull olive-brown disc with no visible ring texture, while Earth (10x closer) looked fine. Fixed by setting `decay={0}` (no distance attenuation — every body gets equal light regardless of scaled orbital distance) and retuning `intensity` down from `4.5` to `1.7` to compensate (decay=2 needed a higher intensity specifically to punch through inverse-square falloff at inner-planet range; without any falloff that same intensity would overexpose Mercury/Venus). Also bumped `ambientLight` `0.12 → 0.22` as a separate fix for a different symptom: a body's unlit night-side hemisphere (e.g. the Moon) rendered as a flat, featureless black disc — no point-light retuning fixes that, since a point light physically can't illuminate the far side of a sphere; the ambient bump is a deliberate stylistic fill for legibility, not realism. **Verified via Playwright: Mercury (closest to the Sun, highest overexposure risk) still shows clean, non-blown-out crater detail after the change — and since `decay=0` means every body now receives identical light intensity regardless of distance, Mercury being safe implies Venus/Earth/Mars are too (they're all the same or farther away).** Saturn's banding became clearly visible after the fix, confirming the diagnosis.
- **Learning Modules system built at `/learn` (list) and `/learn/:moduleId` (detail).** `src/data/modules.js` — 20 modules across the three tiers matching the landing page's Learning Path teaser (8 Beginner, 6 Intermediate, 6 Advanced), each with `id`/`title`/`tier`/`icon`/`summary`/`estimatedMinutes`/`content`/`glossaryTerms`/`didYouKnow`/`relatedTheoryIds`/`relatedPlanetIds`. Beginner modules have full 4-5 section content; Intermediate/Advanced have a lighter 2-3 section first pass (see §8). New: `src/hooks/useProgress.js` (guest → `localStorage`, logged-in → Supabase `progress` table, same optimistic/fails-silently-until-the-table-exists pattern as `InfoPanel`'s bookmarks), `src/components/{ModuleCard,RichBody,moduleIcons}`, `src/pages/Learn/{ModuleList,ModuleDetail}/index.jsx`. `ModuleList` renders each tier as a connected vertical timeline (numbered/checkmarked circles + connecting line) with tier-unlock gating (50% of the previous tier's modules complete, via `getUnlockThreshold` in `modules.js`), an overall progress bar, and tier + text-search filtering. `ModuleDetail` has a max-width reading column, glossary tooltips inline in body text, "Did You Know" chips between sections, related-planet cards (linking to `/explorer?focus=<id>`) and related-theory cards, Mark Complete / Take the Quiz actions, and tier-respecting Previous/Next navigation. Routes added in `routes/index.jsx`: `/learn`, `/learn/:moduleId`, plus `/theories/:theoryId` (placeholder, so related-theory links don't dead-end). `ExplorerPage` now reads a one-shot `?focus=<bodyId>` query param on mount to support the "Explore in 3D" deep link. `InfoPanel`'s "Learn More" button was fixed to route through a new `PLANET_TO_MODULE_ID` map (`modules.js`) instead of `/learn/${body.id}` directly — individual planets are grouped into `inner-planets`/`outer-planets` modules rather than one module per body, so the old direct-id link would have 404'd.
- **Bug: glossary tooltips silently never rendered — a React 18 StrictMode double-invoke + shared mutable object interaction, not a logic error in the matching regex itself.** The first implementation had `RichBody` as its own component (`<RichBody text=... glossaryTerms=... usedTerms=... />`), where `usedTerms` (a `Set` tracking which terms have already been tooltipped, so only the FIRST occurrence in the whole module gets wrapped) was created once in the parent (`ModuleDetail`) and passed down as a prop to four separate `RichBody` instances (one per content section). In dev, React 18 StrictMode double-invokes every component function once "for real" and once as a discarded trial run to catch impure renders — and since all four `RichBody` instances received the *same* `Set` object reference, each instance's own discarded trial invocation mutated that shared `Set` (marking every term "used") before that same instance's second, actually-committed invocation ran — so the committed render always found every term already marked used and wrapped nothing. Confirmed via direct instrumentation: the regex/matching logic was verified correct in isolation (Node), and DOM inspection showed the shared `Set` already contained every term before the "real" pass even started. An initial fix attempt (removing a `useMemo` wrapper around the `Set` in `ModuleDetail`) did NOT fix it, because the contamination was happening one level lower, inside `RichBody`'s own StrictMode double-invoke, not from `useMemo` caching across `ModuleDetail` renders. The actual fix: stopped rendering `RichBody` as a JSX component element entirely — it's now a plain exported function (`renderBody(text, glossaryTerms, usedTerms)`) called directly inside `ModuleDetail`'s own render body (`{renderBody(section.body, module.glossaryTerms, usedTerms)}`), so the whole first-occurrence pass across all sections happens within ModuleDetail's own single render call, with no separate child-component double-invoke boundary to leak mutations across. Lesson: never thread a mutable object (Set/Map/array you `.add`/`.push` into during render) as a prop into a separately-double-invoked child component — either make the child pure w.r.t. that object, or keep the mutation entirely within one component's own render call.

---

## 7. Assets — Texture Library Status

All textures downloaded and organized under `/public/textures/<planet>/`. Sources: Solar System Scope (most planets), NASA Visible Earth (Earth color map, highest res — `earth_color_21k.jpg`, renamed from `world.topo.bathy.200406...jpg`), Planet Pixel Emporium (Pluto, equirectangular).

```
✅ sun/        8k_sun.jpg
✅ earth/      earth_color_21k.jpg (NASA, primary), 8k_earth_daymap.jpg (SSS, backup),
               8k_earth_nightmap.jpg, 8k_earth_clouds.jpg, 8k_earth_specular_map.tif,
               8k_earth_normal_map.tif
✅ moon/       8k_moon.jpg
✅ mercury/    8k_mercury.jpg
✅ venus/      8k_venus_surface.jpg, 4k_venus_atmosphere.jpg
✅ mars/       8k_mars.jpg
✅ jupiter/    8k_jupiter.jpg
✅ saturn/     8k_saturn.jpg, 8k_saturn_ring_alpha.png
✅ uranus/     2k_uranus.jpg
✅ neptune/    2k_neptune.jpg
✅ pluto/      Pluto Global Color Map (Planet Pixel Emporium, equirectangular — note: southern
               region is black/missing data, New Horizons only imaged one hemisphere)
✅ skybox/     8k_stars.jpg, 8k_stars_milky_way.jpg
```

❌ Removed (not used): fictional/dwarf planet placeholders (Eris, Makemake, Haumea, Ceres) that came bundled with an early download batch.

---

## 8. ⚠️ Outstanding / Unverified Items

> Claude Code must NOT silently treat these as resolved. Surface them to the user when relevant.

- **✅ RESOLVED — Earth TIF textures.** `8k_earth_specular_map.tif`/`8k_earth_normal_map.tif` have been converted to `8k_earth_specular_map.png`/`8k_earth_normal_map.png` and are now wired into both the Explorer's Earth (`Planet.jsx`, `meshPhongMaterial` normalMap/specularMap) — the hero on the landing page still only uses daymap + nightmap (unchanged, no need to touch a working section for this).
- **Planet info panel facts are UNVERIFIED — must be fact-checked before launch.** `src/data/planets.js`'s `facts` block (numMoons, tempRangeC, description) on every body was drafted from general astronomy knowledge, NOT cross-checked against a NASA source, per the file's own header comment. Moon counts are especially volatile for the gas giants/ice giants (Jupiter 95, Saturn 146, Uranus 28, Neptune 16 as used — these change as new moons are confirmed) and were the specific case CLAUDE.md already warned about here. Do NOT remove this warning without the user confirming they've checked it.
- **Supabase `bookmarks` table does not exist yet.** `InfoPanel.jsx`'s bookmark button calls `supabase.from('bookmarks').upsert/delete(...)` but no migration/schema for this table has been created anywhere in the project (checked — no `.sql` files, no Supabase migrations folder exist). The call is wrapped in a try/catch so it fails silently and the UI still optimistically toggles the bookmark icon for the current session, but nothing persists yet. Needs a `bookmarks(user_id, body_id)` table (+ RLS policy) before this is a real feature. Same gap likely applies to `quiz_scores`, `progress`, and `badges` referenced in §5 — none of those tables have been created either.
- **News RSS CORS handling** — not yet implemented, needs a server-side proxy/serverless function.
- **Theories.js full content** — full list scoped in conversation (cosmological, astrophysics, planetary theories + discovery timeline) but not yet written into the actual data file. `modules.js`'s `relatedTheoryIds` reference theory ids (e.g. `big-bang-theory`, `nebular-hypothesis`) that don't exist in any data file yet — `ModuleDetail` renders them as cards with a slug-prettified title and links to `/theories/:theoryId` (a placeholder route), per spec ("route even if Theories page not built yet"). When `theories.js` is finally written, these ids must match exactly or the links will silently 404-equivalent (render the generic Theories placeholder).
- **Learning Modules content is UNVERIFIED — must be fact-checked before launch, same policy as `planets.js`.** `src/data/modules.js`'s `content`, `didYouKnow`, and `glossaryTerms` fields (temperatures, dates, distances, discovery years, etc. across all 20 modules) were drafted from general astronomy knowledge, not cross-checked line-by-line against a NASA source. Flagged in the file's own header comment too. Additionally, the 6 Intermediate and 6 Advanced modules have a deliberately lighter first pass (2-3 content sections each) vs. Beginner's 4-5 — real, accurate content, not placeholder text, but less exhaustive. Expanding them is a reasonable follow-up, not a bug.
- **Supabase `progress` table does not exist yet** (same gap as `bookmarks`, `quiz_scores`, `badges` above). `useProgress.js` (`src/hooks/useProgress.js`) reads/writes it in a try/catch, failing silently and falling back to empty state for logged-in users until the table exists. Guests use `localStorage` (`astroverse_guest_progress` key) instead, by design — CLAUDE.md §5 permits session/browser-only storage specifically for guests, since they don't get cross-device sync either way. Needs a `progress(user_id, module_id, status, completed_at)` table (+ RLS policy), `status` being `'in_progress' | 'complete'`.

## 9. Conventions for Claude Code to Follow

- Update Section 6 (Decisions Log) whenever a meaningful technical or product decision is made during a session — append, don't overwrite.
- Update Section 8 when an outstanding item gets resolved, or when a new unverified/risky assumption is introduced.
- Do not invent specific scientific facts (moon counts, temperatures, exact dates) without flagging them as needing verification.
- Keep all new code consistent with the Design System tokens in Section 3 — no ad hoc colors/fonts.
- Prefer editing this file over assuming context will be remembered from chat history alone.

---

## 10. Custom Commands

### "PUSH" (standalone, all caps)

When the user types the word `PUSH` on its own (all caps, standalone — not part of a sentence), treat it as shorthand for: **commit and push all current changes to GitHub.** Do the following, in order:

1. Run `git status` and show the user what's changed.
2. Before staging anything, verify `.gitignore` still properly excludes `.env`, `node_modules/`, and `dist/` — never commit secrets. If any of these show up as trackable/staged, stop and flag it to the user instead of proceeding.
3. Check whether `README.md`'s "Current Build Status" section still matches reality — e.g. if a placeholder page from the "🚧 In progress" list was completed this session, or a new "Known gap" was introduced/resolved. If it needs updating, update it as part of the same commit. If nothing meaningful changed about project status, leave the README as-is.
4. Run `git add .`
5. Generate a clear, descriptive commit message that summarizes what was **actually built or changed in the session** — never a generic message like "update" or "changes". Base it on the real diff/session content.
6. Commit with that message.
7. Push to `main` on the existing `origin` remote.
8. Confirm the push succeeded and give the user the GitHub URL (`https://github.com/vinithgomez/AstroVerse`).

**Critical rule — no AI attribution in commits for this project:** Commits must NOT include a `Co-Authored-By: Claude` trailer, a "Generated with Claude Code" footer, or any other reference to Claude/Anthropic anywhere in the commit message. This project's commits are authored solely under the user's own configured git identity (`vinithgomez <vinithgomez36@gmail.com>`), with a clean message containing only the actual summary of changes. This overrides the default Claude Code commit-message convention — it applies specifically to this repository, per the user's explicit instruction.

### Reminder to PUSH

Whenever a page is finished (e.g. a placeholder route becomes a real, working page) or a major bug is fixed during a session, proactively remind the user at that point to type `PUSH` if they want to commit and push the work — don't wait to be asked. Keep it to a short one-line nudge, not a repeat of the whole PUSH workflow. Do not nag for minor tweaks, small copy edits, or in-progress work that isn't at a natural stopping point.
