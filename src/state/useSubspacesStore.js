import { create } from 'zustand'

const presetMatrices = {
  invertible: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ],
  rank2: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ],
  rank1: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
  ],
  zero: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]
}

const useSubspacesStore = create((set) => ({
  // Matrix A (3x3)
  matrix: presetMatrices.rank2,
  
  // View toggle: 'domain' (Row Space & Null Space) or 'codomain' (Column Space & Left Null Space)
  viewMode: 'domain',
  
  // UI states
  selectedPreset: 'rank2',

  // Actions
  setMatrix: (val) => set({ matrix: val, selectedPreset: 'custom' }),
  setPreset: (presetKey) => set({ 
    selectedPreset: presetKey, 
    matrix: presetMatrices[presetKey] || presetMatrices.rank2 
  }),
  setViewMode: (val) => set({ viewMode: val }),
}))

export default useSubspacesStore
