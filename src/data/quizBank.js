// quizBank.js — Quiz question bank for the /quiz system.
//
// ⚠️ UNVERIFIED — same policy as planets.js and modules.js: every specific
// fact referenced in these questions/explanations (dates, percentages,
// discovery years, etc.) was drafted from general astronomy knowledge, not
// cross-checked line-by-line against a NASA source. Must be fact-checked
// before launch — see CLAUDE.md §8.
//
// Each topic (`moduleId`) reuses the exact module ids from modules.js, and
// each topic's questions are all tagged with that module's own tier as
// `difficulty` — there is no cross-tier question pool per topic (a Beginner
// topic only ever has Beginner-difficulty questions). This matches how
// modules.js already ties one topic to one tier, so a per-topic "difficulty"
// is really just a read-only reflection of its tier, not an independent
// selector — see QuizStart's UI for how this is presented.
//
// Beginner topics have 8 questions each; Intermediate/Advanced have 5 each
// (per spec — "5+ for now, can expand later").

let _id = 0
const nextId = () => `q${++_id}`

function mc(moduleId, difficulty, question, options, correctIndex, explanation) {
  return { id: nextId(), moduleId, difficulty, type: 'multiple-choice', question, options, correctIndex, explanation }
}
function tf(moduleId, difficulty, question, correctAnswer, explanation) {
  return { id: nextId(), moduleId, difficulty, type: 'true-false', question, correctAnswer, explanation }
}
function fill(moduleId, difficulty, question, acceptableAnswers, explanation) {
  return { id: nextId(), moduleId, difficulty, type: 'fill-blank', question, acceptableAnswers, explanation }
}
function order(moduleId, difficulty, question, items, explanation) {
  return { id: nextId(), moduleId, difficulty, type: 'ordering', question, items, explanation }
}
function image(moduleId, difficulty, question, bodyId, options, correctIndex, explanation) {
  return { id: nextId(), moduleId, difficulty, type: 'image', question, bodyId, options, correctIndex, explanation }
}

const B = 'beginner', I = 'intermediate', A = 'advanced'

export const quizBank = [
  // ── universe-intro (Beginner) ──────────────────────────────────────────
  mc('universe-intro', B, 'What is a light-year a measurement of?',
    ['Distance', 'Time', 'Speed', 'Mass'], 0,
    'A light-year is the distance light travels in one year (about 9.46 trillion km) — despite the name, it measures distance, not time.'),
  mc('universe-intro', B, 'Roughly how old is the universe?',
    ['13.8 billion years', '4.6 billion years', '100 billion years', '1 million years'], 0,
    'The universe began roughly 13.8 billion years ago, based on measurements of the cosmic microwave background and the expansion rate of space.'),
  tf('universe-intro', B, 'The observable universe is exactly 13.8 billion light-years across.', false,
    'The observable universe is actually about 93 billion light-years across — larger than the universe\'s age in years would suggest, because space itself has been expanding the whole time light has been traveling toward us.'),
  fill('universe-intro', B, 'What technique lets astronomers measure distance to nearby stars by observing their apparent shift in position from two points in Earth\'s orbit?',
    ['parallax'],
    'Parallax measures how a nearby star appears to shift against distant background stars as Earth orbits the Sun, then uses simple geometry to calculate distance.'),
  mc('universe-intro', B, 'What is the largest known structure in the universe?',
    ['The cosmic web', 'The Milky Way', 'The solar system', 'The Local Group'], 0,
    'The cosmic web is a vast network of galaxy filaments and clusters separated by huge voids — the largest known structure in existence.'),
  tf('universe-intro', B, 'Spectroscopy can tell astronomers what a distant star is made of.', true,
    'Spectroscopy splits light into its component wavelengths, revealing an object\'s composition, temperature, and motion — all without ever traveling there.'),
  mc('universe-intro', B, 'About how many galaxies does the observable universe contain?',
    ['Two trillion', 'Two million', 'Two billion', 'Two hundred'], 0,
    'The observable universe is estimated to contain roughly two trillion galaxies, each with anywhere from millions to trillions of stars.'),
  order('universe-intro', B, 'Arrange these from smallest to largest scale:',
    ['Planet', 'Star', 'Galaxy', 'Universe'],
    'Planets orbit stars; stars (along with gas and dust) are gathered into galaxies; galaxies make up the universe as a whole.'),

  // ── our-solar-system (Beginner) ─────────────────────────────────────────
  mc('our-solar-system', B, 'About what percentage of the solar system\'s total mass does the Sun hold?',
    ['99.8%', '50%', '75%', '90%'], 0,
    'The Sun holds about 99.8% of all the mass in the solar system — everything else, including Jupiter, is essentially orbital debris by comparison.'),
  mc('our-solar-system', B, 'Which four planets are classified as terrestrial planets?',
    ['Mercury, Venus, Earth, Mars', 'Jupiter, Saturn, Uranus, Neptune', 'Earth, Mars, Jupiter, Saturn', 'Mercury, Venus, Mars, Jupiter'], 0,
    'Mercury, Venus, Earth, and Mars are terrestrial planets — relatively small, dense, rocky worlds with solid surfaces.'),
  tf('our-solar-system', B, 'The asteroid belt lies between Mars and Jupiter.', true,
    'The asteroid belt, home to most of the solar system\'s asteroids including the dwarf planet Ceres, orbits between Mars and Jupiter.'),
  fill('our-solar-system', B, 'What is the collapsing cloud of gas and dust that formed the Sun and the rest of the solar system called?',
    ['solar nebula'],
    'The solar nebula collapsed under its own gravity about 4.6 billion years ago, flattening into a disk that formed the Sun at its center and the planets from the remaining material.'),
  mc('our-solar-system', B, 'What does "AU" stand for in astronomy?',
    ['Astronomical Unit', 'Average Universe', 'Atomic Unit', 'Angular Unit'], 0,
    'An Astronomical Unit (AU) is the average distance from Earth to the Sun, about 150 million km — a convenient yardstick for solar system distances.'),
  order('our-solar-system', B, 'Order these planets by increasing distance from the Sun:',
    ['Mercury', 'Earth', 'Jupiter', 'Neptune'],
    'From the Sun outward: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.'),
  tf('our-solar-system', B, 'Jupiter has more mass than all the other planets combined.', true,
    'Jupiter\'s mass is more than twice that of all the other planets in the solar system combined.'),
  mc('our-solar-system', B, 'About how long ago did the solar system form?',
    ['4.6 billion years ago', '13.8 billion years ago', '1 billion years ago', '100 million years ago'], 0,
    'The solar system formed about 4.6 billion years ago, roughly a third of the universe\'s total age.'),

  // ── the-sun (Beginner) ───────────────────────────────────────────────────
  mc('the-sun', B, 'What type of star is the Sun?',
    ['A G-type main-sequence star', 'A red giant', 'A white dwarf', 'A neutron star'], 0,
    'The Sun is a G-type main-sequence star — a fairly ordinary, middle-aged star, about halfway through its roughly 10-billion-year main-sequence lifetime.'),
  fill('the-sun', B, 'What nuclear process powers the Sun, fusing hydrogen into helium?',
    ['fusion', 'nuclear fusion'],
    'Deep in the Sun\'s core, immense pressure and heat force hydrogen atoms to fuse into helium, releasing the energy that makes the Sun shine.'),
  mc('the-sun', B, 'What is the visible "surface" of the Sun called?',
    ['The photosphere', 'The corona', 'The core', 'The chromosphere'], 0,
    'The photosphere is the layer that emits most of the light we see — what we perceive as the Sun\'s surface.'),
  tf('the-sun', B, 'The Sun\'s corona is cooler than its photosphere.', false,
    'Counterintuitively, the Sun\'s faint outer corona is far hotter (millions of degrees) than the visible photosphere below it (about 5,500°C) — a phenomenon still being studied.'),
  mc('the-sun', B, 'About how hot is the Sun\'s core?',
    ['About 15 million °C', 'About 5,500°C', 'About 1 million °C', 'About 50,000°C'], 0,
    'The Sun\'s core reaches roughly 15 million °C — hot enough to sustain the nuclear fusion that powers it — while the visible surface is a comparatively cool 5,500°C.'),
  image('the-sun', B, 'Which body is shown here?', 'sun',
    ['The Sun', 'Mercury', 'Mars', 'A red giant star'], 0,
    'This is the Sun, our solar system\'s G-type main-sequence star.'),
  tf('the-sun', B, 'The Sun is roughly halfway through its main-sequence lifetime.', true,
    'Having formed about 4.6 billion years ago with roughly another 5 billion years of hydrogen fuel left, the Sun is about halfway through its stable main-sequence stage.'),
  mc('the-sun', B, 'What are temporary, cooler, darker patches on the Sun\'s surface called?',
    ['Sunspots', 'Solar flares', 'Coronal holes', 'Prominences'], 0,
    'Sunspots are cooler, darker patches caused by tangled magnetic fields on the Sun\'s surface.'),

  // ── inner-planets (Beginner) ─────────────────────────────────────────────
  mc('inner-planets', B, 'Which planet has the most extreme day-to-night temperature swings, due to having virtually no atmosphere?',
    ['Mercury', 'Venus', 'Earth', 'Mars'], 0,
    'With almost no atmosphere to trap or spread heat, Mercury swings from about 430°C in daytime to -180°C at night.'),
  tf('inner-planets', B, 'A single day on Venus is longer than a full year on Venus.', true,
    'Venus rotates so slowly (243 Earth days per rotation) that its day is longer than its 225-Earth-day year.'),
  mc('inner-planets', B, 'What makes Venus the hottest planet in the solar system, even hotter than Mercury?',
    ['A runaway greenhouse effect from its thick CO2 atmosphere', 'Being closer to the Sun', 'Volcanic activity alone', 'Having a thin atmosphere'], 0,
    'Venus\'s thick carbon dioxide atmosphere traps heat so effectively — a runaway greenhouse effect — that it\'s hotter than Mercury despite being farther from the Sun.'),
  fill('inner-planets', B, 'What is the name of the largest volcano in the solar system, found on Mars?',
    ['olympus mons'],
    'Olympus Mons is roughly three times the height of Mount Everest, making it the largest known volcano in the solar system.'),
  image('inner-planets', B, 'Which planet is known as the "Red Planet"?', 'mars',
    ['Mars', 'Venus', 'Mercury', 'Jupiter'], 0,
    'Mars gets its rusty red color from iron oxide covering its surface.'),
  order('inner-planets', B, 'Order these inner planets from closest to farthest from the Sun:',
    ['Mercury', 'Venus', 'Earth', 'Mars'],
    'The terrestrial planets in order from the Sun are Mercury, Venus, Earth, and Mars.'),
  tf('inner-planets', B, 'Among the terrestrial planets, Earth is unusual for having one large moon.', true,
    'Mercury and Venus have no moons, and Mars has only two tiny ones — Earth\'s single large Moon is unusual among the inner planets.'),
  mc('inner-planets', B, 'What gives Mars its distinctive reddish color?',
    ['Iron oxide (rust) covering its surface', 'Volcanic ash', 'Copper deposits', 'Its thick atmosphere'], 0,
    'Iron oxide — essentially rust — covering the Martian surface gives the planet its reddish appearance.'),

  // ── outer-planets (Beginner) ─────────────────────────────────────────────
  mc('outer-planets', B, 'Which is the largest planet in the solar system?',
    ['Jupiter', 'Saturn', 'Neptune', 'Uranus'], 0,
    'Jupiter is the largest planet, with a mass more than twice that of all the other planets combined.'),
  tf('outer-planets', B, 'Saturn is the least dense planet in the solar system.', true,
    'Saturn is so low-density it would float in an ocean large enough to hold it.'),
  mc('outer-planets', B, 'What is unusual about Uranus\'s rotation?',
    ['It rotates almost entirely on its side', 'It doesn\'t rotate at all', 'It rotates faster than any other planet', 'It only rotates once per Earth year'], 0,
    'Uranus is tilted roughly 98 degrees, rotating almost entirely on its side — likely the result of an ancient collision.'),
  fill('outer-planets', B, 'What is the name of Jupiter\'s centuries-old giant storm, larger than Earth?',
    ['great red spot', 'the great red spot'],
    'The Great Red Spot is a storm larger than Earth that has raged on Jupiter for centuries.'),
  mc('outer-planets', B, 'Which planet has the strongest sustained winds in the solar system?',
    ['Neptune', 'Jupiter', 'Saturn', 'Uranus'], 0,
    'Neptune has supersonic winds exceeding 2,000 km/h, the strongest sustained winds of any planet.'),
  image('outer-planets', B, 'Which planet is shown here, famous for its ring system?', 'saturn',
    ['Saturn', 'Jupiter', 'Uranus', 'Neptune'], 0,
    'Saturn\'s spectacular ring system, made of countless chunks of ice and rock, is its most recognizable feature.'),
  tf('outer-planets', B, 'Uranus and Neptune are classified as gas giants, just like Jupiter and Saturn.', false,
    'Uranus and Neptune are usually classified as ice giants — their interiors are dominated by denser "ices" like water, ammonia, and methane around a rocky core, unlike the mostly hydrogen/helium gas giants Jupiter and Saturn.'),
  order('outer-planets', B, 'Order these outer planets from closest to farthest from the Sun:',
    ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    'The outer planets in order from the Sun are Jupiter, Saturn, Uranus, and Neptune.'),

  // ── earths-moon (Beginner) ────────────────────────────────────────────────
  mc('earths-moon', B, 'What is the leading theory for how the Moon formed?',
    ['The giant-impact hypothesis', 'A captured asteroid', 'It formed alongside Earth independently', 'Volcanic ejection from Earth'], 0,
    'The giant-impact hypothesis holds that a Mars-sized body collided with the early Earth, and debris from the collision coalesced into the Moon.'),
  fill('earths-moon', B, 'What term describes the Moon always showing the same face to Earth?',
    ['tidal locking', 'tidally locked'],
    'The Moon is tidally locked to Earth — its rotation period exactly matches its orbital period, so we always see the same face.'),
  tf('earths-moon', B, 'A full cycle of Moon phases takes about 29.5 days.', true,
    'From new moon back to new moon takes approximately 29.5 days, the length of a lunar month.'),
  mc('earths-moon', B, 'What primarily causes Earth\'s ocean tides?',
    ['The Moon\'s gravity', 'Earth\'s rotation alone', 'Wind patterns', 'The Sun\'s heat'], 0,
    'The Moon\'s gravity (with a smaller contribution from the Sun) pulls ocean water into a bulge, driving the tides.'),
  mc('earths-moon', B, 'How many people have walked on the Moon?',
    ['12', '2', '50', '6'], 0,
    'Twelve astronauts walked on the Moon during NASA\'s Apollo missions between 1969 and 1972.'),
  tf('earths-moon', B, 'The Moon is slowly moving away from Earth over time.', true,
    'The Moon drifts away from Earth at about 3.8 cm per year.'),
  fill('earths-moon', B, 'What is the name of NASA\'s current program aiming to return humans to the Moon?',
    ['artemis', 'artemis program'],
    'NASA\'s Artemis program aims to return humans to the lunar surface and establish a sustainable presence there.'),
  order('earths-moon', B, 'Order these Moon phases as they occur after a new moon:',
    ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'],
    'Starting from new moon, the Moon waxes to first quarter, then full moon, then wanes through last quarter back to new moon.'),

  // ── asteroids-comets (Beginner) ──────────────────────────────────────────
  mc('asteroids-comets', B, 'Where do most asteroids in our solar system orbit?',
    ['The asteroid belt between Mars and Jupiter', 'Between Earth and Mars', 'Beyond Neptune', 'Around the Sun\'s poles'], 0,
    'Most asteroids orbit in the asteroid belt, a region between Mars and Jupiter.'),
  tf('asteroids-comets', B, 'A comet\'s tail always points away from the Sun, regardless of its direction of travel.', true,
    'Solar wind and radiation pressure push a comet\'s tail away from the Sun no matter which way the comet itself is moving.'),
  mc('asteroids-comets', B, 'What are comets primarily made of?',
    ['Ice and dust', 'Solid iron', 'Molten rock', 'Pure carbon'], 0,
    'Comets are icy bodies, often described as "dirty snowballs," made of ice and dust from the outer solar system.'),
  fill('asteroids-comets', B, 'What do we call a fragment of a meteoroid that survives passage through the atmosphere and lands on the ground?',
    ['meteorite'],
    'A meteorite is the surviving fragment that reaches the ground, distinct from a meteor (the streak of light) or a meteoroid (the object while still in space).'),
  mc('asteroids-comets', B, 'What is Ceres?',
    ['A dwarf planet in the asteroid belt', 'A comet', 'A moon of Jupiter', 'A type of meteor'], 0,
    'Ceres is the largest object in the asteroid belt, big enough to be round under its own gravity — classified as both an asteroid and a dwarf planet.'),
  tf('asteroids-comets', B, 'The impact linked to the extinction of the dinosaurs left a crater over 150 km wide.', true,
    'The impact event, in present-day Mexico, left a crater over 150 km wide and is widely thought to have caused the mass extinction that ended the age of dinosaurs.'),
  mc('asteroids-comets', B, 'What is the difference between a meteor and a meteorite?',
    ['A meteorite is a fragment that reaches the ground; a meteor is the streak of light in the sky', 'They are the same thing', 'A meteorite is bigger than a planet', 'A meteor only occurs in winter'], 0,
    'A meteoroid becomes a "meteor" (a streak of light) as it burns in the atmosphere, and a "meteorite" if any part of it survives to reach the ground.'),
  fill('asteroids-comets', B, 'What distant, hypothesized spherical shell of icy bodies is thought to surround the entire solar system?',
    ['oort cloud', 'the oort cloud'],
    'The Oort Cloud is a hypothesized, extremely distant shell of icy bodies thought to surround the entire solar system, a source of long-period comets.'),

  // ── pluto-dwarf-planets (Beginner) ───────────────────────────────────────
  mc('pluto-dwarf-planets', B, 'In what year was Pluto reclassified as a dwarf planet?',
    ['2006', '1930', '2015', '1999'], 0,
    'The International Astronomical Union reclassified Pluto as a dwarf planet in 2006.'),
  tf('pluto-dwarf-planets', B, 'A dwarf planet orbits the Sun and is round, but has not cleared its orbital neighborhood of similar-sized objects.', true,
    'That\'s the key distinction between a dwarf planet and a full planet under the IAU\'s 2006 definition.'),
  mc('pluto-dwarf-planets', B, 'Which organization made the decision to reclassify Pluto?',
    ['The International Astronomical Union (IAU)', 'NASA', 'The United Nations', 'The Royal Astronomical Society'], 0,
    'The International Astronomical Union (IAU) is responsible for official astronomical definitions and naming, including Pluto\'s 2006 reclassification.'),
  fill('pluto-dwarf-planets', B, 'What is the name of the heart-shaped nitrogen-ice plain on Pluto?',
    ['tombaugh regio'],
    'Tombaugh Regio, named after Pluto\'s discoverer Clyde Tombaugh, is the large heart-shaped nitrogen-ice plain revealed by New Horizons.'),
  mc('pluto-dwarf-planets', B, 'Which spacecraft performed the first flyby of Pluto, in 2015?',
    ['New Horizons', 'Voyager 1', 'Cassini', 'Juno'], 0,
    'NASA\'s New Horizons spacecraft became the first to fly past Pluto in 2015.'),
  tf('pluto-dwarf-planets', B, 'Eris, Makemake, and Haumea are also classified as dwarf planets.', true,
    'The same 2006 IAU decision that reclassified Pluto also newly classified Eris, Makemake, and Haumea (along with Ceres) as dwarf planets.'),
  mc('pluto-dwarf-planets', B, 'What is the name of Pluto\'s largest moon?',
    ['Charon', 'Titan', 'Europa', 'Triton'], 0,
    'Charon, about half Pluto\'s size, is Pluto\'s largest of five known moons.'),
  fill('pluto-dwarf-planets', B, 'About how many Earth years does it take Pluto to orbit the Sun once?',
    ['248', '248 years'],
    'One Pluto year is about 248 Earth years — it hasn\'t completed a single orbit since its discovery in 1930.'),

  // ── stars-stellar-evolution (Intermediate) ───────────────────────────────
  mc('stars-stellar-evolution', I, 'What is the long, stable stage of a star\'s life called?',
    ['The main sequence', 'The red giant phase', 'A supernova', 'A protostar'], 0,
    'The main sequence is the long, stable stage when a star fuses hydrogen into helium in its core, balancing gravity with outward pressure.'),
  tf('stars-stellar-evolution', I, 'More massive stars generally live longer than smaller stars.', false,
    'Despite having more fuel, massive stars burn it far faster, giving them dramatically shorter lifespans than smaller stars.'),
  fill('stars-stellar-evolution', I, 'What is a giant cloud of gas and dust where stars are born called?',
    ['nebula'],
    'Stars form inside nebulae, vast clouds of gas and dust that collapse under gravity to ignite nuclear fusion.'),
  mc('stars-stellar-evolution', I, 'What does the Hertzsprung-Russell diagram plot?',
    ['A star\'s temperature against its brightness', 'A star\'s age against its mass', 'A planet\'s distance against its orbital period', 'A galaxy\'s size against its star count'], 0,
    'The H-R diagram plots stars by surface temperature and brightness, used to classify stars and understand stellar evolution.'),
  mc('stars-stellar-evolution', I, 'What process do stars use to fuse lighter elements into heavier ones?',
    ['Stellar nucleosynthesis', 'Radioactive decay', 'Chemical combustion', 'Gravitational collapse alone'], 0,
    'Stellar nucleosynthesis is the process by which stars fuse lighter elements into heavier ones in their cores.'),

  // ── life-cycle-of-stars (Intermediate) ───────────────────────────────────
  mc('life-cycle-of-stars', I, 'What happens to a star like the Sun after it exhausts its core hydrogen?',
    ['It expands into a red giant', 'It immediately becomes a black hole', 'It explodes as a supernova', 'It stays the same size forever'], 0,
    'A Sun-like star expands into a red giant as core hydrogen runs low, eventually shedding its outer layers and leaving behind a white dwarf.'),
  fill('life-cycle-of-stars', I, 'What is the small, dense remnant left behind after a Sun-like star sheds its outer layers?',
    ['white dwarf'],
    'A white dwarf is the small, extremely dense stellar remnant left behind after a low-to-medium mass star sheds its outer layers.'),
  tf('life-cycle-of-stars', I, 'A supernova can briefly outshine an entire galaxy.', true,
    'A supernova explosion, marking the violent death of a massive star, can briefly outshine its entire host galaxy.'),
  mc('life-cycle-of-stars', I, 'What determines whether a dying star becomes a white dwarf, neutron star, or black hole?',
    ['Its original mass', 'Its color', 'Its distance from Earth', 'Its rotation speed'], 0,
    'A star\'s original mass determines its final fate — low-mass stars leave white dwarfs, more massive stars leave neutron stars, and the most massive leave black holes.'),
  mc('life-cycle-of-stars', I, 'What is a planetary nebula?',
    ['A glowing shell of gas ejected by a dying low-mass star', 'A nebula that forms new planets', 'A ring around a planet', 'A type of exoplanet'], 0,
    'A planetary nebula is a glowing shell of gas shed by a dying low-mass star — unrelated to actual planets, despite the name.'),

  // ── galaxies (Intermediate) ───────────────────────────────────────────────
  mc('galaxies', I, 'What shape is the Milky Way galaxy?',
    ['Spiral', 'Elliptical', 'Irregular', 'Perfectly spherical'], 0,
    'The Milky Way is a (barred) spiral galaxy, with a flat rotating disk and sweeping spiral arms.'),
  tf('galaxies', I, 'The Milky Way and Andromeda galaxies are expected to collide in about 4.5 billion years.', true,
    'The Milky Way and the neighboring Andromeda Galaxy are on a slow collision course, expected to merge in roughly 4.5 billion years.'),
  fill('galaxies', I, 'What do astronomers call a smooth, rounded galaxy composed mostly of older stars?',
    ['elliptical galaxy', 'elliptical'],
    'Elliptical galaxies are smooth, rounded collections of mostly older stars, with little ongoing star formation.'),
  mc('galaxies', I, 'What is thought to surround every galaxy and hold it together gravitationally, despite being invisible?',
    ['A dark matter halo', 'A magnetic shield', 'A gas cloud', 'An asteroid ring'], 0,
    'A dark matter halo is an invisible, massive envelope thought to surround every galaxy, providing the extra gravity that holds it together.'),
  mc('galaxies', I, 'Roughly how many stars can a giant galaxy contain?',
    ['Trillions', 'Hundreds', 'Thousands', 'A few million only'], 0,
    'Giant galaxies can contain trillions of stars, while dwarf galaxies may have only a few million.'),

  // ── black-holes (Intermediate) ───────────────────────────────────────────
  mc('black-holes', I, 'What is the boundary around a black hole beyond which nothing can escape called?',
    ['The event horizon', 'The singularity', 'The accretion disk', 'The photon ring'], 0,
    'The event horizon marks the point of no return around a black hole — beyond it, not even light can escape.'),
  tf('black-holes', I, 'Black holes can be detected directly by the light they emit.', false,
    'Black holes emit no light at all — they\'re detected indirectly, through their gravitational pull on nearby matter, X-rays from infalling material, or direct imaging of their silhouette.'),
  fill('black-holes', I, 'What is the name of the supermassive black hole at the center of the Milky Way?',
    ['sagittarius a*', 'sagittarius a'],
    'Sagittarius A* is the supermassive black hole at the center of our own galaxy, the Milky Way.'),
  mc('black-holes', I, 'In what year was the first-ever image of a black hole\'s silhouette captured?',
    ['2019', '1990', '2005', '2015'], 0,
    'The Event Horizon Telescope captured the first-ever direct image of a black hole\'s silhouette in 2019, showing the supermassive black hole in galaxy M87.'),
  mc('black-holes', I, 'What forms stellar-mass black holes?',
    ['The collapse of a sufficiently massive star', 'Two planets colliding', 'The Big Bang directly', 'The cooling of a white dwarf'], 0,
    'Stellar-mass black holes form when a sufficiently massive star collapses at the end of its life.'),

  // ── neutron-stars-pulsars (Intermediate) ─────────────────────────────────
  mc('neutron-stars-pulsars', I, 'What is a neutron star?',
    ['The extremely dense, collapsed core left behind after a massive star\'s supernova', 'A star made entirely of neutrons floating freely in space', 'A newly forming star', 'A dead white dwarf'], 0,
    'A neutron star is the collapsed core left behind after a massive star\'s supernova, packing more mass than the Sun into a sphere only about 20 km across.'),
  tf('neutron-stars-pulsars', I, 'A teaspoon of neutron star material would weigh about a billion tons on Earth.', true,
    'Neutron stars are so dense that a teaspoon of their material would weigh roughly a billion tons on Earth.'),
  fill('neutron-stars-pulsars', I, 'What term describes a rapidly rotating neutron star that emits regular beams of radiation?',
    ['pulsar'],
    'A pulsar is a rapidly rotating, highly magnetized neutron star whose radiation beam sweeps past Earth like a lighthouse.'),
  mc('neutron-stars-pulsars', I, 'Why was the first pulsar discovered briefly nicknamed "LGM-1"?',
    ['Its extremely regular pulses briefly seemed possibly artificial', 'It was found by a scientist named LGM', 'It was the first galaxy ever discovered', 'It emitted green light'], 0,
    'The first pulsar\'s remarkably regular pulses briefly seemed like they might be an artificial signal, earning the nickname "Little Green Men" (LGM-1).'),
  mc('neutron-stars-pulsars', I, 'What is a magnetar?',
    ['A type of neutron star with an exceptionally powerful magnetic field', 'A magnetic black hole', 'A star that repels light', 'A moon with a magnetic core'], 0,
    'A magnetar is a neutron star with an extraordinarily powerful magnetic field, far stronger than anything producible on Earth.'),

  // ── milky-way (Intermediate) ─────────────────────────────────────────────
  mc('milky-way', I, 'What type of galaxy is the Milky Way classified as?',
    ['A barred spiral galaxy', 'An elliptical galaxy', 'An irregular galaxy', 'A ring galaxy'], 0,
    'The Milky Way is a barred spiral galaxy — a central elongated bar of stars surrounded by sweeping spiral arms.'),
  fill('milky-way', I, 'What is the name of the minor spiral arm in which our solar system is located?',
    ['orion arm', 'orion spur'],
    'Our solar system sits in the Orion Arm (or Orion Spur), a minor spiral arm of the Milky Way.'),
  tf('milky-way', I, 'It takes the solar system about 230 million years to orbit the center of the Milky Way once.', true,
    'One full orbit of the solar system around the galactic center — sometimes called a "galactic year" — takes about 230 million years.'),
  mc('milky-way', I, 'Roughly how many stars does the Milky Way contain?',
    ['100 to 400 billion', 'About 1,000', 'About 1 million', 'Over 10 trillion'], 0,
    'The Milky Way is estimated to contain 100 to 400 billion stars.'),
  mc('milky-way', I, 'About how far is our solar system from the galactic center?',
    ['About 26,000 light-years', 'About 4 light-years', 'About 100 light-years', 'About 1 million light-years'], 0,
    'Our solar system sits roughly 26,000 light-years from the Milky Way\'s galactic center.'),

  // ── cosmology-big-bang (Advanced) ────────────────────────────────────────
  mc('cosmology-big-bang', A, 'About how old is the universe according to the Big Bang model?',
    ['13.8 billion years', '4.6 billion years', '100 billion years', '1 trillion years'], 0,
    'The Big Bang model describes a universe that began roughly 13.8 billion years ago in an extremely hot, dense state.'),
  tf('cosmology-big-bang', A, 'The Big Bang was an explosion that happened at a single point within already-existing space.', false,
    'The Big Bang was not an explosion within space — it was the expansion of space itself, with no pre-existing "container" it happened inside of.'),
  fill('cosmology-big-bang', A, 'What is the name for the faint radiation filling the sky, left over from the early universe?',
    ['cosmic microwave background', 'cmb'],
    'The cosmic microwave background is the "afterglow" of the Big Bang, radiation left over from when the universe first became transparent to light.'),
  mc('cosmology-big-bang', A, 'What does Hubble\'s Law describe?',
    ['Distant galaxies recede faster the farther away they are', 'The speed of light in a vacuum', 'The orbit of planets around stars', 'The lifespan of stars'], 0,
    'Hubble\'s Law describes the observation that distant galaxies move away from us faster the farther away they are — key evidence for an expanding universe.'),
  mc('cosmology-big-bang', A, 'What is cosmic inflation?',
    ['A theorized period of extremely rapid expansion just after the Big Bang', 'The current slow expansion of the universe', 'The formation of black holes', 'The cooling of stars over time'], 0,
    'Cosmic inflation is a proposed period of extraordinarily rapid expansion in the first fraction of a second after the Big Bang, helping explain the universe\'s large-scale uniformity.'),

  // ── dark-matter (Advanced) ────────────────────────────────────────────────
  mc('dark-matter', A, 'What evidence points to the existence of dark matter?',
    ['Galaxies rotate faster than visible matter alone can explain', 'Stars are hotter than expected', 'Planets orbit backwards', 'Light travels slower in space'], 0,
    'Galaxy rotation curves show stars orbiting far faster than the visible matter\'s gravity alone could explain — strong evidence for additional, unseen mass.'),
  tf('dark-matter', A, 'Dark matter emits light that is just too faint to see with current telescopes.', false,
    'Dark matter doesn\'t emit, absorb, or reflect light at all — that\'s precisely what makes it "dark" and undetectable by any telescope, regardless of sensitivity.'),
  fill('dark-matter', A, 'What is a leading hypothetical particle candidate for dark matter, often abbreviated WIMP?',
    ['weakly interacting massive particle', 'wimp'],
    'WIMPs (Weakly Interacting Massive Particles) are one of the leading hypothetical candidates for dark matter, though none has ever been directly detected.'),
  mc('dark-matter', A, 'Roughly what percentage of the universe\'s total mass-energy is estimated to be dark matter?',
    ['About 27%', 'About 5%', 'About 68%', 'About 95%'], 0,
    'Dark matter is estimated to make up about 27% of the universe\'s total mass-energy content, compared to about 5% for ordinary matter.'),
  mc('dark-matter', A, 'Has a dark matter particle ever been directly detected in a laboratory?',
    ['No, despite decades of searching', 'Yes, in 2015', 'Yes, in the 1990s', 'Yes, but only in theoretical experiments'], 0,
    'Despite decades of searching with underground detectors and particle colliders, no dark matter particle has ever been directly detected.'),

  // ── dark-energy (Advanced) ────────────────────────────────────────────────
  mc('dark-energy', A, 'What did astronomers discover in 1998 about the universe\'s expansion?',
    ['It is accelerating', 'It is slowing down', 'It has stopped', 'It reverses periodically'], 0,
    'In 1998, observations of distant supernovae revealed that the universe\'s expansion is speeding up, not slowing down as gravity alone would predict.'),
  fill('dark-energy', A, 'What is the leading explanation for dark energy, describing an inherent energy density of empty space itself?',
    ['cosmological constant'],
    'The cosmological constant is the leading explanation for dark energy — a constant energy density built into empty space, pushing space apart.'),
  tf('dark-energy', A, 'Dark energy is estimated to make up roughly two-thirds of the universe\'s total mass-energy.', true,
    'Dark energy is estimated to account for about 68% of the universe\'s total mass-energy content.'),
  mc('dark-energy', A, 'What discovery about the universe\'s expansion won the Nobel Prize in Physics in 2011?',
    ['Its accelerating expansion', 'The Big Bang itself', 'Gravitational waves', 'Dark matter'], 0,
    'The discovery that the universe\'s expansion is accelerating won the Nobel Prize in Physics in 2011.'),
  mc('dark-energy', A, 'What is one possible ultimate fate of the universe depending on dark energy\'s exact behavior?',
    ['It could expand forever at an ever-accelerating rate', 'It will definitely collapse next year', 'It has already stopped expanding', 'It will turn into a single black hole'], 0,
    'Depending on dark energy\'s precise behavior over time, the universe could expand forever at an accelerating rate, or follow a very different path — the exact fate is still an open question.'),

  // ── gravitational-waves (Advanced) ───────────────────────────────────────
  mc('gravitational-waves', A, 'What are gravitational waves?',
    ['Ripples in spacetime caused by massive accelerating objects', 'Sound waves traveling through space', 'Light waves from distant stars', 'Radio signals from pulsars'], 0,
    'Gravitational waves are ripples in the fabric of spacetime itself, produced by massive, rapidly accelerating objects like merging black holes.'),
  fill('gravitational-waves', A, 'Which observatory made the first direct detection of gravitational waves, in 2015?',
    ['ligo'],
    'LIGO (the Laser Interferometer Gravitational-Wave Observatory) made the first direct detection of gravitational waves in 2015.'),
  tf('gravitational-waves', A, 'Albert Einstein predicted gravitational waves in his general theory of relativity.', true,
    'Einstein\'s general theory of relativity predicted gravitational waves in 1916, nearly a century before they were first directly detected.'),
  mc('gravitational-waves', A, 'What kind of event produced the gravitational waves first detected in 2015?',
    ['Two black holes merging', 'A supernova explosion', 'A solar flare', 'A planet forming'], 0,
    'The 2015 detection came from two black holes merging over a billion light-years away.'),
  mc('gravitational-waves', A, 'Why is gravitational wave astronomy significant?',
    ['It lets scientists detect cosmic events that emit no light at all', 'It replaces the need for telescopes entirely', 'It can only detect events within our own solar system', 'It measures a star\'s surface temperature'], 0,
    'Gravitational wave astronomy opens an entirely new way of observing the universe, letting scientists "hear" events like black hole mergers that emit no light at all.'),

  // ── exoplanets-search-for-life (Advanced) ────────────────────────────────
  mc('exoplanets-search-for-life', A, 'What is the transit method used for?',
    ['Detecting exoplanets by observing a star\'s brightness dip as a planet passes in front of it', 'Measuring a star\'s surface temperature', 'Detecting black holes', 'Measuring the speed of light'], 0,
    'The transit method detects exoplanets by observing the periodic, tiny dip in a star\'s brightness as a planet passes in front of it.'),
  fill('exoplanets-search-for-life', A, 'What term describes the region around a star where a planet could plausibly have liquid water on its surface?',
    ['habitable zone'],
    'The habitable zone is the range of orbital distances from a star where temperatures could allow liquid water on a planet\'s surface.'),
  tf('exoplanets-search-for-life', A, 'Over 5,000 exoplanets have been confirmed since the first was discovered in 1995.', true,
    'More than 5,000 exoplanets have been confirmed since the first was discovered orbiting a Sun-like star in 1995.'),
  mc('exoplanets-search-for-life', A, 'What is a biosignature?',
    ['A chemical or physical sign that could indicate the presence of life', 'A type of star', 'A satellite communication signal', 'A planet\'s magnetic field strength'], 0,
    'A biosignature is a chemical or physical clue — like an unusual combination of gases in an atmosphere — that could hint at biological activity.'),
  mc('exoplanets-search-for-life', A, 'What is notable about the TRAPPIST-1 system?',
    ['It contains seven roughly Earth-sized planets, several within the habitable zone', 'It has only one known planet', 'It is the closest star system to our Sun', 'It is a black hole'], 0,
    'The TRAPPIST-1 system contains seven roughly Earth-sized planets, several of which orbit within the star\'s habitable zone.'),

  // ── future-space-exploration (Advanced) ──────────────────────────────────
  mc('future-space-exploration', A, 'What is the primary goal of NASA\'s Artemis program?',
    ['Return humans to the Moon and establish a sustainable presence', 'Send the first probe to the Sun', 'Build a space station on Mars immediately', 'Launch the first exoplanet mission'], 0,
    'NASA\'s Artemis program aims to return humans to the lunar surface and establish a sustainable long-term presence, as a stepping stone toward Mars.'),
  fill('future-space-exploration', A, 'What space telescope, launched in 2021, observes primarily in infrared light?',
    ['james webb space telescope', 'james webb', 'jwst'],
    'The James Webb Space Telescope observes primarily in infrared light, letting it see through cosmic dust and look further back in time than any prior telescope.'),
  tf('future-space-exploration', A, 'A major challenge for a crewed Mars mission is the need for self-sufficient food, water, and air production.', true,
    'Far from any resupply, a crewed Mars mission needs spacecraft and habitats capable of producing their own food, water, and breathable air.'),
  mc('future-space-exploration', A, 'Which icy moons are considered promising targets in the search for subsurface oceans?',
    ['Europa and Enceladus', 'The Moon and Mars', 'Mercury and Venus', 'Titan and the Sun'], 0,
    'Europa and Enceladus, icy moons of Jupiter and Saturn respectively, may harbor subsurface oceans — among the most promising places to search for life beyond Earth.'),
  mc('future-space-exploration', A, 'Who is NASA\'s Artemis program named after, in Greek mythology?',
    ['Apollo\'s twin sister', 'Zeus\'s son', 'The god of the sea', 'A Titan'], 0,
    'Artemis is named after the twin sister of Apollo in Greek mythology — a fitting name for the program following in Apollo\'s footsteps.'),
]

export function getQuestionsForTopic(moduleId) {
  return quizBank.filter(q => q.moduleId === moduleId)
}

export function getQuestionsForTopics(moduleIds) {
  return quizBank.filter(q => moduleIds.includes(q.moduleId))
}

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Generates a randomized 8-10 question set from a pool. If the pool has
// fewer than 10 questions (true for every Intermediate/Advanced topic today,
// which only have 5 each), it simply uses the whole pool shuffled rather
// than padding or repeating questions.
export function generateQuizSet(pool, targetCount = 10) {
  const count = Math.min(targetCount, pool.length)
  return shuffle(pool).slice(0, count)
}
