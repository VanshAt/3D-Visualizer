import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import SVDScene from '../components/Scene/SVDScene'
import SVDPanel from '../components/UI/SVDPanel'
import { CanvasRefContext } from '../context/CanvasRefContext'

export default function SVDPage() {
  const glRef = useRef(null)

  return (
    <CanvasRefContext.Provider value={glRef}>
      <div className="page-layout">
        <div className="canvas-container">
          <Canvas
            camera={{ position: [5, 4, 6], fov: 50, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
            shadows
          >
            <color attach="background" args={['#0a0f1e']} />
            <Suspense fallback={null}>
              <SVDScene glRef={glRef} />
            </Suspense>
          </Canvas>
        </div>
        <SVDPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
