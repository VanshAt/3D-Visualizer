import { create } from 'zustand'

// ─── Palette for auto-assigned colours ───────────────────────────────────────
const PALETTE = [
  '#fb923c', // orange  — α
  '#22d3ee', // cyan    — β
  '#f472b6', // rose    — γ
]

let nextId = 1
const genId = () => `sv${nextId++}`

const defaultVector = (index = 0) => ({
  id:    genId(),
  label: ['v₁', 'v₂', 'v₃'][index] ?? `v${nextId - 1}`,
  x: index === 0 ? 2 : index === 1 ? 0 : 1,
  y: index === 0 ? 0 : index === 1 ? 2 : 0,
  z: 0,
  color: PALETTE[index % PALETTE.length],
})

const SCALAR_LABELS = ['α', 'β', 'γ']

export const useScalarStore = create((set, get) => ({
  // ── Base vectors (up to 3) ────────────────────────────────────────────────
  vectors: [defaultVector(0)],

  addVector: () => set((s) => {
    if (s.vectors.length >= 3) return {}
    const idx = s.vectors.length
    return {
      vectors: [...s.vectors, defaultVector(idx)],
      scalars: [...s.scalars, 1],
    }
  }),

  removeVector: () => set((s) => {
    if (s.vectors.length <= 1) return {}
    return {
      vectors: s.vectors.slice(0, -1),
      scalars: s.scalars.slice(0, -1),
    }
  }),

  updateVector: (id, patch) => set((s) => ({
    vectors: s.vectors.map((v) => v.id === id ? { ...v, ...patch } : v),
  })),

  // ── Scalar multipliers (one per vector) ───────────────────────────────────
  scalars: [1],

  setScalar: (index, value) => set((s) => {
    const next = [...s.scalars]
    next[index] = value
    return { scalars: next }
  }),

  // ── Sweep animation ───────────────────────────────────────────────────────
  sweepActive:  false,
  sweepTarget:  0,    // which scalar index (0/1/2) to animate
  sweepSpeed:   1.0,  // oscillation speed multiplier

  toggleSweep: (target = 0) => set((s) => ({
    sweepActive: s.sweepTarget === target ? !s.sweepActive : true,
    sweepTarget: target,
  })),

  setSweepSpeed: (v) => set({ sweepSpeed: v }),

  // called every frame from LinearCombScene
  tickSweep: (elapsed) => {
    const { sweepActive, sweepTarget, sweepSpeed } = get()
    if (!sweepActive) return
    // Oscillate in [-3, 3] with sine
    const value = 3 * Math.sin(elapsed * sweepSpeed)
    const next = [...get().scalars]
    next[sweepTarget] = value
    set({ scalars: next })
  },

  // ── Derived helpers ───────────────────────────────────────────────────────
  /** Scalar label for a given index: α / β / γ */
  scalarLabel: (i) => SCALAR_LABELS[i] ?? `s${i}`,

  /** Computed linear combination: Σ αᵢ·vᵢ */
  getResult: () => {
    const { vectors, scalars } = get()
    let rx = 0, ry = 0, rz = 0
    vectors.forEach((v, i) => {
      const s = scalars[i] ?? 1
      rx += v.x * s
      ry += v.y * s
      rz += v.z * s
    })
    return [rx, ry, rz]
  },
}))

export { SCALAR_LABELS }
