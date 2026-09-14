import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTransformStore } from '../../state/useTransformStore'
import { Edges } from '@react-three/drei'

export default function TransformObject() {
  const meshRef = useRef()
  
  // Create an array of materials, one for each face of the cube
  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: '#ff4d6d' }), // Right (X+)
    new THREE.MeshStandardMaterial({ color: '#880022' }), // Left (X-)
    new THREE.MeshStandardMaterial({ color: '#4dff88' }), // Top (Y+)
    new THREE.MeshStandardMaterial({ color: '#006622' }), // Bottom (Y-)
    new THREE.MeshStandardMaterial({ color: '#4da6ff' }), // Front (Z+)
    new THREE.MeshStandardMaterial({ color: '#003388' }), // Back (Z-)
  ], [])

  useFrame(() => {
    if (!meshRef.current) return
    const matrix = useTransformStore.getState().matrix
    
    // Convert our row-major 3x3 matrix array to a Three.js Matrix4
    // [m0, m1, m2,
    //  m3, m4, m5,
    //  m6, m7, m8]
    // 
    // Three.js Matrix4 is column-major but its .set() method takes row-major arguments:
    // .set(n11, n12, n13, n14,
    //      n21, n22, n23, n24,
    //      n31, n32, n33, n34,
    //      n41, n42, n43, n44)
    meshRef.current.matrix.set(
      matrix[0], matrix[1], matrix[2], 0,
      matrix[3], matrix[4], matrix[5], 0,
      matrix[6], matrix[7], matrix[8], 0,
      0,         0,         0,         1
    )
  })

  return (
    <mesh ref={meshRef} matrixAutoUpdate={false}>
      <boxGeometry args={[1, 1, 1]} />
      {materials.map((mat, i) => (
        <primitive key={i} object={mat} attach={`material-${i}`} />
      ))}
      <Edges scale={1} threshold={15} color="#ffffff" />
    </mesh>
  )
}
