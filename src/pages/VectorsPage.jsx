import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import SceneSetup from '../components/Scene/SceneSetup'
import Axes from '../components/Scene/Axes'
import VectorArrow from '../components/Scene/VectorArrow'
import VectorPanel from '../components/UI/VectorPanel'
import { useStore } from '../state/useStore'

function VectorScene() {
  const { vectors, selectedId, setSelectedId } = useStore()
  return (
    <>
      <SceneSetup />
      <Axes />
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
  return (
    <div className="page-layout">
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [6, 5, 8], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
          shadows
        >
          <color attach="background" args={['#0a0f1e']} />
          <Suspense fallback={null}>
            <VectorScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Side panel */}
      <VectorPanel />
    </div>
  )
}
