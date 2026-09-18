import React, { useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Grid, Line } from '@react-three/drei'
import * as THREE from 'three'
import SceneSetup from './SceneSetup'
import Axes from './Axes'
import useBasisStore from '../../state/useBasisStore'

// Helper to interpolate matrix
function getInterpolatedMatrix(morphValue, b1, b2, b3) {
  const mCustom = new THREE.Matrix4().set(
    b1[0], b2[0], b3[0], 0,
    b1[1], b2[1], b3[1], 0,
    b1[2], b2[2], b3[2], 0,
    0, 0, 0, 1
  )
  const mStandard = new THREE.Matrix4().identity()
  
  // Linear interpolation of matrix elements (simple enough for affine transforms if not doing polar decomp)
  const elements = []
  for (let i = 0; i < 16; i++) {
    elements[i] = THREE.MathUtils.lerp(mStandard.elements[i], mCustom.elements[i], morphValue)
  }
  return new THREE.Matrix4().fromArray(elements)
}

function VectorRender({ position, color }) {
  if (position[0] === 0 && position[1] === 0 && position[2] === 0) return null
  return (
    <group>
      <Line points={[[0, 0, 0], position]} color={color} lineWidth={4} />
      <mesh position={position}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

export default function BasisScene({ glRef }) {
  const { b1, b2, b3, v, showStandardGrid, showCustomGrid, morphValue } = useBasisStore()

  // Capture gl for PNG export if glRef is provided
  const GlCapture = ({ glRef }) => {
    const { gl } = useThree()
    if (glRef) glRef.current = gl
    return null
  }

  const matrix = useMemo(() => getInterpolatedMatrix(morphValue, b1, b2, b3), [morphValue, b1, b2, b3])

  // v in the basis space (applying the matrix to standard v)
  const vTransformed = useMemo(() => {
    const vec = new THREE.Vector3(v[0], v[1], v[2])
    vec.applyMatrix4(matrix)
    return [vec.x, vec.y, vec.z]
  }, [matrix, v])

  const b1Morphed = useMemo(() => [matrix.elements[0], matrix.elements[1], matrix.elements[2]], [matrix])
  const b2Morphed = useMemo(() => [matrix.elements[4], matrix.elements[5], matrix.elements[6]], [matrix])
  const b3Morphed = useMemo(() => [matrix.elements[8], matrix.elements[9], matrix.elements[10]], [matrix])

  return (
    <>
      <GlCapture glRef={glRef} />
      <SceneSetup />
      
      {/* Standard Grid */}
      {showStandardGrid && (
        <group>
          <Axes size={5} />
          {/* XY plane standard grid */}
          <gridHelper args={[10, 10, 0x444444, 0x222222]} rotation={[Math.PI/2, 0, 0]} />
        </group>
      )}

      {/* Custom Basis Grid */}
      {showCustomGrid && (
        <group matrixAutoUpdate={false} matrix={matrix}>
          {/* XY plane morphed grid */}
          <gridHelper args={[10, 10, '#c77dff', '#5a189a']} rotation={[Math.PI/2, 0, 0]} />
        </group>
      )}

      {/* Show the basis vectors themselves (rendered in standard space to avoid Line2 skew bugs) */}
      {showCustomGrid && (
        <>
          <VectorRender position={b1Morphed} color="#ff4d4d" />
          <VectorRender position={b2Morphed} color="#4dff4d" />
          <VectorRender position={b3Morphed} color="#4d4dff" />
        </>
      )}

      {/* The Vector v */}
      {/* We render it at the transformed position if it's meant to be in custom basis */}
      <VectorRender position={vTransformed} color="#ffd166" />
    </>
  )
}
