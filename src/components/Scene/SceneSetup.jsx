import { OrbitControls, Grid } from '@react-three/drei'

export default function SceneSetup() {
  return (
    <>
      {/* Camera controls */}
      <OrbitControls
        makeDefault
        dampingFactor={0.08}
        enablePan
        minDistance={2}
        maxDistance={30}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.4} color="#a0c4ff" />

      {/* Ground grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#334466"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#445577"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[0, -0.01, 0]}
      />

      {/* Subtle fog */}
      <fog attach="fog" args={['#0a0f1e', 20, 40]} />
    </>
  )
}
