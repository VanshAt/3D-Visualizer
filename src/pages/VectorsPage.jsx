import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import SceneSetup   from '../components/Scene/SceneSetup'
import Axes         from '../components/Scene/Axes'
import VectorArrow  from '../components/Scene/VectorArrow'
import SpanMesh     from '../components/Scene/SpanMesh'
import VectorPanel  from '../components/UI/VectorPanel'
import { useStore } from '../state/useStore'
import { CanvasRefContext, useCanvasRefValue } from '../context/CanvasRefContext'

/** Captures the R3F gl renderer into our context ref */
function GlCapture({ glRef }) {
  const { gl } = useThree()
  glRef.current = gl
  return null
}

function VectorScene({ glRef }) {
  const { vectors, selectedId, setSelectedId } = useStore()
  return (
    <>
      <GlCapture glRef={glRef} />
      <SceneSetup />
      <Axes />
      <SpanMesh />
      {vectors
        .filter((v) => v.visible)
        .map((v) => (
          <VectorArrow
            key={v.id}
            x={v.x}
            y={v.y}
            z={v.z}
            color={v.color}
            label={v.label}
            selected={v.id === selectedId}
            onSelect={() => setSelectedId(v.id === selectedId ? null : v.id)}
          />
        ))}
    </>
  )
}

export default function VectorsPage() {
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
              <VectorScene glRef={glRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Side panel */}
        <VectorPanel />
      </div>
    </CanvasRefContext.Provider>
  )
}
