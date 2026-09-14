import { create } from 'zustand'
import {
  mat3Identity,
  mat3RotX,
  mat3RotY,
  mat3RotZ,
  mat3Scale,
  mat3Shear,
  mat3Mul
} from '../lib/math'

export const useTransformStore = create((set, get) => ({
  // ── Transform parameters ──
  scale: [1, 1, 1],
  rotate: [0, 0, 0], // degrees: X, Y, Z
  shear: { xy: 0, xz: 0, yx: 0, yz: 0, zx: 0, zy: 0 },

  // ── The composed 3x3 matrix ──
  matrix: mat3Identity(),

  // ── Actions ──
  setScale: (i, val) => {
    set((s) => {
      const newScale = [...s.scale]
      newScale[i] = val
      return { scale: newScale, matrix: get().computeMatrix({ ...s, scale: newScale }) }
    })
  },

  setRotate: (i, val) => {
    set((s) => {
      const newRotate = [...s.rotate]
      newRotate[i] = val
      return { rotate: newRotate, matrix: get().computeMatrix({ ...s, rotate: newRotate }) }
    })
  },

  setShear: (key, val) => {
    set((s) => {
      const newShear = { ...s.shear, [key]: val }
      return { shear: newShear, matrix: get().computeMatrix({ ...s, shear: newShear }) }
    })
  },

  reset: () => {
    set({
      scale: [1, 1, 1],
      rotate: [0, 0, 0],
      shear: { xy: 0, xz: 0, yx: 0, yz: 0, zx: 0, zy: 0 },
      matrix: mat3Identity()
    })
  },

  // Compute the final matrix: M = Shear * RotateZ * RotateY * RotateX * Scale
  // (Order can be a bit subjective, but Scale then Rotate then Shear is common)
  computeMatrix: (state) => {
    const { scale, rotate, shear } = state
    const S = mat3Scale(scale[0], scale[1], scale[2])
    const Rx = mat3RotX(rotate[0])
    const Ry = mat3RotY(rotate[1])
    const Rz = mat3RotZ(rotate[2])
    
    // Combine rotations: Rz * Ry * Rx
    let R = mat3Mul(Rz, Ry)
    R = mat3Mul(R, Rx)
    
    const Sh = mat3Shear(shear.xy, shear.xz, shear.yx, shear.yz, shear.zx, shear.zy)
    
    // M = Sh * R * S
    let M = mat3Mul(R, S)
    M = mat3Mul(Sh, M)
    return M
  }
}))
