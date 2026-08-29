import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMatrixStore } from '../../state/useMatrixStore'
import { matMul, normalize, magnitude, smoothStep } from '../../lib/math'

// ─── Arrow geometry constants ─────────────────────────────────────────────────
const SHAFT_R = 0.04
const HEAD_R  = 0.12
const HEAD_L  = 0.30

// Standard basis vectors with their display colours
const BASIS = [
  { vec: [1, 0, 0], color: '#ff4d6d', label: 'î' },
  { vec: [0, 1, 0], color: '#4dff88', label: 'ĵ' },
  { vec: [0, 0, 1], color: '#4da6ff', label: 'k̂' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const lerp3 = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

const _yAxis = new THREE.Vector3(0, 1, 0)

// ─── Single basis arrow ───────────────────────────────────────────────────────
function BasisArrow({ end, color, label }) {
  const mag = magnitude(end)
  if (mag < 0.001) return null

  const shaftLen = Math.max(0, mag - HEAD_L)
  const dir      = normalize(end)
  const q        = new THREE.Quaternion().setFromUnitVectors(
    _yAxis,
    new THREE.Vector3(...dir),
  )

  const shaftMid = [dir[0] * shaftLen / 2, dir[1] * shaftLen / 2, dir[2] * shaftLen / 2]
  const headPos  = [
    dir[0] * (shaftLen + HEAD_L / 2),
    dir[1] * (shaftLen + HEAD_L / 2),
    dir[2] * (shaftLen + HEAD_L / 2),
  ]
  const labelPos = [
    end[0] + dir[0] * 0.4,
    end[1] + dir[1] * 0.4,
    end[2] + dir[2] * 0.4,
  ]

  return (
    <group>
      {/* Shaft */}
      {shaftLen > 0 && (
        <mesh position={shaftMid} quaternion={q}>
          <cylinderGeometry args={[SHAFT_R, SHAFT_R, shaftLen, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      )}

      {/* Cone tip */}
      <mesh position={headPos} quaternion={q}>
        <coneGeometry args={[HEAD_R, HEAD_L, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      {/* Label */}
      <Text
        position={labelPos}
        fontSize={0.30}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#0a0f1e"
      >
        {label}
      </Text>
    </group>
  )
}

// ─── Animation driver + parent ────────────────────────────────────────────────
export default function BasisArrows() {
  const matrix          = useMatrixStore((s) => s.matrix)
  const progress        = useMatrixStore((s) => s.progress)
  const setProgress     = useMatrixStore((s) => s.setProgress)
  const finishAnimation = useMatrixStore((s) => s.finishAnimation)

  // Stable refs so the useFrame closure never sees stale values
  const setProgressRef     = useRef(setProgress)
  const finishAnimationRef = useRef(finishAnimation)
  setProgressRef.current     = setProgress
  finishAnimationRef.current = finishAnimation

  useFrame((_, delta) => {
    // Read live state via getState() to avoid stale closure
    const { animating, progress: cur } = useMatrixStore.getState()
    if (!animating) return

    const next = Math.min(1, cur + delta * 1.4)   // ~0.7 s total
    setProgressRef.current(next)
    if (next >= 1) finishAnimationRef.current()
  })

  // Apply smoothstep easing for a more cinematic feel
  const t = smoothStep(progress)

  return (
    <>
      {BASIS.map((b) => {
        const transformed = matMul(matrix, b.vec)
        const end         = lerp3(b.vec, transformed, t)
        return (
          <BasisArrow
            key={b.label}
            end={end}
            color={b.color}
            label={b.label}
          />
        )
      })}
    </>
  )
}
