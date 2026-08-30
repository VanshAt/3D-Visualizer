import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import SceneSetup from '../components/Scene/SceneSetup'
import Axes from '../components/Scene/Axes'
import BasisArrows from '../components/Scene/BasisArrows'
import EigenArrows from '../components/Scene/EigenArrows'
import MatrixPanel from '../components/UI/MatrixPanel'

function MatrixScene() {
  return (
    <>
      <SceneSetup />
      <Axes />
      <BasisArrows />
      <EigenArrows />
    </>
  )
}

export default function MatricesPage() {
  return (
    <div className="page-layout">
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [3.5, 2.5, 4.5], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
          shadows
        >
          <color attach="background" args={['#0a0f1e']} />
          <Suspense fallback={null}>
            <MatrixScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Side panel */}
      <MatrixPanel />
    </div>
  )
}
