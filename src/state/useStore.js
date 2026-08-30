import { create } from 'zustand'

// ─── palette for auto-assigned vector colours ────────────────────────────────
const PALETTE = [
  '#4da6ff', // blue
  '#ff4d88', // pink
  '#ffcc4d', // yellow
  '#4dff88', // green
  '#c084fc', // purple
  '#fb923c', // orange
  '#22d3ee', // cyan
  '#f472b6', // rose
]

let nextId = 1
const genId = () => `v${nextId++}`

const defaultVector = (overrides = {}) => ({
  id:      genId(),
  label:   `v${nextId - 1}`,
  x:       1,
  y:       1,
  z:       0,
  color:   PALETTE[(nextId - 2) % PALETTE.length],
  visible: true,
  ...overrides,
})

export const useStore = create((set, get) => ({
  // ── vectors ──────────────────────────────────────────────────────────────
  vectors: [defaultVector({ x: 2, y: 1, z: 0, label: 'v1' })],

  addVector: () => set((s) => ({
    vectors: [...s.vectors, defaultVector()],
  })),

  removeVector: (id) => set((s) => ({
    vectors: s.vectors.filter((v) => v.id !== id),
  })),

  updateVector: (id, patch) => set((s) => ({
    vectors: s.vectors.map((v) => v.id === id ? { ...v, ...patch } : v),
  })),

  toggleVector: (id) => set((s) => ({
    vectors: s.vectors.map((v) =>
      v.id === id ? { ...v, visible: !v.visible } : v
    ),
  })),

  // ── UI state ──────────────────────────────────────────────────────────────
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

  showSpan:    false,
  setShowSpan: (b) => set({ showSpan: b }),

  // ── derived helpers (not reactive — call inside component) ────────────────
  getVector: (id) => get().vectors.find((v) => v.id === id),
}))
