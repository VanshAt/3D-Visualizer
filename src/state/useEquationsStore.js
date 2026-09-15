import { create } from 'zustand'
import { det3, solveLinearSystem } from '../lib/math'

const DEFAULT_A = [
  1, 1, 1,
  1, -1, 1,
  2, 1, -1,
]

const DEFAULT_B = [
  6,
  2,
  1,
]

export const useEquationsStore = create((set, get) => ({
  A: [...DEFAULT_A],
  b: [...DEFAULT_B],
  
  setA: (index, value) => set((state) => {
    const newA = [...state.A]
    newA[index] = value
    return { A: newA }
  }),
  
  setB: (index, value) => set((state) => {
    const newB = [...state.b]
    newB[index] = value
    return { b: newB }
  }),
  
  reset: () => set({ A: [...DEFAULT_A], b: [...DEFAULT_B] }),
  
  getSolution: () => {
    const { A, b } = get()
    return solveLinearSystem(A, b)
  }
}))
