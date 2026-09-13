import { create } from 'zustand'

export const useCrossStore = create((set) => ({
  u: { x: 2, y: 0, z: 0, color: '#4da6ff', label: 'u' },
  v: { x: 1, y: 2, z: 0, color: '#ff4d88', label: 'v' },

  updateU: (patch) => set((s) => ({ u: { ...s.u, ...patch } })),
  updateV: (patch) => set((s) => ({ v: { ...s.v, ...patch } })),
}))
