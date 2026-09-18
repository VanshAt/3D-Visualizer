import React, { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SVD } from 'ml-matrix'
import SceneSetup from './SceneSetup'
import Axes from './Axes'
import useSVDStore from '../../state/useSVDStore'

// Helper to interpolate matrix toward identity
function interpolateMatrix(startMat, endMat, t) {
  const elements = []
  for (let i = 0; i < 16; i++) {
    elements[i] = THREE.MathUtils.lerp(startMat.elements[i], endMat.elements[i], t)
  }
  return new THREE.Matrix4().fromArray(elements)
}

function matrixFromMlMatrix(mlMat) {
  // ml-matrix is 2D array, we need THREE.Matrix4 (column-major)
  const m = new THREE.Matrix4()
  m.set(
    mlMat.get(0,0), mlMat.get(0,1), mlMat.get(0,2), 0,
    mlMat.get(1,0), mlMat.get(1,1), mlMat.get(1,2), 0,
    mlMat.get(2,0), mlMat.get(2,1), mlMat.get(2,2), 0,
    0, 0, 0, 1
  )
  return m
}

function diagMatrix(q) {
  const m = new THREE.Matrix4()
  m.makeScale(q[0], q[1], q[2])
  return m
}

export default function SVDScene({ glRef }) {
  const { matrix, animationProgress } = useSVDStore()

  const svd = useMemo(() => {
    try {
      return new SVD(matrix)
    } catch(e) {
      return null
    }
  }, [matrix])

  // Calculate the current transformation matrix based on animationProgress (0 to 3)
  const currentTransform = useMemo(() => {
    const identity = new THREE.Matrix4().identity()
    if (!svd) return identity

    const U = matrixFromMlMatrix(svd.U)
    const Vt = matrixFromMlMatrix(svd.V.transpose()) // V^T
    const Sigma = diagMatrix(svd.diagonal)

    if (animationProgress <= 0) return identity

    // Step 1: V^T (0 to 1)
    if (animationProgress <= 1) {
      return interpolateMatrix(identity, Vt, animationProgress)
    }

    // Step 2: Sigma (1 to 2)
    if (animationProgress <= 2) {
      const t = animationProgress - 1
      const sigmaVt = new THREE.Matrix4().multiplyMatrices(Sigma, Vt)
      return interpolateMatrix(Vt, sigmaVt, t)
    }

    // Step 3: U (2 to 3)
    if (animationProgress <= 3) {
      const t = animationProgress - 2
      const sigmaVt = new THREE.Matrix4().multiplyMatrices(Sigma, Vt)
      const uSigmaVt = new THREE.Matrix4().multiplyMatrices(U, sigmaVt)
      return interpolateMatrix(sigmaVt, uSigmaVt, t)
    }

    return identity
  }, [svd, animationProgress])

  const GlCapture = ({ glRef }) => {
    const { gl } = useThree()
    if (glRef) glRef.current = gl
    return null
  }

  return (
    <>
      <GlCapture glRef={glRef} />
      <SceneSetup />
      <Axes />

      {/* Render a unit sphere getting transformed to an ellipsoid */}
      <group matrixAutoUpdate={false} matrix={currentTransform}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshPhongMaterial color="#00ffff" wireframe opacity={0.6} transparent />
        </mesh>
        {/* Draw internal axes inside the sphere to show rotation better */}
        <axesHelper args={[2.5]} />
      </group>
    </>
  )
}
