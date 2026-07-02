import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '../lib/textureLoader'
import { FRESNEL_VERTEX, FRESNEL_FRAGMENT, fresnelUniforms } from './shaders/fresnel'
import OrbitPath from './OrbitPath'
import PlanetLabel from './PlanetLabel'
import { dynamicHitRadius } from './hitRadius'

// Small/distant bodies (Moon, Pluto, Mercury) render at well under a screen
// pixel of true radius at the default zoom — clicking their VISIBLE mesh is
// nearly impossible. Every body gets an invisible, generously-sized proxy
// sphere purely for raycasting; it never renders (opacity 0) but still
// receives pointer events.
const MIN_HIT_RADIUS = 0.4
const HIT_RADIUS_MULTIPLE = 1.8

// Deterministic per-body starting angle so planets don't all launch aligned
// at angle zero — purely cosmetic, no astronomical meaning.
function hashAngle(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return ((h % 1000) / 1000) * Math.PI * 2
}

// Multiplies the planet's texture color when another body is selected — the
// spec calls for non-focused planets to "dim slightly", not black out.
// 0x555555 (33% brightness) compounded with the scene's already-modest
// point-light + ambient lighting was reading as a near-total blackout, not a
// dim. 0xb0b0b0 (~69%) is a genuinely subtle dim.
const DIM_COLOR   = new THREE.Color(0xb0b0b0)
const WHITE_COLOR = new THREE.Color(0xffffff)

function AtmosphereShell({ radius, color }) {
  const uniforms = useMemo(() => fresnelUniforms(color, 3.2, 0.75), [color])
  return (
    <mesh scale={1.03}>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial
        vertexShader={FRESNEL_VERTEX}
        fragmentShader={FRESNEL_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function Clouds({ radius, texture }) {
  const ref = useRef()
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.02 })
  return (
    <mesh ref={ref} scale={1.008}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshPhongMaterial map={texture} transparent opacity={0.4} depthWrite={false} />
    </mesh>
  )
}

function VenusHaze({ radius, texture }) {
  return (
    <mesh scale={1.015}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshPhongMaterial map={texture} transparent opacity={0.55} depthWrite={false} />
    </mesh>
  )
}

// Saturn's ring alpha texture is a radial gradient strip (inner→outer edge).
// RingGeometry's default UVs are angular, so we remap them to run linearly
// across the radius — the standard three.js technique for textured rings.
function Rings({ innerRadius, outerRadius, texture }) {
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(innerRadius, outerRadius, 128)
    const pos = geo.attributes.position
    const uv  = geo.attributes.uv
    const v3  = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i)
      const u = (v3.length() - innerRadius) / (outerRadius - innerRadius)
      uv.setXY(i, u, 1)
    }
    return geo
  }, [innerRadius, outerRadius])

  return (
    <mesh geometry={geometry} rotation-x={Math.PI / 2}>
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} opacity={0.92} />
    </mesh>
  )
}

export default function Planet({
  body, playingRef, speedRef, showOrbits, showLabels,
  selectedId, onSelect, registerRef, lowEnd, children,
}) {
  const pivotRef = useRef()
  const tiltRef  = useRef()
  const meshRef  = useRef()
  const hitRef   = useRef()
  const { gl } = useThree()

  const angleRef = useRef(hashAngle(body.id))
  const tmpVec   = useMemo(() => new THREE.Vector3(), [])

  // Highest-quality by default (this is the flagship page) — lowEnd only
  // clamps texture resolution when the device/quality toggle actually asks
  // for it, never below a still-sharp 4K.
  const mapMax = lowEnd ? 3072 : 8192

  // Always call the same fixed set of hooks in the same order (rules-of-hooks
  // safety) — optional maps fall back to the primary map URL, which the
  // texture cache in lib/textureLoader.js dedupes to zero extra cost.
  const mainMap    = useTexture(body.textures.map, mapMax)
  const nightMap   = useTexture(body.textures.night      ?? body.textures.map, mapMax)
  const cloudsMap  = useTexture(body.textures.clouds     ?? body.textures.map, 2048)
  const normalMap  = useTexture(body.textures.normal     ?? body.textures.map, mapMax)
  const specMap    = useTexture(body.textures.specular   ?? body.textures.map, mapMax)
  const atmoMap    = useTexture(body.textures.atmosphere ?? body.textures.map, 2048)
  const ringMap    = useTexture(body.textures.ring       ?? body.textures.map, 2048)

  // Sharper textures at oblique/grazing angles (rings, crescent-lit limbs).
  useMemo(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy()
    ;[mainMap, nightMap, normalMap, specMap].forEach(t => { if (t) t.anisotropy = maxAniso })
  }, [mainMap, nightMap, normalMap, specMap, gl])

  const tiltRad = THREE.MathUtils.degToRad(body.axialTiltDeg ?? 0)
  const dimmed  = selectedId != null && selectedId !== body.id

  // Floor for the hit-sphere's size — Earth gets a tighter multiple (it's
  // already the biggest inner-planet target) so it doesn't swallow clicks
  // meant for the Moon, which orbits close in at 2.4× Earth's own visual
  // radius. Ringed bodies floor to the visible ring's outer edge, or clicks
  // on the rings themselves — a large chunk of Saturn's clickable area —
  // would silently miss. This is only the MINIMUM: the actual hit-sphere is
  // resized every frame in useFrame to stay a roughly constant clickable
  // size on screen regardless of camera distance (see hitRadius.js) — a
  // fixed world-space size like this alone is only a few screen pixels at
  // the Explorer's wide default zoom, effectively unclickable for small/
  // distant bodies like Pluto, Mercury, and the Moon.
  const minHitRadius = body.hasRings
    ? body.scene.radius * body.ringOuterRatio * 1.05
    : Math.max(body.scene.radius * (body.id === 'earth' ? 1.15 : HIT_RADIUS_MULTIPLE), MIN_HIT_RADIUS)

  useFrame((state, delta) => {
    const playing = playingRef?.current ?? true
    const speed   = speedRef?.current ?? 1

    if (playing) {
      angleRef.current += delta * speed * body.scene.orbitSpeed
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * speed * body.scene.rotationSpeed
      }
    }

    if (pivotRef.current) {
      pivotRef.current.position.set(
        Math.cos(angleRef.current) * body.scene.distance,
        0,
        Math.sin(angleRef.current) * body.scene.distance,
      )
    }

    if (meshRef.current?.material?.color) {
      meshRef.current.material.color.lerp(dimmed ? DIM_COLOR : WHITE_COLOR, delta * 4)
    }

    if (hitRef.current && pivotRef.current) {
      pivotRef.current.getWorldPosition(tmpVec)
      const r = dynamicHitRadius(state.camera, state.size, tmpVec, minHitRadius)
      hitRef.current.scale.setScalar(r)
    }
  })

  const isEarth = body.id === 'earth'

  return (
    <>
      {showOrbits && <OrbitPath radius={body.scene.distance} color={body.color} />}

      <group ref={pivotRef}>
        <group ref={tiltRef} rotation={[0, 0, tiltRad]}>
          <mesh ref={meshRef}>
            <sphereGeometry args={[body.scene.radius, lowEnd ? 32 : 96, lowEnd ? 32 : 96]} />
            {isEarth ? (
              <meshPhongMaterial
                map={mainMap}
                normalMap={body.textures.normal ? normalMap : undefined}
                specularMap={body.textures.specular ? specMap : undefined}
                emissiveMap={nightMap}
                emissive={new THREE.Color(0x223355)}
                emissiveIntensity={0.35}
                specular={new THREE.Color(0x336699)}
                shininess={22}
              />
            ) : (
              <meshStandardMaterial map={mainMap} roughness={0.75} metalness={0.06} />
            )}
          </mesh>

          {/* Invisible, generously-sized proxy purely for click/hover raycasting
              — the visible sphere above is often sub-pixel at default zoom for
              small/distant bodies (Moon, Pluto, Mercury), making it an
              effectively impossible click target on its own. */}
          <mesh
            ref={hitRef}
            onClick={e => { e.stopPropagation(); onSelect?.(body.id) }}
            onPointerOver={() => { document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { document.body.style.cursor = 'auto' }}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          {isEarth && body.textures.clouds && <Clouds radius={body.scene.radius} texture={cloudsMap} />}
          {body.textures.atmosphere && <VenusHaze radius={body.scene.radius} texture={atmoMap} />}
          {!lowEnd && body.hasAtmosphere && <AtmosphereShell radius={body.scene.radius} color={body.color} />}
          {body.hasRings && (
            <Rings
              innerRadius={body.scene.radius * body.ringInnerRatio}
              outerRadius={body.scene.radius * body.ringOuterRatio}
              texture={ringMap}
            />
          )}
        </group>

        <PlanetLabel name={body.name} radius={body.scene.radius} visible={showLabels} />

        <group ref={el => registerRef?.(body.id, el)} />

        {children}
      </group>
    </>
  )
}
