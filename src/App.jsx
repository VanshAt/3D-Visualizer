import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import SceneSetup from './components/Scene/SceneSetup'
import Axes from './components/Scene/Axes'
import './App.css'

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#4da6ff" wireframe />
    </mesh>
  )
}

export default function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-gradient">LinAlg</span>
            <span className="title-accent">Viz</span>
          </h1>
          <p className="app-subtitle">Interactive 3D Linear Algebra Explorer</p>
        </div>
        <nav className="module-nav">
          <button className="nav-btn active">Vectors</button>
          <button className="nav-btn">Scalars</button>
          <button className="nav-btn">Matrices</button>
        </nav>
      </header>

      {/* 3D Canvas */}
      <main className="canvas-container">
        <Canvas
          camera={{ position: [6, 5, 8], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
          shadows
        >
          <color attach="background" args={['#0a0f1e']} />
          <Suspense fallback={<LoadingFallback />}>
            <SceneSetup />
            <Axes />
          </Suspense>
        </Canvas>

        {/* Overlay badge */}
        <div className="phase-badge">Phase 0 — Pipeline Verified ✓</div>
      </main>
    </div>
  )
}
