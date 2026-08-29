import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { magnitude, normalize } from '../../lib/math'

// ─── Tuning constants ─────────────────────────────────────────────────────────
const SHAFT_RADIUS  = 0.035
const HEAD_RADIUS   = 0.11
const HEAD_LENGTH   = 0.28
const MIN_MAG       = 0.01   // below this we don't draw the arrow

/**
 * Renders a single 3D arrow from the origin to (x, y, z).
 * Props: x, y, z, color, label, selected
 */
export default function VectorArrow({ x, y, z, color = '#4da6ff', label = '', selected = false, onSelect }) {
  const shaftRef  = useRef()
  const groupRef  = useRef()
  const { gl }    = useThree()       // canvas DOM element for cursor changes

  const end = [x, y, z]
  const mag = magnitude(end)

  // ── geometry derived values ────────────────────────────────────────────────
  const { shaftLength, dir, quaternion } = useMemo(() => {
    if (mag < MIN_MAG) return { shaftLength: 0, dir: [0, 1, 0], quaternion: new THREE.Quaternion() }

    const shaftLength = Math.max(0, mag - HEAD_LENGTH)
    const dir         = normalize(end)

    // CylinderGeometry points along Y by default → rotate to point along dir
    const yAxis = new THREE.Vector3(0, 1, 0)
    const dirV  = new THREE.Vector3(...dir)
    const q     = new THREE.Quaternion().setFromUnitVectors(yAxis, dirV)

    return { shaftLength, dir, quaternion: q }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y, z, mag])

  // ── subtle pulse on selected ───────────────────────────────────────────────
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    if (selected) {
      const t = clock.getElapsedTime()
      groupRef.current.scale.setScalar(1 + 0.03 * Math.sin(t * 4))
    } else {
      groupRef.current.scale.setScalar(1)
    }
  })

  if (mag < MIN_MAG) return null

  const shaftMid = [
    (dir[0] * shaftLength) / 2,
    (dir[1] * shaftLength) / 2,
    (dir[2] * shaftLength) / 2,
  ]
  const headPos = [
    dir[0] * (shaftLength + HEAD_LENGTH / 2),
    dir[1] * (shaftLength + HEAD_LENGTH / 2),
    dir[2] * (shaftLength + HEAD_LENGTH / 2),
  ]
  const labelPos = [
    x + dir[0] * 0.35,
    y + dir[1] * 0.35,
    z + dir[2] * 0.35,
  ]

  const emissiveColor = selected ? color : '#000000'
  const emissiveInt   = selected ? 0.45  : 0

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onSelect?.() }}
      onPointerOver={(e) => { e.stopPropagation(); gl.domElement.style.cursor = 'pointer' }}
      onPointerOut={(e)  => { e.stopPropagation(); gl.domElement.style.cursor = 'default' }}
    >
      {/* ── Shaft ────────────────────────────────────────────────────────── */}
      {shaftLength > 0 && (
        <mesh position={shaftMid} quaternion={quaternion} ref={shaftRef}>
          <cylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, shaftLength, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={emissiveInt}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      )}

      {/* ── Cone tip ─────────────────────────────────────────────────────── */}
      <mesh position={headPos} quaternion={quaternion}>
        <coneGeometry args={[HEAD_RADIUS, HEAD_LENGTH, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={emissiveInt}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      {/* ── Label ────────────────────────────────────────────────────────── */}
      <Text
        position={labelPos}
        fontSize={0.28}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#0a0f1e"
      >
        {label}
      </Text>

      {/* ── Magnitude label ──────────────────────────────────────────────── */}
      <Text
        position={[labelPos[0], labelPos[1] - 0.32, labelPos[2]]}
        fontSize={0.18}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#0a0f1e"
      >
        {`|${label}| = ${mag.toFixed(2)}`}
      </Text>
    </group>
  )
}
