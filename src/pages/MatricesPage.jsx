import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import SceneSetup  from '../components/Scene/SceneSetup'
import Axes        from '../components/Scene/Axes'
import BasisArrows from '../components/Scene/BasisArrows'
import EigenArrows from '../components/Scene/EigenArrows'
import MatrixPanel from '../components/UI/MatrixPanel'
import { CanvasRefContext, useCanvasRefValue } from '../context/CanvasRefContext'

/** Captures the R3F gl renderer into our context ref */
function GlCapture({ glRef }) {
  const { gl } = useThree()
  glRef.current = gl
  return null
}

function MatrixScene({ glRef }) {
  return (
    <>
      <GlCapture glRef={glRef} />
      <SceneSetup />
      <Axes />
      <BasisArrows />
      <EigenArrows />
    </>
  )
}

export default function MatricesPage() {
  const glRef = useCanvasRefValue()

  return (
    <CanvasRefContext.Provider value={glRef}>
      <div className="page-layout">
        {/* 3D Canvas */}
        <div className="canvas-container">
          <Canvas
            camera={{ position: [3.5, 2.5, 4.5], fov: 55, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
            shadows
          >
            <color attach="background" args={['#0a0f1e']} />
            <Suspense fallback={null}>
              <MatrixScene glRef={glRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Side panel */}
        <MatrixPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
