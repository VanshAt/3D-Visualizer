import { create } from 'zustand'

const useSVDStore = create((set) => ({
  // Matrix A (3x3)
  matrix: [
    [1, 1, 0],
    [0, 1, 1],
    [1, 0, 1]
  ],
  
  // Animation state (0 to 3)
  // 0: Identity
  // 1: V^T applied
  // 2: Sigma applied
  // 3: U applied
  animationProgress: 0,
  isPlaying: false,

  // Actions
  setMatrix: (val) => set({ matrix: val }),
  setAnimationProgress: (val) => set({ animationProgress: val }),
  setIsPlaying: (val) => set({ isPlaying: val }),
  reset: () => set({
    animationProgress: 0,
    isPlaying: false
  }),
}))

export default useSVDStore
