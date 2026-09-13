import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import {
  magnitude, normalize, dot, scale, sub, add, fmt,
} from '../../lib/math'
import { useProjectionStore } from '../../state/useProjectionStore'
import SceneSetup from './SceneSetup'
import Axes from './Axes'

// ─── Arrow geometry constants ─────────────────────────────────────────────────
const SHAFT_R = 0.035
const HEAD_R  = 0.11
const HEAD_L  = 0.28
const MIN_MAG = 0.01
const _yAxis  = new THREE.Vector3(0, 1, 0)

// ─── Generic arrow (origin → end, optional origin offset) ─────────────────────
function Arrow3D({
  end, color, opacity = 1, label = '', labelOffset = 0.35,
  origin = [0, 0, 0], emissiveIntensity = 0.15,
}) {
  const dx = end[0] - origin[0]
  const dy = end[1] - origin[1]
  const dz = end[2] - origin[2]
  const dir3 = [dx, dy, dz]
  const mag  = magnitude(dir3)
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

  return (
    <group>
      {shaftLen > 0 && (
        <mesh position={shaftMid} quaternion={q}>
          <cylinderGeometry args={[SHAFT_R, SHAFT_R, shaftLen, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.3}
            metalness={0.6}
            transparent={transparent}
            opacity={opacity}
            depthWrite={!transparent}
          />
        </mesh>
      )}

      <mesh position={headPos} quaternion={q}>
        <coneGeometry args={[HEAD_R, HEAD_L, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
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

// ─── Right-angle marker at the foot of the perpendicular ──────────────────────
function RightAngleMarker({ projEnd }) {
  const mag = magnitude(projEnd)
  if (mag < MIN_MAG) return null

  // Build a small square in the plane of proj and residual
  const size = 0.15
  const dir  = normalize(projEnd)

  // We need a perpendicular in the plane — for simplicity use the residual direction
  // But we render a small square offset along proj + up
  const up = Math.abs(dir[1]) < 0.99
    ? normalize(sub([0, 1, 0], scale(dir, dot([0, 1, 0], dir))))
    : normalize(sub([1, 0, 0], scale(dir, dot([1, 0, 0], dir))))

  const corner0 = projEnd
  const corner1 = add(projEnd, scale(dir, -size))
  const corner2 = add(add(projEnd, scale(dir, -size)), scale(up, size))
  const corner3 = add(projEnd, scale(up, size))

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
        opacity={0.5}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Projection computations ──────────────────────────────────────────────────

/** Project b onto a single vector a:  proj = (b·a / a·a) * a */
function project1D(b, a) {
  const d = dot(a, a)
  if (d < 1e-12) return [0, 0, 0]
  return scale(a, dot(b, a) / d)
}

/** Project b onto subspace spanned by [a1, a2] via normal equations */
function projectSubspace(b, bases) {
  if (bases.length === 0) return [0, 0, 0]
  if (bases.length === 1) return project1D(b, bases[0])

  // Gram-Schmidt on bases to get orthogonal set, then sum projections
  const a1 = bases[0]
  const a2raw = bases[1]
  const a2orth = sub(a2raw, project1D(a2raw, a1))

  return add(project1D(b, a1), project1D(b, a2orth))
}

// ─── Main scene ───────────────────────────────────────────────────────────────
export default function ProjectionScene() {
  const baseVectors  = useProjectionStore((s) => s.baseVectors)
  const targetVector = useProjectionStore((s) => s.targetVector)

  const bVec = [targetVector.x, targetVector.y, targetVector.z]
  const bases = baseVectors.map((v) => [v.x, v.y, v.z])

  const proj     = useMemo(() => projectSubspace(bVec, bases), [bVec, bases])
  const residual = useMemo(() => sub(bVec, proj), [bVec, proj])

  return (
    <>
      <SceneSetup />
      <Axes />

      {/* Base arrows */}
      {baseVectors.map((v) => (
        <Arrow3D
          key={v.id}
          end={[v.x, v.y, v.z]}
          color={v.color}
          label={v.label}
        />
      ))}

      {/* Target arrow b */}
      <Arrow3D
        end={bVec}
        color={targetVector.color}
        label="b"
      />

      {/* Projection arrow (glowing cyan) */}
      <Arrow3D
        end={proj}
        color="#22d3ee"
        emissiveIntensity={0.55}
        label="proj"
        labelOffset={0.3}
      />

      {/* Residual arrow (orange-red): from tip of proj to tip of b */}
      {magnitude(residual) > MIN_MAG && (
        <Arrow3D
          origin={proj}
          end={bVec}
          color="#ff6b6b"
          label="err"
          labelOffset={0.3}
        />
      )}

      {/* Right-angle marker */}
      <RightAngleMarker projEnd={proj} />
    </>
  )
}
