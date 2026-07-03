// modules.js — Learning Modules content for the /learn section.
//
// ⚠️ UNVERIFIED — as with planets.js, every specific fact/number in the
// `content`, `didYouKnow`, and `glossaryTerms` fields below (temperatures,
// dates, distances, discovery years, etc.) was drafted from general
// astronomy knowledge, NOT cross-checked line-by-line against a NASA
// source. Per CLAUDE.md §8/§9, this must be fact-checked before launch —
// same policy already applied to planets.js's `facts` block.
//
// Beginner-tier modules (the first 8) have full multi-section content.
// Intermediate/Advanced modules have a lighter (2-3 section) first pass —
// real, accurate content, not placeholder text, but less exhaustive than
// Beginner — flagged in CLAUDE.md §8 as a follow-up to expand later.

export const TIERS = [
  { id: 'beginner',     label: 'Foundation',  subtitle: 'Start your journey', color: 'var(--color-blue)' },
  { id: 'intermediate', label: 'Deep Space',  subtitle: 'Expand your view',   color: 'var(--color-purple)' },
  { id: 'advanced',     label: 'The Cosmos',  subtitle: 'Push the frontier',  color: 'var(--color-purple)' },
]

// Maps an Explorer body id to the Learn module that covers it — used by
// InfoPanel's "Learn More" button. Individual planets are grouped into
// Inner/Outer Planets modules rather than one module per body, so a direct
// id match (e.g. `/learn/earth`) would 404 without this lookup.
export const PLANET_TO_MODULE_ID = {
  sun: 'the-sun',
  mercury: 'inner-planets',
  venus: 'inner-planets',
  earth: 'inner-planets',
  mars: 'inner-planets',
  jupiter: 'outer-planets',
  saturn: 'outer-planets',
  uranus: 'outer-planets',
  neptune: 'outer-planets',
  moon: 'earths-moon',
  pluto: 'pluto-dwarf-planets',
}

const RAW_MODULES = [
  // ── BEGINNER — Foundation ────────────────────────────────────────────────
  {
    id: 'universe-intro',
    title: 'The Universe: An Introduction',
    tier: 'beginner',
    icon: 'Telescope',
    summary: 'What the universe is, how big it is, and how we’ve learned to measure it.',
    estimatedMinutes: 8,
    content: [
      {
        heading: 'What Is the Universe?',
        body: 'The universe is everything that exists — all matter, energy, space, and time. It began roughly 13.8 billion years ago and has been expanding ever since.\n\nThe part we can actually observe, called the observable universe, is about 93 billion light-years across. That number is larger than "13.8 billion light-years" might suggest, because space itself has been stretching the whole time light has been traveling toward us.\n\nBeyond the observable universe, space likely continues — possibly forever — but we can never see that part, because light from it hasn’t had time to reach us yet.',
      },
      {
        heading: 'Scale: From Atoms to Galaxies',
        body: 'The universe is organized in a rough hierarchy of scale. Planets orbit stars. Stars, along with gas and dust, are gathered into galaxies. Galaxies cluster together into groups and clusters, and those clusters link up into enormous filaments and sheets called the cosmic web — the largest known structure in existence.\n\nOur own galaxy, the Milky Way, contains an estimated 100 to 400 billion stars. And the Milky Way is just one of an estimated two trillion galaxies in the observable universe.',
      },
      {
        heading: 'How We Measure Cosmic Distances',
        body: 'Distances in space are so large that kilometers stop being useful. Astronomers instead use the light-year — the distance light travels in one year, about 9.46 trillion km.\n\nFor nearby stars, astronomers use parallax: measuring how a star appears to shift position against distant background stars as Earth orbits the Sun, then using simple geometry to calculate distance. For objects too far away for parallax to work, astronomers use "standard candles" — objects like certain exploding stars whose true brightness is already known, so comparing their true brightness to how dim they appear reveals their distance.',
      },
      {
        heading: 'Tools of Discovery',
        body: 'Almost everything we know about the universe comes from studying light. Telescopes come in many forms — optical telescopes that collect visible light, radio telescopes that detect radio waves, and space-based observatories like Hubble and the James Webb Space Telescope that avoid Earth’s atmosphere entirely.\n\nSpectroscopy — splitting light into its component colors, much like a prism — lets scientists determine what distant objects are made of, how hot they are, and how fast they’re moving, all without ever traveling there.',
      },
    ],
    glossaryTerms: [
      { term: 'Light-year', definition: 'The distance light travels in one year — about 9.46 trillion km. Used to measure vast distances in space.' },
      { term: 'Observable universe', definition: 'The portion of the universe we can detect, limited by how far light has had time to travel since the universe began.' },
      { term: 'Parallax', definition: 'A method for measuring distance to nearby stars by observing their apparent shift in position from two points in Earth’s orbit.' },
      { term: 'Spectroscopy', definition: 'The technique of splitting light into its component wavelengths to determine an object’s composition, temperature, and motion.' },
      { term: 'Cosmic web', definition: 'The largest known structure in the universe — a vast network of galaxy filaments and clusters separated by huge voids.' },
    ],
    didYouKnow: [
      'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.',
      'The observable universe contains an estimated two trillion galaxies.',
      'If you could drive a car to the Moon at highway speed, it would take about six months.',
    ],
    relatedTheoryIds: ['big-bang-theory'],
    relatedPlanetIds: [],
  },
  {
    id: 'our-solar-system',
    title: 'Our Solar System',
    tier: 'beginner',
    icon: 'Orbit',
    summary: 'A tour of the Sun’s family — planets, moons, and the shape of our cosmic neighborhood.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'A Family Built Around One Star',
        body: 'Our solar system is the Sun and everything gravitationally bound to it: eight planets, at least five recognized dwarf planets, more than 200 moons, and countless asteroids and comets.\n\nThe Sun dominates the system completely — it holds about 99.8% of all the mass in the solar system. Everything else, including Jupiter, is essentially orbital debris by comparison.',
      },
      {
        heading: 'Terrestrial Planets vs. Giant Planets',
        body: 'The four planets closest to the Sun — Mercury, Venus, Earth, and Mars — are terrestrial planets: relatively small, dense, and rocky, with solid surfaces you could (in theory) stand on.\n\nBeyond the asteroid belt, the four outer planets — Jupiter, Saturn, Uranus, and Neptune — are giant planets, far larger and made mostly of gas and ice with no solid surface at all.',
      },
      {
        heading: 'How the Solar System Formed',
        body: 'About 4.6 billion years ago, a giant cloud of gas and dust — a solar nebula — began to collapse under its own gravity, likely triggered by the shockwave of a nearby exploding star.\n\nAs it collapsed, it flattened into a spinning disk. Most of the material fell to the center and ignited as the Sun. The rest gradually clumped together — a process called accretion — building up the planets, moons, and smaller bodies we see today.',
      },
      {
        heading: 'Measuring Distance: The Astronomical Unit',
        body: 'Within the solar system, astronomers use the astronomical unit (AU) — the average distance from Earth to the Sun, about 150 million km — as a convenient yardstick.\n\nMercury orbits at about 0.4 AU, Neptune at about 30 AU, and Pluto’s highly elliptical orbit averages around 39 AU. Thinking in AU makes solar system distances far easier to compare than writing out kilometers each time.',
      },
    ],
    glossaryTerms: [
      { term: 'Astronomical Unit', definition: 'The average distance from Earth to the Sun (about 150 million km), used as a standard unit for solar system distances.' },
      { term: 'Terrestrial planet', definition: 'A small, dense, rocky planet with a solid surface — Mercury, Venus, Earth, and Mars.' },
      { term: 'Gas giant', definition: 'A large planet made mostly of hydrogen and helium with no solid surface — Jupiter and Saturn.' },
      { term: 'Accretion', definition: 'The process by which small particles gradually stick together and grow into larger bodies like planets.' },
      { term: 'Solar nebula', definition: 'The collapsing cloud of gas and dust from which the Sun and the rest of the solar system formed.' },
    ],
    didYouKnow: [
      'All of the planets could fit in the space between Earth and the Moon, with room to spare.',
      'The solar system formed from the same collapsing cloud of gas and dust that created the Sun itself.',
      'Jupiter alone has more mass than all of the other planets combined.',
    ],
    relatedTheoryIds: ['nebular-hypothesis'],
    relatedPlanetIds: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
  },
  {
    id: 'the-sun',
    title: 'The Sun',
    tier: 'beginner',
    icon: 'Sun',
    summary: 'Our star up close — structure, energy, and the fusion reaction that powers the solar system.',
    estimatedMinutes: 8,
    content: [
      {
        heading: 'What Kind of Star Is the Sun?',
        body: 'The Sun is a G-type main-sequence star — a fairly ordinary, middle-aged star as stars go. It formed about 4.6 billion years ago and has enough hydrogen fuel to keep shining roughly the same way for another 5 billion years.\n\nIt’s a single star, unlike many others in the galaxy that exist in binary or multiple-star systems.',
      },
      {
        heading: 'Layers of the Sun',
        body: 'The Sun is built in layers. At its center is the core, where fusion happens. Around that, energy slowly works its way outward through the radiative zone, then the convective zone, where hot plasma physically churns and rises like boiling water.\n\nWhat we actually see as the Sun’s "surface" is the photosphere. Above that sit two more layers — the chromosphere and the corona, the Sun’s faint outer atmosphere, only easily visible during a total solar eclipse.',
      },
      {
        heading: 'Nuclear Fusion: The Sun’s Power Source',
        body: 'Deep in the core, immense pressure and heat force hydrogen atoms to fuse into helium. This fusion reaction releases enormous amounts of energy, which is what makes the Sun shine.\n\nThe core reaches about 15 million°C — hot enough to sustain fusion — while the visible photosphere is a comparatively cool 5,500°C.',
      },
      {
        heading: 'Solar Activity',
        body: 'The Sun isn’t static. Sunspots are cooler, darker patches caused by tangled magnetic fields. Solar flares and coronal mass ejections are sudden bursts of energy and charged particles blasted into space.\n\nWhen those particles reach Earth, they can create auroras near the poles — and, in extreme cases, disrupt satellites, power grids, and radio communication, a field of study called space weather.',
      },
    ],
    glossaryTerms: [
      { term: 'Fusion', definition: 'A nuclear reaction where atomic nuclei combine, releasing enormous energy — the process that powers the Sun and all stars.' },
      { term: 'Photosphere', definition: 'The visible "surface" of the Sun, the layer that emits most of the light we see.' },
      { term: 'Corona', definition: 'The Sun’s faint, extremely hot outer atmosphere, usually only visible during a total solar eclipse.' },
      { term: 'Solar wind', definition: 'A continuous stream of charged particles flowing outward from the Sun into the solar system.' },
      { term: 'Sunspot', definition: 'A temporary dark patch on the Sun’s surface caused by concentrated magnetic activity, cooler than surrounding areas.' },
    ],
    didYouKnow: [
      'The Sun’s core reaches about 15 million°C, while its visible surface is a comparatively cool 5,500°C.',
      'Every second, the Sun converts about 600 million tons of hydrogen into helium.',
      'The Sun accounts for about 99.8% of all the mass in the solar system.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: ['sun'],
  },
  {
    id: 'inner-planets',
    title: 'Inner Planets',
    tier: 'beginner',
    icon: 'Globe',
    summary: 'The four rocky worlds closest to the Sun — Mercury, Venus, Earth, and Mars — and what makes each one unique.',
    estimatedMinutes: 10,
    content: [
      {
        heading: 'What Makes a Planet "Terrestrial"?',
        body: 'Mercury, Venus, Earth, and Mars are all terrestrial planets — relatively small, dense worlds with solid rocky surfaces and metallic cores, unlike the gas giants further out. All four likely formed from similar rocky material in the young solar system, close enough to the Sun that lighter gases were blown away rather than accumulating.',
      },
      {
        heading: 'Mercury: The Swift, Scorched World',
        body: 'Mercury is the closest planet to the Sun and the smallest in the solar system. It orbits so quickly that its year lasts only 88 Earth days.\n\nWith virtually no atmosphere to trap or spread heat, Mercury has the most extreme temperature swings of any planet — scorching by day, freezing by night. Its heavily cratered surface looks a lot like our own Moon’s.',
      },
      {
        heading: 'Venus: Earth’s Toxic Twin',
        body: 'Venus is similar to Earth in size and mass, but the resemblance ends there. A thick atmosphere of carbon dioxide traps heat so effectively — a runaway greenhouse effect — that Venus is the hottest planet in the solar system, even hotter than Mercury.\n\nVenus also rotates backwards compared to most planets, and does so incredibly slowly: a single day on Venus lasts longer than its entire year.',
      },
      {
        heading: 'Earth: The Only Known Home for Life',
        body: 'Earth is the only place we know of, so far, with liquid water on its surface, a breathable oxygen-rich atmosphere, and life. Its protective magnetic field, generated by a molten metal core, shields the surface from much of the Sun’s harmful radiation.\n\nEarth is also unusual among the terrestrial planets for having one large moon, which stabilizes its axial tilt and drives ocean tides.',
      },
      {
        heading: 'Mars: The Red Planet',
        body: 'Mars gets its rusty color from iron oxide covering its surface. It has a thin atmosphere, far too thin to support liquid water on the surface today — but strong evidence, including dry riverbeds and mineral deposits, shows that water once flowed there.\n\nMars is home to Olympus Mons, the largest volcano in the solar system, and Valles Marineris, a canyon system that dwarfs the Grand Canyon. It’s also the primary target for future crewed missions beyond the Moon.',
      },
    ],
    glossaryTerms: [
      { term: 'Terrestrial planet', definition: 'A small, dense, rocky planet with a solid surface — Mercury, Venus, Earth, and Mars.' },
      { term: 'Greenhouse effect', definition: 'The trapping of heat by a planet’s atmosphere, warming its surface beyond what direct sunlight alone would produce.' },
      { term: 'Retrograde rotation', definition: 'Spinning in the opposite direction to most other bodies in the solar system — as Venus does.' },
      { term: 'Magnetosphere', definition: 'The region around a planet dominated by its magnetic field, which can deflect charged particles from the Sun.' },
      { term: 'Regolith', definition: 'The layer of loose dust, soil, and broken rock covering a planet or moon’s solid bedrock.' },
    ],
    didYouKnow: [
      'A day on Venus (243 Earth days) is longer than its year (225 Earth days).',
      'Mars is home to Olympus Mons, a volcano roughly three times the height of Mount Everest.',
      'Mercury’s temperature swings from about 430°C in daytime to -180°C at night, thanks to its near-total lack of atmosphere.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: ['mercury', 'venus', 'earth', 'mars'],
  },
  {
    id: 'outer-planets',
    title: 'Outer Planets',
    tier: 'beginner',
    icon: 'Wind',
    summary: 'The giant worlds beyond the asteroid belt — Jupiter, Saturn, Uranus, and Neptune — massive, gaseous, and ringed.',
    estimatedMinutes: 10,
    content: [
      {
        heading: 'Gas Giants vs. Ice Giants',
        body: 'Jupiter and Saturn are gas giants, made overwhelmingly of hydrogen and helium, much like the Sun itself. Uranus and Neptune are sometimes called ice giants instead — they still have hydrogen and helium atmospheres, but a much larger share of their interior is made of denser "ices" like water, ammonia, and methane surrounding a rocky core.\n\nNone of the four have a solid surface you could land on — descend far enough and the atmosphere simply gets denser and denser.',
      },
      {
        heading: 'Jupiter: King of the Planets',
        body: 'Jupiter is the largest planet in the solar system, with a mass more than twice that of all the other planets combined. Its Great Red Spot is a storm larger than Earth that has raged for centuries.\n\nJupiter also has the strongest magnetic field of any planet and dozens of moons, including the four large Galilean moons — Io, Europa, Ganymede, and Callisto — first discovered by Galileo in 1610.',
      },
      {
        heading: 'Saturn: Master of the Rings',
        body: 'Saturn is famous for its spectacular ring system, made of countless chunks of ice and rock ranging from dust-sized grains to boulders. Saturn is also the least dense planet in the solar system — it would float, if there were an ocean large enough to hold it.\n\nAmong its many moons is Titan, the only moon in the solar system known to have a substantial atmosphere and stable liquid on its surface (lakes of liquid methane, not water).',
      },
      {
        heading: 'Uranus: The Sideways Planet',
        body: 'Uranus rotates almost entirely on its side, tilted roughly 98 degrees — likely the result of an ancient collision. This means its poles take turns facing the Sun directly during its 84-year orbit, producing the most extreme seasons of any planet.\n\nIts pale blue-green color comes from methane in its atmosphere, which absorbs red light and reflects blue-green back to our eyes.',
      },
      {
        heading: 'Neptune: The Windy Outpost',
        body: 'Neptune is the most distant planet from the Sun and home to the strongest sustained winds in the solar system, with supersonic gusts exceeding 2,000 km/h. Like Uranus, its deep blue color comes from atmospheric methane.\n\nNeptune has the unusual distinction of being discovered through mathematics before it was ever observed — astronomers predicted its position from irregularities in Uranus’s orbit, then pointed a telescope exactly where the math said to look.',
      },
    ],
    glossaryTerms: [
      { term: 'Gas giant', definition: 'A large planet made mostly of hydrogen and helium with no solid surface — Jupiter and Saturn.' },
      { term: 'Ice giant', definition: 'A large planet whose interior is dominated by dense "ices" like water, ammonia, and methane around a rocky core — Uranus and Neptune.' },
      { term: 'Great Red Spot', definition: 'A giant, centuries-old storm on Jupiter, larger than Earth.' },
      { term: 'Ring system', definition: 'A disk of orbiting ice, rock, and dust particles circling a planet — most prominently Saturn.' },
      { term: 'Axial tilt', definition: 'The angle between a planet’s rotational axis and its orbital plane, which drives seasonal variation.' },
    ],
    didYouKnow: [
      'Saturn is so low-density it would float in a bathtub big enough to hold it.',
      'Neptune was discovered by predicting its position mathematically from Uranus’s orbital wobble, before anyone observed it directly.',
      'Jupiter’s Great Red Spot is a storm larger than Earth that has raged for centuries.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: ['jupiter', 'saturn', 'uranus', 'neptune'],
  },
  {
    id: 'earths-moon',
    title: 'Earth’s Moon',
    tier: 'beginner',
    icon: 'Moon',
    summary: 'Our closest neighbor in space — formation, phases, and its influence on Earth.',
    estimatedMinutes: 8,
    content: [
      {
        heading: 'How the Moon Formed',
        body: 'The leading explanation for the Moon’s origin is the giant-impact hypothesis: early in Earth’s history, a Mars-sized body (often called Theia) collided with the young Earth. Debris blasted into orbit eventually coalesced under gravity to form the Moon.\n\nThis explains several odd facts about the Moon, including its relatively small iron core and its chemical similarity to Earth’s outer layers.',
      },
      {
        heading: 'Phases of the Moon',
        body: 'The Moon doesn’t produce its own light — it reflects sunlight. As the Moon orbits Earth, we see different amounts of its sunlit half, producing the familiar cycle of phases: new moon, waxing crescent, first quarter, waxing gibbous, full moon, and back down through waning phases.\n\nOne full cycle takes about 29.5 days.',
      },
      {
        heading: 'Tidal Locking and Tides',
        body: 'The Moon is tidally locked to Earth, meaning it rotates on its axis in exactly the same time it takes to orbit us — so we always see the same face, and there really is a permanent "far side of the Moon."\n\nThe Moon’s gravity (along with a smaller pull from the Sun) is also the main driver of Earth’s ocean tides, pulling water into a bulge on the side of Earth facing the Moon (and a matching bulge on the opposite side).',
      },
      {
        heading: 'Exploring the Moon',
        body: 'The Moon is the only place beyond Earth that humans have ever set foot. NASA’s Apollo program landed twelve astronauts on the lunar surface between 1969 and 1972.\n\nInterest in the Moon has renewed in recent years through NASA’s Artemis program, which aims to return humans to the lunar surface and establish a sustainable presence as a stepping stone toward future Mars missions.',
      },
    ],
    glossaryTerms: [
      { term: 'Giant-impact hypothesis', definition: 'The leading theory that the Moon formed from debris after a Mars-sized body collided with the early Earth.' },
      { term: 'Tidal locking', definition: 'When an orbiting body’s rotation period matches its orbital period, so it always shows the same face to what it orbits.' },
      { term: 'Waxing', definition: 'The period when the Moon’s illuminated portion, as seen from Earth, is increasing.' },
      { term: 'Waning', definition: 'The period when the Moon’s illuminated portion, as seen from Earth, is decreasing.' },
      { term: 'Maria', definition: 'Large, dark, flat plains on the Moon formed by ancient volcanic lava flows (Latin for "seas," though they contain no water).' },
    ],
    didYouKnow: [
      'The same side of the Moon always faces Earth because it is tidally locked.',
      'The Moon is slowly moving away from Earth, at about 3.8 cm per year.',
      'Only twelve people have ever walked on the Moon, all during NASA’s Apollo missions between 1969 and 1972.',
    ],
    relatedTheoryIds: ['giant-impact-hypothesis'],
    relatedPlanetIds: ['moon', 'earth'],
  },
  {
    id: 'asteroids-comets',
    title: 'Asteroids & Comets',
    tier: 'beginner',
    icon: 'Gem',
    summary: 'The rocky and icy leftovers of solar system formation, and the difference between them.',
    estimatedMinutes: 8,
    content: [
      {
        heading: 'What Are Asteroids?',
        body: 'Asteroids are rocky, metallic leftovers from the solar system’s formation that never grew large enough to become planets. Most orbit in the asteroid belt, a region between Mars and Jupiter.\n\nCeres, the largest object in the asteroid belt, is big enough to be round under its own gravity and is classified as both an asteroid and a dwarf planet.',
      },
      {
        heading: 'What Are Comets?',
        body: 'Comets are icy bodies, often described as "dirty snowballs," originating from the cold outer solar system — the Kuiper Belt and the more distant, hypothesized Oort Cloud.\n\nWhen a comet’s orbit brings it close to the Sun, heat vaporizes its ices, releasing gas and dust that form a glowing coma and a long tail. A comet’s tail always points away from the Sun, pushed by solar wind and radiation pressure, regardless of the comet’s direction of travel.',
      },
      {
        heading: 'Near-Earth Objects and Impact Risk',
        body: 'Asteroids and comets whose orbits bring them close to Earth are called Near-Earth Objects (NEOs). NASA and other agencies actively track thousands of NEOs to assess any future impact risk, a field known as planetary defense.\n\nThe impact of a large asteroid or comet is widely thought to have caused the mass extinction that ended the age of dinosaurs about 66 million years ago, leaving a crater over 150 km wide in present-day Mexico.',
      },
      {
        heading: 'Meteors, Meteoroids, and Meteorites',
        body: 'These three related terms describe the same object at different stages. A meteoroid is a small rocky or metallic fragment travelling through space. If it enters Earth’s atmosphere and burns up, the streak of light it creates is called a meteor (a "shooting star"). If any part of it survives and reaches the ground, that surviving fragment is called a meteorite.',
      },
    ],
    glossaryTerms: [
      { term: 'Asteroid belt', definition: 'The region between Mars and Jupiter where most of the solar system’s asteroids orbit.' },
      { term: 'Kuiper Belt', definition: 'A disk-shaped region beyond Neptune containing icy bodies, including Pluto and many comets.' },
      { term: 'Oort Cloud', definition: 'A hypothesized, extremely distant spherical shell of icy bodies thought to surround the entire solar system.' },
      { term: 'Near-Earth Object', definition: 'An asteroid or comet whose orbit brings it into the vicinity of Earth’s orbit.' },
      { term: 'Meteorite', definition: 'A fragment of a meteoroid that survives passage through the atmosphere and lands on the ground.' },
    ],
    didYouKnow: [
      'A comet’s tail always points away from the Sun, regardless of which direction the comet is traveling.',
      'The asteroid Ceres is large enough to also be classified as a dwarf planet.',
      'The impact linked to the extinction of the dinosaurs left a crater over 150 km wide in present-day Mexico.',
    ],
    relatedTheoryIds: ['impact-extinction-hypothesis'],
    relatedPlanetIds: [],
  },
  {
    id: 'pluto-dwarf-planets',
    title: 'Pluto & Dwarf Planets',
    tier: 'beginner',
    icon: 'CircleDashed',
    summary: 'Why Pluto lost its planet status, and the other dwarf worlds sharing its category.',
    estimatedMinutes: 7,
    content: [
      {
        heading: 'What Is a Dwarf Planet?',
        body: 'In 2006, the International Astronomical Union (IAU) formally defined a "planet" as a body that orbits the Sun, is round due to its own gravity, and has "cleared its neighborhood" of other debris. A dwarf planet meets the first two criteria but not the third — it shares its orbital region with lots of similar-sized objects.',
      },
      {
        heading: 'Pluto: A Teaching Moment in Science',
        body: 'Pluto was discovered in 1930 and was considered the ninth planet for over 70 years. As astronomers discovered more Kuiper Belt objects of comparable size — including Eris, which is similar in mass — it became clear that either dozens of new objects needed to be called planets, or the definition needed to change.\n\nThe 2006 IAU decision reclassified Pluto as a dwarf planet. It’s a favorite teaching example of how scientific classification evolves as new evidence emerges — the underlying facts about Pluto didn’t change, only the category we use to describe it.',
      },
      {
        heading: 'Other Dwarf Planets',
        body: 'Pluto is not alone in its category. Eris, Makemake, and Haumea are dwarf planets in the Kuiper Belt, similar in nature to Pluto. Ceres, in the asteroid belt between Mars and Jupiter, is the only recognized dwarf planet in the inner solar system.',
      },
      {
        heading: 'What New Horizons Taught Us',
        body: 'In 2015, NASA’s New Horizons spacecraft became the first to fly past Pluto, revealing a surprisingly active world: mountains of water ice, a heart-shaped plain of nitrogen ice nicknamed Tombaugh Regio, and a thin nitrogen atmosphere.\n\nThe flyby transformed Pluto from a fuzzy dot in even the best telescopes into a genuinely explored world.',
      },
    ],
    glossaryTerms: [
      { term: 'Dwarf planet', definition: 'A body that orbits the Sun and is round from its own gravity, but has not cleared its orbital neighborhood of similar-sized objects.' },
      { term: 'IAU', definition: 'The International Astronomical Union, the organization responsible for official astronomical definitions and naming.' },
      { term: 'Kuiper Belt Object', definition: 'Any icy body orbiting in the Kuiper Belt, the disk-shaped region beyond Neptune.' },
      { term: 'Tombaugh Regio', definition: 'The large, heart-shaped nitrogen-ice plain on Pluto, named after Pluto’s discoverer Clyde Tombaugh.' },
    ],
    didYouKnow: [
      'Pluto has five known moons; the largest, Charon, is about half Pluto’s size.',
      'Pluto hasn’t completed a single orbit of the Sun since its discovery in 1930 — one Pluto year is about 248 Earth years.',
      'The same 2006 decision that reclassified Pluto also newly classified Eris, Makemake, Haumea, and Ceres as dwarf planets.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: ['pluto'],
  },

  // ── INTERMEDIATE — Deep Space ────────────────────────────────────────────
  {
    id: 'stars-stellar-evolution',
    title: 'Stars & Stellar Evolution',
    tier: 'intermediate',
    icon: 'Star',
    summary: 'How stars are born, shine, and change over billions of years.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'Star Formation',
        body: 'Stars are born inside nebulae — vast clouds of gas and dust. Gravity slowly pulls denser pockets of a nebula together; as the pocket collapses, it heats up. If enough mass collapses into a small enough volume, the core becomes hot and dense enough to ignite nuclear fusion, and a star is born.',
      },
      {
        heading: 'The Main Sequence',
        body: 'Most of a star’s life is spent on the main sequence — a long, stable stage where fusion in the core (turning hydrogen into helium) produces exactly enough outward pressure to balance the inward pull of gravity.\n\nA star’s mass determines almost everything about it: more massive stars burn hotter, shine brighter, and use up their fuel far faster than smaller stars, giving them dramatically shorter lifespans despite having more fuel to begin with.',
      },
      {
        heading: 'The Hertzsprung-Russell Diagram',
        body: 'Astronomers classify and compare stars using the Hertzsprung-Russell (H-R) diagram, a chart that plots a star’s brightness against its surface temperature. Most stars fall along a diagonal band — the main sequence — while giants, supergiants, and white dwarfs occupy distinct regions, representing different stages of stellar life.',
      },
    ],
    glossaryTerms: [
      { term: 'Nebula', definition: 'A giant cloud of gas and dust in space, often the birthplace of new stars.' },
      { term: 'Main sequence', definition: 'The long, stable stage of a star’s life when it fuses hydrogen into helium in its core.' },
      { term: 'Hertzsprung-Russell diagram', definition: 'A chart plotting stars by temperature and brightness, used to classify stars and understand stellar evolution.' },
      { term: 'Stellar nucleosynthesis', definition: 'The process by which stars fuse lighter elements into heavier ones in their cores.' },
    ],
    didYouKnow: [
      'The more massive a star is, the shorter its life — massive stars burn fuel much faster than small ones.',
      'Almost every element heavier than hydrogen and helium was forged inside stars.',
    ],
    relatedTheoryIds: ['stellar-nucleosynthesis'],
    relatedPlanetIds: ['sun'],
  },
  {
    id: 'life-cycle-of-stars',
    title: 'Life Cycle of Stars',
    tier: 'intermediate',
    icon: 'Flame',
    summary: 'From stellar nurseries to white dwarfs, neutron stars, and black holes.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'Low-Mass Stars: A Quiet Retirement',
        body: 'Stars like the Sun end their lives relatively gently. As core hydrogen runs out, the star expands into a red giant, eventually shedding its outer layers into space as a glowing shell called a planetary nebula. What remains is a white dwarf — a small, extremely dense stellar remnant that slowly cools over billions of years.',
      },
      {
        heading: 'High-Mass Stars: A Violent End',
        body: 'Much more massive stars meet a far more dramatic fate. When they exhaust their fuel, their cores collapse suddenly, triggering a supernova — an explosion so bright it can briefly outshine an entire galaxy. Supernovae scatter heavy elements, forged during the star’s life and death, out into space to eventually become part of new stars, planets, and even living things.',
      },
      {
        heading: 'What’s Left Behind',
        body: 'What remains after a star dies depends heavily on its original mass. Low-mass stars leave white dwarfs. Massive stars leave neutron stars — city-sized, unbelievably dense remnants — and the most massive stars of all can collapse completely into black holes.',
      },
    ],
    glossaryTerms: [
      { term: 'Red giant', definition: 'A late-life stage where a star’s outer layers expand and cool as its core runs low on hydrogen fuel.' },
      { term: 'White dwarf', definition: 'The small, dense, cooling remnant left behind after a low-to-medium mass star sheds its outer layers.' },
      { term: 'Supernova', definition: 'A massive stellar explosion marking the violent death of a high-mass star.' },
      { term: 'Planetary nebula', definition: 'A glowing shell of gas ejected by a dying low-mass star (unrelated to planets, despite the name).' },
    ],
    didYouKnow: [
      'Our Sun will eventually become a red giant, likely swelling large enough to engulf Mercury and Venus, before shrinking into a white dwarf.',
      'A single supernova can briefly outshine an entire galaxy.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: [],
  },
  {
    id: 'galaxies',
    title: 'Galaxies',
    tier: 'intermediate',
    icon: 'Sparkles',
    summary: 'Vast island universes of stars, gas, and dark matter, and the shapes they take.',
    estimatedMinutes: 8,
    content: [
      {
        heading: 'What Is a Galaxy?',
        body: 'A galaxy is a massive, gravitationally bound collection of stars, gas, dust, and dark matter. Galaxies range enormously in size — from dwarf galaxies with a few million stars to giant ellipticals with trillions.',
      },
      {
        heading: 'Types of Galaxies',
        body: 'Astronomers broadly classify galaxies into three shapes. Spiral galaxies, like our own Milky Way, have a flat rotating disk with sweeping spiral arms. Elliptical galaxies are smoother, rounder collections of older stars with little new star formation. Irregular galaxies don’t fit either category, often shaped by past collisions.',
      },
      {
        heading: 'Galaxy Collisions and Mergers',
        body: 'Galaxies aren’t static — over cosmic timescales, they interact, merge, and reshape each other under gravity. The Milky Way and the neighboring Andromeda Galaxy are on a slow collision course and are expected to merge in roughly 4.5 billion years.',
      },
    ],
    glossaryTerms: [
      { term: 'Galaxy', definition: 'A massive, gravitationally bound system of stars, gas, dust, and dark matter.' },
      { term: 'Spiral galaxy', definition: 'A disk-shaped galaxy with sweeping spiral arms, like the Milky Way.' },
      { term: 'Elliptical galaxy', definition: 'A smooth, rounded galaxy composed mostly of older stars, with little ongoing star formation.' },
      { term: 'Dark matter halo', definition: 'An invisible, massive envelope of dark matter thought to surround every galaxy, holding it together gravitationally.' },
    ],
    didYouKnow: [
      'The Milky Way and the Andromeda Galaxy are expected to collide in about 4.5 billion years.',
      'Some galaxies contain trillions of stars, while dwarf galaxies may have only a few million.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: [],
  },
  {
    id: 'black-holes',
    title: 'Black Holes',
    tier: 'intermediate',
    icon: 'CircleDot',
    summary: 'Regions of spacetime where gravity is so strong that nothing, not even light, can escape.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'What Is a Black Hole?',
        body: 'A black hole is a region where gravity has become so strong that nothing — not even light — can escape. The boundary marking the point of no return is called the event horizon.',
      },
      {
        heading: 'How Black Holes Form',
        body: 'Stellar-mass black holes form when a sufficiently massive star collapses at the end of its life. Supermassive black holes, millions to billions of times the Sun’s mass, sit at the centers of most large galaxies, including our own Milky Way — their exact origin is still an active area of research.',
      },
      {
        heading: 'Detecting the Invisible',
        body: 'Since a black hole itself emits no light, astronomers detect them indirectly — through their gravitational pull on nearby stars and gas, and through the intense X-rays given off by material heating up as it spirals into an accretion disk around the black hole. In 2019, the Event Horizon Telescope captured the first-ever direct image of a black hole’s silhouette.',
      },
    ],
    glossaryTerms: [
      { term: 'Event horizon', definition: 'The boundary around a black hole beyond which nothing, not even light, can escape.' },
      { term: 'Singularity', definition: 'The theoretical point at a black hole’s center where matter is crushed to infinite density.' },
      { term: 'Supermassive black hole', definition: 'An enormous black hole, millions to billions of times the Sun’s mass, found at the center of most large galaxies.' },
      { term: 'Accretion disk', definition: 'A swirling disk of superheated gas and dust spiraling into a black hole or other massive object.' },
    ],
    didYouKnow: [
      'The first-ever image of a black hole’s silhouette was captured in 2019, showing the supermassive black hole in galaxy M87.',
      'The Milky Way has its own supermassive black hole at its center, called Sagittarius A*.',
    ],
    relatedTheoryIds: ['general-relativity'],
    relatedPlanetIds: [],
  },
  {
    id: 'neutron-stars-pulsars',
    title: 'Neutron Stars & Pulsars',
    tier: 'intermediate',
    icon: 'Radar',
    summary: 'The dense, city-sized remnants of massive stars, some spinning hundreds of times per second.',
    estimatedMinutes: 8,
    content: [
      {
        heading: 'What Is a Neutron Star?',
        body: 'A neutron star is the collapsed core left behind after a massive star’s supernova. It packs more mass than the Sun into a sphere only about 20 km across — dense enough that a teaspoon of its material would weigh roughly a billion tons on Earth.',
      },
      {
        heading: 'Pulsars: Cosmic Lighthouses',
        body: 'Some neutron stars are pulsars — rapidly rotating, highly magnetized, and emitting beams of radiation from their magnetic poles. As the star spins, the beam sweeps past Earth like a lighthouse, appearing to "pulse" with extreme regularity, sometimes hundreds of times per second.',
      },
      {
        heading: 'Extreme Physics',
        body: 'Neutron stars push known physics to its limits: crushing gravity, magnetic fields far stronger than anything producible on Earth, and matter compressed denser than an atomic nucleus. Studying them helps physicists test theories that can’t be tested any other way.',
      },
    ],
    glossaryTerms: [
      { term: 'Neutron star', definition: 'The extremely dense, collapsed core left behind after a massive star’s supernova.' },
      { term: 'Pulsar', definition: 'A rapidly rotating neutron star that emits regular beams of radiation, observed as pulses from Earth.' },
      { term: 'Magnetar', definition: 'A type of neutron star with an exceptionally powerful magnetic field.' },
    ],
    didYouKnow: [
      'A teaspoon of neutron star material would weigh about a billion tons on Earth.',
      'The first pulsar discovered was initially nicknamed "LGM-1" (Little Green Men) because its regular pulses briefly seemed artificial.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: [],
  },
  {
    id: 'milky-way',
    title: 'The Milky Way',
    tier: 'intermediate',
    icon: 'Layers',
    summary: 'Our home galaxy — structure, scale, and our solar system’s place within it.',
    estimatedMinutes: 8,
    content: [
      {
        heading: 'A Barred Spiral Galaxy',
        body: 'The Milky Way is classified as a barred spiral galaxy: a central elongated "bar" of stars, surrounded by sweeping spiral arms, all embedded in a larger, roughly spherical halo of older stars and dark matter.',
      },
      {
        heading: 'Our Place in the Galaxy',
        body: 'Our solar system sits in a minor spiral arm known as the Orion Arm (or Orion Spur), roughly 26,000 light-years from the galactic center — out in the suburbs, not downtown.',
      },
      {
        heading: 'How Big Is the Milky Way?',
        body: 'The Milky Way’s disk spans roughly 100,000 light-years and contains an estimated 100 to 400 billion stars. It takes our solar system about 230 million years to complete one full orbit around the galactic center, a span of time sometimes called a "galactic year."',
      },
    ],
    glossaryTerms: [
      { term: 'Spiral arm', definition: 'One of the sweeping, star-rich curved bands radiating from the center of a spiral galaxy.' },
      { term: 'Galactic center', definition: 'The rotational center of a galaxy, in the Milky Way’s case marked by a supermassive black hole.' },
      { term: 'Orion Arm', definition: 'The minor spiral arm of the Milky Way in which our solar system is located.' },
    ],
    didYouKnow: [
      'It takes our solar system about 230 million years to complete one orbit around the Milky Way’s center — a period sometimes called a "galactic year."',
      'On a clear, dark night, the faint band of the Milky Way you see is the combined light of billions of stars in its disk.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: ['sun'],
  },

  // ── ADVANCED — The Cosmos ────────────────────────────────────────────────
  {
    id: 'cosmology-big-bang',
    title: 'Cosmology & the Big Bang',
    tier: 'advanced',
    icon: 'Zap',
    summary: 'The leading scientific model for how the universe began and evolved.',
    estimatedMinutes: 10,
    content: [
      {
        heading: 'The Big Bang Model',
        body: 'The Big Bang model describes a universe that began in an extremely hot, dense state roughly 13.8 billion years ago, and has been expanding and cooling ever since. It isn’t an explosion happening within space — it’s the expansion of space itself.',
      },
      {
        heading: 'Evidence for the Big Bang',
        body: 'Three major lines of evidence support the model: the cosmic microwave background, a faint glow of radiation filling the entire sky, left over from when the universe first became transparent to light; the observed redshift of distant galaxies, which recede faster the farther away they are (Hubble’s Law); and the observed abundance of light elements like hydrogen and helium, which matches predictions for a hot early universe.',
      },
      {
        heading: 'Cosmic Inflation',
        body: 'Cosmic inflation is a proposed period of extraordinarily rapid expansion in the first tiny fraction of a second after the Big Bang. It helps explain why the universe looks so uniform in every direction, even across regions that otherwise wouldn’t have had time to interact with each other.',
      },
    ],
    glossaryTerms: [
      { term: 'Cosmic microwave background', definition: 'Faint radiation filling the entire sky, left over from when the early universe first became transparent to light.' },
      { term: 'Redshift', definition: 'The stretching of light to longer, redder wavelengths as its source moves away, used to measure the recession of distant galaxies.' },
      { term: 'Hubble’s Law', definition: 'The observation that distant galaxies recede faster the farther away they are, evidence for an expanding universe.' },
      { term: 'Cosmic inflation', definition: 'A theorized period of extremely rapid expansion in the universe’s first fraction of a second.' },
    ],
    didYouKnow: [
      'The cosmic microwave background is essentially the "afterglow" of the Big Bang, discovered accidentally in 1965.',
      'Distant galaxies appear to move away from us faster the farther away they are — a relationship known as Hubble’s Law.',
    ],
    relatedTheoryIds: ['big-bang-theory', 'cosmic-inflation'],
    relatedPlanetIds: [],
  },
  {
    id: 'dark-matter',
    title: 'Dark Matter',
    tier: 'advanced',
    icon: 'EyeOff',
    summary: 'The invisible substance that outweighs ordinary matter in the universe, known only through its gravity.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'The Missing Mass Problem',
        body: 'Galaxies rotate faster than the gravity of their visible matter alone can explain — stars at their outer edges orbit almost as fast as those near the center, which shouldn’t be possible without extra, unseen mass holding them in. The same pattern appears in the motion of entire galaxy clusters.',
      },
      {
        heading: 'What Dark Matter Isn’t',
        body: 'Dark matter doesn’t emit, absorb, or reflect light, which rules out ordinary explanations like dim stars or clouds of gas in most cases. Whatever it is, it interacts with normal matter almost entirely through gravity alone.',
      },
      {
        heading: 'Leading Candidates',
        body: 'Physicists have proposed hypothetical particles — including WIMPs (Weakly Interacting Massive Particles) and axions — as dark matter candidates, and are actively searching for them in underground detectors and particle colliders. Despite decades of searching, none has ever been directly detected.',
      },
    ],
    glossaryTerms: [
      { term: 'Dark matter', definition: 'An invisible form of matter, detected only through its gravitational effects, that outweighs ordinary matter in the universe.' },
      { term: 'Galaxy rotation curve', definition: 'A plot of a galaxy’s orbital speed at different distances from its center, used as key evidence for dark matter.' },
      { term: 'WIMP', definition: 'Weakly Interacting Massive Particle — a leading hypothetical candidate for dark matter, not yet detected.' },
    ],
    didYouKnow: [
      'Dark matter is estimated to make up about 27% of the universe’s total mass-energy content, compared to about 5% for ordinary matter.',
      'Despite decades of searching, no dark matter particle has ever been directly detected in a lab.',
    ],
    relatedTheoryIds: ['dark-matter-hypothesis'],
    relatedPlanetIds: [],
  },
  {
    id: 'dark-energy',
    title: 'Dark Energy',
    tier: 'advanced',
    icon: 'Waves',
    summary: 'The mysterious force accelerating the expansion of the universe.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'An Accelerating Universe',
        body: 'In 1998, two independent teams studying distant exploding stars found something unexpected: the universe’s expansion is speeding up, not slowing down as gravity alone would predict.',
      },
      {
        heading: 'What Could Dark Energy Be?',
        body: 'The leading explanation is a cosmological constant — an inherent energy density built into empty space itself, pushing space apart. Its true underlying nature remains one of the biggest open questions in physics.',
      },
      {
        heading: 'The Fate of the Universe',
        body: 'How the universe ends depends heavily on dark energy’s exact behavior over time. Depending on the details, the universe could expand forever at an ever-accelerating rate, tear itself apart in a "Big Rip," or eventually change course entirely — nobody currently knows for certain.',
      },
    ],
    glossaryTerms: [
      { term: 'Dark energy', definition: 'A mysterious form of energy thought to be causing the accelerating expansion of the universe.' },
      { term: 'Cosmological constant', definition: 'A proposed constant energy density inherent to empty space, the leading explanation for dark energy.' },
      { term: 'Accelerating expansion', definition: 'The observation that the rate of the universe’s expansion is increasing over time, rather than slowing down.' },
    ],
    didYouKnow: [
      'Dark energy is estimated to make up about 68% of the universe’s total mass-energy content.',
      'The discovery of the universe’s accelerating expansion won the Nobel Prize in Physics in 2011.',
    ],
    relatedTheoryIds: ['dark-energy-hypothesis'],
    relatedPlanetIds: [],
  },
  {
    id: 'gravitational-waves',
    title: 'Gravitational Waves',
    tier: 'advanced',
    icon: 'Activity',
    summary: 'Ripples in spacetime itself, predicted by Einstein and first directly detected a century later.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'Ripples in Spacetime',
        body: 'Massive, rapidly accelerating objects — like two black holes spiraling into each other — stretch and compress the fabric of spacetime itself, sending ripples outward at the speed of light. These are gravitational waves.',
      },
      {
        heading: 'Predicted by Einstein',
        body: 'Albert Einstein’s general theory of relativity predicted gravitational waves in 1916, but Einstein himself doubted they would ever be detectable — the ripples they cause are almost unimaginably faint by the time they reach Earth.',
      },
      {
        heading: 'First Direct Detection',
        body: 'In 2015, the LIGO observatory directly detected gravitational waves for the first time, from two black holes merging over a billion light-years away — confirming Einstein’s century-old prediction and opening an entirely new way of observing the universe, one that doesn’t rely on light at all.',
      },
    ],
    glossaryTerms: [
      { term: 'General relativity', definition: 'Einstein’s theory describing gravity as the curvature of spacetime caused by mass and energy.' },
      { term: 'Spacetime', definition: 'The unified four-dimensional fabric of three spatial dimensions and time, central to general relativity.' },
      { term: 'LIGO', definition: 'The Laser Interferometer Gravitational-Wave Observatory, which made the first direct detection of gravitational waves in 2015.' },
    ],
    didYouKnow: [
      'The first gravitational wave detection in 2015 stretched LIGO’s 4-km detector arms by a fraction of the width of a proton.',
      'Gravitational wave astronomy lets scientists "hear" cosmic events like black hole mergers that emit no light at all.',
    ],
    relatedTheoryIds: ['general-relativity'],
    relatedPlanetIds: [],
  },
  {
    id: 'exoplanets-search-for-life',
    title: 'Exoplanets & the Search for Life',
    tier: 'advanced',
    icon: 'Rocket',
    summary: 'Planets beyond our solar system, and the ongoing hunt for signs of life elsewhere.',
    estimatedMinutes: 10,
    content: [
      {
        heading: 'Finding Worlds Around Other Stars',
        body: 'Two methods have found the vast majority of known exoplanets. The transit method detects a tiny, regular dip in a star’s brightness as a planet passes in front of it. The radial velocity method detects a star’s slight wobble, caused by the gravitational tug of an orbiting planet.',
      },
      {
        heading: 'The Habitable Zone',
        body: 'The habitable zone is the range of orbital distances from a star where a planet could plausibly have liquid water on its surface — not so close that water boils away, not so far that it freezes solid. It’s a key, though not the only, factor in the search for potentially life-bearing worlds.',
      },
      {
        heading: 'Biosignatures',
        body: 'Scientists search for biosignatures — chemical clues in a distant planet’s atmosphere, like oxygen or methane in combinations that are hard to explain without biological activity. No confirmed biosignature has been found on any exoplanet to date, but the search is a major driver of next-generation telescope design.',
      },
    ],
    glossaryTerms: [
      { term: 'Exoplanet', definition: 'A planet that orbits a star other than the Sun.' },
      { term: 'Transit method', definition: 'A technique for detecting exoplanets by observing the periodic dimming of a star as a planet passes in front of it.' },
      { term: 'Habitable zone', definition: 'The range of distances from a star where a planet could plausibly maintain liquid water on its surface.' },
      { term: 'Biosignature', definition: 'A chemical or physical sign in a planet’s atmosphere or surface that could indicate the presence of life.' },
    ],
    didYouKnow: [
      'Over 5,000 exoplanets have been confirmed since the first was discovered in 1995.',
      'The TRAPPIST-1 system contains seven roughly Earth-sized planets, several within its star’s habitable zone.',
    ],
    relatedTheoryIds: ['drake-equation'],
    relatedPlanetIds: ['earth'],
  },
  {
    id: 'future-space-exploration',
    title: 'The Future of Space Exploration',
    tier: 'advanced',
    icon: 'Satellite',
    summary: 'What’s next for human and robotic exploration of the solar system and beyond.',
    estimatedMinutes: 9,
    content: [
      {
        heading: 'Returning to the Moon',
        body: 'NASA’s Artemis program aims to return humans to the Moon’s surface and establish a sustainable long-term presence there, using it as a proving ground and stepping stone for eventual crewed missions to Mars.',
      },
      {
        heading: 'Human Missions to Mars',
        body: 'A crewed mission to Mars faces major unsolved challenges: months of radiation exposure during transit, the psychological toll of long-duration isolation, and the need for spacecraft and habitats that can produce their own food, water, and breathable air far from any resupply.',
      },
      {
        heading: 'Next-Generation Telescopes and Probes',
        body: 'Observatories like the James Webb Space Telescope are already reshaping our view of the early universe and distant exoplanets. Future robotic missions aim to explore icy moons like Europa and Enceladus, which may harbor subsurface oceans — among the most promising places to search for life beyond Earth without sending humans there at all.',
      },
    ],
    glossaryTerms: [
      { term: 'Artemis program', definition: 'NASA’s current program aiming to return humans to the Moon and establish a sustainable lunar presence.' },
      { term: 'In-situ resource utilization', definition: 'Using locally available material (like lunar or Martian soil) to produce resources needed for a mission, rather than shipping everything from Earth.' },
      { term: 'James Webb Space Telescope', definition: 'A large infrared space observatory, launched in 2021, designed to see further back in cosmic time than any prior telescope.' },
    ],
    didYouKnow: [
      'The James Webb Space Telescope observes primarily in infrared light, letting it see through cosmic dust and look further back in time than any telescope before it.',
      'NASA’s Artemis program is named after the twin sister of Apollo in Greek mythology.',
    ],
    relatedTheoryIds: [],
    relatedPlanetIds: ['mars', 'earth'],
  },
]

// ── Precomputed lookups ──────────────────────────────────────────────────────
export const modules = RAW_MODULES

export function getModule(id) {
  return modules.find(m => m.id === id)
}

export function getModulesByTier(tierId) {
  return modules.filter(m => m.tier === tierId)
}

// Flat, tier-ordered list (Beginner, then Intermediate, then Advanced, each in
// the authored order above) — used for Previous/Next navigation on ModuleDetail.
export const ALL_MODULES_ORDERED = TIERS.flatMap(tier => getModulesByTier(tier.id))

export function getAdjacentModules(id) {
  const idx = ALL_MODULES_ORDERED.findIndex(m => m.id === id)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? ALL_MODULES_ORDERED[idx - 1] : null,
    next: idx < ALL_MODULES_ORDERED.length - 1 ? ALL_MODULES_ORDERED[idx + 1] : null,
  }
}

// Tier unlock rule: a tier unlocks once at least 50% of the PREVIOUS tier's
// modules are marked complete. Beginner is always unlocked.
export function getUnlockThreshold(tierId) {
  const idx = TIERS.findIndex(t => t.id === tierId)
  if (idx <= 0) return 0
  const prevTierCount = getModulesByTier(TIERS[idx - 1].id).length
  return Math.ceil(prevTierCount * 0.5)
}

export default modules
