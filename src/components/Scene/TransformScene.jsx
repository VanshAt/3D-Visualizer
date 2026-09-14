import React from 'react'
import { useThree } from '@react-three/fiber'
import SceneSetup from './SceneSetup'
import Axes from './Axes'
import TransformObject from './TransformObject'

export default function TransformScene({ glRef }) {
  // Capture gl for PNG export if glRef is provided
  const GlCapture = ({ glRef }) => {
    const { gl } = useThree()
    if (glRef) glRef.current = gl
    return null
  }

  return (
    <>
      <GlCapture glRef={glRef} />
      <SceneSetup />
      <Axes />
      <TransformObject />
    </>
  )
}
