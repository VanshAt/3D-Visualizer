import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { magnitude, normalize } from '../../lib/math'

// ─── Tuning constants ─────────────────────────────────────────────────────────
const SHAFT_R = 0.055   // slightly thicker than regular arrows
const HEAD_R  = 0.155
const HEAD_L  = 0.36
const MIN_MAG = 0.01

const RESULT_COLOR   = '#ffd166'   // warm gold
const EMISSIVE_COLOR = '#ffaa00'

/**
 * A thick, glowing gold arrow for the linear combination result.
 * Renders from origin to (x, y, z) with an animated emissive pulse.
 */
export default function ResultArrow({ x, y, z, label = 'r' }) {
  const matRef    = useRef()
  const coneRef   = useRef()
  const groupRef  = useRef()

  const end = [x, y, z]
  const mag = magnitude(end)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 0.25 + 0.18 * Math.sin(t * 2.5)
    if (matRef.current)  matRef.current.emissiveIntensity  = pulse
    if (coneRef.current) coneRef.current.emissiveIntensity = pulse
  })

  if (mag < MIN_MAG) return null

  const shaftLen = Math.max(0, mag - HEAD_L)
  const dir      = normalize(end)
  const yAxis    = new THREE.Vector3(0, 1, 0)
  const dirV     = new THREE.Vector3(...dir)
  const q        = new THREE.Quaternion().setFromUnitVectors(yAxis, dirV)

  const shaftMid = [dir[0] * shaftLen / 2, dir[1] * shaftLen / 2, dir[2] * shaftLen / 2]
  const headPos  = [
    dir[0] * (shaftLen + HEAD_L / 2),
    dir[1] * (shaftLen + HEAD_L / 2),
    dir[2] * (shaftLen + HEAD_L / 2),
  ]
  const labelPos = [
    x + dir[0] * 0.5,
    y + dir[1] * 0.5,
    z + dir[2] * 0.5,
  ]

  return (
    <group ref={groupRef}>
      {/* Glow halo (wide transparent cylinder) */}
      {shaftLen > 0 && (
        <mesh position={shaftMid} quaternion={q}>
          <cylinderGeometry args={[SHAFT_R * 3, SHAFT_R * 3, shaftLen, 10]} />
          <meshBasicMaterial
            color={RESULT_COLOR}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Shaft */}
      {shaftLen > 0 && (
        <mesh position={shaftMid} quaternion={q}>
          <cylinderGeometry args={[SHAFT_R, SHAFT_R, shaftLen, 14]} />
          <meshStandardMaterial
            ref={matRef}
            color={RESULT_COLOR}
            emissive={EMISSIVE_COLOR}
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
      )}

      {/* Cone tip */}
      <mesh position={headPos} quaternion={q}>
        <coneGeometry args={[HEAD_R, HEAD_L, 18]} />
        <meshStandardMaterial
          ref={coneRef}
          color={RESULT_COLOR}
          emissive={EMISSIVE_COLOR}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Label */}
      <Text
        position={labelPos}
        fontSize={0.32}
        color={RESULT_COLOR}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.014}
        outlineColor="#0a0f1e"
      >
        {label}
      </Text>

      {/* Magnitude label */}
      <Text
        position={[labelPos[0], labelPos[1] - 0.36, labelPos[2]]}
        fontSize={0.19}
        color="#d4a84b"
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
