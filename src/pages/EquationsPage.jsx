import React from 'react'
import { Canvas } from '@react-three/fiber'
import SceneSetup from '../components/Scene/SceneSetup'
import Axes from '../components/Scene/Axes'
import EquationsScene from '../components/Scene/EquationsScene'
import EquationsPanel from '../components/UI/EquationsPanel'

export default function EquationsPage() {
  return (
    <div className="page-layout">
      {/* 3D Viewport */}
      <div className="canvas-container">
        <Canvas camera={{ position: [6, 4, 8], fov: 45 }}>
          <SceneSetup />
          <Axes />
          <EquationsScene />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="ui-layer">
        <div className="panels-container">
          <EquationsPanel />
        </div>
      </div>
    </div>
  )
}
