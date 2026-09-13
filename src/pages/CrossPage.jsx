import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import CrossScene from '../components/Scene/CrossScene'
import CrossPanel from '../components/UI/CrossPanel'
import { CanvasRefContext, useCanvasRefValue } from '../context/CanvasRefContext'

/** Captures the R3F gl renderer into our context ref */
function GlCapture({ glRef }) {
  const { gl } = useThree()
  glRef.current = gl
  return null
}

export default function CrossPage() {
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
              <GlCapture glRef={glRef} />
              <CrossScene />
            </Suspense>
          </Canvas>
        </div>

        {/* Side panel */}
        <CrossPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
