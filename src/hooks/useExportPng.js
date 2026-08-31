import { useCallback } from 'react'
import { useCanvasRef } from '../context/CanvasRefContext'

/**
 * Returns an `exportPng(filename?)` function.
 * Reads the WebGLRenderer from CanvasRefContext and downloads
 * the current frame as a PNG file.
 *
 * The Canvas must have `gl={{ preserveDrawingBuffer: true }}` set,
 * otherwise the buffer is cleared right after each frame and
 * toDataURL returns a blank image.
 */
export function useExportPng() {
  const glRef = useCanvasRef()

  return useCallback((filename = 'linalg-viz.png') => {
    const gl = glRef.current
    if (!gl) {
      console.warn('[useExportPng] No WebGLRenderer available yet.')
      return
    }

    // toDataURL only works when preserveDrawingBuffer is true
    const dataURL = gl.domElement.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = dataURL
    link.download = filename
    link.click()
  }, [glRef])
}
