import React, { useMemo } from 'react'
import * as THREE from 'three'
import { generatePlaneGeometry } from '../../lib/math'
import { useEquationsStore } from '../../state/useEquationsStore'

// Fixed visual size for the planes, matching the grid (-5 to +5)
const PLANE_SIZE = 10

function EquationPlane({ a, b, c, d, color, opacity = 0.5 }) {
  const geomData = useMemo(() => generatePlaneGeometry(a, b, c, d), [a, b, c, d])
  
  if (!geomData) return null // Normal vector is [0,0,0]
  
  const { u, v, center, normal } = geomData
  
  // Build a custom BufferGeometry for the plane using the orthogonal basis
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const half = PLANE_SIZE / 2
    
    // Four corners of the quad
    const corners = [
      [
        center[0] - half * u[0] - half * v[0],
        center[1] - half * u[1] - half * v[1],
        center[2] - half * u[2] - half * v[2]
      ],
      [
        center[0] + half * u[0] - half * v[0],
        center[1] + half * u[1] - half * v[1],
        center[2] + half * u[2] - half * v[2]
      ],
      [
        center[0] - half * u[0] + half * v[0],
        center[1] - half * u[1] + half * v[1],
        center[2] - half * u[2] + half * v[2]
      ],
      [
        center[0] + half * u[0] + half * v[0],
        center[1] + half * u[1] + half * v[1],
        center[2] + half * u[2] + half * v[2]
      ]
    ]
    
    const vertices = new Float32Array([
      // Triangle 1
      ...corners[0], ...corners[1], ...corners[2],
      // Triangle 2
      ...corners[2], ...corners[1], ...corners[3]
    ])
    
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geo.computeVertexNormals() // Computes normals based on vertex order
    return geo
  }, [u, v, center])

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.2}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function EquationsScene() {
  const A = useEquationsStore((s) => s.A)
  const b = useEquationsStore((s) => s.b)
  const getSolution = useEquationsStore((s) => s.getSolution)
  
  const solution = getSolution()
  
  // distinct colors for the 3 planes
  const colors = ['#ff4d6d', '#4dff88', '#4da6ff']
  
  return (
    <group>
      {/* Plane 1 */}
      <EquationPlane a={A[0]} b={A[1]} c={A[2]} d={b[0]} color={colors[0]} opacity={0.4} />
      
      {/* Plane 2 */}
      <EquationPlane a={A[3]} b={A[4]} c={A[5]} d={b[1]} color={colors[1]} opacity={0.4} />
      
      {/* Plane 3 */}
      <EquationPlane a={A[6]} b={A[7]} c={A[8]} d={b[2]} color={colors[2]} opacity={0.4} />
      
      {/* Intersection Point */}
      {solution && (
        <mesh position={solution.x}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#ffffff" intensity={2} distance={2} />
        </mesh>
      )}
    </group>
  )
}
