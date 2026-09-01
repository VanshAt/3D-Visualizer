import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import LinearCombScene from '../components/Scene/LinearCombScene'
import ScalarPanel from '../components/UI/ScalarPanel'
import { CanvasRefContext, useCanvasRefValue } from '../context/CanvasRefContext'

/** Captures the R3F gl renderer into our context ref */
function GlCapture({ glRef }) {
  const { gl } = useThree()
  glRef.current = gl
  return null
}

function ScalarScene({ glRef }) {
  return (
    <>
      <GlCapture glRef={glRef} />
      <LinearCombScene />
    </>
  )
}

export default function ScalarsPage() {
  const glRef = useCanvasRefValue()

  return (
    <CanvasRefContext.Provider value={glRef}>
      <div className="page-layout">
        {/* 3D Canvas */}
        <div className="canvas-container">
          <Canvas
            camera={{ position: [6, 5, 8], fov: 55, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
            shadows
          >
            <color attach="background" args={['#0a0f1e']} />
            <Suspense fallback={null}>
              <ScalarScene glRef={glRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Side panel */}
        <ScalarPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
