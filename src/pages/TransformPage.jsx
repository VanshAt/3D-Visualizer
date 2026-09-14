import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import TransformScene from '../components/Scene/TransformScene'
import TransformPanel from '../components/UI/TransformPanel'
import { CanvasRefContext, useCanvasRefValue } from '../context/CanvasRefContext'

export default function TransformPage() {
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
              <TransformScene glRef={glRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Side panel */}
        <TransformPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
