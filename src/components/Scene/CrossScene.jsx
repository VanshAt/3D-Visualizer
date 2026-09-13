import { useMemo } from 'react'
import * as THREE from 'three'
import { cross, add, magnitude, normalize, sub, dot, scale } from '../../lib/math'
import { useCrossStore } from '../../state/useCrossStore'
import SceneSetup from './SceneSetup'
import Axes from './Axes'
import VectorArrow from './VectorArrow'
import { Text } from '@react-three/drei'

// ─── Right-angle marker ────────────────────────────────────────────────────────
function RightAngleMarker({ v1, v2, origin = [0, 0, 0] }) {
  const m1 = magnitude(v1)
  const m2 = magnitude(v2)
  if (m1 < 0.01 || m2 < 0.01) return null

  // Ensure they are orthogonal
  const d = Math.abs(dot(normalize(v1), normalize(v2)))
  if (d > 0.05) return null // Only show if they are roughly orthogonal

  const size = 0.25
  const dir1 = normalize(v1)
  const dir2 = normalize(v2)

  const corner0 = origin
  const corner1 = add(origin, scale(dir1, size))
  const corner2 = add(add(origin, scale(dir1, size)), scale(dir2, size))
  const corner3 = add(origin, scale(dir2, size))

  const vertices = new Float32Array([
    ...corner0, ...corner1, ...corner2,
    ...corner0, ...corner2, ...corner3,
  ])

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          count={6}
          itemSize={3}
        />
      </bufferGeometry>
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Parallelogram Mesh ────────────────────────────────────────────────────────
function Parallelogram({ u, v, color }) {
  const mU = magnitude(u)
  const mV = magnitude(v)
  if (mU < 0.01 || mV < 0.01) return null

  const p0 = [0, 0, 0]
  const p1 = u
  const p2 = add(u, v)
  const p3 = v

  const vertices = new Float32Array([
    ...p0, ...p1, ...p2,
    ...p0, ...p2, ...p3,
  ])

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          count={6}
          itemSize={3}
        />
      </bufferGeometry>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Main scene ───────────────────────────────────────────────────────────────
export default function CrossScene() {
  const { u, v } = useCrossStore()

  const uVec = [u.x, u.y, u.z]
  const vVec = [v.x, v.y, v.z]

  const crossProduct = useMemo(() => cross(uVec, vVec), [uVec, vVec])

  return (
    <>
      <SceneSetup />
      <Axes />

      {/* Base vectors */}
      <VectorArrow
        x={u.x} y={u.y} z={u.z}
        color={u.color}
        label={u.label}
      />
      <VectorArrow
        x={v.x} y={v.y} z={v.z}
        color={v.color}
        label={v.label}
      />

      {/* Cross Product Vector */}
      <VectorArrow
        x={crossProduct[0]} y={crossProduct[1]} z={crossProduct[2]}
        color="#fb923c"
        label="u × v"
      />

      {/* Parallelogram area */}
      <Parallelogram u={uVec} v={vVec} color="#a855f7" />

      {/* Right angle indicators */}
      <RightAngleMarker v1={uVec} v2={crossProduct} />
      <RightAngleMarker v1={vVec} v2={crossProduct} />
    </>
  )
}
