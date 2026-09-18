import React, { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { SVD } from 'ml-matrix'
import SceneSetup from './SceneSetup'
import Axes from './Axes'
import useSubspacesStore from '../../state/useSubspacesStore'

function getBasisFromSVD(svd, type, threshold = 1e-6) {
  const U = svd.U
  const V = svd.V
  const q = svd.diagonal
  
  const rank = q.filter(val => Math.abs(val) > threshold).length

  if (type === 'col') {
    // Column Space: span of first r columns of U
    const basis = []
    for(let i=0; i<rank; i++) {
      basis.push(U.getColumnVector(i).to1DArray())
    }
    return basis
  }
  if (type === 'left-null') {
    // Left Null Space: span of remaining m-r columns of U
    const basis = []
    for(let i=rank; i<U.columns; i++) {
      basis.push(U.getColumnVector(i).to1DArray())
    }
    return basis
  }
  if (type === 'row') {
    // Row Space: span of first r columns of V
    const basis = []
    for(let i=0; i<rank; i++) {
      basis.push(V.getColumnVector(i).to1DArray())
    }
    return basis
  }
  if (type === 'null') {
    // Null Space: span of remaining n-r columns of V
    const basis = []
    for(let i=rank; i<V.columns; i++) {
      basis.push(V.getColumnVector(i).to1DArray())
    }
    return basis
  }
  return []
}

function SubspaceGeometry({ basis, color, opacity = 0.5 }) {
  if (basis.length === 0) {
    // Rank 0 (Origin only)
    return (
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    )
  }

  if (basis.length === 1) {
    // 1D Subspace (Line)
    const vec = new THREE.Vector3(...basis[0]).normalize().multiplyScalar(10)
    return (
      <Line points={[vec.clone().negate(), vec]} color={color} lineWidth={5} />
    )
  }

  if (basis.length === 2) {
    // 2D Subspace (Plane)
    const v1 = new THREE.Vector3(...basis[0]).normalize()
    const v2 = new THREE.Vector3(...basis[1]).normalize()
    
    // Normal vector
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize()
    
    // Create a plane geometry and orient it to normal
    const planeGeo = new THREE.PlaneGeometry(20, 20)
    planeGeo.lookAt(normal)

    return (
      <mesh geometry={planeGeo}>
        <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
        {/* We also draw a grid on the plane for visual clarity */}
        <gridHelper args={[20, 20, color, color]} rotation={[Math.PI/2, 0, 0]} applyMatrix4={new THREE.Matrix4().lookAt(new THREE.Vector3(0,0,0), normal, new THREE.Vector3(0,1,0))} />
      </mesh>
    )
  }

  if (basis.length === 3) {
    // 3D Subspace (Whole Space - usually R^3)
    return (
      <mesh>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} wireframe />
      </mesh>
    )
  }
  
  return null
}

export default function SubspacesScene({ glRef }) {
  const { matrix, viewMode } = useSubspacesStore()

  const svd = useMemo(() => {
    try {
      return new SVD(matrix)
    } catch(e) {
      return null
    }
  }, [matrix])

  const GlCapture = ({ glRef }) => {
    const { gl } = useThree()
    if (glRef) glRef.current = gl
    return null
  }

  if (!svd) return null

  // Compute bases
  const colBasis = getBasisFromSVD(svd, 'col')
  const leftNullBasis = getBasisFromSVD(svd, 'left-null')
  const rowBasis = getBasisFromSVD(svd, 'row')
  const nullBasis = getBasisFromSVD(svd, 'null')

  return (
    <>
      <GlCapture glRef={glRef} />
      <SceneSetup />
      <Axes />

      {viewMode === 'domain' && (
        <group>
          {/* Row Space and Null Space are orthogonal complements in Domain */}
          <SubspaceGeometry basis={rowBasis} color="#4dff4d" opacity={0.6} /> {/* Green for Row Space */}
          <SubspaceGeometry basis={nullBasis} color="#ff4d4d" opacity={0.6} /> {/* Red for Null Space */}
        </group>
      )}

      {viewMode === 'codomain' && (
        <group>
          {/* Column Space and Left Null Space are orthogonal complements in Codomain */}
          <SubspaceGeometry basis={colBasis} color="#4d4dff" opacity={0.6} /> {/* Blue for Column Space */}
          <SubspaceGeometry basis={leftNullBasis} color="#ffd166" opacity={0.6} /> {/* Yellow for Left Null Space */}
        </group>
      )}
    </>
  )
}
