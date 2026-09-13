import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import {
  magnitude, normalize, dot, scale, sub,
} from '../../lib/math'
import { useProjectionStore, GS_OUTPUT, GS_INPUT } from '../../state/useProjectionStore'
import SceneSetup from './SceneSetup'
import Axes from './Axes'

// ─── Arrow geometry constants ─────────────────────────────────────────────────
const SHAFT_R = 0.035
const HEAD_R  = 0.11
const HEAD_L  = 0.28
const MIN_MAG = 0.01
const _yAxis  = new THREE.Vector3(0, 1, 0)

// ─── Arrow helper ─────────────────────────────────────────────────────────────
function Arrow3D({
  end, color, opacity = 1, label = '', labelOffset = 0.35,
  origin = [0, 0, 0], emissiveIntensity = 0.15, pulsing = false,
}) {
  const matRef = useRef()
  const dx = end[0] - origin[0]
  const dy = end[1] - origin[1]
  const dz = end[2] - origin[2]
  const dir3 = [dx, dy, dz]
  const mag  = magnitude(dir3)

  useFrame(({ clock }) => {
    if (!pulsing || !matRef.current) return
    const t = clock.getElapsedTime()
    matRef.current.emissiveIntensity = 0.35 + 0.35 * Math.sin(t * 3)
  })

  if (mag < MIN_MAG) return null

  const shaftLen = Math.max(0, mag - HEAD_L)
  const dir      = normalize(dir3)
  const dirV     = new THREE.Vector3(...dir)
  const q        = new THREE.Quaternion().setFromUnitVectors(_yAxis, dirV)

  const shaftMid = [
    origin[0] + dir[0] * shaftLen / 2,
    origin[1] + dir[1] * shaftLen / 2,
    origin[2] + dir[2] * shaftLen / 2,
  ]
  const headPos = [
    origin[0] + dir[0] * (shaftLen + HEAD_L / 2),
    origin[1] + dir[1] * (shaftLen + HEAD_L / 2),
    origin[2] + dir[2] * (shaftLen + HEAD_L / 2),
  ]
  const labelPos = [
    end[0] + dir[0] * labelOffset,
    end[1] + dir[1] * labelOffset,
    end[2] + dir[2] * labelOffset,
  ]

  const transparent = opacity < 1
  const matProps = {
    color,
    emissive: color,
    emissiveIntensity,
    roughness: 0.3,
    metalness: 0.6,
    transparent,
    opacity,
    depthWrite: !transparent,
  }

  return (
    <group>
      {shaftLen > 0 && (
        <mesh position={shaftMid} quaternion={q}>
          <cylinderGeometry args={[SHAFT_R, SHAFT_R, shaftLen, 12]} />
          <meshStandardMaterial ref={pulsing ? matRef : undefined} {...matProps} />
        </mesh>
      )}

      <mesh position={headPos} quaternion={q}>
        <coneGeometry args={[HEAD_R, HEAD_L, 16]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {label && (
        <Text
          position={labelPos}
          fontSize={0.26}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.011}
          outlineColor="#0a0f1e"
          fillOpacity={opacity}
        >
          {label}
        </Text>
      )}
    </group>
  )
}

// ─── GS auto-play ticker ──────────────────────────────────────────────────────
function GsAutoPlay() {
  const lastTick = useRef(0)

  useFrame(({ clock }) => {
    const { gsPlaying, gsStep, gsVectors, nextGsStep } = useProjectionStore.getState()
    if (!gsPlaying) { lastTick.current = clock.getElapsedTime(); return }

    const elapsed = clock.getElapsedTime()
    if (elapsed - lastTick.current >= 1.0) {
      lastTick.current = elapsed
      if (gsStep < gsVectors.length) {
        nextGsStep()
      } else {
        // Loop back
        useProjectionStore.setState({ gsStep: 0 })
      }
    }
  })

  return null
}

// ─── Main scene ───────────────────────────────────────────────────────────────
export default function GramSchmidtScene() {
  const gsVectors = useProjectionStore((s) => s.gsVectors)
  const gsStep    = useProjectionStore((s) => s.gsStep)

  // Compute intermediate + final orthonormal basis
  const { steps } = useMemo(() => {
    const eps   = 1e-6
    const basis = []   // orthonormal vectors
    const steps = []   // { input, orthogonal (unnormalized), output (normalized) }

    for (const v of gsVectors) {
      const raw = [v.x, v.y, v.z]
      if (magnitude(raw) < eps) {
        steps.push({ input: raw, orthogonal: [0, 0, 0], output: [0, 0, 0] })
        continue
      }

      let w = [...raw]
      for (const b of basis) w = sub(w, scale(b, dot(w, b)))

      const ortho  = [...w]
      const normed = magnitude(w) > eps ? normalize(w) : [0, 0, 0]
      if (magnitude(w) > eps) basis.push(normed)

      steps.push({ input: raw, orthogonal: ortho, output: normed })
    }

    return { steps }
  }, [gsVectors])

  return (
    <>
      <GsAutoPlay />
      <SceneSetup />
      <Axes />

      {/* Input vectors (muted) */}
      {gsVectors.map((v, i) => (
        <Arrow3D
          key={`input-${v.id}`}
          end={[v.x, v.y, v.z]}
          color={v.color}
          opacity={0.3}
          label={v.label}
        />
      ))}

      {/* Orthogonalised + normalised output arrows per step */}
      {steps.map((step, i) => {
        if (i >= gsStep) return null

        const isCurrent = i === gsStep - 1
        const outColor  = GS_OUTPUT[i % GS_OUTPUT.length]

        return (
          <group key={`gs-step-${i}`}>
            {/* Grey semi-transparent orthogonal (before normalisation) */}
            {magnitude(step.orthogonal) > MIN_MAG && (
              <Arrow3D
                end={step.orthogonal}
                color="#64748b"
                opacity={0.35}
                label={`u${i + 1}`}
                labelOffset={0.25}
              />
            )}

            {/* Normalised output vector */}
            {magnitude(step.output) > MIN_MAG && (
              <Arrow3D
                end={step.output}
                color={outColor}
                emissiveIntensity={isCurrent ? 0.6 : 0.3}
                pulsing={isCurrent}
                label={`e${i + 1}`}
              />
            )}
          </group>
        )
      })}
    </>
  )
}
