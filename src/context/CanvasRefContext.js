import { createContext, useContext, useRef } from 'react'

/**
 * Holds a { current: WebGLRenderer | null } ref.
 * Set by an inner R3F component via useThree(); read by the export hook.
 */
export const CanvasRefContext = createContext({ current: null })

export function useCanvasRef() {
  return useContext(CanvasRefContext)
}

/** Convenience wrapper – create once at page level */
export function useCanvasRefValue() {
  return useRef(null)
}
