import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../state/useStore'
import { gramSchmidtBasis, cross, normalize } from '../../lib/math'

// --- Colour blend ----------------------------------------------------------------
function blendColors(hexList) {
  if (!hexList.length) return '#94a3b8'
  let r = 0, g = 0, b = 0
  for (const h of hexList) {
    const n = parseInt(h.slice(1), 16)
    r += (n >> 16) & 0xff
    g += (n >>  8) & 0xff
    b +=  n        & 0xff
  }
  const n = hexList.length
  const hex = (v) => Math.round(v / n).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

const HALF_LEN = 6.5

// --- Rank-1: infinite line -------------------------------------------------------
function SpanLine({ dir, color }) {
  const yUp  = new THREE.Vector3(0, 1, 0)
  const dirV = new THREE.Vector3(...dir)
  let q
  if (Math.abs(dirV.dot(yUp)) > 0.9999) {
    q = dirV.y > 0
      ? new THREE.Quaternion()
      : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI)
  } else {
    q = new THREE.Quaternion().setFromUnitVectors(yUp, dirV)
  }

  return (
    <group>
      <mesh quaternion={q}>
        <cylinderGeometry args={[0.032, 0.032, HALF_LEN * 2, 10]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.35}
          transparent opacity={0.5} depthWrite={false}
        />
      </mesh>
      <mesh quaternion={q}>
        <cylinderGeometry args={[0.14, 0.14, HALF_LEN * 2, 10]} />
        <meshStandardMaterial
          color={color} transparent opacity={0.055}
          side={THREE.BackSide} depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// --- Rank-2: plane ---------------------------------------------------------------
function SpanPlane({ v1, v2, color }) {
  const normal = normalize(cross(v1, v2))
  const zUp    = new THREE.Vector3(0, 0, 1)
  const nV     = new THREE.Vector3(...normal)

  let q
  if (nV.dot(zUp) < -0.9999) {
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI)
  } else {
    q = new THREE.Quaternion().setFromUnitVectors(zUp, nV)
  }

  const SIZE = HALF_LEN * 2
  const SEGS = 13

  return (
    <group quaternion={q}>
      <mesh>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial
          color={color} transparent opacity={0.07}
          side={THREE.DoubleSide} depthWrite={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[SIZE, SIZE, SEGS, SEGS]} />
        <meshBasicMaterial
          color={color} wireframe transparent opacity={0.2}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// --- Rank-3: all of R3 ----------------------------------------------------------
function SpanFullSpace() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.material.opacity = 0.055 + 0.022 * Math.sin(clock.getElapsedTime() * 1.4)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[3.2, 18, 18]} />
      <meshBasicMaterial
        color="#94a3b8" wireframe transparent opacity={0.07}
        depthWrite={false}
      />
    </mesh>
  )
}

// --- Main export -----------------------------------------------------------------
export default function SpanMesh() {
  const showSpan = useStore((s) => s.showSpan)
  const vectors  = useStore((s) => s.vectors)

  const { rank, basis, color } = useMemo(() => {
    const vis   = vectors.filter((v) => v.visible)
    const vecs  = vis.map((v) => [v.x, v.y, v.z])
    const basis = gramSchmidtBasis(vecs)
    const color = blendColors(vis.slice(0, 3).map((v) => v.color))
    return { rank: basis.length, basis, color }
  }, [vectors])

  if (!showSpan || rank === 0) return null
  if (rank === 1) return <SpanLine dir={basis[0]} color={color} />
  if (rank === 2) return <SpanPlane v1={basis[0]} v2={basis[1]} color={color} />
  return <SpanFullSpace />
}
