// planets.js — orbital and physical data verified against NASA/NSSDC
// Planetary Fact Sheet (nssdc.gsfc.nasa.gov/planetary/factsheet)
//
// Orbital period, rotation period, axial tilt, radius, and distance-from-Sun
// fields below are VERIFIED (see CLAUDE.md §6 — "Orbital data VERIFIED").
//
// ⚠️ UNVERIFIED — the `facts` block on each body (numMoons, tempRangeC,
// description) was drafted from general astronomy knowledge, NOT cross-checked
// against a NASA source. Moon counts in particular change as new moons are
// discovered/confirmed (Jupiter/Saturn/Uranus/Neptune counts are especially
// volatile). Per CLAUDE.md §8/§9, this must be fact-checked before launch.

const KM_PER_AU     = 149_600_000
const EARTH_RADIUS_KM = 6371

// ── Scene scale constants ───────────────────────────────────────────────────
// Distance: square root of real AU distance (CLAUDE.md §6 decision) — keeps
// outer planets from vanishing off-scene while preserving relative ordering.
// Radius: cube root of real radius ratio to Earth — real linear ratios would
// make the Sun (109× Earth) dwarf the entire inner solar system at any scale
// that also fits Mercury's orbit. Cube-root compresses the range while still
// correctly ordering "gas giant > terrestrial > Sun-adjacent tiny bodies".
export const SCENE_SCALE = {
  distanceUnitPerSqrtAU: 10,   // scene units per √AU
  earthVisualRadius:     0.55, // scene units — Earth's rendered sphere radius
}

// Time: two INDEPENDENT scales, not one.
//  - Orbits use "1 Earth year = 20 seconds" (CLAUDE.md §6 decision), applied
//    uniformly to every orbital period including the Moon's real 27.3-day
//    orbit around Earth (so all revolution motion shares one consistent clock).
//  - Rotation (axial spin) is deliberately NOT driven by the same clock: at a
//    20s/year pace, Earth's real day:year ratio (1:365.25) would spin it
//    ~18 times per second — invisible as anything but a strobe. Instead
//    rotation maps "1 Earth day = 8 seconds", scaled proportionally for every
//    other body from ITS real rotation period. This preserves correct
//    relative ordering (Jupiter spins fastest, Mercury/Venus barely move)
//    while staying visually legible.
export const TIME_SCALE = {
  orbitSecondsPerYear:       20,
  rotationSecondsPerEarthDay: 8,
}

// Moon's orbit radius around Earth is NOT on the same √AU scale as the
// planet-Sun distances — true-to-scale (real ratio ~60 Earth radii) the Moon
// would sit inside Earth's rendered sphere, since Earth itself is already
// rendered far larger than true-to-scale relative to interplanetary distance.
// Exaggerated to a fixed multiple of Earth's own visual radius for legibility.
const MOON_ORBIT_RADIUS_EARTH_MULTIPLE = 2.4

function sceneRadius(radiusKm) {
  return Math.cbrt(radiusKm / EARTH_RADIUS_KM) * SCENE_SCALE.earthVisualRadius
}

function sceneDistanceFromSun(distanceKm) {
  const au = distanceKm / KM_PER_AU
  return Math.sqrt(au) * SCENE_SCALE.distanceUnitPerSqrtAU
}

export function orbitAngularSpeed(periodDays) {
  const periodSeconds = (periodDays / 365.25) * TIME_SCALE.orbitSecondsPerYear
  return (2 * Math.PI) / periodSeconds
}

// Retrograde rotation is encoded through axial tilt (>90°), NOT through a
// negative spin rate. NASA's fact sheet lists both a >90° obliquity AND a
// negative rotation period for the same three bodies (Venus, Uranus, Pluto)
// — those are two redundant descriptions of one physical fact, not two facts
// to compose. In this renderer each body's tilt group is rotated by its full
// axialTiltDeg (which may exceed 90°), and the mesh always spins with a
// POSITIVE right-hand-rule rate around that tilted local axis. When the tilt
// exceeds 90° the axis points into the "southern" hemisphere, so a positive
// local spin reads as retrograde motion to an outside observer — exactly
// matching reality. Applying the sign of rotationPeriodHours on TOP of that
// would double-flip these three bodies and make them look prograde again.
export function rotationAngularSpeed(periodHours) {
  const periodSeconds = (Math.abs(periodHours) / 24) * TIME_SCALE.rotationSecondsPerEarthDay
  return (2 * Math.PI) / periodSeconds
}

// ── Raw body data (verified fields per CLAUDE.md §6) ────────────────────────
const RAW_BODIES = [
  {
    id: 'sun', name: 'Sun', type: 'star', orbits: null, difficulty: 'beginner',
    color: '#FDB813',
    textures: { map: '/textures/sun/8k_sun.jpg' },
    radiusKm: 696_000, // IAU nominal solar radius — standard reference value, not from orbital-data.txt
    // Sun's rotation is differential (≈25 days at the equator, ≈35 days near
    // the poles) — there is no single "rotation period". A slow stylistic
    // self-rotation is used instead of an invented precise figure.
    facts: {
      numMoons: 0,
      tempRangeC: [5500, 15_000_000], // surface vs. core — UNVERIFIED, order-of-magnitude only
      description: 'The Sun is a G-type main-sequence star that holds the solar system together with its gravity and powers nearly all life on Earth through nuclear fusion in its core.',
    },
  },
  {
    id: 'mercury', name: 'Mercury', type: 'planet', orbits: 'sun', difficulty: 'beginner',
    color: '#9c9c9c',
    textures: { map: '/textures/mercury/8k_mercury.jpg' },
    radiusKm: 2440, distanceKm: 58_000_000,
    orbitalPeriodDays: 87.97, rotationPeriodHours: 1416, axialTiltDeg: 2,
    facts: {
      numMoons: 0,
      tempRangeC: [-180, 430],
      description: 'The closest planet to the Sun and the smallest in the solar system, Mercury has virtually no atmosphere, leaving it with the most extreme temperature swings of any planet.',
    },
  },
  {
    id: 'venus', name: 'Venus', type: 'planet', orbits: 'sun', difficulty: 'beginner',
    color: '#deb887',
    hasAtmosphere: true,
    textures: { map: '/textures/venus/8k_venus_surface.jpg', atmosphere: '/textures/venus/4k_venus_atmosphere.jpg' },
    radiusKm: 6052, distanceKm: 108_200_000,
    orbitalPeriodDays: 224.7, rotationPeriodHours: -5832.5, axialTiltDeg: 177.4,
    facts: {
      numMoons: 0,
      tempRangeC: [460, 470],
      description: "Venus rotates backwards compared to most planets and is wrapped in a thick, toxic atmosphere that traps heat so effectively it's the hottest planet in the solar system — hotter even than Mercury.",
    },
  },
  {
    id: 'earth', name: 'Earth', type: 'planet', orbits: 'sun', difficulty: 'beginner',
    color: '#4f8ef7',
    hasAtmosphere: true,
    // 8k_earth_daymap.jpg, not earth_color_21k.jpg — the 21k NASA file causes
    // GPU memory/load-time issues (CLAUDE.md §6, same call already made for
    // the landing-page hero). Explorer loads 10 bodies simultaneously, so the
    // cost is even more pronounced than the single-sphere hero case.
    textures: {
      map: '/textures/earth/8k_earth_daymap.jpg',
      night: '/textures/earth/8k_earth_nightmap.jpg',
      clouds: '/textures/earth/8k_earth_clouds.jpg',
      normal: '/textures/earth/8k_earth_normal_map.png',
      specular: '/textures/earth/8k_earth_specular_map.png',
    },
    radiusKm: 6371, distanceKm: 149_600_000,
    orbitalPeriodDays: 365.25, rotationPeriodHours: 23.9, axialTiltDeg: 23.4,
    facts: {
      numMoons: 1,
      tempRangeC: [-88, 58],
      description: 'Our home world is the only known place in the universe with liquid water on its surface and confirmed life — a thin, fragile atmosphere is all that separates it from the vacuum of space.',
    },
  },
  {
    id: 'moon', name: 'Moon', type: 'moon', orbits: 'earth', difficulty: 'beginner',
    color: '#b8b8b8',
    textures: { map: '/textures/moon/8k_moon.jpg' },
    radiusKm: 1737.4, distanceKm: 384_000, // from Earth, not the Sun
    orbitalPeriodDays: 27.3, rotationPeriodHours: 655.7, axialTiltDeg: 6.7,
    facts: {
      numMoons: 0,
      tempRangeC: [-173, 127],
      description: "Earth's only natural satellite is tidally locked, always showing the same face to Earth. It's the reason we have predictable ocean tides.",
    },
  },
  {
    id: 'mars', name: 'Mars', type: 'planet', orbits: 'sun', difficulty: 'beginner',
    color: '#c1440e',
    hasAtmosphere: true,
    textures: { map: '/textures/mars/8k_mars.jpg' },
    radiusKm: 3389.5, distanceKm: 227_900_000,
    orbitalPeriodDays: 687, rotationPeriodHours: 24.6, axialTiltDeg: 25.2,
    facts: {
      numMoons: 2,
      tempRangeC: [-140, 20],
      description: 'The "Red Planet" gets its color from iron oxide (rust) covering its surface. It hosts Olympus Mons, the largest volcano in the solar system, and is the main target for future crewed missions.',
    },
  },
  {
    id: 'jupiter', name: 'Jupiter', type: 'planet', orbits: 'sun', difficulty: 'intermediate',
    color: '#c88b3a',
    hasAtmosphere: true,
    textures: { map: '/textures/Jupiter/8k_jupiter.jpg' },
    radiusKm: 69_911, distanceKm: 778_500_000,
    orbitalPeriodDays: 4331, rotationPeriodHours: 9.9, axialTiltDeg: 3.1,
    facts: {
      numMoons: 95,
      tempRangeC: [-145, -145], // cloud-top temperature — gas giant, no solid surface
      description: "The largest planet in the solar system, Jupiter is a gas giant with a Great Red Spot — a storm larger than Earth that has raged for centuries — and the fastest rotation of any planet.",
    },
  },
  {
    id: 'saturn', name: 'Saturn', type: 'planet', orbits: 'sun', difficulty: 'intermediate',
    color: '#d4b96a',
    hasRings: true,
    textures: { map: '/textures/saturn/8k_saturn.jpg', ring: '/textures/saturn/8k_saturn_ring_alpha.png' },
    radiusKm: 58_232, distanceKm: 1_432_000_000,
    orbitalPeriodDays: 10_747, rotationPeriodHours: 10.7, axialTiltDeg: 26.7,
    ringInnerRatio: 1.2, ringOuterRatio: 2.3, // × planet radius
    facts: {
      numMoons: 146,
      tempRangeC: [-178, -178], // cloud-top temperature
      description: "Famous for its spectacular ring system made of countless chunks of ice and rock, Saturn is the least dense planet in the solar system — it would float in water, if there were an ocean big enough.",
    },
  },
  {
    id: 'uranus', name: 'Uranus', type: 'planet', orbits: 'sun', difficulty: 'intermediate',
    color: '#7de8e8',
    hasAtmosphere: false,
    textures: { map: '/textures/uranus/2k_uranus.jpg' },
    radiusKm: 25_362, distanceKm: 2_867_000_000,
    orbitalPeriodDays: 30_589, rotationPeriodHours: -17.2, axialTiltDeg: 97.8,
    facts: {
      numMoons: 28,
      tempRangeC: [-224, -224], // cloud-top temperature
      description: "Uranus rotates on its side — likely the result of an ancient collision — so its poles take turns facing the Sun directly during its 84-year orbit, giving it the most extreme seasons of any planet.",
    },
  },
  {
    id: 'neptune', name: 'Neptune', type: 'planet', orbits: 'sun', difficulty: 'intermediate',
    color: '#3444aa',
    hasAtmosphere: true,
    textures: { map: '/textures/neptune/2k_neptune.jpg' },
    radiusKm: 24_622, distanceKm: 4_515_000_000,
    orbitalPeriodDays: 59_800, rotationPeriodHours: 16.1, axialTiltDeg: 28.3,
    facts: {
      numMoons: 16,
      tempRangeC: [-218, -218], // cloud-top temperature
      description: 'The most distant planet from the Sun, Neptune has the strongest sustained winds in the solar system — supersonic gusts exceeding 2,000 km/h tear through its deep blue atmosphere.',
    },
  },
  {
    id: 'pluto', name: 'Pluto', type: 'dwarf', orbits: 'sun', difficulty: 'advanced',
    color: '#c9b8a8',
    textures: { map: '/textures/pluto/pluto_color_mapmosaic.jpg' },
    radiusKm: 1188, distanceKm: 5_906_000_000,
    orbitalPeriodDays: 90_560, rotationPeriodHours: -153.3, axialTiltDeg: 122.5,
    facts: {
      numMoons: 5,
      tempRangeC: [-240, -218],
      description: "Reclassified from a planet to a 'dwarf planet' by the IAU in 2006 after the discovery of similarly-sized icy worlds beyond Neptune, Pluto remains a favorite teaching example of how scientific classification evolves with new evidence.",
    },
  },
]

// ── Precompute scene-ready fields ────────────────────────────────────────────
export const bodies = RAW_BODIES.map(body => {
  const scene = { radius: sceneRadius(body.radiusKm) }

  if (body.orbits === 'sun') {
    scene.distance   = sceneDistanceFromSun(body.distanceKm)
    scene.orbitSpeed = orbitAngularSpeed(body.orbitalPeriodDays)
  } else if (body.orbits === 'earth') {
    scene.distance   = SCENE_SCALE.earthVisualRadius * MOON_ORBIT_RADIUS_EARTH_MULTIPLE
    scene.orbitSpeed = orbitAngularSpeed(body.orbitalPeriodDays)
  }

  if (body.rotationPeriodHours != null) {
    scene.rotationSpeed = rotationAngularSpeed(body.rotationPeriodHours)
  }

  return { ...body, scene }
})

export const sun     = bodies.find(b => b.id === 'sun')
export const planets = bodies.filter(b => b.type === 'planet' || b.type === 'dwarf')
export const moons    = bodies.filter(b => b.type === 'moon')

export function getBody(id) {
  return bodies.find(b => b.id === id)
}

export default bodies
