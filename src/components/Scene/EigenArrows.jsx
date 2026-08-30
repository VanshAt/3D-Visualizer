import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMatrixStore } from '../../state/useMatrixStore'
import {
  eigenSolve3, eigenColor, complexEigenColor,
  cross, normalize, magnitude, matMul,
} from '../../lib/math'

// --- Geometry constants ----------------------------------------------------------
const SHAFT_R = 0.04, HEAD_R = 0.12, HEAD_L = 0.28
const _yAxis  = new THREE.Vector3(0, 1, 0)

// --- Single arrow (shaft + cone + label) ----------------------------------------
function EigenArrow({ end, color, label = '', opacity = 1 }) {
  const mag = magnitude(end)
  if (mag < 0.05) return null

  const shaftLen = Math.max(0, mag - HEAD_L)
  const dir      = normalize(end)
  const q        = new THREE.Quaternion().setFromUnitVectors(_yAxis, new THREE.Vector3(...dir))
  const shaftMid = dir.map((d) => d * shaftLen / 2)
  const headPos  = dir.map((d) => d * (shaftLen + HEAD_L / 2))
  const labelPos = [end[0] + dir[0] * 0.5, end[1] + dir[1] * 0.5, end[2] + dir[2] * 0.5]

  return (
    <group>
      {shaftLen > 0 && (
        <mesh position={shaftMid} quaternion={q}>
          <cylinderGeometry args={[SHAFT_R, SHAFT_R, shaftLen, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4}
            transparent opacity={opacity} depthWrite={false} />
        </mesh>
      )}
      <mesh position={headPos} quaternion={q}>
        <coneGeometry args={[HEAD_R, HEAD_L, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4}
          transparent opacity={opacity} depthWrite={false} />
      </mesh>
      {label && (
        <Text position={labelPos} fontSize={0.24} color={color}
          anchorX="center" anchorY="middle"
          outlineWidth={0.01} outlineColor="#0a0f1e">
          {label}
        </Text>
      )}
    </group>
  )
}

// --- Line strip from points array -----------------------------------------------
function LineStrip({ points, color, opacity = 1 }) {
  const geo = useMemo(() => {
    const g    = new THREE.BufferGeometry()
    const flat = new Float32Array(points.flat())
    g.setAttribute('position', new THREE.BufferAttribute(flat, 3))
    return g
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points)])

  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

// --- Eigenplane translucent disc ------------------------------------------------
function EigenPlaneDisc({ v1, v2, modulus, color }) {
  const normal = normalize(cross(v1, v2))
  const zUp    = new THREE.Vector3(0, 0, 1)
  const nV     = new THREE.Vector3(...normal)

  const q = nV.dot(zUp) < -0.9999
    ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI)
    : new THREE.Quaternion().setFromUnitVectors(zUp, nV)

  const radius = Math.min(modulus + 0.9, 3.5)

  return (
    <mesh quaternion={q}>
      <circleGeometry args={[radius, 52]} />
      <meshBasicMaterial color={color} transparent opacity={0.08}
        side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

// --- Full complex-pair visualisation --------------------------------------------
function ComplexEigenViz({ re, im, magnitude: mod, angleDeg, v1, v2 }) {
  const color    = complexEigenColor(mod)
  const angleRad = angleDeg * (Math.PI / 180)

  // Orbit ring (where unit vectors in the plane map to after M)
  const ringPts = useMemo(() => {
    const N = 64
    return Array.from({ length: N + 1 }, (_, i) => {
      const t = (i / N) * 2 * Math.PI
      return [
        mod * (Math.cos(t) * v1[0] + Math.sin(t) * v2[0]),
        mod * (Math.cos(t) * v1[1] + Math.sin(t) * v2[1]),
        mod * (Math.cos(t) * v1[2] + Math.sin(t) * v2[2]),
      ]
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v1, v2, mod])

  // Rotation arc at unit radius (from v1 direction, swept by angleDeg)
  const arcPts = useMemo(() => {
    const N = 32
    return Array.from({ length: N + 1 }, (_, i) => {
      const t = (i / N) * angleRad
      return [
        Math.cos(t) * v1[0] + Math.sin(t) * v2[0],
        Math.cos(t) * v1[1] + Math.sin(t) * v2[1],
        Math.cos(t) * v1[2] + Math.sin(t) * v2[2],
      ]
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v1, v2, angleRad])

  // Image of v1 under M:  re*v1 + im*v2  (has length = |lambda|)
  const imageEnd = [
    re * v1[0] + im * v2[0],
    re * v1[1] + im * v2[1],
    re * v1[2] + im * v2[2],
  ]

  const labelPos = [
    (mod + 0.9) * v1[0],
    (mod + 0.9) * v1[1] + 0.4,
    (mod + 0.9) * v1[2],
  ]

  return (
    <group>
      {/* Eigenplane translucent disc */}
      <EigenPlaneDisc v1={v1} v2={v2} modulus={mod} color={color} />

      {/* Orbit ring at radius |lambda| */}
      <LineStrip points={ringPts} color={color} opacity={0.5} />

      {/* Rotation arc (unit radius) */}
      <LineStrip points={arcPts} color={color} opacity={0.95} />

      {/* Reference unit arrow along v1 */}
      <EigenArrow end={v1} color={color} opacity={0.38} />

      {/* Image arrow: where v1 maps under M */}
      <EigenArrow
        end={imageEnd}
        color={color}
        label={`|?|=${mod.toFixed(2)} ?${angleDeg.toFixed(0)}°`}
        opacity={0.95}
      />
    </group>
  )
}

// --- Real eigenvalue arrow -------------------------------------------------------
function RealEigenArrow({ lambda, vec, index }) {
  const color     = eigenColor(lambda)
  const arrowLen  = Math.min(Math.max(Math.abs(lambda), 0.2), 2.5)
  const end       = vec.map((c) => c * arrowLen)
  const label     = `e${index + 1}  ?=${lambda.toFixed(2)}`

  return <EigenArrow end={end} color={color} label={label} />
}

// --- Main export -----------------------------------------------------------------
export default function EigenArrows() {
  const matrix           = useMatrixStore((s) => s.matrix)
  const showEigenvectors = useMatrixStore((s) => s.showEigenvectors)

  const { real, complex } = useMemo(() => eigenSolve3(matrix), [matrix])

  if (!showEigenvectors) return null

  return (
    <>
      {real.map((e, i) => (
        <RealEigenArrow key={`re-${i}`} {...e} index={i} />
      ))}
      {complex.map((e, i) => (
        <ComplexEigenViz key={`cx-${i}`} {...e} />
      ))}
    </>
  )
}
