import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import ProjectionScene   from '../components/Scene/ProjectionScene'
import GramSchmidtScene  from '../components/Scene/GramSchmidtScene'
import ProjectionPanel   from '../components/UI/ProjectionPanel'
import { useProjectionStore } from '../state/useProjectionStore'
import { CanvasRefContext, useCanvasRefValue } from '../context/CanvasRefContext'

/** Captures the R3F gl renderer into our context ref */
function GlCapture({ glRef }) {
  const { gl } = useThree()
  glRef.current = gl
  return null
}

function ProjectionCanvas({ glRef }) {
  const mode = useProjectionStore((s) => s.mode)
  return (
    <>
      <GlCapture glRef={glRef} />
      {mode === 'project' ? <ProjectionScene /> : <GramSchmidtScene />}
    </>
  )
}

export default function ProjectionPage() {
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
              <ProjectionCanvas glRef={glRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Side panel */}
        <ProjectionPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
