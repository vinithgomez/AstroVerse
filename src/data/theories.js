// theories.js — Theories & Discoveries content for the /theories section.
//
// ⚠️ UNVERIFIED — as with planets.js and modules.js, every specific fact,
// date, attribution, and claim below (proposedBy names, years, evidence
// bullet points, etc.) was drafted from general astronomy/physics
// knowledge, NOT cross-checked line-by-line against a primary source.
// Per CLAUDE.md §8/§9, this must be fact-checked before launch.

export const CATEGORIES = [
  { id: 'cosmological', label: 'Cosmological', color: 'var(--color-purple)' },
  { id: 'astrophysics', label: 'Astrophysics', color: 'var(--color-blue)' },
  { id: 'planetary',    label: 'Planetary Science', color: 'var(--color-success)' },
  { id: 'discovery',    label: 'Discovery', color: 'var(--color-warning)' },
]

export const STATUSES = [
  { id: 'proven',          label: 'Proven' },
  { id: 'strong-evidence', label: 'Strong Evidence' },
  { id: 'hypothesis',      label: 'Hypothesis' },
  { id: 'debated',         label: 'Debated' },
  { id: 'disproven',       label: 'Disproven' },
]

// Difficulty here tags overall topic complexity (used for filtering, shown
// as a DifficultyBadge on cards) — separate from the beginner/advanced
// explanation toggle on the detail page, which every entry has regardless
// of its difficulty tag.
export const DIFFICULTIES = [
  { id: 'beginner',     label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced',     label: 'Advanced' },
]

export const ERAS = [
  { id: 'pre-1900', label: 'Ancient – 1800s' },
  { id: '1900s',    label: '1900s' },
  { id: '2000s',    label: '2000s' },
  { id: '2020s',    label: '2020s' },
]

function theory({
  id, title, category, status, era, proposedBy, year, difficulty = 'beginner',
  summary, beginnerExplanation, advancedExplanation,
  evidenceFor = [], evidenceAgainst = [],
  relatedTheoryIds = [], relatedDiscoveryIds = [], relatedModuleId = null,
}) {
  return {
    id, title, category, status, era, proposedBy, year, difficulty,
    summary, beginnerExplanation, advancedExplanation,
    evidenceFor, evidenceAgainst,
    relatedTheoryIds, relatedDiscoveryIds, relatedModuleId,
  }
}

// A "discovery" is just a theory-shaped entry pinned to category:'discovery'
// and status:'proven' — historical, confirmed events rather than open
// scientific questions, so evidenceFor/evidenceAgainst don't apply.
function discovery({
  id, title, era, proposedBy, year, difficulty = 'beginner',
  summary, beginnerExplanation, advancedExplanation,
  relatedTheoryIds = [], relatedModuleId = null,
}) {
  return theory({
    id, title, category: 'discovery', status: 'proven', era, proposedBy, year, difficulty,
    summary, beginnerExplanation, advancedExplanation,
    relatedTheoryIds, relatedDiscoveryIds: [], relatedModuleId,
  })
}

const RAW_THEORIES = [
  // ── COSMOLOGICAL ─────────────────────────────────────────────────────────
  theory({
    id: 'big-bang-theory', title: 'The Big Bang Theory', category: 'cosmological',
    status: 'proven', era: '1900s', proposedBy: 'Georges Lemaître', year: 1931, difficulty: 'beginner',
    summary: 'The universe began as an extremely hot, dense state roughly 13.8 billion years ago and has been expanding and cooling ever since.',
    beginnerExplanation: 'Almost 14 billion years ago, everything that exists today — all matter, energy, space, and time — began expanding outward from an incredibly hot, dense state. It wasn’t an explosion happening inside space; it was the expansion of space itself, and it’s still happening now. Since then, the universe has cooled enough for atoms, stars, galaxies, and eventually planets to form.',
    advancedExplanation: 'The Big Bang model is the standard cosmological framework describing the universe’s evolution from a hot, dense initial state, derived from solutions to Einstein’s general relativity (the Friedmann equations). It is supported by three independent, converging lines of evidence: the redshift-distance relationship of galaxies (Hubble’s Law), the cosmic microwave background radiation, and the observed primordial abundances of light elements (Big Bang nucleosynthesis).',
    evidenceFor: [
      'Cosmic microwave background radiation matches predictions for a hot early universe cooling over ~13.8 billion years.',
      'Distant galaxies show redshift proportional to their distance (Hubble’s Law), consistent with universal expansion.',
      'The observed ratio of hydrogen to helium in the universe matches Big Bang nucleosynthesis predictions.',
    ],
    relatedTheoryIds: ['cosmic-inflation', 'steady-state-theory'],
    relatedDiscoveryIds: ['cmb-discovered', 'expanding-universe-discovered'],
    relatedModuleId: 'cosmology-big-bang',
  }),
  theory({
    id: 'cosmic-inflation', title: 'Cosmic Inflation', category: 'cosmological',
    status: 'strong-evidence', era: '1900s', proposedBy: 'Alan Guth', year: 1981, difficulty: 'advanced',
    summary: 'A theorized period of extraordinarily rapid expansion in the first fraction of a second after the Big Bang.',
    beginnerExplanation: 'In the tiniest sliver of a second after the Big Bang, the universe is thought to have ballooned in size far faster than light could otherwise travel through normal space. This burst, called inflation, would explain why the universe looks so uniform in every direction — regions that seem too far apart to have ever interacted were actually close together before inflation flung them apart.',
    advancedExplanation: 'Inflation proposes a scalar field (the "inflaton") that briefly dominated the universe’s energy density, driving exponential expansion and resolving the horizon and flatness problems inherent in the basic Big Bang model. It also predicts the quantum fluctuations that seeded the density variations later observed in the cosmic microwave background and that grew into galaxies.',
    evidenceFor: [
      'The universe’s large-scale flatness matches inflation’s predictions far better than an uninflated Big Bang alone.',
      'The uniformity of the cosmic microwave background across regions that shouldn’t have been in causal contact is naturally explained by inflation.',
      'The statistical pattern of CMB temperature fluctuations matches quantum fluctuations stretched by inflation.',
    ],
    evidenceAgainst: [
      'No direct detection of an inflaton field or particle has been made.',
      'Specific inflationary models make a wide range of differing predictions, and it isn’t settled which (if any) is correct.',
    ],
    relatedTheoryIds: ['big-bang-theory'],
    relatedDiscoveryIds: ['cmb-discovered'],
    relatedModuleId: 'cosmology-big-bang',
  }),
  theory({
    id: 'steady-state-theory', title: 'Steady State Theory', category: 'cosmological',
    status: 'disproven', era: '1900s', proposedBy: 'Fred Hoyle, Hermann Bondi, Thomas Gold', year: 1948, difficulty: 'intermediate',
    summary: 'A now-disproven model proposing the universe has always looked the same, with matter continuously created to keep density constant as it expands.',
    beginnerExplanation: 'Before the Big Bang model won out, some astronomers proposed that the universe never had a beginning at all — it simply always existed, looking roughly the same at every point in time, with new matter constantly appearing to fill the gaps left by expansion. It was a serious, competing scientific idea for about two decades.',
    advancedExplanation: 'The steady-state model preserved the "perfect cosmological principle" — homogeneity in both space and time — by invoking continuous spontaneous matter creation at a rate matching the expansion. The 1965 discovery of the cosmic microwave background, along with observed evolution in galaxy populations over cosmic time, was fatal to the model, since a truly unchanging universe should show neither.',
    evidenceFor: ['Explained the observed expansion of the universe without requiring a singular beginning.'],
    evidenceAgainst: [
      'The cosmic microwave background is direct evidence of a hot, dense early universe, which the steady-state model cannot account for.',
      'Distant (and thus younger) galaxies look systematically different from nearby ones, showing the universe has evolved rather than stayed constant.',
    ],
    relatedTheoryIds: ['big-bang-theory'],
    relatedDiscoveryIds: ['cmb-discovered'],
  }),
  theory({
    id: 'multiverse-hypothesis', title: 'Multiverse Hypothesis', category: 'cosmological',
    status: 'debated', era: '2000s', proposedBy: 'Various (Hugh Everett, Andrei Linde, others)', year: 1957, difficulty: 'advanced',
    summary: 'The idea that our universe may be just one of many, possibly infinite, separate universes.',
    beginnerExplanation: 'Some theories suggest our universe isn’t the only one — that it might be one bubble among countless others, each possibly with different physical laws or constants, forever cut off from ours. It’s a genuinely mind-bending idea, but one that’s extremely difficult, maybe impossible, to test.',
    advancedExplanation: 'Multiverse proposals arise from several independent directions: eternal inflation predicts causally disconnected "bubble universes"; the many-worlds interpretation of quantum mechanics proposes branching universes for every quantum outcome; and string theory’s vast landscape of possible vacuum states suggests many possible sets of physical constants. Critics argue that, without observable consequences in our own universe, these ideas sit at the edge of falsifiable science. Note the single 1957 date above marks only the earliest of these — Everett’s many-worlds interpretation — while eternal inflation (1980s) and the string landscape (2000s) are independent proposals that arrived decades later; "the multiverse" is really three separate ideas converging on a similar theme, not one single dated theory.',
    evidenceFor: [
      'Eternal inflation, a well-motivated extension of inflationary theory, naturally predicts multiple universes.',
      'The many-worlds interpretation resolves quantum measurement paradoxes without requiring wavefunction collapse.',
    ],
    evidenceAgainst: [
      'Other universes, by most formulations, can never be observed or tested directly.',
      'Some physicists argue multiverse proposals aren’t falsifiable and therefore fall outside the bounds of empirical science.',
    ],
    relatedTheoryIds: ['cosmic-inflation', 'string-theory'],
  }),
  theory({
    id: 'string-theory', title: 'String Theory', category: 'cosmological',
    status: 'hypothesis', era: '1900s', proposedBy: 'Gabriele Veneziano and others', year: 1968, difficulty: 'advanced',
    summary: 'A theoretical framework proposing that fundamental particles are actually tiny, one-dimensional vibrating strings of energy.',
    beginnerExplanation: 'Instead of point-like particles being the most basic building blocks of everything, string theory proposes that reality is made of impossibly tiny vibrating strings — and the specific way each string vibrates determines what particle it appears to be. It’s an attempt to unify gravity with the other forces of nature into one consistent theory, but it requires 10 or 11 dimensions, most curled up too small to ever notice.',
    advancedExplanation: 'String theory replaces point particles with one-dimensional extended objects whose vibrational modes correspond to different particles, naturally including a massless spin-2 excitation identified with the graviton — a strong hint it may unify gravity with quantum mechanics. It requires extra spatial dimensions (typically 10 in superstring theory, 11 in M-theory) compactified at scales far below current experimental reach.',
    evidenceFor: [
      'Naturally predicts a graviton-like particle, suggesting a path to unifying gravity with quantum mechanics.',
      'Internally mathematically consistent in ways many competing quantum gravity proposals are not.',
    ],
    evidenceAgainst: [
      'No experimental evidence for extra dimensions or string-scale physics has ever been found.',
      'Makes essentially no falsifiable predictions testable with current or near-future technology.',
    ],
    relatedTheoryIds: ['loop-quantum-cosmology', 'multiverse-hypothesis'],
  }),
  theory({
    id: 'loop-quantum-cosmology', title: 'Loop Quantum Cosmology', category: 'cosmological',
    status: 'hypothesis', era: '2000s', proposedBy: 'Martin Bojowald, Abhay Ashtekar and others', year: 2001, difficulty: 'advanced',
    summary: 'A competing approach to quantum gravity that quantizes spacetime itself into discrete units, applied to the early universe.',
    beginnerExplanation: 'Loop quantum cosmology is a different attempt (from string theory) to describe gravity using quantum mechanics. It suggests space itself is made of tiny, discrete chunks rather than being perfectly smooth — and applying that idea to the universe’s birth suggests the Big Bang might actually have been a "bounce" from a previous contracting universe, rather than a true beginning.',
    advancedExplanation: 'Loop quantum gravity quantizes spacetime geometry directly, without requiring extra dimensions, producing discrete spin-network structures at the Planck scale. Applied cosmologically, the resulting quantum geometry replaces the classical Big Bang singularity with a "quantum bounce," a prediction with no analog in standard general relativity.',
    evidenceFor: [
      'Avoids the singularity problem present in classical general-relativity descriptions of the Big Bang.',
      'Doesn’t require extra spatial dimensions, unlike string theory.',
    ],
    evidenceAgainst: [
      'No observational evidence yet distinguishes it from standard inflationary cosmology.',
      'Full unification with the Standard Model of particle physics remains unresolved.',
    ],
    relatedTheoryIds: ['string-theory', 'cyclic-universe-big-bounce'],
  }),
  theory({
    id: 'cyclic-universe-big-bounce', title: 'Cyclic Universe / Big Bounce', category: 'cosmological',
    status: 'hypothesis', era: '2000s', proposedBy: 'Paul Steinhardt and Neil Turok', year: 2002, difficulty: 'advanced',
    summary: 'The idea that the universe undergoes endless cycles of expansion and contraction, with each Big Bang preceded by a prior "Big Crunch."',
    beginnerExplanation: 'What if the Big Bang wasn’t the true beginning of everything, but just the latest event in an endless cycle — the universe expands, eventually contracts back down, "bounces," and expands again as a new Big Bang? Some cosmologists have proposed models like this as an alternative to a single one-time beginning.',
    advancedExplanation: 'Cyclic models, including the ekpyrotic scenario drawing on string-theory brane collisions, attempt to reproduce inflation’s successes (flatness, uniformity) without a singular beginning, instead proposing an eternal sequence of contractions and "bounces." Current observational data doesn’t clearly favor cyclic models over standard inflation, and open theoretical questions remain about how a bounce would actually occur physically.',
    evidenceFor: [
      'Can reproduce some of the same large-scale uniformity and flatness that inflation explains.',
      'Avoids requiring a unique, unexplained initial condition for the universe.',
    ],
    evidenceAgainst: [
      'No confirmed physical mechanism for how a contracting universe would "bounce" rather than collapse into a singularity.',
      'Current observations of the cosmic microwave background are generally considered a better fit for standard inflation.',
    ],
    relatedTheoryIds: ['cosmic-inflation', 'big-crunch'],
  }),
  theory({
    id: 'simulation-theory', title: 'Simulation Theory', category: 'cosmological',
    status: 'debated', era: '2000s', proposedBy: 'Nick Bostrom', year: 2003, difficulty: 'advanced',
    summary: 'The philosophical proposal that our entire reality could be a computer simulation run by an advanced civilization.',
    beginnerExplanation: 'Simulation theory suggests that everything we experience — the universe, physics, even our own thoughts — could be running inside a vastly powerful computer simulation, similar to a video game, created by some advanced civilization. It’s a fascinating philosophical argument, but it isn’t really a testable scientific theory in the way the Big Bang or general relativity are.',
    advancedExplanation: 'Bostrom’s original "simulation argument" is a probabilistic trilemma: either civilizations almost always go extinct before becoming capable of running realistic simulations, or they choose not to run them, or we are almost certainly living in one, given how many simulated realities a single advanced civilization could plausibly generate. It remains fundamentally unfalsifiable with current or foreseeable physics.',
    evidenceFor: ['A purely logical/probabilistic argument, not empirical evidence — if simulations of consciousness are possible at all and common, simulated observers would vastly outnumber "real" ones.'],
    evidenceAgainst: [
      'No proposed experiment can currently distinguish a simulated reality from a "base" physical one.',
      'Widely considered philosophy rather than testable physics by most working scientists.',
    ],
    relatedTheoryIds: ['multiverse-hypothesis'],
  }),
  theory({
    id: 'dark-energy-hypothesis', title: 'Dark Energy', category: 'cosmological',
    status: 'strong-evidence', era: '1900s', proposedBy: 'Saul Perlmutter, Brian Schmidt, Adam Riess', year: 1998, difficulty: 'intermediate',
    summary: 'A mysterious form of energy, making up roughly 68% of the universe, that appears to be driving its accelerating expansion.',
    beginnerExplanation: 'In 1998, astronomers studying distant exploding stars found something nobody expected: the universe’s expansion isn’t just continuing, it’s speeding up. Whatever is causing that acceleration has been named "dark energy," and while we can measure its effects precisely, we still don’t know what it actually is.',
    advancedExplanation: 'Type Ia supernova observations revealed that distant supernovae are dimmer (and thus farther away) than a decelerating universe would predict, indicating accelerating expansion. The leading explanation is a cosmological constant — a constant energy density inherent to space itself — though alternative models like quintessence (a dynamic scalar field) remain viable.',
    evidenceFor: [
      'Type Ia supernova distance measurements consistently show accelerating expansion.',
      'Cosmic microwave background and large-scale structure measurements independently require a dark-energy-like component to match observations.',
      'Won the 2011 Nobel Prize in Physics for its discoverers.',
    ],
    evidenceAgainst: [
      'The fundamental physical nature of dark energy remains completely unknown.',
      'The measured value of the cosmological constant is dramatically smaller than naive quantum field theory predictions — a major unsolved discrepancy.',
    ],
    relatedTheoryIds: ['dark-matter-hypothesis', 'big-rip'],
    relatedDiscoveryIds: ['dark-energy-confirmed'],
    relatedModuleId: 'dark-energy',
  }),
  theory({
    id: 'dark-matter-hypothesis', title: 'Dark Matter', category: 'cosmological',
    status: 'strong-evidence', era: '1900s', proposedBy: 'Fritz Zwicky (proposed), Vera Rubin (confirmed via rotation curves)', year: 1933, difficulty: 'intermediate',
    summary: 'An invisible form of matter, detected only through its gravity, that appears to outweigh all ordinary matter in the universe roughly five to one.',
    beginnerExplanation: 'Galaxies rotate faster than they should, based on the gravity of everything we can actually see in them — stars, gas, dust. The leading explanation is that a huge amount of invisible matter, which doesn’t emit or reflect any light, is filling in the missing gravity. We call it dark matter, and even though we’ve never seen it directly, its gravitational fingerprints are everywhere.',
    advancedExplanation: 'Galaxy rotation curves remain flat at large radii rather than declining as expected from visible mass distribution alone, implying an extended, unseen mass halo. Independent evidence — gravitational lensing around galaxy clusters, the CMB power spectrum, and large-scale structure formation simulations — all converge on roughly the same dark matter density, despite probing entirely different physical phenomena.',
    evidenceFor: [
      'Galaxy rotation curves stay flat instead of declining at large radii, implying unseen mass.',
      'Gravitational lensing around galaxy clusters (e.g. the Bullet Cluster) reveals mass distributions offset from visible matter.',
      'Large-scale cosmic structure formation only matches observations if a dark matter component is included in simulations.',
    ],
    evidenceAgainst: [
      'No dark matter particle has ever been directly detected in laboratory experiments despite decades of searching.',
      'Alternative modified-gravity theories (like MOND) can explain some, but not all, of the same observations without invoking unseen matter.',
    ],
    relatedTheoryIds: ['dark-energy-hypothesis'],
    relatedModuleId: 'dark-matter',
  }),
  theory({
    id: 'heat-death-of-the-universe', title: 'Heat Death of the Universe', category: 'cosmological',
    status: 'hypothesis', era: 'pre-1900', proposedBy: 'William Thomson (Lord Kelvin)', year: 1852, difficulty: 'intermediate',
    summary: 'A proposed ultimate fate of the universe in which entropy reaches a maximum, leaving nothing but a cold, dark, unchanging expanse.',
    beginnerExplanation: 'One possible ending for the universe: everything keeps spreading out and cooling down, forever, until stars burn out, black holes evaporate, and there’s no usable energy left anywhere — just a cold, dark, silent expanse for the rest of time. Given what we currently know about dark energy, this is considered the most likely long-term fate.',
    advancedExplanation: 'Heat death follows from the second law of thermodynamics applied to an ever-expanding universe: as usable free energy is progressively converted to unusable entropy, matter and energy asymptotically approach a state of maximum entropy and minimum temperature. Given current evidence for accelerating expansion driven by a stable cosmological constant, most cosmologists consider heat death the most likely eventual outcome over trillions of years.',
    evidenceFor: [
      'Consistent with the second law of thermodynamics applied on a cosmic scale.',
      'Matches current observations of accelerating expansion driven by a (so far) stable dark energy density.',
    ],
    evidenceAgainst: ['Depends on dark energy’s long-term behavior remaining constant, which isn’t fully confirmed.'],
    relatedTheoryIds: ['dark-energy-hypothesis', 'big-rip'],
  }),
  theory({
    id: 'big-rip', title: 'The Big Rip', category: 'cosmological',
    status: 'hypothesis', era: '2000s', proposedBy: 'Robert Caldwell, Marc Kamionkowski, and Nevin Weinberg', year: 2003, difficulty: 'advanced',
    summary: 'A hypothesized end state where dark energy grows strong enough over time to tear apart galaxies, stars, planets, and eventually atoms themselves.',
    beginnerExplanation: 'If dark energy’s push doesn’t just stay constant but actually gets stronger over time, the universe’s expansion could eventually become so violent that it rips apart galaxies, then solar systems, then planets — and finally atoms themselves, in the universe’s literal final moments. It’s one of several proposed "endings," and it depends on the exact nature of dark energy, which we still don’t fully understand.',
    advancedExplanation: 'The Big Rip scenario requires "phantom" dark energy, with an equation-of-state parameter w < -1, causing dark energy density to increase over time rather than remain constant. Under this scenario, cosmic expansion accelerates without bound, eventually overcoming every bound structure — from galaxy clusters down to atomic nuclei — at a finite time in the future.',
    evidenceFor: ['Some cosmological measurements have statistical uncertainty ranges that don’t fully rule out a phantom (w < -1) dark energy equation of state.'],
    evidenceAgainst: ['Measurements through the late 2010s were consistent with a simple cosmological constant (w = -1), not phantom energy — though 2024–2025 DESI results have introduced a preliminary hint that dark energy’s equation of state may be evolving rather than fixed, an unconfirmed but active area of research that specifically bears on whether phantom (w < -1) behavior is plausible.'],
    relatedTheoryIds: ['dark-energy-hypothesis', 'heat-death-of-the-universe'],
  }),
  theory({
    id: 'big-crunch', title: 'The Big Crunch', category: 'cosmological',
    status: 'disproven', era: '1900s', proposedBy: 'Alexander Friedmann (theoretical framework)', year: 1922, difficulty: 'intermediate',
    summary: 'A once-favored hypothesis that cosmic expansion would eventually reverse, pulling the universe back into a final collapse.',
    beginnerExplanation: 'Before dark energy was discovered, one popular idea about the universe’s end was that gravity would eventually win out — expansion would slow, stop, then reverse, pulling everything back together into a "Big Crunch," essentially the Big Bang running in reverse. The 1998 discovery that expansion is actually accelerating, not slowing, made this outcome look very unlikely.',
    advancedExplanation: 'A Big Crunch requires a universe with enough total mass-energy density (and no persistent repulsive dark energy) for gravity to eventually halt and reverse expansion, corresponding to a closed Friedmann-Lemaître-Robertson-Walker cosmology. Since 1998, precision measurements consistently show the expansion rate increasing, not decreasing, making a crunch inconsistent with current data under simple dark-energy models.',
    evidenceFor: ['Was a mathematically valid solution to Einstein’s field equations under a sufficiently dense, non-accelerating universe.'],
    evidenceAgainst: [
      'Type Ia supernova and CMB data show the universe’s expansion accelerating, the opposite of what a Big Crunch requires.',
      'Current best measurements of the universe’s total density and dark energy behavior don’t support an eventual recollapse.',
      'Depends on dark energy’s long-term behavior remaining as currently measured — 2024–2025 DESI observations show a preliminary, unconfirmed hint that its strength may not be constant, which would theoretically reopen this question if confirmed, though it does not change the current classification.',
    ],
    relatedTheoryIds: ['dark-energy-hypothesis', 'cyclic-universe-big-bounce'],
    relatedDiscoveryIds: ['dark-energy-confirmed'],
  }),

  // ── ASTROPHYSICS ─────────────────────────────────────────────────────────
  theory({
    id: 'general-relativity', title: 'General Relativity', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Albert Einstein', year: 1915, difficulty: 'intermediate',
    summary: 'Einstein’s theory describing gravity not as a force, but as the curvature of spacetime caused by mass and energy.',
    beginnerExplanation: 'Isaac Newton described gravity as a force pulling objects together. Einstein reimagined it completely: massive objects like stars and planets actually bend the fabric of space and time around them, and what we feel as gravity is really just objects following the curved paths created by that warped spacetime.',
    advancedExplanation: 'General relativity describes gravitation through the Einstein field equations, relating spacetime curvature (the metric tensor) to the distribution of mass-energy. It has passed every experimental test to date, from the precession of Mercury’s orbit to gravitational lensing, gravitational time dilation, and the direct detection of gravitational waves.',
    evidenceFor: [
      'Correctly predicted the anomalous precession of Mercury’s orbit, which Newtonian gravity couldn’t explain.',
      'Confirmed by the 1919 solar eclipse expedition observing starlight bending around the Sun.',
      'GPS satellites must correct for relativistic time dilation predicted by general relativity to remain accurate.',
      'Gravitational waves, predicted in 1916, were directly detected in 2015.',
    ],
    relatedTheoryIds: ['special-relativity', 'black-hole-existence', 'gravitational-waves-theory'],
    relatedDiscoveryIds: ['relativity-published', 'gravitational-waves-detected'],
    relatedModuleId: 'black-holes',
  }),
  theory({
    id: 'special-relativity', title: 'Special Relativity', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Albert Einstein', year: 1905, difficulty: 'intermediate',
    summary: 'Einstein’s earlier theory establishing that the speed of light is constant for all observers, and that space and time are relative, not absolute.',
    beginnerExplanation: 'Special relativity showed that measurements of space and time aren’t fixed the same way for everyone — they depend on how fast you’re moving relative to something else. The one constant, no matter your speed, is the speed of light. This leads to strange but experimentally confirmed effects, like time passing slower for someone moving very fast.',
    advancedExplanation: 'Special relativity is built on two postulates: the laws of physics are the same in all inertial reference frames, and the speed of light in a vacuum is constant regardless of the observer’s motion. It unifies space and time into a single four-dimensional spacetime and gives rise to time dilation, length contraction, and the mass-energy equivalence expressed as E = mc².',
    evidenceFor: [
      'Particle accelerators routinely confirm relativistic time dilation and mass-energy effects.',
      'Atomic clocks on fast-moving aircraft and satellites measurably tick slower, matching predictions.',
      'The mass-energy equivalence E = mc² underlies both nuclear power and the Sun’s own fusion energy output.',
    ],
    relatedTheoryIds: ['general-relativity'],
    relatedDiscoveryIds: ['relativity-published'],
  }),
  theory({
    id: 'stellar-evolution', title: 'Stellar Evolution', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Arthur Eddington and others', year: 1920, difficulty: 'beginner',
    summary: 'The well-established model describing how stars form, live, and die, based primarily on their initial mass.',
    beginnerExplanation: 'Stars aren’t static — they’re born inside collapsing clouds of gas, spend most of their lives steadily fusing hydrogen into helium, and eventually die in ways that depend almost entirely on how massive they were to begin with. Small stars fade quietly; massive stars often end in a violent supernova.',
    advancedExplanation: 'Stellar evolution models track a star’s structure and energy generation over time using the equations of stellar structure — hydrostatic equilibrium, energy transport, and nuclear reaction rates — as a function of initial mass and composition. Predictions match observed properties across the Hertzsprung-Russell diagram, star cluster ages, and the observed endpoints of stellar death (white dwarfs, neutron stars, black holes).',
    evidenceFor: [
      'Star clusters of known age show stars at exactly the evolutionary stage predicted by their mass.',
      'Observed white dwarfs, neutron stars, and stellar-mass black holes match predicted end states for stars of different masses.',
      'Solar neutrino measurements directly confirm the fusion reactions predicted to power the Sun.',
    ],
    relatedTheoryIds: ['stellar-nucleosynthesis'],
    relatedModuleId: 'stars-stellar-evolution',
  }),
  theory({
    id: 'stellar-nucleosynthesis', title: 'Stellar Nucleosynthesis', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Margaret Burbidge, Geoffrey Burbidge, William Fowler, Fred Hoyle (B²FH)', year: 1957, difficulty: 'intermediate',
    summary: 'The process by which stars fuse lighter elements into heavier ones, forging almost every element heavier than hydrogen and helium.',
    beginnerExplanation: 'Nearly every atom in your body heavier than hydrogen — the carbon, oxygen, calcium, iron — was forged inside a star, or in the explosion that ended one. Stars act as element factories, fusing simple atoms into more complex ones over their lifetimes, then scattering the results into space when they die.',
    advancedExplanation: 'The landmark 1957 B²FH paper laid out the processes by which stars synthesize elements: hydrogen and helium burning in main-sequence stars, the triple-alpha process forming carbon, and successive fusion stages up to iron in massive stars. Elements heavier than iron require energy-absorbing processes — neutron capture (s-process and r-process) — occurring in evolved stars and cataclysmic events like supernovae and neutron star mergers.',
    evidenceFor: [
      'The observed abundance pattern of elements in the universe closely matches predictions from stellar nucleosynthesis models.',
      'Spectroscopic analysis of stars at different ages shows heavier-element enrichment increasing over cosmic time, as predicted.',
      'The 2017 neutron star merger (GW170817) produced a kilonova whose spectra confirmed newly synthesized r-process elements — strontium and yttrium were directly identified; the event’s overall energetics are consistent with production of heavier r-process elements like gold and platinum too, though those specific elements haven’t been individually confirmed in the spectra.',
    ],
    relatedTheoryIds: ['stellar-evolution'],
    relatedModuleId: 'stars-stellar-evolution',
  }),
  theory({
    id: 'black-hole-existence', title: 'Black Hole Existence', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Karl Schwarzschild (mathematical solution); John Wheeler (coined the term)', year: 1916, difficulty: 'intermediate',
    summary: 'Regions of spacetime where gravity is so strong that nothing, not even light, can escape — now directly observed.',
    beginnerExplanation: 'Black holes were first predicted mathematically, as a strange consequence of Einstein’s equations, decades before anyone had direct evidence they were real. That changed decisively in the 2010s: gravitational wave detections and, in 2019, an actual image of a black hole’s silhouette, confirmed these objects genuinely exist.',
    advancedExplanation: 'The Schwarzschild solution to Einstein’s field equations described an object with an event horizon in 1916, though it was long considered a mathematical curiosity rather than a physically realizable object. Direct confirmation came from LIGO’s 2015 detection of gravitational waves from merging stellar-mass black holes, and the Event Horizon Telescope’s 2019 image of the supermassive black hole in galaxy M87.',
    evidenceFor: [
      'LIGO has directly detected gravitational waves from dozens of merging black hole pairs since 2015.',
      'The Event Horizon Telescope produced a direct image of a black hole’s silhouette (M87*) in 2019, and Sagittarius A* in 2022.',
      'Stars orbiting the center of the Milky Way show orbital motion that can only be explained by an unseen, extremely compact, supermassive object.',
    ],
    relatedTheoryIds: ['general-relativity', 'hawking-radiation', 'wormholes'],
    relatedDiscoveryIds: ['first-black-hole-image', 'gravitational-waves-detected'],
    relatedModuleId: 'black-holes',
  }),
  theory({
    id: 'neutron-stars', title: 'Neutron Stars', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Walter Baade and Fritz Zwicky (predicted)', year: 1934, difficulty: 'intermediate',
    summary: 'Ultra-dense stellar remnants, packing more mass than the Sun into a sphere roughly 20 km across.',
    beginnerExplanation: 'When a massive star runs out of fuel and its core collapses, gravity can crush the remaining matter so intensely that protons and electrons are forced together into neutrons — leaving behind a neutron star, a city-sized object so dense that a teaspoon of its material would weigh about a billion tons.',
    advancedExplanation: 'Neutron stars form from the core collapse of stars roughly 8 to 20 solar masses, with electron degeneracy pressure overcome and matter converted to a neutron-degenerate state supported against further collapse by neutron degeneracy pressure and the strong nuclear force. Their existence was predicted theoretically in 1934, just two years after the neutron’s discovery, and confirmed observationally via pulsars in 1967.',
    evidenceFor: [
      'Pulsars, discovered in 1967, are rapidly rotating neutron stars, directly confirming their existence.',
      'Neutron star mergers have been directly observed via both gravitational waves and electromagnetic radiation (GW170817, 2017).',
      'X-ray observations of neutron star surfaces match predicted mass-radius relationships.',
    ],
    relatedTheoryIds: ['pulsars-theory', 'magnetars'],
    relatedDiscoveryIds: ['pulsars-discovered'],
    relatedModuleId: 'neutron-stars-pulsars',
  }),
  theory({
    id: 'gravitational-waves-theory', title: 'Gravitational Waves', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Albert Einstein', year: 1916, difficulty: 'advanced',
    summary: 'Ripples in spacetime itself, predicted by general relativity, caused by massive accelerating objects like merging black holes.',
    beginnerExplanation: 'Einstein’s theory of gravity predicted that sufficiently violent cosmic events — like two black holes spiraling into each other — should send ripples through spacetime itself, stretching and squeezing space by an almost immeasurably tiny amount as they pass. Einstein himself doubted they’d ever actually be detectable.',
    advancedExplanation: 'Gravitational waves are perturbations in the spacetime metric that propagate at the speed of light, generated by time-varying mass quadrupole moments — most detectably from merging compact binaries (black holes, neutron stars). Detection requires interferometers sensitive to length changes far smaller than a proton’s width across kilometers-long detector arms, achieved by LIGO in 2015.',
    evidenceFor: [
      'Directly detected by LIGO in 2015, exactly matching general relativity’s predicted waveform for a black hole merger.',
      'Dozens of further detections since, including a neutron star merger observed in both gravitational waves and light (2017).',
    ],
    relatedTheoryIds: ['general-relativity', 'black-hole-existence'],
    relatedDiscoveryIds: ['gravitational-waves-detected'],
    relatedModuleId: 'gravitational-waves',
  }),
  theory({
    id: 'hawking-radiation', title: 'Hawking Radiation', category: 'astrophysics',
    status: 'hypothesis', era: '1900s', proposedBy: 'Stephen Hawking', year: 1974, difficulty: 'advanced',
    summary: 'A theoretical prediction that black holes slowly emit radiation and, over immense timescales, evaporate entirely.',
    beginnerExplanation: 'Black holes are supposed to trap everything, including light — but Stephen Hawking showed that quantum effects near a black hole’s edge should let it slowly leak radiation and lose mass over time. Given enough time (an almost unimaginably long time for anything but the smallest black holes), a black hole could eventually evaporate away completely.',
    advancedExplanation: 'Hawking radiation arises from quantum field theory applied near a black hole’s event horizon: virtual particle-antiparticle pairs occasionally separate, with one falling in and the other escaping as real radiation, carrying away mass-energy. The predicted radiation is so faint for stellar-mass or larger black holes (temperature inversely proportional to mass) that it’s far below any current detection threshold.',
    evidenceFor: [
      'Follows from well-established quantum field theory applied to curved spacetime near an event horizon.',
      'Resolves aspects of black hole thermodynamics, giving black holes a well-defined temperature and entropy.',
    ],
    evidenceAgainst: [
      'Never directly observed — predicted radiation from any known astrophysical black hole is far too faint to detect with current instruments.',
      'The "black hole information paradox" it raises is still not fully resolved theoretically.',
    ],
    relatedTheoryIds: ['black-hole-existence', 'general-relativity'],
    relatedModuleId: 'black-holes',
  }),
  theory({
    id: 'wormholes', title: 'Wormholes', category: 'astrophysics',
    status: 'hypothesis', era: '1900s', proposedBy: 'Albert Einstein and Nathan Rosen', year: 1935, difficulty: 'advanced',
    summary: 'Hypothetical tunnels through spacetime that could connect two distant points, allowed mathematically by general relativity but never observed.',
    beginnerExplanation: 'General relativity’s equations technically allow for shortcuts through spacetime — tunnels that could, in principle, connect two far-apart points in the universe almost instantly. No wormhole has ever been observed, and most physicists think that even if they exist, keeping one open and stable would require an exotic form of matter we’ve never detected.',
    advancedExplanation: 'The Einstein-Rosen bridge was an early mathematical solution connecting two black hole spacetimes, but such a solution is not traversable — it collapses too quickly for anything to cross. Traversable wormhole proposals (Morris-Thorne, 1988) require "exotic matter" with negative energy density to hold the throat open, a form of matter never observed and possibly disallowed by quantum energy conditions.',
    evidenceFor: ['Mathematically permitted as valid solutions to Einstein’s field equations.'],
    evidenceAgainst: [
      'No observational evidence for wormholes of any kind has ever been found.',
      'Traversable wormholes require exotic negative-energy matter that has never been detected and may not be physically possible in the needed quantities.',
    ],
    relatedTheoryIds: ['general-relativity', 'white-holes'],
  }),
  theory({
    id: 'white-holes', title: 'White Holes', category: 'astrophysics',
    status: 'hypothesis', era: '1900s', proposedBy: 'Igor Novikov', year: 1964, difficulty: 'advanced',
    summary: 'A theoretical mirror image of a black hole — a region that can only expel matter and light, never absorb them.',
    beginnerExplanation: 'If a black hole is a one-way door that only lets things in, a white hole is the mathematical opposite: a one-way door that only lets things out, and nothing can ever fall in. They emerge as a valid solution to the same equations that describe black holes, but there’s no evidence any have ever actually formed in nature.',
    advancedExplanation: 'White holes arise as the time-reversed solution of the same Schwarzschild/Kerr metrics that describe black holes, since general relativity’s field equations are time-symmetric. Most physicists consider white holes physically implausible, since they would require extremely fine-tuned, non-generic initial conditions that no known astrophysical process could produce.',
    evidenceFor: ['A mathematically valid, time-reversed solution to the same equations that produce black holes.'],
    evidenceAgainst: [
      'No observational evidence exists for any white hole.',
      'Considered physically implausible by most physicists due to the extreme fine-tuning their formation would require.',
    ],
    relatedTheoryIds: ['black-hole-existence', 'wormholes'],
  }),
  theory({
    id: 'magnetars', title: 'Magnetars', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Robert Duncan and Christopher Thompson', year: 1992, difficulty: 'intermediate',
    summary: 'A rare type of neutron star with an almost incomprehensibly powerful magnetic field, trillions of times stronger than Earth’s.',
    beginnerExplanation: 'Magnetars are an extreme variety of neutron star with magnetic fields trillions of times stronger than anything on Earth — powerful enough that, at close range, they could theoretically scramble the atoms in a human body. Sudden shifts in their magnetic fields can trigger enormous bursts of X-rays and gamma rays.',
    advancedExplanation: 'Magnetars are believed to form from the collapse of rapidly rotating, strongly magnetized progenitor stars, with a dynamo effect amplifying the magnetic field during the neutron star’s formation to strengths of 10^14 to 10^15 gauss. Sudden magnetic field reconfigurations ("starquakes") release enormous bursts of X-rays and soft gamma rays, observed as soft gamma repeaters and anomalous X-ray pulsars.',
    evidenceFor: [
      'Directly observed via their characteristic X-ray and gamma-ray burst emissions since the 1990s.',
      'Measured spin-down rates of known magnetars imply magnetic field strengths consistent with theoretical predictions.',
    ],
    relatedTheoryIds: ['neutron-stars'],
    relatedModuleId: 'neutron-stars-pulsars',
  }),
  theory({
    id: 'quasars', title: 'Quasars', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Maarten Schmidt (identified their true nature)', year: 1963, difficulty: 'intermediate',
    summary: 'Extremely luminous, distant objects now understood to be supermassive black holes actively feeding on surrounding matter.',
    beginnerExplanation: 'Quasars were first spotted as strange, star-like points of light that didn’t make sense — until astronomers realized their light was extremely redshifted, meaning they were billions of light-years away, yet still brighter than entire galaxies. We now understand them as supermassive black holes at galaxy centers, blazing with light as infalling matter heats up before crossing the event horizon.',
    advancedExplanation: 'Quasars are the most luminous class of active galactic nucleus, powered by accretion onto a supermassive black hole, with infalling material forming a superheated accretion disk radiating across the electromagnetic spectrum. Their extreme redshifts place most known quasars in the early universe, making them valuable probes of galaxy and black hole co-evolution.',
    evidenceFor: [
      'Spectroscopic redshift measurements confirm quasars are among the most distant, and therefore earliest, objects observed.',
      'Their luminosity and rapid variability are only explainable by accretion onto a compact supermassive object.',
    ],
    relatedTheoryIds: ['black-hole-existence'],
  }),
  theory({
    id: 'pulsars-theory', title: 'Pulsars', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Franco Pacini (1967, predicted before pulsars were discovered) and Thomas Gold (1968, applied directly to the observed pulsar signal)', year: 1968, difficulty: 'intermediate',
    summary: 'The confirmed explanation that pulsars are rapidly rotating, highly magnetized neutron stars sweeping beams of radiation past Earth like a lighthouse.',
    beginnerExplanation: 'When the first pulsar was discovered in 1967, its impossibly regular radio pulses briefly seemed almost artificial. Astrophysicist Franco Pacini had actually predicted, just months earlier, that a rotating, magnetized neutron star could power a nebula like the Crab — and after the pulsar discovery, Thomas Gold independently proposed the same rotating-neutron-star model to explain the pulses directly: a spinning neutron star beams radiation from its poles, and as it spins — sometimes hundreds of times per second — that beam sweeps past Earth again and again, like a lighthouse.',
    advancedExplanation: 'The lighthouse model explains pulsar periodicity as the rotational period of a highly magnetized neutron star whose magnetic axis is misaligned with its rotation axis, producing a beamed radiation pattern observed as pulses whenever the beam crosses our line of sight. Precise, stable pulsar timing has since become a tool for testing general relativity and searching for gravitational waves.',
    evidenceFor: [
      'Pulse periods match precisely with the predicted rotation rates of collapsed neutron star cores.',
      'Pulsar timing has been used to indirectly confirm energy loss to gravitational waves in binary pulsar systems (Hulse-Taylor pulsar, 1974).',
    ],
    relatedTheoryIds: ['neutron-stars'],
    relatedDiscoveryIds: ['pulsars-discovered'],
    relatedModuleId: 'neutron-stars-pulsars',
  }),
  theory({
    id: 'gamma-ray-bursts', title: 'Gamma Ray Bursts', category: 'astrophysics',
    status: 'proven', era: '1900s', proposedBy: 'Vela satellite program (US Department of Defense)', year: 1967, difficulty: 'advanced',
    summary: 'Extremely energetic explosions, briefly the brightest events in the universe, now linked to collapsing massive stars and neutron star mergers.',
    beginnerExplanation: 'Gamma-ray bursts are the most powerful explosions known in the universe — for a few seconds to minutes, a single burst can outshine an entire galaxy. They were first spotted accidentally by satellites built to watch for secret nuclear tests on Earth, and it took decades to figure out they were actually coming from deep space.',
    advancedExplanation: 'Long-duration gamma-ray bursts (over ~2 seconds) are associated with the core collapse of massive, rapidly rotating stars into black holes ("collapsars"), while short-duration bursts are linked to neutron star mergers, confirmed directly by the 2017 GW170817 multi-messenger observation. Their cosmological origin was only firmly established in 1997, three decades after their accidental discovery.',
    evidenceFor: [
      'Afterglow observations have pinpointed long GRBs to distant star-forming galaxies, consistent with massive star collapse.',
      'The 2017 neutron star merger GW170817 was observed with a coincident short gamma-ray burst, directly confirming that progenitor model.',
    ],
    relatedTheoryIds: ['black-hole-existence', 'neutron-stars'],
  }),
  theory({
    id: 'drake-equation', title: 'The Drake Equation', category: 'astrophysics',
    status: 'hypothesis', era: '1900s', proposedBy: 'Frank Drake', year: 1961, difficulty: 'intermediate',
    summary: 'A famous probabilistic formula estimating the number of communicating civilizations in the galaxy, built from a chain of uncertain factors.',
    beginnerExplanation: 'The Drake Equation is a way of breaking down a huge question — "how many alien civilizations could we detect?" — into a series of smaller estimates, like how many stars have planets, how many of those planets could support life, and how long a civilization might broadcast detectable signals before it goes silent. It’s not a prediction so much as a framework for organizing what we don’t yet know.',
    advancedExplanation: 'The equation multiplies factors including star formation rate, the fraction of stars with planets, the number of habitable planets per system, the fraction developing life, intelligence, and detectable technology, and the average lifetime of a communicating civilization. Most of these terms remain poorly constrained by observation, so the equation’s output can range from "we are likely alone" to "the galaxy should be teeming with life" depending on assumptions.',
    evidenceFor: ['Provides a structured way to incorporate new exoplanet data as it becomes available, several terms of which are now measured far better than in 1961.'],
    evidenceAgainst: [
      'Several key terms (fraction of life-bearing planets that develop intelligence, average civilization lifetime) remain essentially unconstrained guesses.',
      'The complete absence of confirmed contact so far (the "Fermi Paradox") is itself unexplained by the equation.',
    ],
    relatedDiscoveryIds: ['first-exoplanet-discovered'],
    relatedModuleId: 'exoplanets-search-for-life',
  }),

  // ── PLANETARY SCIENCE ────────────────────────────────────────────────────
  theory({
    id: 'nebular-hypothesis', title: 'Nebular Hypothesis', category: 'planetary',
    status: 'strong-evidence', era: 'pre-1900', proposedBy: 'Immanuel Kant and Pierre-Simon Laplace', year: 1755, difficulty: 'beginner',
    summary: 'The widely accepted model that the solar system formed from a collapsing, rotating cloud of gas and dust.',
    beginnerExplanation: 'About 4.6 billion years ago, a giant cloud of gas and dust began collapsing under its own gravity, likely nudged along by a nearby exploding star. As it collapsed, it flattened into a spinning disk — most material fell to the center and became the Sun, while the rest gradually clumped together into planets, moons, and everything else in the solar system.',
    advancedExplanation: 'The nebular hypothesis describes solar system formation from a collapsing molecular cloud fragment, conserving angular momentum into a flattened protoplanetary disk. Planetesimal accretion within this disk, differentiated by the frost line separating rocky from icy/gaseous material, explains the observed layout of terrestrial planets close to the Sun and gas/ice giants farther out. Kant proposed the initial version in 1755; Laplace independently developed a similar model four decades later, in 1796 — the pairing is often called the Kant-Laplace hypothesis despite the gap.',
    evidenceFor: [
      'Protoplanetary disks have been directly observed around young stars (e.g. by ALMA and JWST), matching the model’s predicted structure.',
      'All planets orbit in nearly the same plane and direction, consistent with formation from a single flattened disk.',
      'Meteorite radiometric dating consistently places solar system formation at ~4.6 billion years ago.',
    ],
    relatedTheoryIds: ['giant-impact-hypothesis'],
    relatedModuleId: 'our-solar-system',
  }),
  theory({
    id: 'giant-impact-hypothesis', title: 'Giant Impact Hypothesis', category: 'planetary',
    status: 'strong-evidence', era: '1900s', proposedBy: 'William Hartmann and Donald Davis; Alastair Cameron and William Ward', year: 1975, difficulty: 'beginner',
    summary: 'The leading explanation for the Moon’s origin: a Mars-sized body collided with the early Earth, and the debris coalesced into the Moon.',
    beginnerExplanation: 'The leading theory for how the Moon formed is that, early in Earth’s history, a Mars-sized object (often nicknamed Theia) slammed into the young Earth. The collision blasted enormous amounts of debris into orbit, which gradually clumped together under gravity to form the Moon.',
    advancedExplanation: 'The giant-impact hypothesis explains several otherwise puzzling lunar properties: its relatively small iron core (most impactor and proto-Earth core material remained on Earth), its chemical similarity to Earth’s mantle in oxygen isotope ratios, and its angular momentum. Ongoing refinements address a remaining puzzle — the near-identical isotopic composition between Earth and Moon is closer than simple impact simulations originally predicted. Hartmann and Davis proposed the hypothesis in 1975; Cameron and Ward independently presented a similar model the following year, in 1976.',
    evidenceFor: [
      'Apollo lunar samples show oxygen isotope ratios nearly identical to Earth’s mantle.',
      'The Moon has a disproportionately small iron core compared to Earth, consistent with forming mostly from mantle-derived debris.',
      'Computer simulations of a Mars-sized impact can reproduce the Earth-Moon system’s current angular momentum.',
    ],
    evidenceAgainst: ['The near-perfect isotopic match between Earth and Moon is harder to reproduce in simulations than originally expected, an active area of refinement.'],
    relatedTheoryIds: ['nebular-hypothesis'],
    relatedModuleId: 'earths-moon',
  }),
  theory({
    id: 'late-heavy-bombardment', title: 'Late Heavy Bombardment', category: 'planetary',
    status: 'debated', era: '1900s', proposedBy: 'Fouad Tera, D.A. Papanastassiou, and Gerald Wasserburg', year: 1974, difficulty: 'advanced',
    summary: 'A hypothesized spike in asteroid and comet impacts across the inner solar system roughly 4.1–3.8 billion years ago.',
    beginnerExplanation: 'For a while, scientists thought the inner solar system experienced a dramatic surge in asteroid and comet impacts several hundred million years after the planets formed — based on the ages of impact craters dated from Apollo Moon rocks all clustering around the same time. More recent research has cast doubt on whether this was really a distinct spike, or just an ongoing decline in impacts that looked that way in a limited sample.',
    advancedExplanation: 'The original hypothesis rests on radiometric ages of Apollo-returned lunar impact melt samples clustering around 3.8–4.1 billion years ago, interpreted as evidence of an impact spike, potentially triggered by orbital migration of the giant planets (the "Nice model"). More recent reanalysis suggests sample-selection bias (Apollo sites cluster near one large basin) may have created an apparent spike from what was actually a smoothly declining impact rate.',
    evidenceFor: [
      'Apollo lunar sample ages cluster suspiciously around 3.8–4.1 billion years.',
      'The Nice model provides a plausible dynamical mechanism (giant planet migration destabilizing small body orbits) for a genuine bombardment spike.',
    ],
    evidenceAgainst: [
      'Apollo landing sites are geographically clustered near one large impact basin, potentially biasing the sample toward one event’s ejecta rather than a global spike.',
      'Some more recent crater-count and sample studies favor a smoothly declining impact rate instead of a distinct spike.',
    ],
    relatedTheoryIds: ['giant-impact-hypothesis'],
    relatedDiscoveryIds: ['moon-landing'],
  }),
  theory({
    id: 'panspermia', title: 'Panspermia', category: 'planetary',
    status: 'hypothesis', era: '1900s', proposedBy: 'Svante Arrhenius (modern formulation)', year: 1908, difficulty: 'intermediate',
    summary: 'The idea that microbial life, or the chemical precursors to life, could travel between planets or star systems aboard asteroids, comets, or dust.',
    beginnerExplanation: 'Panspermia is the idea that life — or at least the raw chemical ingredients for life — didn’t necessarily have to start fresh on every planet that has it. Instead, hardy microorganisms or complex organic molecules could hitch a ride on asteroids, comets, or dust, seeding new worlds when they land.',
    advancedExplanation: 'Panspermia proposes interplanetary or interstellar transfer of biological material, requiring organisms or complex prebiotic chemistry to survive the vacuum, radiation, and thermal extremes of space travel and atmospheric entry. Confirmed meteorite exchange between Mars and Earth demonstrates the transport mechanism is physically possible; whether viable organisms could survive the trip remains unconfirmed.',
    evidenceFor: [
      'Certain extremophile microorganisms and bacterial spores have survived simulated space conditions in laboratory and low-orbit experiments.',
      'Meteorites from Mars have been confirmed reaching Earth, proving interplanetary material transfer genuinely occurs.',
      'Complex organic molecules, including amino acids, have been found in meteorites and comets.',
    ],
    evidenceAgainst: [
      'No evidence of viable, living organisms has ever been found aboard a meteorite or comet.',
      'Doesn’t explain the origin of life, only proposes a mechanism for spreading it once it exists somewhere.',
    ],
    relatedTheoryIds: ['ocean-worlds-life'],
  }),
  theory({
    id: 'planet-nine', title: 'Planet Nine', category: 'planetary',
    status: 'hypothesis', era: '2000s', proposedBy: 'Konstantin Batygin and Mike Brown', year: 2016, difficulty: 'advanced',
    summary: 'A hypothesized large, undiscovered planet in the outer solar system, inferred from the unusual clustering of distant icy objects’ orbits.',
    beginnerExplanation: 'Several small, extremely distant icy objects beyond Neptune have oddly similar, clustered orbits that seem unlikely to happen by chance. One explanation is a large, undiscovered planet — nicknamed "Planet Nine" — far beyond Pluto, whose gravity is shepherding those objects into their unusual alignment. No one has actually found it yet.',
    advancedExplanation: 'The clustering of perihelion arguments and orbital orientations among several extreme trans-Neptunian objects is statistically difficult to explain by chance alone, motivating models with a distant, super-Earth-mass planet (estimated 5–10 Earth masses at hundreds of AU) gravitationally shepherding these orbits. Wide-field sky surveys have progressively ruled out large swaths of the predicted search region without a detection.',
    evidenceFor: [
      'The orbital clustering of several extreme trans-Neptunian objects is statistically unlikely to occur by chance.',
      'A distant massive planet is a physically plausible explanation supported by orbital dynamics simulations.',
    ],
    evidenceAgainst: [
      'No direct observation of Planet Nine has been made despite years of dedicated searching.',
      'Alternative explanations, including observational selection bias in how these distant objects were discovered, could also account for the clustering.',
      'The 2023 discovery of the sednoid 2023 KQ14 ("Ammonite"), whose orbit doesn’t align with the other clustered trans-Neptunian objects, has weakened the original clustering argument.',
    ],
  }),
  theory({
    id: 'ocean-worlds-life', title: 'Ocean Worlds & the Search for Life (Europa/Enceladus)', category: 'planetary',
    status: 'hypothesis', era: '1900s', proposedBy: 'Multiple (informed by Galileo and Cassini mission data)', year: 1998, difficulty: 'intermediate',
    summary: 'The hypothesis that subsurface oceans on icy moons like Europa and Enceladus could harbor conditions suitable for microbial life.',
    beginnerExplanation: 'Some of the most promising places to look for life beyond Earth aren’t planets at all — they’re icy moons like Jupiter’s Europa and Saturn’s Enceladus, which appear to hide vast liquid water oceans under their frozen surfaces, kept warm by tidal heating rather than sunlight. Whether those oceans actually host life is completely unknown, but they have the key ingredients we associate with habitability.',
    advancedExplanation: 'Tidal flexing from a moon’s eccentric orbit generates internal heat sufficient to maintain a liquid water layer beneath an ice shell, potentially in contact with a rocky seafloor enabling hydrothermal chemistry — a combination considered promising for prebiotic or biological chemistry. Europa’s ocean was first inferred from Galileo imaging and magnetometer data published in 1998; Cassini later directly sampled Enceladus’s water-ice plumes after arriving at Saturn in 2004, detecting organic molecules and evidence of hydrothermal activity starting in 2005.',
    evidenceFor: [
      'Cassini detected organic molecules and silica particles in Enceladus’s plumes, consistent with hydrothermal activity.',
      'Europa’s induced magnetic field strongly indicates a global subsurface saltwater ocean.',
      'Both moons have the three ingredients considered essential for life as we know it: liquid water, chemical energy, and organic molecules.',
    ],
    evidenceAgainst: [
      'No direct evidence of biological activity, or life itself, has been found on either moon.',
      'The Europa Clipper and other planned missions are designed to investigate habitability, not directly search for organisms.',
    ],
    relatedTheoryIds: ['panspermia'],
    relatedDiscoveryIds: ['europa-water-vapor-detected'],
    relatedModuleId: 'exoplanets-search-for-life',
  }),
  theory({
    id: 'mars-liquid-water', title: 'Liquid Water on Mars', category: 'planetary',
    status: 'strong-evidence', era: '1900s', proposedBy: 'Multiple (NASA rover and orbiter missions)', year: 1971, difficulty: 'beginner',
    summary: 'Strong geological evidence that Mars once had abundant liquid water on its surface, with more limited, debated evidence for water today.',
    beginnerExplanation: 'Mars is bone dry today, with an atmosphere far too thin to support liquid water on its surface for long. But dried-up riverbeds, ancient lakebeds, and specific mineral deposits that only form in water show that Mars once had abundant liquid water, billions of years ago. Whether any liquid water still exists on or near the surface today is a much more actively debated question.',
    advancedExplanation: 'Orbital and rover-based observations of fluvial and lacustrine landforms, along with detection of clay minerals and hydrated sulfates that require liquid water to form, provide strong evidence of a wetter early Mars roughly 3.5–4 billion years ago. Claimed present-day evidence, like recurring slope lineae and a possible subsurface lake detected by radar near the south pole, remains more contested and could have alternative explanations like dry granular flows.',
    evidenceFor: [
      'Mariner 9 (1971) returned the first images of dried river channels and valley networks, later reinforced by the Viking orbiters (1976–1980).',
      'Rover missions have found ancient lakebed sediments, river delta formations, and water-formed mineral deposits across multiple Mars locations.',
      'In 2000, Mars Global Surveyor imaging revealed gully features suggesting possible, geologically recent water activity — a separate, more contested claim from the ancient-water evidence above.',
      'Orbital radar has detected what may be a briny subsurface lake near Mars’s south pole.',
    ],
    evidenceAgainst: [
      'Present-day surface temperatures and atmospheric pressure make stable liquid water on the surface today essentially impossible for extended periods.',
      'The interpretation of recurring slope lineae as liquid water flows has been challenged by studies favoring a dry-sand explanation instead.',
    ],
    relatedTheoryIds: ['ocean-worlds-life'],
    relatedDiscoveryIds: ['water-on-mars-evidence'],
    relatedModuleId: 'future-space-exploration',
  }),
  theory({
    id: 'venus-oceans', title: 'Ancient Venus Oceans', category: 'planetary',
    status: 'debated', era: '2000s', proposedBy: 'Michael Way and colleagues (NASA GISS climate modeling)', year: 2016, difficulty: 'advanced',
    summary: 'The hypothesis that early Venus may have had a temperate climate and liquid water oceans for billions of years before a runaway greenhouse effect took hold.',
    beginnerExplanation: 'It seems hard to believe today, given how scorching Venus is, but some climate models suggest early Venus may have actually had liquid water oceans and a relatively mild climate for as long as 2-3 billion years — before something (possibly intense volcanic activity) triggered a runaway greenhouse effect that boiled the oceans away and left the hellish planet we see now.',
    advancedExplanation: 'Climate models incorporating Venus’s slow rotation rate suggest cloud patterns that could have shielded an early ocean from runaway heating for billions of years, until a resurfacing event or other trigger released enough carbon dioxide to tip the climate into a runaway greenhouse state. The hypothesis is difficult to test directly, since Venus’s surface has been extensively resurfaced by volcanism, erasing most direct geological evidence of an ancient ocean.',
    evidenceFor: [
      'Climate models show a stable, habitable early Venus scenario is physically plausible given its slow rotation.',
      'Venus’s deuterium-to-hydrogen ratio is much higher than Earth’s, consistent with having lost a large amount of water to space over time.',
    ],
    evidenceAgainst: [
      'No direct geological evidence remains, since Venus’s surface has been almost entirely resurfaced by volcanism within the last ~700 million years.',
      'Alternative models suggest Venus may never have cooled enough to have surface oceans at all, remaining in a runaway greenhouse state from formation.',
      'A 2024 analysis of volcanic outgassing found Venusian eruption gases contain no more than ~6% water vapor, suggesting a dry interior inconsistent with ever having sustained large oceans.',
    ],
  }),
  theory({
    id: 'earth-water-from-asteroids', title: 'Earth’s Water from Asteroids', category: 'planetary',
    status: 'debated', era: '2000s', proposedBy: 'Multiple (isotope-ratio studies)', year: 2000, difficulty: 'advanced',
    summary: 'The hypothesis that most of Earth’s water arrived after formation, delivered by water-rich asteroids (or comets) rather than forming with the planet.',
    beginnerExplanation: 'Earth formed close enough to the Sun that most of its original building material should have been too hot and dry to include much water. So where did Earth’s oceans come from? The leading idea is that water-rich asteroids — not comets, as once thought — crashed into the young Earth and delivered most of its water after the planet had already formed.',
    advancedExplanation: 'The ratio of deuterium to hydrogen in Earth’s oceans closely matches carbonaceous chondrite asteroids, but differs significantly from most measured comets, favoring asteroids as the dominant water source. Sample-return missions (Hayabusa2 to Ryugu, OSIRIS-REx to Bennu) are directly testing this by measuring isotope ratios in pristine asteroid material rather than relying solely on meteorite proxies.',
    evidenceFor: [
      'Earth’s ocean deuterium-to-hydrogen ratio closely matches carbonaceous chondrite meteorites.',
      'Sample-return missions to asteroids Ryugu and Bennu have confirmed the presence of water-bearing minerals and organic compounds.',
    ],
    evidenceAgainst: [
      'Some comets (like comet 67P/Churyumov-Gerasimenko, sampled by Rosetta) show a deuterium ratio very different from Earth’s oceans, complicating a simple "comets delivered the water" story either way.',
      'The precise mix of asteroid versus comet contribution, and how much water Earth may have retained from formation itself, is still actively debated.',
    ],
    relatedTheoryIds: ['nebular-hypothesis'],
  }),
  theory({
    id: 'impact-extinction-hypothesis', title: 'Impact Extinction Hypothesis', category: 'planetary',
    status: 'strong-evidence', era: '1900s', proposedBy: 'Luis Alvarez, Walter Alvarez, Frank Asaro, and Helen Michel', year: 1980, difficulty: 'beginner',
    summary: 'The theory that a large asteroid or comet impact 66 million years ago triggered the mass extinction that ended the age of dinosaurs.',
    beginnerExplanation: 'About 66 million years ago, something wiped out roughly three-quarters of all species on Earth, including every non-avian dinosaur. The leading explanation is a massive asteroid or comet impact, which threw enormous amounts of dust and debris into the atmosphere, blocking sunlight and collapsing food chains around the planet for years.',
    advancedExplanation: 'The hypothesis is anchored by a global layer of iridium-enriched sediment at the Cretaceous-Paleogene boundary, an element rare in Earth’s crust but common in asteroids, combined with the discovery of the roughly 150-km-wide Chicxulub crater in present-day Mexico, dated to the same time. Shocked quartz and impact glass (tektites) found worldwide at the same geological layer provide further direct physical confirmation of an impact event.',
    evidenceFor: [
      'A global iridium-rich sediment layer marks the exact extinction boundary worldwide.',
      'The Chicxulub crater, dated to precisely 66 million years ago, is the right size and age to have caused a global catastrophe.',
      'Shocked quartz and impact glass are found in the same sediment layer at sites across the globe.',
    ],
    evidenceAgainst: ['Some researchers argue massive volcanic activity (the Deccan Traps in India) contributed significantly to the extinction alongside, or instead of, the impact.'],
    relatedModuleId: 'asteroids-comets',
  }),
]

const RAW_DISCOVERIES = [
  // ── ANCIENT – 1800s ──────────────────────────────────────────────────────
  discovery({
    id: 'heliocentrism', title: 'Heliocentrism Proposed', era: 'pre-1900', proposedBy: 'Nicolaus Copernicus', year: 1543,
    summary: 'Proposed that the Sun, not Earth, is the center of the solar system, overturning over a thousand years of geocentric belief.',
    beginnerExplanation: 'For centuries, most people believed Earth sat motionless at the center of the universe, with everything else orbiting around it. Copernicus proposed the opposite: Earth and the other planets actually orbit the Sun. It was a radical, controversial idea that took another century to become widely accepted.',
    advancedExplanation: 'Copernicus’s De revolutionibus orbium coelestium (1543) proposed a Sun-centered model that better explained planetary retrograde motion than the prevailing Ptolemaic geocentric system, though it still relied on circular orbits and required further refinement by Kepler decades later.',
    relatedModuleId: 'our-solar-system',
  }),
  discovery({
    id: 'jupiters-moons-discovered', title: 'Jupiter’s Moons Discovered', era: 'pre-1900', proposedBy: 'Galileo Galilei', year: 1610,
    summary: 'Galileo’s discovery of four moons orbiting Jupiter provided the first direct observational evidence that not everything orbits Earth.',
    beginnerExplanation: 'Using one of the first astronomical telescopes, Galileo spotted four small points of light near Jupiter that moved night after night — moons orbiting another planet, not Earth. It was powerful evidence supporting the heliocentric model, since it proved at least some things clearly didn’t orbit Earth.',
    advancedExplanation: 'The discovery of the four Galilean moons (Io, Europa, Ganymede, Callisto) directly contradicted the geocentric assumption that all celestial motion centered on Earth, becoming one of the most persuasive early observational arguments for Copernican heliocentrism.',
    relatedModuleId: 'outer-planets',
  }),
  discovery({
    id: 'saturns-rings-discovered', title: 'Saturn’s Rings Identified', era: 'pre-1900', proposedBy: 'Christiaan Huygens', year: 1655,
    summary: 'Huygens correctly identified the strange appendages Galileo had seen around Saturn decades earlier as a flat ring system.',
    beginnerExplanation: 'Galileo had seen odd bulges around Saturn back in 1610 but couldn’t explain them with his primitive telescope. With better optics, Huygens correctly figured out in 1655 that Saturn is surrounded by a thin, flat ring, not attached to the planet.',
    advancedExplanation: 'Huygens’s improved telescope resolved what earlier observers (including Galileo) had seen only as ambiguous appendages, correctly describing them as a single flat ring encircling Saturn without touching it — a description later refined by Cassini, who identified a gap within the rings in 1675.',
    relatedModuleId: 'outer-planets',
  }),
  discovery({
    id: 'keplers-laws', title: 'Kepler’s Laws of Planetary Motion', era: 'pre-1900', proposedBy: 'Johannes Kepler', year: 1609,
    summary: 'Three mathematical laws describing planetary orbits as ellipses, replacing the assumption that orbits must be perfect circles.',
    beginnerExplanation: 'Kepler analyzed decades of extremely precise observational data and discovered that planets don’t move in perfect circles, as everyone had assumed — they move in ellipses, speeding up when closer to the Sun and slowing down when farther away. His first two laws, published in 1609, gave heliocentrism the precise mathematical backbone it had been missing; the third law followed a decade later, in 1619.',
    advancedExplanation: 'Kepler’s three laws — elliptical orbits with the Sun at one focus, equal areas swept in equal times, and the relationship between orbital period and semi-major axis — were derived empirically from Tycho Brahe’s naked-eye observational data and later shown by Newton to follow directly from the inverse-square law of gravity. Note the single 1609 date above covers only the first two laws, published in Astronomia Nova; the third law (period-squared proportional to semi-major-axis-cubed) wasn’t published until a decade later, in Harmonices Mundi (1619).',
    relatedModuleId: 'our-solar-system',
  }),
  discovery({
    id: 'newtons-law-of-gravitation', title: 'Newton’s Law of Universal Gravitation', era: 'pre-1900', proposedBy: 'Isaac Newton', year: 1687,
    summary: 'Newton’s law describing gravity as a universal force of attraction between any two masses, unifying terrestrial and celestial motion.',
    beginnerExplanation: 'Newton showed that the same force pulling an apple to the ground also keeps the Moon in orbit around Earth and the planets in orbit around the Sun — one universal rule governing gravity everywhere, not separate rules for the heavens and the Earth.',
    advancedExplanation: 'Published in the Principia Mathematica, Newton’s law of universal gravitation states that every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them, mathematically deriving Kepler’s empirical laws as a consequence.',
    relatedModuleId: 'our-solar-system',
  }),
  discovery({
    id: 'uranus-discovered', title: 'Uranus Discovered', era: 'pre-1900', proposedBy: 'William Herschel', year: 1781,
    summary: 'The first planet discovered using a telescope, doubling the known size of the solar system overnight.',
    beginnerExplanation: 'Every planet visible to the naked eye had been known since ancient times. That changed in 1781, when William Herschel spotted a faint object through his telescope that turned out to be an entirely new planet — Uranus — roughly doubling the known size of the solar system.',
    advancedExplanation: 'Herschel initially believed he had discovered a comet, but further orbital tracking confirmed a nearly circular orbit well beyond Saturn, establishing it as the first planet discovered in recorded history using a telescope rather than the naked eye.',
    relatedModuleId: 'outer-planets',
  }),
  discovery({
    id: 'neptune-discovered', title: 'Neptune Discovered', era: 'pre-1900', proposedBy: 'Urbain Le Verrier (predicted); Johann Galle (observed)', year: 1846,
    summary: 'The first planet discovered through mathematical prediction — astronomers calculated its position from Uranus’s orbital irregularities before ever seeing it.',
    beginnerExplanation: 'Uranus’s orbit wasn’t behaving exactly as predicted, and astronomers suspected the gravity of an undiscovered planet was tugging on it. Urbain Le Verrier calculated exactly where that planet should be — and when Johann Galle pointed a telescope at those coordinates, Neptune was sitting almost exactly where the math said it would be.',
    advancedExplanation: 'Le Verrier’s prediction, based on perturbation analysis of Uranus’s orbit under Newtonian gravity, placed Neptune within about 1 degree of its actual position — a landmark triumph for celestial mechanics and a powerful confirmation of Newtonian gravity’s predictive power.',
    relatedModuleId: 'outer-planets',
  }),
  discovery({
    id: 'speed-of-light-measured', title: 'Speed of Light First Measured', era: 'pre-1900', proposedBy: 'Ole Rømer', year: 1676,
    summary: 'The first reasonably accurate measurement of the speed of light, derived from timing discrepancies in Jupiter’s moon eclipses.',
    beginnerExplanation: 'Rømer noticed that eclipses of Jupiter’s moon Io appeared to happen earlier or later than predicted, depending on how far apart Earth and Jupiter currently were. He correctly reasoned that this was because light itself takes time to travel — the first evidence that light’s speed, while enormous, isn’t infinite.',
    advancedExplanation: 'Rømer’s measurement, derived from systematic timing variations in Io’s eclipses as Earth-Jupiter distance changed over an orbit, yielded a speed of light within about 25% of the modern accepted value — a remarkable result for 17th-century instrumentation, later refined by more precise terrestrial measurements in the 19th century.',
  }),

  // ── 1900s ────────────────────────────────────────────────────────────────
  discovery({
    id: 'relativity-published', title: 'Special & General Relativity Published', era: '1900s', proposedBy: 'Albert Einstein', year: 1905,
    summary: 'Einstein published special relativity in 1905 and general relativity a decade later, fundamentally rewriting our understanding of space, time, and gravity.',
    beginnerExplanation: 'In 1905, Einstein published special relativity, showing that space and time aren’t absolute. A decade later, in 1915, he extended those ideas into general relativity, redefining gravity itself as the curvature of spacetime caused by mass — one of the most consequential shifts in the history of physics.',
    advancedExplanation: 'Einstein’s 1905 "miracle year" papers introduced special relativity alongside groundbreaking work on the photoelectric effect and Brownian motion; general relativity followed in 1915, providing a geometric theory of gravitation that has since passed every experimental test devised for it.',
    relatedTheoryIds: ['special-relativity', 'general-relativity'],
  }),
  discovery({
    id: 'expanding-universe-discovered', title: 'The Expanding Universe Discovered', era: '1900s', proposedBy: 'Edwin Hubble', year: 1929,
    summary: 'Hubble’s observation that distant galaxies are receding, with speed proportional to distance, provided the first direct evidence the universe is expanding.',
    beginnerExplanation: 'Edwin Hubble measured the light from distant galaxies and found something startling: nearly all of them are moving away from us, and the farther away a galaxy is, the faster it’s receding. This single observation became one of the strongest pieces of evidence for the Big Bang.',
    advancedExplanation: 'Hubble combined his own galaxy distance measurements (using Cepheid variable stars as standard candles) with redshift data, revealing a linear velocity-distance relationship now known as Hubble’s Law — direct observational evidence for universal expansion, later folded into the Big Bang model’s theoretical foundation.',
    relatedTheoryIds: ['big-bang-theory'],
    relatedModuleId: 'cosmology-big-bang',
  }),
  discovery({
    id: 'cmb-discovered', title: 'Cosmic Microwave Background Discovered', era: '1900s', proposedBy: 'Arno Penzias and Robert Wilson', year: 1965,
    summary: 'The accidental discovery of a faint background radiation filling the entire sky — the "afterglow" of the Big Bang.',
    beginnerExplanation: 'While trying to eliminate mysterious background noise from a radio antenna, two Bell Labs scientists accidentally discovered a faint microwave signal coming from every direction in the sky, equally. It turned out to be the cosmic microwave background — leftover radiation from the universe’s hot, dense early state, exactly as the Big Bang model predicted.',
    advancedExplanation: 'Penzias and Wilson’s uniform, unpolarized microwave excess noise, initially suspected to be an instrumental artifact, was recognized by nearby Princeton theorists as the predicted relic radiation from the early universe — decisive observational evidence favoring the Big Bang model over the steady-state alternative, earning a 1978 Nobel Prize.',
    relatedTheoryIds: ['big-bang-theory', 'steady-state-theory'],
    relatedModuleId: 'cosmology-big-bang',
  }),
  discovery({
    id: 'moon-landing', title: 'First Moon Landing (Apollo 11)', era: '1900s', proposedBy: 'NASA — Apollo 11 (Neil Armstrong, Buzz Aldrin, Michael Collins)', year: 1969,
    summary: 'The first crewed landing on the Moon, and the first time humans set foot on another world.',
    beginnerExplanation: 'On July 20, 1969, Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon, while Michael Collins orbited above in the command module. It remains the only time humans have set foot on another world, and it capped an intense decade-long space race between the US and Soviet Union.',
    advancedExplanation: 'Apollo 11 successfully executed a lunar orbit rendezvous mission profile, landing the Lunar Module Eagle in the Sea of Tranquility. Six Apollo missions landed a total of twelve astronauts on the Moon between 1969 and 1972, returning 382 kg of lunar samples that remain scientifically valuable today.',
    relatedModuleId: 'earths-moon',
  }),
  discovery({
    id: 'pulsars-discovered', title: 'Pulsars Discovered', era: '1900s', proposedBy: 'Jocelyn Bell Burnell and Antony Hewish', year: 1967,
    summary: 'The accidental discovery of an impossibly regular radio pulse from deep space, initially nicknamed "LGM-1" before being identified as a spinning neutron star.',
    beginnerExplanation: 'While analyzing radio telescope data as a graduate student, Jocelyn Bell Burnell noticed a strange, perfectly regular pulsing signal that briefly seemed almost too precise to be natural — it was even nicknamed "LGM-1," for "Little Green Men." It turned out to be the first-ever detected pulsar: a rapidly spinning neutron star.',
    advancedExplanation: 'The discovery confirmed the theoretical prediction of neutron stars from decades earlier, and the "lighthouse model" proposed shortly after correctly explained the pulses as beamed radiation from a rotating, magnetized neutron star. Antony Hewish received the 1974 Nobel Prize for the discovery — a decision that remains controversial given Bell Burnell’s central role in identifying the signal.',
    relatedTheoryIds: ['neutron-stars', 'pulsars-theory'],
    relatedModuleId: 'neutron-stars-pulsars',
  }),
  discovery({
    id: 'voyager-launched', title: 'Voyager Probes Launched', era: '1900s', proposedBy: 'NASA', year: 1977,
    summary: 'Twin robotic probes launched to explore the outer solar system, later becoming the first human-made objects to reach interstellar space.',
    beginnerExplanation: 'NASA launched two nearly identical spacecraft, Voyager 1 and Voyager 2, in 1977 to take advantage of a rare planetary alignment allowing a "grand tour" of the outer planets. Decades later, both probes are still operating and have become the most distant human-made objects ever, with Voyager 1 having crossed into interstellar space in 2012.',
    advancedExplanation: 'The Voyager missions returned the first close-up imagery of Jupiter, Saturn, Uranus, and Neptune (Voyager 2 remains the only spacecraft to have visited the latter two), discovering active volcanism on Io, new moons, and ring details invisible from Earth. Both probes carry the "Golden Record," a curated audio-visual message intended for any spacefaring civilization that might one day encounter them.',
    relatedModuleId: 'outer-planets',
  }),
  discovery({
    id: 'pluto-discovered', title: 'Pluto Discovered', era: '1900s', proposedBy: 'Clyde Tombaugh', year: 1930,
    summary: 'The discovery of Pluto, considered the ninth planet for over 70 years before its 2006 reclassification as a dwarf planet.',
    beginnerExplanation: 'Clyde Tombaugh discovered Pluto in 1930 by painstakingly comparing photographic plates of the night sky, looking for anything that moved against the fixed background stars. It was considered the ninth planet for the next 76 years, until the 2006 discovery of similarly sized objects led to its reclassification as a dwarf planet.',
    advancedExplanation: 'Tombaugh’s systematic blink-comparator search was motivated by predicted irregularities in Neptune’s orbit (later found to be measurement error, not a real "Planet X" effect) — meaning Pluto’s discovery, while genuine, wasn’t actually caused by the orbital anomaly that originally motivated the search.',
    relatedModuleId: 'pluto-dwarf-planets',
  }),
  discovery({
    id: 'first-exoplanet-discovered', title: 'First Exoplanet Discovered', era: '1900s', proposedBy: 'Michel Mayor and Didier Queloz', year: 1995,
    summary: 'The first confirmed detection of a planet orbiting a Sun-like star outside our solar system, 51 Pegasi b.',
    beginnerExplanation: 'In 1995, two Swiss astronomers detected a planet orbiting a star very similar to our Sun, 51 light-years away — the first confirmed planet found around a Sun-like star beyond our own solar system. It kicked off a scientific field that has since found thousands more.',
    advancedExplanation: 'Mayor and Queloz detected 51 Pegasi b using the radial velocity method, identifying periodic Doppler shifts in the host star’s spectrum caused by the planet’s gravitational tug. The discovery was doubly surprising because the planet, a "hot Jupiter," orbits its star in just 4.2 days — a configuration not predicted by solar-system-based planet formation models at the time. Mayor and Queloz shared the 2019 Nobel Prize in Physics for the discovery.',
    relatedTheoryIds: ['drake-equation'],
    relatedModuleId: 'exoplanets-search-for-life',
  }),
  discovery({
    id: 'dark-energy-confirmed', title: 'Accelerating Universe / Dark Energy Confirmed', era: '1900s', proposedBy: 'High-Z Supernova Search Team and Supernova Cosmology Project', year: 1998,
    summary: 'Two independent teams studying distant supernovae confirmed that the universe’s expansion is accelerating, evidence for what became known as dark energy.',
    beginnerExplanation: 'Two competing research teams, both studying distant exploding stars to measure the universe’s expansion, independently arrived at the same shocking conclusion in 1998: the expansion is speeding up, not slowing down. The discovery won the Nobel Prize in Physics in 2011.',
    advancedExplanation: 'Both teams found that distant Type Ia supernovae were systematically dimmer, and thus farther away, than predicted under any decelerating cosmological model — direct observational evidence requiring a repulsive dark energy component in the universe’s total energy budget.',
    relatedTheoryIds: ['dark-energy-hypothesis'],
    relatedModuleId: 'dark-energy',
  }),

  // ── 2000s ────────────────────────────────────────────────────────────────
  discovery({
    id: 'water-on-mars-evidence', title: 'Geological Evidence of Water on Mars', era: '2000s', proposedBy: 'Multiple NASA missions (Mars Global Surveyor, Opportunity, Phoenix, Curiosity)', year: 2004,
    summary: 'A series of rover and orbiter missions through the 2000s built an overwhelming geological case that Mars once had abundant liquid water.',
    beginnerExplanation: 'Through the 2000s, a string of NASA missions found increasingly convincing evidence that Mars used to be wet — dried-up riverbeds, ancient lakebeds, and minerals that only form in the presence of water, spread across many different regions of the planet.',
    advancedExplanation: 'The Opportunity rover’s 2004 discovery of hematite "blueberries" and sulfate minerals at Meridiani Planum provided some of the clearest early mineralogical evidence, later reinforced by Curiosity’s detailed study of ancient lakebed sediments in Gale Crater beginning in 2012.',
    relatedTheoryIds: ['mars-liquid-water'],
    relatedModuleId: 'future-space-exploration',
  }),
  discovery({
    id: 'higgs-boson-discovered', title: 'Higgs Boson Discovered', era: '2000s', proposedBy: 'ATLAS and CMS collaborations, CERN Large Hadron Collider', year: 2012,
    summary: 'The discovery of the Higgs boson confirmed the mechanism by which fundamental particles acquire mass, completing the Standard Model of particle physics.',
    beginnerExplanation: 'Predicted theoretically in 1964, the Higgs boson is the particle associated with a field that gives other fundamental particles their mass. It took the world’s largest particle accelerator, the Large Hadron Collider, until 2012 to finally produce and detect it — filling in the last missing piece of the Standard Model of particle physics.',
    advancedExplanation: 'Two independent detector collaborations at the LHC, ATLAS and CMS, each observed a new particle with a mass of about 125 GeV decaying in patterns consistent with the predicted Higgs boson, confirming the Higgs mechanism for electroweak symmetry breaking. The discovery earned Peter Higgs and François Englert the 2013 Nobel Prize in Physics.',
  }),
  discovery({
    id: 'gravitational-waves-detected', title: 'Gravitational Waves Directly Detected', era: '2000s', proposedBy: 'LIGO Scientific Collaboration', year: 2015,
    summary: 'The first direct detection of gravitational waves, from two merging black holes over a billion light-years away, confirming a century-old Einstein prediction.',
    beginnerExplanation: 'On September 14, 2015, the LIGO observatory directly detected ripples in spacetime for the very first time — gravitational waves from two black holes merging over a billion light-years away. It confirmed a prediction Einstein made a hundred years earlier and opened up an entirely new way of observing the universe.',
    advancedExplanation: 'The signal, designated GW150914, matched general relativity’s predicted waveform for a binary black hole merger (36 and 29 solar masses merging into a 62-solar-mass remnant, with 3 solar masses converted to gravitational wave energy) to extraordinary precision. The detection earned the 2017 Nobel Prize in Physics for LIGO’s founders.',
    relatedTheoryIds: ['gravitational-waves-theory', 'general-relativity', 'black-hole-existence'],
    relatedModuleId: 'gravitational-waves',
  }),
  discovery({
    id: 'first-black-hole-image', title: 'First Black Hole Image Captured', era: '2000s', proposedBy: 'Event Horizon Telescope Collaboration', year: 2019,
    summary: 'The first-ever direct image of a black hole’s silhouette, capturing the supermassive black hole at the center of galaxy M87.',
    beginnerExplanation: 'In 2019, an international team combined data from radio telescopes spread across the globe — effectively creating a telescope the size of Earth — to capture the first-ever direct image of a black hole: a glowing ring of superheated gas surrounding the dark silhouette of the supermassive black hole in galaxy M87.',
    advancedExplanation: 'The Event Horizon Telescope used very-long-baseline interferometry across a global network of radio observatories to achieve the angular resolution needed to resolve M87*’s event horizon-scale structure, 55 million light-years away. The team imaged our own galaxy’s supermassive black hole, Sagittarius A*, in 2022.',
    relatedTheoryIds: ['black-hole-existence', 'general-relativity'],
    relatedModuleId: 'black-holes',
  }),
  discovery({
    id: 'europa-water-vapor-detected', title: 'Water Vapor Plumes Detected on Europa', era: '2000s', proposedBy: 'Lorenz Roth and team (Hubble Space Telescope)', year: 2013,
    summary: 'The detection of water vapor plumes erupting from Europa’s south polar region, hinting at a connection to its suspected subsurface ocean.',
    beginnerExplanation: 'Using the Hubble Space Telescope, astronomers spotted what looked like plumes of water vapor erupting from Europa’s south pole — a tantalizing hint that material from its hidden subsurface ocean might occasionally reach space, potentially making that ocean easier to study without ever landing on the moon.',
    advancedExplanation: 'The detection, based on far-ultraviolet auroral emission signatures consistent with water vapor, has been intermittent and not consistently reproduced across all subsequent observation campaigns, making plume activity likely episodic rather than continuous. Confirming and characterizing this activity is a key goal for the Europa Clipper mission.',
    relatedTheoryIds: ['ocean-worlds-life'],
    relatedModuleId: 'exoplanets-search-for-life',
  }),

  // ── 2020s ────────────────────────────────────────────────────────────────
  discovery({
    id: 'jwst-launch-and-first-images', title: 'James Webb Space Telescope Launch & First Images', era: '2020s', proposedBy: 'NASA, ESA, CSA', year: 2021,
    summary: 'The James Webb Space Telescope launched in December 2021 and released its first full-color science images in July 2022, opening a new era of infrared astronomy.',
    beginnerExplanation: 'The James Webb Space Telescope, the long-awaited successor to Hubble, launched on Christmas Day 2021 and unfolded into position roughly a million miles from Earth. Its first full-color images, released in July 2022, revealed the most detailed views of the distant universe ever captured, immediately reshaping astronomers’ understanding of early galaxies.',
    advancedExplanation: 'JWST observes primarily in infrared light, letting it see through cosmic dust and detect the redshifted light of the earliest galaxies, more than 13 billion years in the past. Early results have already challenged galaxy formation models by revealing surprisingly massive, mature-looking galaxies far earlier in cosmic history than expected.',
    relatedModuleId: 'future-space-exploration',
  }),
  discovery({
    id: 'moon-water-confirmed', title: 'Molecular Water Confirmed on Sunlit Moon', era: '2020s', proposedBy: 'NASA (SOFIA airborne observatory)', year: 2020,
    summary: 'The confirmed detection of molecular water on the sunlit surface of the Moon, beyond the permanently shadowed polar craters previously suspected to hold ice.',
    beginnerExplanation: 'For years, scientists suspected water ice might be hiding in permanently shadowed craters near the Moon’s poles, places sunlight never reaches. In 2020, NASA’s airborne SOFIA observatory confirmed molecular water even in a sunlit region of the Moon, suggesting water might be more widespread across the lunar surface than previously thought.',
    advancedExplanation: 'SOFIA detected the distinct spectral signature of molecular water (H₂O), as opposed to the more chemically ambiguous hydroxyl (OH) signal detected by earlier missions, at concentrations of about 100 to 400 parts per million in sunlit lunar soil near the Clavius crater.',
    relatedModuleId: 'earths-moon',
  }),
  discovery({
    id: 'artemis-program', title: 'Artemis I Launched', era: '2020s', proposedBy: 'NASA', year: 2022,
    summary: 'NASA’s Artemis I uncrewed test flight in 2022 marked the first step in the agency’s program to return humans to the Moon.',
    beginnerExplanation: 'Artemis I, launched in November 2022, sent an uncrewed Orion spacecraft around the Moon and back as a critical test flight, paving the way for future crewed Artemis missions aiming to land astronauts on the Moon again — including, for the first time, a woman and a person of color.',
    advancedExplanation: 'Artemis I validated the Space Launch System rocket and Orion crew capsule’s heat shield during a high-speed lunar-return atmospheric reentry, a key risk-reduction step before committing to crewed missions. The broader Artemis program aims to establish a sustainable lunar presence as a proving ground for eventual crewed Mars missions.',
    relatedModuleId: 'future-space-exploration',
  }),
  discovery({
    id: 'mars-sample-return-caching', title: 'Mars Sample Caching Begins (Perseverance)', era: '2020s', proposedBy: 'NASA — Perseverance rover', year: 2021,
    summary: 'NASA’s Perseverance rover has been collecting and caching Martian rock samples since 2021, intended for eventual return to Earth by a future mission.',
    beginnerExplanation: 'Since landing in 2021, NASA’s Perseverance rover has been drilling and caching carefully selected rock samples in sealed tubes, left on the Martian surface for a future mission to eventually collect and bring back to Earth — where scientists could study them in far more detail than any rover instrument allows.',
    advancedExplanation: 'The Mars Sample Return campaign, a joint NASA-ESA effort, faces significant cost and schedule challenges, with the mission architecture under active review as of the mid-2020s; Perseverance’s cached samples from Jezero Crater, an ancient lake and river delta, remain scientifically primed for eventual return.',
    relatedTheoryIds: ['mars-liquid-water'],
    relatedModuleId: 'future-space-exploration',
  }),
  discovery({
    id: 'europa-clipper-launched', title: 'Europa Clipper Launched', era: '2020s', proposedBy: 'NASA', year: 2024,
    summary: 'NASA launched the Europa Clipper spacecraft in 2024 to conduct detailed reconnaissance of Jupiter’s icy moon Europa and its suspected subsurface ocean.',
    beginnerExplanation: 'Europa Clipper launched in October 2024, beginning its journey to Jupiter’s moon Europa, where it will perform dozens of close flybys to study the moon’s ice shell, search for evidence of its suspected subsurface ocean, and assess whether Europa could plausibly support life.',
    advancedExplanation: 'Europa Clipper carries a suite of instruments — including ice-penetrating radar, a magnetometer, and mass spectrometers — designed to characterize the ice shell thickness, confirm the subsurface ocean’s properties, and directly sample any plume material encountered, without being designed to detect life directly.',
    relatedTheoryIds: ['ocean-worlds-life'],
    relatedModuleId: 'exoplanets-search-for-life',
  }),
]

export const theories = [...RAW_THEORIES, ...RAW_DISCOVERIES]

export function getTheory(id) {
  return theories.find(t => t.id === id)
}

export function getTheoriesByCategory(categoryId) {
  if (categoryId === 'all') return theories
  return theories.filter(t => t.category === categoryId)
}

// Chronological Discoveries Timeline — separate from the filterable theory grid.
export function getDiscoveriesTimeline() {
  return theories.filter(t => t.category === 'discovery').sort((a, b) => a.year - b.year)
}

export default theories
