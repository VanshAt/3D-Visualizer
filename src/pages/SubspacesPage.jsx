import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import SubspacesScene from '../components/Scene/SubspacesScene'
import SubspacesPanel from '../components/UI/SubspacesPanel'
import { CanvasRefContext } from '../context/CanvasRefContext'

export default function SubspacesPage() {
  const glRef = useRef(null)

  return (
    <CanvasRefContext.Provider value={glRef}>
      <div className="page-layout">
        <div className="canvas-container">
          <Canvas
            camera={{ position: [6, 4, 6], fov: 50, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
            shadows
          >
            <color attach="background" args={['#0a0f1e']} />
            <Suspense fallback={null}>
              <SubspacesScene glRef={glRef} />
            </Suspense>
          </Canvas>
        </div>
        <SubspacesPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
