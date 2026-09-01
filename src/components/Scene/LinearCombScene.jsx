import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { magnitude, normalize } from '../../lib/math'
import { useScalarStore } from '../../state/useScalarStore'
import ResultArrow from './ResultArrow'
import SceneSetup from './SceneSetup'
import Axes from './Axes'

// ─── Arrow geometry constants (base & ghost arrows) ───────────────────────────
const BASE_SHAFT_R = 0.035
const BASE_HEAD_R  = 0.11
const BASE_HEAD_L  = 0.28
const MIN_MAG      = 0.01

const _yAxis = new THREE.Vector3(0, 1, 0)

// ─── Shared arrow builder ─────────────────────────────────────────────────────
function Arrow3D({ end, color, opacity = 1, label = '', labelOffset = 0.35 }) {
  const mag = magnitude(end)
  if (mag < MIN_MAG) return null

  const shaftLen = Math.max(0, mag - BASE_HEAD_L)
  const dir      = normalize(end)
  const dirV     = new THREE.Vector3(...dir)
  const q        = new THREE.Quaternion().setFromUnitVectors(_yAxis, dirV)

  const shaftMid = [dir[0] * shaftLen / 2, dir[1] * shaftLen / 2, dir[2] * shaftLen / 2]
  const headPos  = [
    dir[0] * (shaftLen + BASE_HEAD_L / 2),
    dir[1] * (shaftLen + BASE_HEAD_L / 2),
    dir[2] * (shaftLen + BASE_HEAD_L / 2),
  ]
  const labelPos = [
    end[0] + dir[0] * labelOffset,
    end[1] + dir[1] * labelOffset,
    end[2] + dir[2] * labelOffset,
  ]

  const transparent = opacity < 1

  return (
    <group>
      {shaftLen > 0 && (
        <mesh position={shaftMid} quaternion={q}>
          <cylinderGeometry args={[BASE_SHAFT_R, BASE_SHAFT_R, shaftLen, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            roughness={0.3}
            metalness={0.6}
            transparent={transparent}
            opacity={opacity}
            depthWrite={!transparent}
          />
        </mesh>
      )}

      <mesh position={headPos} quaternion={q}>
        <coneGeometry args={[BASE_HEAD_R, BASE_HEAD_L, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.25}
          metalness={0.6}
          transparent={transparent}
          opacity={opacity}
          depthWrite={!transparent}
        />
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

// ─── Dashed scaled ghost arrow ────────────────────────────────────────────────
// Renders αᵢ·vᵢ as a translucent copy with a dashed connector from tip of base to tip of scaled
function ScaledGhost({ baseVec, scalar, color, scalarLabel }) {
  const sx = baseVec.x * scalar
  const sy = baseVec.y * scalar
  const sz = baseVec.z * scalar

  const end = [sx, sy, sz]
  const mag = magnitude(end)
  if (mag < MIN_MAG) return null

  return (
    <group>
      {/* The scaled arrow itself at 30% opacity */}
      <Arrow3D
        end={end}
        color={color}
        opacity={0.35}
        label={`${scalarLabel}·${baseVec.label}`}
        labelOffset={0.28}
      />
    </group>
  )
}

// ─── Sweep ticker (runs inside Canvas via useFrame) ───────────────────────────
function SweepTicker() {
  useFrame(({ clock }) => {
    useScalarStore.getState().tickSweep(clock.getElapsedTime())
  })
  return null
}

// ─── Main scene ───────────────────────────────────────────────────────────────
export default function LinearCombScene() {
  const vectors     = useScalarStore((s) => s.vectors)
  const scalars     = useScalarStore((s) => s.scalars)
  const scalarLabel = useScalarStore((s) => s.scalarLabel)

  const result = useMemo(() => useScalarStore.getState().getResult(), [vectors, scalars])

  // Recompute when vectors or scalars change
  const [rx, ry, rz] = useMemo(() => {
    let rx = 0, ry = 0, rz = 0
    vectors.forEach((v, i) => {
      const s = scalars[i] ?? 1
      rx += v.x * s
      ry += v.y * s
      rz += v.z * s
    })
    return [rx, ry, rz]
  }, [vectors, scalars])

  return (
    <>
      <SweepTicker />
      <SceneSetup />
      <Axes />

      {/* Base vectors (full opacity) */}
      {vectors.map((v) => (
        <Arrow3D
          key={v.id}
          end={[v.x, v.y, v.z]}
          color={v.color}
          opacity={1}
          label={v.label}
        />
      ))}

      {/* Scaled ghost arrows (αᵢvᵢ) */}
      {vectors.map((v, i) => {
        const s = scalars[i] ?? 1
        return (
          <ScaledGhost
            key={`ghost-${v.id}`}
            baseVec={v}
            scalar={s}
            color={v.color}
            scalarLabel={scalarLabel(i)}
          />
        )
      })}

      {/* Result arrow: Σ αᵢvᵢ */}
      <ResultArrow x={rx} y={ry} z={rz} label="r" />
    </>
  )
}
