import { create } from 'zustand'

const useBasisStore = create((set) => ({
  // Custom basis vectors (initially standard basis)
  b1: [1, 0, 0],
  b2: [0, 1, 0],
  b3: [0, 0, 1],
  
  // Vector v in standard coordinates
  v: [1, 1, 1],

  // UI state
  showStandardGrid: true,
  showCustomGrid: true,
  morphValue: 0, // 0 = standard, 1 = custom

  // Actions
  setB1: (val) => set({ b1: val }),
  setB2: (val) => set({ b2: val }),
  setB3: (val) => set({ b3: val }),
  setV: (val) => set({ v: val }),
  setShowStandardGrid: (val) => set({ showStandardGrid: val }),
  setShowCustomGrid: (val) => set({ showCustomGrid: val }),
  setMorphValue: (val) => set({ morphValue: val }),
  reset: () => set({
    b1: [1, 0, 0],
    b2: [0, 1, 0],
    b3: [0, 0, 1],
    v: [1, 1, 1],
    showStandardGrid: true,
    showCustomGrid: true,
    morphValue: 0,
  }),
}))

export default useBasisStore
