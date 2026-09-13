import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMatrixStore } from '../../state/useMatrixStore'
import { matMul, det3, smoothStep, magnitude } from '../../lib/math'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const lerp3 = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

/** Build the 12-triangle geometry for a parallelepiped from 3 edge vectors */
function buildPipedGeometry(a, b, c) {
  //  8 vertices of the parallelepiped: O, A, B, C, A+B, A+C, B+C, A+B+C
  const O   = [0, 0, 0]
  const A   = a
  const B   = b
  const C   = c
  const AB  = [a[0]+b[0], a[1]+b[1], a[2]+b[2]]
  const AC  = [a[0]+c[0], a[1]+c[1], a[2]+c[2]]
  const BC  = [b[0]+c[0], b[1]+c[1], b[2]+c[2]]
  const ABC = [a[0]+b[0]+c[0], a[1]+b[1]+c[1], a[2]+b[2]+c[2]]

  // 6 quads → 12 triangles (CCW winding)
  const quads = [
    [O, B, AB, A],    // bottom  (O, B, A plane)
    [C, AC, ABC, BC], // top
    [O, A, AC, C],    // left    (O, A, C plane)
    [B, BC, ABC, AB], // right
    [O, C, BC, B],    // front   (O, C, B plane)
    [A, AB, ABC, AC], // back
  ]

  const positions = new Float32Array(6 * 2 * 3 * 3) // 12 tris × 3 verts × 3 floats
  let idx = 0
  for (const [p0, p1, p2, p3] of quads) {
    // tri 1: p0, p1, p2
    for (const p of [p0, p1, p2]) { positions[idx++] = p[0]; positions[idx++] = p[1]; positions[idx++] = p[2] }
    // tri 2: p0, p2, p3
    for (const p of [p0, p2, p3]) { positions[idx++] = p[0]; positions[idx++] = p[1]; positions[idx++] = p[2] }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.computeVertexNormals()
  return geo
}

/** Build line geometry for the 12 edges of the parallelepiped */
function buildEdgesGeometry(a, b, c) {
  const O   = [0, 0, 0]
  const A   = a
  const B   = b
  const C   = c
  const AB  = [a[0]+b[0], a[1]+b[1], a[2]+b[2]]
  const AC  = [a[0]+c[0], a[1]+c[1], a[2]+c[2]]
  const BC  = [b[0]+c[0], b[1]+c[1], b[2]+c[2]]
  const ABC = [a[0]+b[0]+c[0], a[1]+b[1]+c[1], a[2]+b[2]+c[2]]

  const edges = [
    O,A, O,B, O,C,
    A,AB, A,AC, B,AB, B,BC,
    C,AC, C,BC, AB,ABC, AC,ABC, BC,ABC,
  ]

  const positions = new Float32Array(edges.length * 3)
  let idx = 0
  for (const p of edges) { positions[idx++] = p[0]; positions[idx++] = p[1]; positions[idx++] = p[2] }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geo
}

// ─── Parallelepiped component ─────────────────────────────────────────────────
export default function Parallelepiped() {
  const matrix            = useMatrixStore((s) => s.matrix)
  const progress          = useMatrixStore((s) => s.progress)
  const showParallelepiped = useMatrixStore((s) => s.showParallelepiped)
  const emissiveRef       = useRef(0.15)
  const matRef            = useRef()
  const edgeMatRef        = useRef()

  // Compute the three transformed basis column vectors, lerp'd with progress
  const t = smoothStep(progress)
  const colA = lerp3([1,0,0], matMul(matrix, [1,0,0]), t)
  const colB = lerp3([0,1,0], matMul(matrix, [0,1,0]), t)
  const colC = lerp3([0,0,1], matMul(matrix, [0,0,1]), t)

  // Determinant of the interpolated state
  const interpMatrix = [
    colA[0], colB[0], colC[0],
    colA[1], colB[1], colC[1],
    colA[2], colB[2], colC[2],
  ]
  const det = det3(interpMatrix)
  const absDet = Math.abs(det)
  const isCollapsed = absDet < 0.001

  // Colours based on orientation
  const faceColor = det >= 0 ? '#22d3ee' : '#e879a0'
  const edgeColor = det >= 0 ? '#67e8f9' : '#f0abca'

  // Geometries
  const faceGeo = useMemo(() => buildPipedGeometry(colA, colB, colC), [colA, colB, colC])
  const edgeGeo = useMemo(() => buildEdgesGeometry(colA, colB, colC), [colA, colB, colC])

  // Centre for the label
  const centre = [
    (colA[0] + colB[0] + colC[0]) / 2,
    (colA[1] + colB[1] + colC[1]) / 2,
    (colA[2] + colB[2] + colC[2]) / 2,
  ]

  // Animate emissive pulse
  useFrame((state) => {
    const pulse = 0.15 + Math.sin(state.clock.elapsedTime * 2.0) * 0.08
    if (matRef.current) matRef.current.emissiveIntensity = pulse
    if (edgeMatRef.current) edgeMatRef.current.emissiveIntensity = pulse + 0.1
  })

  if (!showParallelepiped || isCollapsed) return null

  return (
    <group>
      {/* Translucent faces */}
      <mesh geometry={faceGeo}>
        <meshStandardMaterial
          ref={matRef}
          color={faceColor}
          emissive={faceColor}
          emissiveIntensity={0.15}
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
          depthWrite={false}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Wireframe edges */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          ref={edgeMatRef}
          color={edgeColor}
          transparent
          opacity={0.55}
          linewidth={1}
        />
      </lineSegments>

      {/* Volume label */}
      <Text
        position={centre}
        fontSize={0.22}
        color={faceColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#0a0f1e"
        fillOpacity={0.85}
      >
        {`Vol = ${absDet.toFixed(3)}`}
      </Text>
    </group>
  )
}
