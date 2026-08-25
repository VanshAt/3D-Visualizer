import { Line, Text } from '@react-three/drei'

const AXIS_LENGTH = 5

export default function Axes() {
  return (
    <group>
      {/* X axis — red */}
      <Line
        points={[[-AXIS_LENGTH, 0, 0], [AXIS_LENGTH, 0, 0]]}
        color="#ff4d4d"
        lineWidth={2}
      />
      <Text position={[AXIS_LENGTH + 0.3, 0, 0]} fontSize={0.35} color="#ff4d4d">
        X
      </Text>

      {/* Y axis — green */}
      <Line
        points={[[0, -AXIS_LENGTH, 0], [0, AXIS_LENGTH, 0]]}
        color="#4dff88"
        lineWidth={2}
      />
      <Text position={[0, AXIS_LENGTH + 0.3, 0]} fontSize={0.35} color="#4dff88">
        Y
      </Text>

      {/* Z axis — blue */}
      <Line
        points={[[0, 0, -AXIS_LENGTH], [0, 0, AXIS_LENGTH]]}
        color="#4da6ff"
        lineWidth={2}
      />
      <Text position={[0, 0, AXIS_LENGTH + 0.3]} fontSize={0.35} color="#4da6ff">
        Z
      </Text>

      {/* Origin dot */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}
