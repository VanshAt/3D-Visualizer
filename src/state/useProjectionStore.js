import { create } from 'zustand'

// ─── Palette ─────────────────────────────────────────────────────────────────
const BASE_COLORS = ['#fb923c', '#22d3ee']  // orange, cyan
const GS_INPUT    = ['#fb923c', '#22d3ee', '#f472b6']  // orange, cyan, rose
const GS_OUTPUT   = ['#ffd166', '#2dd4bf', '#e879f9']  // gold, teal, magenta

let nextId = 1
const genId = () => `pv${nextId++}`

const defaultBase = (i = 0) => ({
  id:    genId(),
  label: `a${i + 1}`,
  x: i === 0 ? 1 : 0,
  y: i === 0 ? 0 : 1,
  z: 0,
  color: BASE_COLORS[i % BASE_COLORS.length],
})

const defaultTarget = () => ({
  id:    genId(),
  label: 'b',
  x: 1,
  y: 1,
  z: 0,
  color: '#e2e8f0',   // light — stands out against bases
})

const defaultGsVec = (i = 0) => ({
  id:    genId(),
  label: `v${i + 1}`,
  x: i === 0 ? 2 : i === 1 ? 1 : 0,
  y: i === 0 ? 1 : i === 1 ? 2 : 1,
  z: i === 0 ? 0 : i === 1 ? 0 : 2,
  color: GS_INPUT[i % GS_INPUT.length],
})

export const useProjectionStore = create((set, get) => ({
  // ── Mode ─────────────────────────────────────────────────────────────────
  mode: 'project',   // 'project' | 'gram-schmidt'
  setMode: (m) => set({ mode: m }),
  toggleMode: () => set((s) => ({
    mode: s.mode === 'project' ? 'gram-schmidt' : 'project',
  })),

  // ── Projection mode state ────────────────────────────────────────────────
  baseVectors:  [defaultBase(0)],
  targetVector: defaultTarget(),

  addBase: () => set((s) => {
    if (s.baseVectors.length >= 2) return {}
    return { baseVectors: [...s.baseVectors, defaultBase(s.baseVectors.length)] }
  }),

  removeBase: () => set((s) => {
    if (s.baseVectors.length <= 1) return {}
    return { baseVectors: s.baseVectors.slice(0, -1) }
  }),

  updateBase: (id, patch) => set((s) => ({
    baseVectors: s.baseVectors.map((v) => v.id === id ? { ...v, ...patch } : v),
  })),

  updateTarget: (patch) => set((s) => ({
    targetVector: { ...s.targetVector, ...patch },
  })),

  // ── Gram-Schmidt mode state ──────────────────────────────────────────────
  gsVectors: [defaultGsVec(0), defaultGsVec(1)],
  gsStep:    0,       // current step (0 → N)
  gsPlaying: false,   // auto-advance toggle

  addGsVector: () => set((s) => {
    if (s.gsVectors.length >= 3) return {}
    return { gsVectors: [...s.gsVectors, defaultGsVec(s.gsVectors.length)] }
  }),

  removeGsVector: () => set((s) => {
    if (s.gsVectors.length <= 1) return {}
    const newVecs = s.gsVectors.slice(0, -1)
    return {
      gsVectors: newVecs,
      gsStep: Math.min(s.gsStep, newVecs.length),
    }
  }),

  updateGsVector: (id, patch) => set((s) => ({
    gsVectors: s.gsVectors.map((v) => v.id === id ? { ...v, ...patch } : v),
  })),

  setGsStep:  (step) => set({ gsStep: step }),
  nextGsStep: () => set((s) => ({
    gsStep: Math.min(s.gsStep + 1, s.gsVectors.length),
  })),
  prevGsStep: () => set((s) => ({
    gsStep: Math.max(s.gsStep - 1, 0),
  })),
  toggleGsPlay: () => set((s) => ({ gsPlaying: !s.gsPlaying })),
}))

export { GS_OUTPUT, GS_INPUT }
