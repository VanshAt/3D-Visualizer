import { create } from 'zustand'
import {
  mat3Identity,
  mat3RotY,
  mat3RotZ,
  mat3Scale,
  mat3ShearX,
  mat3MirrorX,
} from '../lib/math'

// ─── Named presets ────────────────────────────────────────────────────────────
export const PRESETS = {
  'Identity':      mat3Identity(),
  'Rotate Y 45°':  mat3RotY(45),
  'Rotate Y 90°':  mat3RotY(90),
  'Rotate Z 45°':  mat3RotZ(45),
  'Scale 2×':      mat3Scale(2, 2, 2),
  'Scale 0.5×':    mat3Scale(0.5, 0.5, 0.5),
  'Shear X':       mat3ShearX(),
  'Mirror X':      mat3MirrorX(),
}

export const useMatrixStore = create((set) => ({
  // ── state ─────────────────────────────────────────────────────────────────
  matrix:    mat3Identity(),
  animating: false,
  progress:  0,           // 0 → 1  (raw, pre-easing)

  // ── matrix editing ────────────────────────────────────────────────────────
  setCell: (i, val) =>
    set((s) => {
      const m = [...s.matrix]
      m[i] = isNaN(val) ? 0 : val
      return { matrix: m }
    }),

  setPreset: (name) =>
    set({
      matrix:    [...PRESETS[name]],
      progress:  0,
      animating: false,
    }),

  // ── animation control ─────────────────────────────────────────────────────
  startAnimation:  () => set({ animating: true,  progress: 0 }),
  setProgress:     (p) => set({ progress: p }),
  finishAnimation: () => set({ animating: false, progress: 1 }),

  /** Reset the visual progress back to 0 without changing the matrix */
  resetTransform: () => set({ animating: false, progress: 0 }),

  // ── eigenvector display ────────────────────────────────────────────────────
  showEigenvectors:    true,
  setShowEigenvectors: (b) => set({ showEigenvectors: b }),

  // ── parallelepiped display ─────────────────────────────────────────────────
  showParallelepiped:    true,
  setShowParallelepiped: (b) => set({ showParallelepiped: b }),

  // ── inverse section ────────────────────────────────────────────────────────
  showInverse: false,
  toggleInverse: () => set((s) => ({ showInverse: !s.showInverse })),

  // ── Cramer's Rule section ──────────────────────────────────────────────────
  showCramer: false,
  toggleCramer: () => set((s) => ({ showCramer: !s.showCramer })),
  cramerB: [1, 0, 0],
  setCramerB: (i, val) =>
    set((s) => {
      const b = [...s.cramerB]
      b[i] = isNaN(val) ? 0 : val
      return { cramerB: b }
    }),
}))
